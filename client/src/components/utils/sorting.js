/**
 * This file contains all the sorting functions for sorby
 */

// Homepage sortby handlers
function handleSortByUnansweredClickAll(appModel, setResults) {
  var results = appModel.getAllQuestionsUnanswered();
  setResults(results);
}

function handleSortByActiveClickAll(appModel, setResults) {
  var results = appModel.getAllQuestionsActive();
  setResults(results);
}

function handleSortByNewestClickAll(appModel, setResults) {
  var results = appModel.getAllQuestionsNewest();
  setResults(results);
}

// Search sortby handlers
function handleSortByUnansweredClickSearch(appModel, setResults, searchString) {
  let results = appModel.searchQuestions(searchString);
  setResults(appModel.sortByUnanswered(results));
}

function handleSortByActiveClickSearch(appModel, setResults, searchString) {
  let results = appModel.searchQuestions(searchString);
  setResults(appModel.sortByActive(results));
}

function handleSortByNewestClickSearch(appModel, setResults, searchString) {
  let results = appModel.searchQuestions(searchString);
  setResults(appModel.sortByNewestQuestion(results));
}

//Sort click handlers
function handleSortByUnansweredClickTag(appModel, setResults, tag) {
  let results = appModel.searchQuestions(`[${tag.name.toLowerCase()}]`);
  console.log(results)
  setResults(appModel.sortByUnanswered(results));
}

function handleSortByActiveClickTag(appModel, setResults, tag) {
  let results = appModel.searchQuestions(`[${tag.name.toLowerCase()}]`);
  console.log(results)
  setResults(appModel.sortByActive(results));
}

function handleSortByNewestClickTag(appModel, setResults, tag) {
  let results = appModel.searchQuestions(`[${tag.name.toLowerCase()}]`);
  console.log(results)
  setResults(appModel.sortByNewestQuestion(results));
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
};
