import { getQuestions } from "./tag.js";
import { getAnswers } from "./question.js";
import axios from "axios";

async function getAllQuestions() {
  return [];
}

async function getAllTags() {
  return [];
}

async function getAllAnswers() {
  return [];
}
export class Model {
  constructor() {
    this.data = {
      questions: [],
      tags: [],
      answers: [],
    };
  }

  async fetchData() {
    let questions = await getAllQuestions();
    let tags = await getAllTags();
    let answers = await getAllAnswers();
    this.data = {
      questions: questions,
      tags: tags,
      answers: answers,
    };
  }
  generateQid() {
    return "q" + (this.data.questions.length + 1);
  }

  generateAid() {
    return "a" + (this.data.answers.length + 1);
  }

  generateTid() {
    return "t" + (this.data.tags.length + 1);
  }

  //General sort answerby newest function
  sortByNewestAnswer(answers) {
    var result = [...answers].sort((answer1, answer2) => {
      if (answer1 === undefined) {
        return 1;
      } else if (answer2 === undefined) {
        return -1;
      } else {
        return new Date(answer2.ans_date_time) - new Date(answer1.ans_date_time);
      }
    });
    return result
  }

  //General sort by newest function
  sortByNewestQuestion(questions) {
    return [...questions].sort((question1, question2) => {
      return new Date(question2.ask_date_time) - new Date(question1.ask_date_time);
    });
  }

  //General sort by active function
  sortByActive(questions) {

    return [...questions].sort((question1, question2) => {
      var question1LatestAnswer = this.sortByNewestAnswer(
        getAnswers(question1, this)
      )[0];
      var question2LatestAnswer = this.sortByNewestAnswer(
        getAnswers(question2, this)
      )[0];

      if (question1LatestAnswer === undefined) {
        return 1;
      } else if (question2LatestAnswer === undefined) {
        return -1;
      } else {
        return new Date(question2LatestAnswer.ans_date_time) - new Date(question1LatestAnswer.ans_date_time);
      }
    });
  }

  //General sort by unaswered function

  sortByUnanswered(questions) {
    return [...questions].filter((question) => {
      return question.answers.length === 0 ? true : false;
    });
  }

  //Get question by qid
  getQuestionByQid(qid) {
    return this.data.questions.find((question) => question._id === qid);
  }

  //Returns all questions sorted by Newest-Oldest
  getAllQuestionsNewest() {
    return this.sortByNewestQuestion(this.data.questions);
  }
  //Returns all questions sorted by Activity. Latest answer first
  getAllQuestionsActive() {
    return this.sortByActive(this.data.questions);
  }
  //Returns all questions filtered by Unanswered
  getAllQuestionsUnanswered() {
    return this.sortByUnanswered(this.data.questions);
  }

  //Returns all tags
  getAllTags() {
    return this.data.tags;
  }

  //Returns all Answers
  getAllAnswers() {
    return this.data.answers;
  }

  //Creates and adds question to data
  //Returns question object
  async createQuestion(title, text, askedBy, tagStrings = []) {
    var question = {
      title: title,
      text: text,
      tag_strings: tagStrings,
      asked_by: askedBy,
      ask_date_time: new Date(),
      answers: [],
      views: 0,
    };

    let data = JSON.stringify(question);
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    await axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
      })
      .catch((error) => {
        console.log(error);
      });
    return question;
  }

  //find tag tid with name. if not found return undefined
  getTidWithName(tagName) {
    var tid;
    this.data.tags.forEach(
      (tag) => (tid = tag.name === tagName ? tag._id : tid)
    );
    return tid;
  }
  //Returns all questions for which their title or text contains at least one word in the search string
  searchQuestions(searchString) {
    searchString = searchString.toLowerCase();
    var questions = new Set();

    //Search for titles and texts with at least one word in the search string
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
    searchStringWords.forEach((word) => {
      var resultQuestions = this.data.questions.filter((question) => {
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

    //Check for tags in [] and add their questions
    var searchStringTags = searchString.toLowerCase().match(/\[[^\]]*\]/g);
    if (searchStringTags) {
      searchStringTags.forEach((tagStringWithBrackets) => {
        var tagName = tagStringWithBrackets.replace(/(\[|\])/g, "");
        tagName = tagName.trim();
        //get tag
        var foundTag = this.data.tags.find(
          (tag) => tagName.toLowerCase() === tag.name.toLowerCase()
        );
        if (foundTag) {
          getQuestions(this, foundTag).forEach((question) => {
            questions.add(question);
          });
        }
      });
    }

    return this.sortByNewestQuestion(Array.from(questions));
  }

  //Creates and adds answer to data
  //Returns answer object
  async createAnswer(text, ansBy, qid) {
    var data = {
      text: text,
      ans_by: ansBy,
      question_id: qid,
      ans_date_time: new Date(),
    };
    
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: '',
      headers: { 
        'Content-Type': 'application/json'
      },
      data : data
    };
    
    await axios.request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
    })
    .catch((error) => {
      console.log(error);
    });

    return data;
  }

  //Creates and adds tag to data
  //Returns tag object
  createTag(tid, name) {
    var tag = { tid: tid, name: name };
    this.data.tags.push(tag);
    return tag;
  }
}
