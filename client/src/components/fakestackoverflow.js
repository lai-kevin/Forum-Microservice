import { Model } from "../models/model.js";
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
import WelcomePage from "./pages/welcome-page.jsx";
import { UserContext } from "../contexts/user-context.js";

/**
 * The `FakeStackOverflow` function is a React component that represents a Stack Overflow-like application.
 * It uses state hooks to manage the application's data and current page. The function returns JSX elements that render different components based on the current page state.
 * Currently does not use useContext even though it shouldve been used.
 * @returns {JSX.Element} JSX elements that represent the application's UI.
 */
const FakeStackOverflow = () => {
  const [user, setUser] = useContext(UserContext);
  const [currentPage, setCurrentPage] = useState("Homepage");
  const [appModel, setAppModel] = useState(1);
  const [searchString, setSearchString] = useState("");
  const [searchResults, setSearchResults] = useState([]); // For search result page
  const [tagString, setTagString] = useState(""); // For Tag Questions page
  const [currentQuestion, setCurrentQuestion] = useState(undefined); //For question answers page and post answer page. Stores a qid.

  var currentPageComponent = <div></div>;

  console.log(user)

  if (appModel) {
    switch (currentPage) {
      case "Homepage":
        currentPageComponent = (
          <Homepage
            appModel={appModel}
            setAppModel={setAppModel}
            setCurrentPage={setCurrentPage}
            setCurrentQuestion={setCurrentQuestion}
          />
        );
        break;
      case "Tags":
        currentPageComponent = (
          <TagsPage
            appModel={appModel}
            setCurrentPage={setCurrentPage}
            setTagString={setTagString}
          />
        );
        break;
      case "Search":
        currentPageComponent = (
          <SearchResults
            appModel={appModel}
            setAppModel={setAppModel}
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
          <PostQuestionPage
            appModel={appModel}
            setAppModel={setAppModel}
            setCurrentPage={setCurrentPage}
          />
        );
        break;
      case "Answers":
        currentPageComponent = (
          <QuestionAnswersPage
            appModel={appModel}
            setCurrentPage={setCurrentPage}
            questionQid={currentQuestion}
          />
        );
        break;
      case "Post Answer":
        currentPageComponent = (
          <PostAnswerPage
            appModel={appModel}
            setAppModel={setAppModel}
            setCurrentPage={setCurrentPage}
            currentQuestion={currentQuestion}
          />
        );
        break;
      case "Tag Questions":
        currentPageComponent = (
          <TagQuestionsPage
            appModel={appModel}
            setAppModel={setAppModel}
            tagString={tagString}
            setCurrentPage={setCurrentPage}
            setCurrentQuestion={setCurrentQuestion}
          />
        );
        break;
      case "Account Creation":
        currentPageComponent = (
          <AccountCreationPage
            appModel={appModel}
            setAppModel={setAppModel}
            setCurrentPage={setCurrentPage}
          />
        );
        break;
      case "Login":
        currentPageComponent = (
          <LoginPage
            appModel={appModel}
            setAppModel={setAppModel}
            setCurrentPage={setCurrentPage}
          />
        );
        break;
      case "Welcome":
        currentPageComponent = (
          <WelcomePage
            appModel={appModel}
            setAppModel={setAppModel}
            setCurrentPage={setCurrentPage}
          />
        );
        break;
      default:
        // Default case should not be reached
        console.log("Error: default case reached in page component switch");
        currentPageComponent = (
          <Homepage
            appModel={appModel}
            setAppModel={setAppModel}
            setCurrentPage={setCurrentPage}
            setCurrentQuestion={setCurrentQuestion}
          />
        );
        break;
    }
  }

  return (
    <div>
      {appModel ? (
        <div>
          <Header
            appModel={appModel}
            searchString={searchString}
            setSearchString={setSearchString}
            setCurrentPage={setCurrentPage}
            setSearchResults={setSearchResults}
          />
          <div className="container">
            <NavigationBar
              appModel={appModel}
              setCurrentPage={setCurrentPage}
            />
            <div id="content" style={{ overflow: "auto" }}>
              {currentPageComponent}
            </div>
          </div>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};
export default FakeStackOverflow;
