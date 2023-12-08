import React, { useState } from "react";
import axios from "axios";

const HyperlinkErrorMessage = ({ hyperlinkError }) => {
  return (
    <div>
      <p style={{ color: "red" }}>{`${hyperlinkError}`}</p>
    </div>
  );
};
const TagsErrorMessage = ({ tagsError }) => {
  return (
    <div>
      <p style={{ color: "red" }}>{`${tagsError}`}</p>
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
  const [questionSummary, setQuestionSummary] = useState("");

  async function handlePostQuestionClick(event) {
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
      } else if (noProtocolMatch != null) {
        setHyperlinkError(
          "Hyperlink Invalid: link in () must start with https:// or http://"
        );
      }
    }

    tagStrings.forEach(
      (tagString, index, arr) => (arr[index] = arr[index].toLowerCase())
    );

    if (valid) {

      const postQuestion = async () => {
        let data = JSON.stringify({
          title: title,
          summary: questionSummary,
          question_text: text,
          tags_strings: tagStrings,
        });

        let config = {
          method: "post",
          maxBodyLength: Infinity,
          url: "http://localhost:8000/api/questions_v2",
          headers: {
            "Content-Type": "application/json",
          },
          data: data,
          withCredentials: true,
        };

        try {
          const response = await axios.request(config);
          console.log(`posted question: ${JSON.stringify(response.data)}`);
          setCurrentPage("Homepage");
        } catch (error) {
          console.log(error);
        }

      };

      postQuestion();
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
          <i>Limit title to 50 characters or less</i>
        </p>
        <input
          type="text"
          className="single-line-textbox"
          id="question-title-input"
          required
          minLength="1"
          maxLength="50"
          onChange={(event) => setQuestionTitle(event.target.value)}
        />

        <h1>Question Summary*</h1>
        <p>
          <i>Limit summary to 140 characters</i>
        </p>
        <input
          type="text"
          className="single-line-textbox"
          id="question-sumary-input"
          required
          maxLength="140"
          onChange={(event) => setQuestionSummary(event.target.value)}
          style={{ width: "100%" }}
        ></input>

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
