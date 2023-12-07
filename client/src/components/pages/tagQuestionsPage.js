import ResultListItem from "../page-components/result-list-item";
import { getQuestions } from "../../models/tag";
import { UserContext } from "../../contexts/user-context";
import {
  handleSortByNewestClickTag,
  handleSortByUnansweredClickTag,
  handleSortByActiveClickTag,
} from "../utils/sorting";

import { useState, useEffect, useContext } from "react";
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
const TagQuestionsPage = ({ tag, setCurrentPage, setCurrentQuestion }) => {
  const [user, setUser] = useContext(UserContext);
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchTagQuestions = async () => {
      try {
        // Get all questions for tag
        const tagQuestions = await getQuestions(tag);
        setResults(tagQuestions);
      } catch (error) {
        console.log(error);
      }
    };
    fetchTagQuestions();
  });

  return (
    <div className="page">
      <div className="page-top">
        <div className="page-info-and-sortby">
          <div className="page-info">
            <h1>Questions of Tag: [{tag.name}]</h1>
            <div style={{ flexGrow: 1 }}></div>
            {user && (
              <button id="question-ask-button" onClick={() => {}}>
                Ask Question
              </button>
            )}
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
