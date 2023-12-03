import { getAnswers } from "../models/question";
//General sort answerby newest function
function sortByNewestAnswer(answers) {
  return [...answers].sort((answer1, answer2) => {
    if (answer1 === undefined) {
      return 1;
    } else if (answer2 === undefined) {
      return -1;
    } else {
      return new Date(answer2.ans_date_time) - new Date(answer1.ans_date_time);
    }
  });
}

//General sort by newest function
function sortByNewestQuestion(questions) {
  return [...questions].sort((question1, question2) => {
    return question2.ask_date_time - question1.ask_date_time;
  });
}

//General sort by active function
function sortByActive(questions) {
  return [...questions].sort((question1, question2) => {
    var question1LatestAnswer = sortByNewestAnswer(
      //AXIOS FETCH
      getAnswers(question1, this)
    )[0];
    var question2LatestAnswer = sortByNewestAnswer(
      //AXIOS FETCH
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

function sortByUnanswered(questions) {
  return [...questions].filter((question) => {
    return question.answers.length === 0 ? true : false;
  });
}

//Returns all questions sorted by Newest-Oldest
function getAllQuestionsNewest() {
  //AXIOS FETCH
  return sortByNewestQuestion(this.data.questions);
}
//Returns all questions sorted by Activity. Latest answer first
function getAllQuestionsActive() {
  //AXIOS FETCH
  return sortByActive(this.data.questions);
}
//Returns all questions filtered by Unanswered
function getAllQuestionsUnanswered() {
  //AXIOS FETCH
  return sortByUnanswered(this.data.questions);
}

export {
    sortByNewestAnswer,
    sortByNewestQuestion,
    sortByActive,
    sortByUnanswered,
    getAllQuestionsNewest,
    getAllQuestionsActive,
    getAllQuestionsUnanswered,
}