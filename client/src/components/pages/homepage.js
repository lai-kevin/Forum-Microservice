import ResultListItem from "../page-components/result-list-item";
import { useState, useEffect } from "react";
import "../../stylesheets/index.css";
import {
  handleSortByActiveClickAll,
  handleSortByNewestClickAll,
  handleSortByUnansweredClickAll,
} from "../utils/sorting";

/**
 * Renders a page displaying a list of questions.
 *
 * @param {object} appModel - The application model object.
 * @param {function} setAppModel - A function to update the `appModel` object.
 * @returns {JSX.Element} - The rendered page layout with the list of questions and sorting options.
 */
const Homepage = ({ appModel, setAppModel, setCurrentPage, setCurrentQuestion}) => {
  const [results, setResults] = useState([]);

  return (
    <div className="page">
      <div className="page-top">
        <div className="page-info-and-sortby">
          <div className="page-info">
            <h1>All Questions</h1>
            <div style={{ flexGrow: 1 }}></div>
            <button
              id="question-ask-button"
              onClick={() => setCurrentPage("Post Question")}
            >
              Ask Question
            </button>
          </div>
          <div className="num-questions-sortby">
            <p>{results.length} questions</p>
            <div style={{ flexGrow: 1 }}></div>
            <ul className="sortby">
              <li>
                <button
                  className="sort-button"
                  id="sortby-newest"
                  onClick={() => { 
                    handleSortByNewestClickAll(appModel, setResults);
                    console.log("sort by newest")
                  }

                  }
                >
                  Newest
                </button>
              </li>
              <li>
                <button
                  className="sort-button"
                  id="sortby-active"
                  onClick={() =>
                    handleSortByActiveClickAll(appModel, setResults)
                  }
                >
                  Active
                </button>
              </li>
              <li>
                <button
                  className="sort-button"
                  id="sortby-unanswered"
                  onClick={() =>
                    handleSortByUnansweredClickAll(appModel, setResults)
                  }
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
                key={`HomepageResultItem${JSON.stringify(result)}`}
              />
            );
          })
        ) : (
          <h2 style={{ margin: 5 }}>No Questions Found</h2>
        )}
      </div>
    </div>
  );
};

export default Homepage;
