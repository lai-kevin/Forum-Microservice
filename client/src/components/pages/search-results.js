import ResultListItem from "../page-components/result-list-item";
import {
  handleSortByActiveClickSearch,
  handleSortByNewestClickSearch,
  handleSortByUnansweredClickSearch,
} from "../utils/sorting";

/**
 * Functional component that renders a list of search results.
 *
 * @param {Object} appModel - An object representing the application model.
 * @param {Array} results - An array of objects representing the search results.
 * @returns {JSX.Element} - JSX element representing the search results page.
 */
const SearchResults = ({
  appModel,
  setAppModel,
  setCurrentPage,
  results,
  setResults,
  searchString,
  setCurrentQuestion,
}) => {
  return (
    <div id="content" style={{ overflow: "auto" }}>
      <div className="page">
        <div className="page-top">
          <div className="page-info-and-sortby">
            <div className="page-info">
              <h1>Search Results</h1>
              <div style={{ flex: "1" }}></div>
              <button
                id="question-ask-button"
                onClick={() => setCurrentPage("Post Question")}
              >
                Ask Question
              </button>
            </div>
            <div className="num-questions-sortby">
              <p>{results.length} questions</p>
              <div style={{ flex: "1" }}></div>
              <ul className="sortby">
                <li>
                  <button
                    className="sort-button"
                    id="sortby-newest"
                    onClick={() =>
                      handleSortByNewestClickSearch(
                        appModel,
                        setResults,
                        searchString
                      )
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
                      handleSortByActiveClickSearch(
                        appModel,
                        setResults,
                        searchString
                      )
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
                      handleSortByUnansweredClickSearch(
                        appModel,
                        setResults,
                        searchString
                      )
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
                  key={`SearchResultItem${JSON.stringify(result)}`}
                />
              );
            })
          ) : (
            <h2 style={{ margin: "5vh" }}>No Questions Found</h2>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
