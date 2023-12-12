import ResultListItem from "../page-components/result-list-item";
import {
  handleSortByActiveClickSearch,
  handleSortByNewestClickSearch,
  handleSortByUnansweredClickSearch,
} from "../utils/sorting";
import { UserContext } from "../../contexts/user-context";
import { useContext, useState } from "react";
import { Button } from "@mui/material";

/**
 * Functional component that renders a list of search results.
 *
 * @param {Object} appModel - An object representing the application model.
 * @param {Array} results - An array of objects representing the search results.
 * @returns {JSX.Element} - JSX element representing the search results page.
 */
const SearchResults = ({
  setCurrentPage,
  results,
  setResults,
  searchString,
  setCurrentQuestion,
}) => {
  const [user, setUser] = useContext(UserContext);
  const [page, setPage] = useState(1);
  const start = (page - 1) * 5;
  const end = page * 5;
  return (
    <div id="content" style={{ overflow: "auto" }}>
      <div className="page">
        <div className="page-top">
          <div className="page-info-and-sortby">
            <div className="page-info">
              <h1>Search Results</h1>
              <div style={{ flex: "1" }}></div>
              {user && (
                <button
                  id="question-ask-button"
                  onClick={() => setCurrentPage("Post Question")}
                >
                  Ask Question
                </button>
              )}
            </div>
            <div className="num-questions-sortby">
              <p>{results.length} questions</p>
              <div style={{ flex: "1" }}></div>
              <ul className="sortby">
                <li>
                  <button
                    className="sort-button"
                    id="sortby-newest"
                    onClick={ async () => {
                      await handleSortByNewestClickSearch(setResults, searchString);
                    }}
                  >
                    Newest
                  </button>
                </li>
                <li>
                  <button
                    className="sort-button"
                    id="sortby-active"
                    onClick={ async () => {
                      await handleSortByActiveClickSearch(setResults, searchString);
                    }}
                  >
                    Active
                  </button>
                </li>
                <li>
                  <button
                    className="sort-button"
                    id="sortby-unanswered"
                    onClick={ async () => {
                      await handleSortByUnansweredClickSearch(
                        setResults,
                        searchString
                      );
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
                  key={`SearchResultItem${JSON.stringify(result)}`}
                />
              );
            })
          ) : (
            <h2 style={{ margin: "5vh" }}>No Questions Found</h2>
          )}
        </div>
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

export default SearchResults;
