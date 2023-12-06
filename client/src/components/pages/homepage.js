import ResultListItem from "../page-components/result-list-item";
import { useState, useEffect, useContext } from "react";
import "../../stylesheets/index.css";
import { Button } from "@mui/material";
import {
  handleSortByActiveClickAll,
  handleSortByNewestClickAll,
  handleSortByUnansweredClickAll,
} from "../utils/sorting";
import axios from "axios";
import { UserContext } from "../../contexts/user-context";

/**
 * Renders a page displaying a list of questions.
 *
 * @param {object} appModel - The application model object.
 * @param {function} setAppModel - A function to update the `appModel` object.
 * @returns {JSX.Element} - The rendered page layout with the list of questions and sorting options.
 */
const Homepage = ({
  appModel,
  setAppModel,
  setCurrentPage,
  setCurrentQuestion,
}) => {
  const [user, setUser] = useContext(UserContext);
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);

  // fetch posts from the backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        let config = {
          method: "get",
          maxBodyLength: Infinity,
          url: `http://localhost:8000/api/questions_v2?question_id&tag&page=${page}`,
          withCredentials: true,
        };

        const response = await axios.request(config);
        setResults(response.data.docs);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [page]);

  return (
    <div>
      <div className="page">
        <div className="page-top">
          <div className="page-info-and-sortby">
            <div className="page-info">
              <div style={{ display: "flex", flexDirection: "column" }}>
                <h1>All Questions</h1>
              </div>
              <div style={{ flexGrow: 1 }}></div>
              {user && (
                <button
                  id="question-ask-button"
                  onClick={() => setCurrentPage("Post Question")}
                >
                  Ask Question
                </button>
              )}
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
                  key={`HomepageResultItem${JSON.stringify(result)}`}
                />
              );
            })
          ) : (
            <h2 style={{ margin: 5 }}>No Questions Found</h2>
          )}
        </div>
      </div>
      <div style={{ position: "fixed", bottom: 0, right: 0, margin: 10 }}>
        <Button
          variant="contained"
          onClick={() => setPage(page === 0 ? page : page - 1)}
          style={{ marginRight: 10 }}
        >
          prev
        </Button>
        <Button
          variant="contained"
          onClick={() => setPage(results.length < 5 ? page : page + 1)}
        >
          next
        </Button>
      </div>
    </div>
  );
};

export default Homepage;

/* <div className="num-questions-sortby">
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
          </div> */
