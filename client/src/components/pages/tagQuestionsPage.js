import ResultListItem from "../page-components/result-list-item";
import { getQuestions } from "../../models/tag";
import { UserContext } from "../../contexts/user-context";
import { useContext } from "react";
import {
  handleSortByNewestClickTag,
  handleSortByUnansweredClickTag,
  handleSortByActiveClickTag,
} from "../utils/sorting";
import { Button } from "@mui/material";

import { useState, useEffect } from "react";
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
  const [page, setPage] = useState(1);
  const start = (page - 1) * 5;
  const end = page * 5;

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
  }, [tag]);

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
                  onClick={async () => {
                    await handleSortByNewestClickTag(setResults, tag);
                  }}
                >
                  Newest
                </button>
              </li>
              <li>
                <button
                  className="sort-button"
                  id="sortby-active"
                  onClick={async () => {
                    await handleSortByActiveClickTag(setResults, tag);
                  }}
                >
                  Active
                </button>
              </li>
              <li>
                <button
                  className="sort-button"
                  id="sortby-unanswered"
                  onClick={async () => {
                    await handleSortByUnansweredClickTag(setResults, tag);
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
          results.slice(start, end).map((result) => {
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
      <div style={{ position: "fixed", bottom: 0, right: 0, margin: 10 }}>
        <Button
          variant="contained"
          onClick={() => setPage(page === 1 ? 1 : page - 1)}
          style={{ marginRight: 10 }}
        >
          prev
        </Button>
        <Button
          variant="contained"
          onClick={() => setPage(page * 5 > results.length ? page : page + 1)}
        >
          next
        </Button>
      </div>
    </div>
  );
};

export default TagQuestionsPage;
