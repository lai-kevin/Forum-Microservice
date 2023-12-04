import ResultListItem from "../page-components/result-list-item";
import {
  handleSortByNewestClickTag,
  handleSortByUnansweredClickTag,
  handleSortByActiveClickTag,
} from "../utils/sorting";

import { useState } from "react";
/**
 * Renders a page with a list of questions related to a specific tag.
 * 
 * @param {Object} appModel - The application model.
 * @param {Function} setAppModel - The function to update the application model.
 * @param {string} tagString - The tag string used to filter the questions.
 * @param {Function} setCurrentPage - The function to update the current page in the application.
 * @param {Function} setCurrentQuestion - The function to update the currently selected question in the application.
 * @returns {JSX.Element} The rendered TagQuestionsPage component.
 */
const TagQuestionsPage = ({
  appModel,
  setAppModel,
  tagString,
  setCurrentPage,
  setCurrentQuestion,
}) => {
  var tag = appModel.data.tags.find(
    (tag) => tag.name.toLowerCase() === tagString.toLowerCase()
  );
  const [results, setResults] = useState(
    appModel.searchQuestions(`[${tag.name}]`)
  );

  return (
    <div className="page">
      <div className="page-top">
        <div className="page-info-and-sortby">
          <div className="page-info">
            <h1>Questions of Tag: [{tag.name}]</h1>
            <div style={{ flexGrow: 1 }}></div>
            <button id="question-ask-button" onClick={() => {}}>
              Ask Question
            </button>
          </div>
          <div className="num-questions-sortby">
            <p> {results.length} questions</p>
            <div style={{ flexGrow: 1 }}></div>
            <ul className="sortby">
              <li>
                <button
                  className="sort-button"
                  id="sortby-newest"
                  onClick={() => {
                    handleSortByNewestClickTag(appModel, setResults, tag);
                  }}
                >
                  Newest
                </button>
              </li>
              <li>
                <button
                  className="sort-button"
                  id="sortby-active"
                  onClick={() => {
                    handleSortByActiveClickTag(appModel, setResults, tag);
                  }}
                >
                  Active
                </button>
              </li>
              <li>
                <button
                  className="sort-button"
                  id="sortby-unanswered"
                  onClick={() => {
                    handleSortByUnansweredClickTag(appModel, setResults, tag);
                  }}
                >
                  Unanswered
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div id="result-list">
        {results.length ? (
          results.map((result) => {
            return (
              <ResultListItem
                appModel={appModel}
                setModel={setAppModel}
                question={result}
                setCurrentPage={setCurrentPage}
                setCurrentQuestion={setCurrentQuestion}
                key={`TagQuestionItem${JSON.stringify(result)}`}
              />
            );
          })
        ) : (
          <h2 style={{ margin: "5vh" }}>No Questions Found</h2>
        )}
      </div>
    </div>
  );
};

export default TagQuestionsPage;
