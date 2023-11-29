const questionsRouter = require("express").Router();
const Question = require("../models/questions");
const {
  getTagWithName,
  createTag,
  getAllQuestions,
  searchQuestions,
  getQuestionsOfTagId,
  getQuestionById,
} = require("./helpers");

// Create a question and save to database
questionsRouter.post("/", async (req, res) => {
  try {
    // Get associated tag ids. Create a tag if the tag does exist
    const tag_strings = req.body.tag_strings;
    const tags = await Promise.all(tag_strings.map(async (tag_string) => {
      const tag = await getTagWithName(tag_string);
      return tag ? tag._id : (await createTag(tag_string))._id;
    }));

    const question = await new Question({
      title: req.body.title,
      text: req.body.text,
      tags: tags,
      answers: req.body.answers,
      asked_by: req.body.asked_by,
      ask_date_time: req.body.ask_date_time,
      views: req.body.views,
    });
    const savedQuestion = await question.save();
    res.status(200).json({
      message: "Successfully saved question",
      question: savedQuestion,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to save question to database." });
  }
});

questionsRouter.patch("/", async (req, res) => {
  const questionId = req.query.question_id;

  try {
    const question = await Question.findById(questionId);

    if (!question) {
      return res.status(404).json({ message: `Question with ${questionId} not found` });
    }

    question.views += 1;

    await question.save();

    return res.json(question);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
})

// Get all questions from database.
// If search string is defined in query params, get questions associated with the search string.
// If tag_id is defined in query params, get questions associated with the tag.
// if question_id is defined in query params, get question associated with the question_id
questionsRouter.get("/", async (req, res) => {
  try {
    const tag_id = req.query.tag_id;
    const question_id = req.query.question_id;
    const search_string = req.query.search_string;
    if (tag_id) {
      getQuestionsOfTagId(tag_id).then((questions) => {
        res.status(200).json(questions);
      });
    } else if (question_id) {
      getQuestionById(question_id).then((question) => {
        res.status(200).json(question);
      });
    } else if (search_string) {
      searchQuestions(search_string).then((questions) => {
        res.status(200).json(questions);
      });
    } else {
      getAllQuestions().then((questions) => {
        res.status(200).json(questions);
      });
    }
  } catch (error) {
    console.log(error);
    res.status(404).json({
      message: "Failed to get questions from database.",
    });
  }
});

module.exports = questionsRouter;
