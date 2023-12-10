import { useState, useEffect, useContext } from "react";
import Homepage from "./pages/homepage.js";
import Header from "./header.js";
import NavigationBar from "./navigation-bar.js";
import SearchResults from "./pages/search-results.js";
import PostQuestionPage from "./pages/post-question-page.js";
import TagsPage from "./pages/tagsPage.js";
import TagQuestionsPage from "./pages/tagQuestionsPage.js";
import QuestionAnswersPage from "./pages/question-answers-page.js";
import PostAnswerPage from "./pages/post-answer-page.js";
import AccountCreationPage from "./pages/account-creation.jsx";
import LoginPage from "./pages/login-page.jsx";
import { UserContext } from "../contexts/user-context.js";
import PostCommentPage from "./pages/post-comment-page.jsx";
/**
 * The `FakeStackOverflow` function is a React component that represents a Stack Overflow-like application.
 * It uses state hooks to manage the application's data and current page. The function returns JSX elements that render different components based on the current page state.
 * Currently does not use useContext even though it shouldve been used.
 * @returns {JSX.Element} JSX elements that represent the application's UI.
 */
const FakeStackOverflow = () => {
  const [user, setUser] = useContext(UserContext);
  const [currentPage, setCurrentPage] = useState("Homepage");
  const [searchString, setSearchString] = useState("");

  const [searchResults, setSearchResults] = useState([]); // For search result page
  const [tag, setTag] = useState(""); // For Tag Questions page
  const [currentQuestion, setCurrentQuestion] = useState(undefined); //For question answers page and post answer page. Stores a qid.
  const [currentAnswer, setCurrentAnswer] = useState(undefined); //For post comment page. Stores an aid.
  var currentPageComponent = <div></div>;

  switch (currentPage) {
    case "Homepage":
      currentPageComponent = (
        <Homepage
          setCurrentPage={setCurrentPage}
          setCurrentQuestion={setCurrentQuestion}
        />
      );
      break;
    case "Tags":
      currentPageComponent = (
        <TagsPage setCurrentPage={setCurrentPage} setTag={setTag} />
      );
      break;
    case "Search":
      currentPageComponent = (
        <SearchResults
          setCurrentPage={setCurrentPage}
          searchString={searchString}
          results={searchResults}
          setResults={setSearchResults}
          setCurrentQuestion={setCurrentQuestion}
        />
      );
      break;
    case "Post Question":
      currentPageComponent = (
        <PostQuestionPage setCurrentPage={setCurrentPage} />
      );
      break;
    case "Answers":
      currentPageComponent = (
        <QuestionAnswersPage
          setCurrentPage={setCurrentPage}
          question={currentQuestion}
          setCurrentAnswer={setCurrentAnswer}
        />
      );
      break;
    case "Post Answer":
      currentPageComponent = (
        <PostAnswerPage
          setCurrentPage={setCurrentPage}
          currentQuestion={currentQuestion}
        />
      );
      break;
    case "Tag Questions":
      currentPageComponent = (
        <TagQuestionsPage
          tag={tag}
          setCurrentPage={setCurrentPage}
          setCurrentQuestion={setCurrentQuestion}
        />
      );
      break;
    case "Account Creation":
      currentPageComponent = (
        <AccountCreationPage setCurrentPage={setCurrentPage} />
      );
      break;
    case "Login":
      currentPageComponent = <LoginPage setCurrentPage={setCurrentPage} />;
      break;
    case "Post Comment":
      currentPageComponent = (
        <PostCommentPage
          setCurrentPage={setCurrentPage}
          currentQuestion={currentQuestion}
          currentAnswer={currentAnswer}
        />
      );
      break;
    default:
      // Default case should not be reached
      console.log("Error: default case reached in page component switch");
      currentPageComponent = (
        <Homepage
          setCurrentPage={setCurrentPage}
          setCurrentQuestion={setCurrentQuestion}
        />
      );
      break;
  }

  return (
    <div>
      <div>
        <Header
          searchString={searchString}
          setSearchString={setSearchString}
          setCurrentPage={setCurrentPage}
          setSearchResults={setSearchResults}
        />
        <div className="container">
          <NavigationBar setCurrentPage={setCurrentPage} />
          <div id="content" style={{ overflow: "auto" }}>
            {currentPageComponent}
          </div>
        </div>
      </div>
    </div>
  );
};
export default FakeStackOverflow;
