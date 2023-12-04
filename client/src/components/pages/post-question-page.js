import React, { useState } from "react";

const HyperlinkErrorMessage = ({ hyperlinkError }) => {
  return (
    <div>
      <p style={{color: "red"}}>{`${hyperlinkError}`}</p>
    </div>
  );
};
const TagsErrorMessage = ({ tagsError }) => {
  return (
    <div>
      <p style={{color: "red"}}>{`${tagsError}`}</p>
    </div>
  );
};

/**
 * Renders a form for posting a question.
 *
 * @returns {JSX.Element} The rendered form component.
 */
const PostQuestionPage = ({ appModel, setAppModel, setCurrentPage }) => {
  const [questionTitle, setQuestionTitle] = useState("");
  const [questionText, setQuestionText] = useState("");
  const [tags, setTags] = useState("");
  const [username, setUsername] = useState("");
  const [tagsError, setTagsError] = useState("");
  const [hyperlinkError, setHyperlinkError] = useState("");

  function handlePostQuestionClick(event) {
    event.preventDefault();
    var title = questionTitle;
    var text = questionText;
    var tagStrings = tags
      .split(" ")
      .filter((tagString) => tagString.length > 0);

    var valid = true;
    var tagsTooLong = false;

    if (title.length === 0) {
      valid = false;
    }
    if (text.length === 0) {
      valid = false;
    }
    if (tagStrings.length > 5) {
      valid = false;
      setTagsError("Invalid: Too many tags. Max 5 tags.");
    }
    tagStrings.forEach(
      (tagString) => (tagsTooLong = tagString.length > 10 ? true : tagsTooLong)
    );
    if (tagsTooLong) {
      valid = false;
    }
    if (tagsTooLong) {
      setTagsError("Invalid: Tag(s) too long");
    }
    if (username.length === 0) {
      valid = false;
    }

    // Look for invalid hyperlinks
    const emptyHyperlinkMatch = questionText.match(/\[.*\]\(\)/g); // match [...]()
    const noProtocolMatch = questionText.match(
      /\[[^\]]*\]\((?!(https:\/\/|http:\/\/)).*\)/g
    ); // match [...](string that does not start with protocol)
    if (emptyHyperlinkMatch != null || noProtocolMatch != null) {
      valid = false;
      if (emptyHyperlinkMatch != null) {
        setHyperlinkError("Hyperlink Invalid: () must not be empty");
      }
      else if (noProtocolMatch != null) {
        setHyperlinkError(
          "Hyperlink Invalid: link in () must start with https:// or http://"
        );
      }
    }

    tagStrings.forEach(
      (tagString, index, arr) => (arr[index] = arr[index].toLowerCase())
    );

    if (valid) {
      setAppModel(undefined);
      var question = appModel.createQuestion(title, text, username, tagStrings).then( () => setCurrentPage("Homepage"));
      console.log(`posted question: ${question.title}`);
    } else {
      console.log(`invalid question form`);
    }
    return false;
  }

  return (
    <div className="form">
      <form
        onSubmit={(event) => handlePostQuestionClick(event)}
        style={{ flexGrow: 1 }}
      >
        <h1>Question Title*</h1>
        <p>
          <i>Limit title to 100 characters or less</i>
        </p>
        <input
          type="text"
          className="single-line-textbox"
          id="question-title-input"
          required
          minLength="1"
          maxLength="100"
          onChange={(event) => setQuestionTitle(event.target.value)}
        />

        <h1>Question Text*</h1>
        <p>
          <i>Add details</i>
        </p>
        <textarea
          className="multi-line-textbox"
          id="question-text-input"
          required
          onChange={(event) => setQuestionText(event.target.value)}
        ></textarea>
        <HyperlinkErrorMessage hyperlinkError={hyperlinkError} />

        <h1>Tags*</h1>
        <p>
          <i>Add keywords separated by whitespace</i>
        </p>
        <input
          type="text"
          className="single-line-textbox"
          id="question-tags-input"
          onChange={(event) => setTags(event.target.value)}
        />
        <TagsErrorMessage tagsError={tagsError} />

        <h1>Username*</h1>
        <input
          type="text"
          className="single-line-textbox"
          id="question-username-input"
          required
          minLength="1"
          onChange={(event) => setUsername(event.target.value)}
        />

        <div
          style={{ display: "flex", flexDirection: "row", marginTop: "3vh" }}
        >
          <input type="submit" value="Post Question" className="button-blue" />
          <div style={{ flexGrow: 1 }}></div>
          <p style={{ color: "red" }}> * indicated mandatory fields</p>
        </div>
      </form>
    </div>
  );
};

export default PostQuestionPage;
