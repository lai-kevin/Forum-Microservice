import React, { useContext } from "react";
import { UserContext } from "../../contexts/user-context";
import "../../stylesheets/index.css";
import { getAnswers } from "../../models/question";
import { getAnswerMetaData } from "../../models/answer";
import { getQuestionMetaData } from "../../models/question";
import { useState, useEffect } from "react";
import { sortByNewestAnswer } from "../utils/sorting";
import { QuestionMetaData } from "../../utils/metadata_generators";
import axios from "axios";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { Divider } from "@mui/material";

function Comments({ comments }) {
  const [page, setPage] = useState(1);
  const start = (page - 1) * 3;
  const end = page * 3;

  // Sort comments by post_time
  const sortedComments = comments.sort(
    (a, b) => new Date(b.post_time) - new Date(a.post_time)
  );

  if (sortedComments.length === 0) {
    return <div>No comments</div>;
  }

  return (
    <div>
      {sortedComments.slice(start, end).map((comment) => (
        <CommentListItem key={comment._id} comment={comment} />
      ))}
      <div style={{ margin: 10 }}>
        <Button
          variant="contained"
          onClick={() => setPage(page === 1 ? 1 : page - 1)}
          style={{ marginRight: 10 }}
        >
          prev
        </Button>
        <Button
          variant="contained"
          onClick={() =>
            setPage(page * 3 >= sortedComments.length ? page : page + 1)
          }
        >
          next
        </Button>
      </div>
    </div>
  );
}

function CommentListItem({ comment }) {
  console.log(comment);
  return (
    <div style={{ display: "flex", border: "dotted" }}>
      <p className="answer-text">{comment.text}</p>
      <p className="answer-text">comment by: {comment.posted_by.username}</p>
    </div>
  );
}

/**
 * Renders a single tag item.
 *
 * @param {Object} tag - The tag object.
 * @param {string} tag.name - The name of the tag.
 * @returns {JSX.Element} The rendered tag item.
 */
function tagsListItem(tag) {
  return (
    <div className="tag-item" key={JSON.stringify(tag)}>
      <p>{tag.name}</p>
    </div>
  );
}

/**
 * Renders a single answer item on a question page.
 *
 * @param {Object} answer - The answer object.
 * @returns {JSX.Element} - Rendered answer item, including the answer text and metadata.
 */
const AnswerResultListItem = ({ answer }) => {
  var answerText = answer.text;
  const hyperlinkRegex = /\[[^\]]+\]\([^)]+\)/g;
  var textArray = answerText.split(hyperlinkRegex);
  var hyperlinks = answerText.match(hyperlinkRegex);
  if (hyperlinks != null) {
    var hyperlinkLink = hyperlinks.map((hyperlink) =>
      hyperlink
        .match(/\(((https:\/\/|http:\/\/)).*\)/g)[0]
        .replace(/(\(|\))/g, "")
    ); //gets link from ()
    var hyperlinkHTML = hyperlinks.map((hyperlink, index) => (
      <a href={hyperlinkLink[index]} target="_blank" rel="noreferrer noopener">
        {hyperlink.match(/^\[[^\]]*\]/g)[0].replace(/(\[|\])/g, "")}
      </a>
    ));
    var i = 0;
    textArray = textArray.flatMap((text) => [text, hyperlinkHTML[i++]]);
  }
  return (
    <div
      style={{
        justifyContent: "center",
        borderStyle: "dotted",
        borderTop: "none",
        borderRight: "none",
        borderLeft: "none",
      }}
    >
      <div className="result-item">
        <p className="answer-text">{textArray.map((text) => text)}</p>
        {getAnswerMetaData(answer)}
      </div>
      <div style={{margin: 10}}>
        <div>
          <h4>Answer Comments</h4>
          <Comments comments={answer.comments} />
        </div>
      </div>
    </div>
  );
};

