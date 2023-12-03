import { useState } from "react";

const HyperlinkErrorMessage = ({ hyperlinkError }) => {
  return (
    <div>
      <p style={{ color: "red" }}>{`${hyperlinkError}`}</p>
    </div>
  );
};

/**
 * Renders a form for users to post an answer.
 * Includes input fields for the username and answer text,
 * as well as a validation check for hyperlinks in the answer text.
 *
 * @param {Object} appModel - The model object that contains the application data and methods.
 * @param {Function} setAppModel - A function to update the appModel object.
 * @param {Function} setCurrentPage - A function to update the current page of the application.
 * @param {Object} currentQuestion - The question object for which the answer is being posted.
 * @returns {JSX.Element} - The rendered form for posting an answer.
 */
const PostAnswerPage = ({
  appModel,
  setAppModel,
  setCurrentPage,
  currentQuestion,
}) => {
  const [username, setUsername] = useState("");
  const [answerText, setAnswerText] = useState("");
  const [hyperlinkError, setHyperlinkError] = useState("");

  const handlePostAnswerClick = (event) => {
    event.preventDefault();
    var valid = true;
    // Look for invalid hyperlinks
    const emptyHyperlinkMatch = answerText.match(/\[.*\]\(\)/g); // match [...]()
    const noProtocolMatch = answerText.match(
      /\[[^\]]*\]\((?!(https:\/\/|http:\/\/)).*\)/g
    ); // match [...](string that does not start with protocol)
    if (emptyHyperlinkMatch != null || noProtocolMatch != null) {
      valid = false;
      if (emptyHyperlinkMatch != null) {
        setHyperlinkError("Hyperlink Invalid: () must not be empty");
      } else if (noProtocolMatch != null) {
        setHyperlinkError(
          "Hyperlink Invalid: link in () must start with https:// or http://"
        );
      }
    }
    if (username.length > 0 && answerText.length > 0 && valid) {
      appModel.createAnswer(answerText, username, currentQuestion).then(() => setCurrentPage("Answers"));
      //redirect to answer page
      setAppModel(undefined);
      
    } else {
      console.log(`Invalid Answer Form`);
    }
  };

  return (
    <div className="form">
      <form onSubmit={(event) => handlePostAnswerClick(event)}>
        <h1>Username*</h1>
        <input
          type="text"
          className="single-line-textbox"
          id="answer-username-input"
          required
          minLength="1"
          onChange={(event) => setUsername(event.target.value)}
        />
        <h1>Answer Text*</h1>
        <textarea
          className="multi-line-textbox"
          id="answer-text-input"
          minLength="1"
          required
          onChange={(event) => setAnswerText(event.target.value)}
        ></textarea>
        <HyperlinkErrorMessage hyperlinkError={hyperlinkError} />

        <div
          style={{ display: "flex", flexDirection: "row", marginTop: "3vh" }}
        >
          <input type="submit" value="Post Answer" className="button-blue" />
          <div style={{ flexGrow: 1 }}></div>
          <p style={{ color: "red" }}> * indicated mandatory fields</p>
        </div>
      </form>
    </div>
  );
};

export default PostAnswerPage;
