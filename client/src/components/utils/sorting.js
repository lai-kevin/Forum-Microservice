import {
  getAllQuestionsActive,
  getAllQuestionsNewest,
  getAllQuestionsUnanswered,
} from "../../utils/sorting";

import searchQuestions from "./search";
/**
 * This file contains all the sorting functions for sorby
 */

//General sort answerby newest function
function sortByNewestAnswer(answers) {
  var result = [...answers].sort((answer1, answer2) => {
    if (answer1 === undefined) {
      return 1;
    } else if (answer2 === undefined) {
      return -1;
    } else {
      return new Date(answer2.aposted_time) - new Date(answer1.posted_time);
    }
  });
  return result;
}

//General sort by newest function
function sortByNewestQuestion(questions) {
  return [...questions].sort((question1, question2) => {
    return new Date(question2.posted_time) - new Date(question1.posted_time);
  });
}

//General sort by active function
function sortByActive(questions) {
  return [...questions].sort((question1, question2) => {
    var question1LatestAnswer = this.sortByNewestAnswer(question1.answers)[0];
    var question2LatestAnswer = this.sortByNewestAnswer(question2.answers)[0];

    if (question1LatestAnswer === undefined) {
      return 1;
    } else if (question2LatestAnswer === undefined) {
      return -1;
    } else {
      return (
        new Date(question2LatestAnswer.posted_time) -
        new Date(question1LatestAnswer.posted_time)
      );
    }
  });
}

//General sort by unaswered function

function sortByUnanswered(questions) {
  return [...questions].filter((question) => {
    return question.answers.length === 0 ? true : false;
  });
}

// Homepage sortby handlers
function handleSortByUnansweredClickAll(setResults) {
  var results = getAllQuestionsUnanswered();
  setResults(results);
}

function handleSortByActiveClickAll(setResults) {
  var results = getAllQuestionsActive();
  setResults(results);
}

function handleSortByNewestClickAll(setResults) {
  var results = getAllQuestionsNewest();
  setResults(results);
}

// Search sortby handlers
function handleSortByUnansweredClickSearch(setResults, searchString) {
  let results = searchQuestions(searchString);
  setResults(sortByUnanswered(results));
}

function handleSortByActiveClickSearch(setResults, searchString) {
  let results = searchQuestions(searchString);
  setResults(sortByActive(results));
}

function handleSortByNewestClickSearch(setResults, searchString) {
  let results = searchQuestions(searchString);
  setResults(sortByNewestQuestion(results));
}

//Sort click handlers
function handleSortByUnansweredClickTag(setResults, tag) {
  let results = searchQuestions(`[${tag.name.toLowerCase()}]`);
  console.log(results);
  setResults(sortByUnanswered(results));
}

function handleSortByActiveClickTag(setResults, tag) {
  let results = searchQuestions(`[${tag.name.toLowerCase()}]`);
  console.log(results);
  setResults(sortByActive(results));
}

function handleSortByNewestClickTag(setResults, tag) {
  let results = searchQuestions(`[${tag.name.toLowerCase()}]`);
  console.log(results);
  setResults(sortByNewestQuestion(results));
}

export {
  handleSortByActiveClickAll,
  handleSortByUnansweredClickAll,
  handleSortByNewestClickAll,
  handleSortByActiveClickSearch,
  handleSortByNewestClickSearch,
  handleSortByUnansweredClickSearch,
  handleSortByActiveClickTag,
  handleSortByNewestClickTag,
  handleSortByUnansweredClickTag,
  sortByNewestAnswer,
  sortByNewestQuestion,
  sortByActive,
  sortByUnanswered,
};