const QuestionAnswersPage = ({
  setCurrentPage,
  question,
  setCurrentAnswer,
}) => {
  const navi = useNavigate();
  const [user, setUser] = useContext(UserContext);
  const [page, setPage] = useState(1);
  const start = (page - 1) * 5;
  const end = page * 5;

  var questionText = question.text;
  const hyperlinkRegex = /\[[^\]]+\]\([^)]+\)/g;
  var textArray = questionText.split(hyperlinkRegex);
  var hyperlinks = questionText.match(hyperlinkRegex);
  if (hyperlinks != null) {
    var hyperlinkLink = hyperlinks.map((hyperlink) =>
      hyperlink
        .match(/\(((https:\/\/|http:\/\/)).*\)/g)[0]
        .replace(/(\(|\))/g, "")
    ); //gets link from ()
    var hyperlinkHTML = hyperlinks.map((hyperlink, index) => (
      <a href={hyperlinkLink[index]} target="_blank" rel="noreferrer noopener">
        {hyperlink.match(/^\[[^\]]*\]/g)[0].replace(/(\[|\])/g, "")}
      </a>
    ));
    var i = 0;
    textArray = textArray.flatMap((text) => [text, hyperlinkHTML[i++]]);
  }
  const [answers, setAnswers] = useState([]);

  // Update with latest answers from the server
  useEffect(() => {
    const updateAnswers = async () => {
      let config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `http://localhost:8000/api/answers_v2?question_id=${question._id}`,
        headers: {},
      };

      let answers = [];
      await axios
        .request(config)
        .then((response) => {
          answers = response.data;
        })
        .catch((error) => {
          console.log(error);
        });
      setAnswers(sortByNewestAnswer(answers));
    };
    updateAnswers();
  }, [question]);

  // Increment View
  useEffect(() => {
    const incrementView = async () => {
      let config = {
        method: "patch",
        maxBodyLength: Infinity,
        url: `http://localhost:8000/api/questions_v2/view?question_id=${question._id}`,
        headers: {},
      };

      axios
        .request(config)
        .then((response) => {
          console.log("viewed question");
        })
        .catch((error) => {
          console.log(error);
        });
    };
    incrementView();
  }, [question]);

  return (
    <div>
      {answers ? (
        <div className="page">
          <div className="page-top">
            <div className="page-info">
              <p className="page-info-item">
                <b>{answers.length} answers</b>
              </p>
              <h2 style={{ flexGrow: 1 }}>{question.title}</h2>
              {user && (
                <button
                  id="question-ask-button"
                  onClick={() => setCurrentPage("Post Question")}
                >
                  Ask Question
                </button>
              )}
            </div>
            <div className="page-info">
              <p className="page-info-item">
                <b>{question.views + 1} views</b>
              </p>
              <p className="page-info-item" style={{ flexGrow: 1 }}>
                {textArray.map((text) => text)}
              </p>
              <QuestionMetaData question={question} />
            </div>
            <div
              className="result-item-tag-list"
              style={{ justifyContent: "right" }}
            >
              <h4>Tags: </h4>
              {question.tags.map((tag) => tagsListItem(tag))}
            </div>
            <div>
              {user && (
                <button
                  className="blue-button"
                  id="question-answer-button"
                  onClick={() => {
                    setCurrentAnswer(undefined);
                    setCurrentPage("Post Comment");
                  }}
                >
                  Post Comment
                </button>
              )}
            </div>
            <div>
              <h3>Question Comments</h3>
              <Comments comments={question.comments} />
            </div>
          </div>
          <div>
            <h1 style={{fontSize: 50, textDecoration: "underline"}}>Answers</h1>
          </div>
          <div>
            {answers.slice(start, end).map((answer) => (
              <AnswerResultListItem answer={answer} key={`${answer._id}`} />
            ))}
          </div>
          <div style={{ margin: 1 }}>
            <button
              className="button-blue"
              id="question-answer-button"
              onClick={() => setCurrentPage("Post Answer")}
            >
              Answer Question
            </button>
          </div>
        </div>
      ) : (
        <div></div>
      )}
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
          onClick={() => setPage(page * 5 >= answers.length ? page : page + 1)}
        >
          next
        </Button>
      </div>
    </div>
  );
};

export default QuestionAnswersPage;
