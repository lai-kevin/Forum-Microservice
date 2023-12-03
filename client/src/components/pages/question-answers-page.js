import React from "react";
import "../../stylesheets/index.css";
import { getAnswers } from "../../models/question";
import { getAnswerMetaData } from "../../models/answer";
import { getQuestionMetaData } from "../../models/question";
import { useState, useEffect } from "react";

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

const QuestionAnswersPage = ({ appModel, setCurrentPage, questionQid }) => {
  const question = appModel.getQuestionByQid(questionQid);
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
  const [answers, setAnswers] = useState(undefined);

  useEffect(() => {
    const updateAnswers = async () => {
      setAnswers(appModel.sortByNewestAnswer(getAnswers(question, appModel)));
    };
    updateAnswers();
  }, [appModel, question]);

  return (
    <div>
      { appModel && answers ? (
        <div className="page">
        <div className="page-top">
          <div className="page-info">
            <p className="page-info-item">
              <b>{answers.length} answers</b>
            </p>
            <h2 style={{ flexGrow: 1 }}>{question.title}</h2>
            <button
              id="question-ask-button"
              onClick={() => setCurrentPage("Post Question")}
            >
              Ask Question
            </button>
          </div>
          <div className="page-info">
            <p className="page-info-item">
              <b>{question.views} views</b>
            </p>
            <p className="page-info-item" style={{ flexGrow: 1 }}>
              {textArray.map((text) => text)}
            </p>
            {getQuestionMetaData(question)}
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
