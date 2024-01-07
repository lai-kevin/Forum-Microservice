const Tag = require("../models/tags");
const Question = require("../models/questions");
const getTagWithName = async (name) => {
  const tag = await Tag.findOne({ name: name })
    .then((tag) => tag)
    .catch((error) => undefined);
  return tag;
};

const getAllTags = async () => {
  return await Tag.find()
    .then((tags) => tags)
    .catch(() => []);
};

const createTag = async (name) => {
  try {
    const newTag = await new Tag({
      name: name,
    });
    const savedTag = await newTag.save();
    return savedTag;
  } catch (error) {
    console.log(`Failed to create tag: ${error}`);
    return undefined;
  }
};

const getAllQuestions = async () => {
  try {
    const questions = await Question.find()
      .then((questions) => questions)
      .catch(() => []);
    return questions;
  } catch (error) {
    console.log(error);
    return [];
  }
};

const getQuestionsofTag = async (tag) => {
  return (await getAllQuestions()).filter((question) => {
    return question.tags.indexOf(tag._id) > -1;
  });
};

const getQuestionsOfTagId = async (tag_id) => {
  return await Tag.findById(tag_id)
    .then((tag) => getQuestionsofTag(tag))
    .catch((error) => {
      console.log(error);
      return [];
    });
};

const getQuestionById = async (question_id) => {
  return await Question.findById(question_id);
}

const searchQuestions = async (searchString) => {
  searchString = searchString.toLowerCase();
  var questions = new Set();

  // Replace symbols with whitespace and trim
  var searchStringWords = searchString
    .replace(/[{}=\-_`~().,^&*/#!$%;:]/g, " ")
    .split(" ");
  searchStringWords = searchStringWords.filter((word) => {
    if (word.trim().length === 0) {
      return false;
    } else {
      return true;
    }
  });

  // Search for titles and texts with at least one word in the search string
  var searchPromises = searchStringWords.map(async (word) => {
    var resultQuestions = (await getAllQuestions()).filter((question) => {
      return (
        question.title
          .toLowerCase()
          .replace(/[{}=\-_`~().,^&*/#!$%;:]/g, " ")
          .split(" ")
          .find((titleWord) => word === titleWord) ||
        question.text
          .toLowerCase()
          .replace(/[{}=\-_`~().,^&*/#!$%;:]/g, " ")
          .split(" ")
          .find((textWord) => word === textWord)
      );
    });
    resultQuestions.forEach((question) => {
      questions.add(question);
    });
  });
  await Promise.all(searchPromises);

  //Check for tags in [] and add their questions
  var searchStringTags = searchString.toLowerCase().match(/\[[^\]]*\]/g);
  if (searchStringTags) {
    var tags = searchStringTags.map(async (tagStringWithBrackets) => {
      var tagName = tagStringWithBrackets.replace(/(\[|\])/g, "");
      tagName = tagName.trim();
      // get tag
      var foundTag = (await getAllTags()).find(
        (tag) => tagName.toLowerCase() === tag.name.toLowerCase()
      );
      // add questions associated with the tag to the question set
      if (foundTag) {
        (await getQuestionsofTag(foundTag)).forEach((question) => {
          questions.add(question);
        });
      }
    });
    tags = await Promise.all(tags);
  }
  return Array.from(questions);
};

const getTagsOfQuestionID = async (question_id) => {
  try {
    const question = await Question.findById(question_id);
    var tags = question.tags.map( async (tag_id) => await Tag.findById(tag_id))
    tags = await Promise.all(tags);
    return tags;
  } catch (error) {
    console.log(error);
    return [];
  }
}

module.exports = {
  getTagWithName,
  createTag,
  getAllQuestions,
  getAllTags,
  searchQuestions,
  getQuestionsOfTagId,
  getQuestionById,
  getTagsOfQuestionID,
};
