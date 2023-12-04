import React from "react";
import { getQuestions } from "../../models/tag";

const TagsPage = ({ appModel, setCurrentPage, setTagString}) => {
  const tags = [];

  const handleTagBlockClick = (tag) => {
    setTagString(tag.name);
    setCurrentPage("Tag Questions")
  };

  return (
    <div className="page">
      <div className="page-top">
        <div className="page-info">
          <h1>{tags.length} Tags</h1>
          <h1 style={{ flex: 1, textAlign: "center" }}>All Tags</h1>
          <button id="question-ask-button" onClick={() => setCurrentPage("Post Question")}>
            Ask Question
          </button>
        </div>
      </div>
      <div
        style={{
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <div className="tag-container">
          {tags.map((tag) => {
            const questions = getQuestions(appModel, tag);
            return (
              <div className="tag-block" key={`TagBlock${JSON.stringify(tag)}`}>
                <p
                  style={{ color: "blue" }}
                  onClick={() => handleTagBlockClick(tag)}
                >
                  <u>{tag.name}</u>
                </p>
                <p>
                  {questions.length}{" "}
                  {questions.length ? "questions" : "question"}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TagsPage;
