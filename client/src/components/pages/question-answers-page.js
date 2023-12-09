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
    <div className="result-item">
      <p className="answer-text">{textArray.map((text) => text)}</p>
      {getAnswerMetaData(answer)}
    </div>
  );
};

const QuestionAnswersPage = ({ setCurrentPage, question }) => {
  const [user, setUser] = useContext(UserContext);
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

  useEffect(() => {
    const updateAnswers = async () => {
      setAnswers(sortByNewestAnswer(question.answers));
    };
    updateAnswers();
  }, [question]);

  // Increment View
  useEffect( () => {
    const incrementView = async () => {
      let config = {
        method: 'patch',
        maxBodyLength: Infinity,
        url: `http://localhost:8000/api/questions_v2/view?question_id=${question._id}`,
        headers: {}
      };
      
      axios.request(config)
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
      { answers ? (
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
        </div>
        <div id="result-list">
          {answers.map((answer) => (
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
      )
    }
    </div>
  );
};

export default QuestionAnswersPage;
