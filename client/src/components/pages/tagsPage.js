import { getQuestions } from "../../models/tag";
import { useEffect, useState } from "react";
import axios from "axios";

const TagsPage = ({ appModel, setCurrentPage, setTagString }) => {
  const [tags, setTags] = useState([]);
  const [tagQuestions, setTagQuestions] = useState([]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        let config = {
          method: "get",
          maxBodyLength: Infinity,
          url: "http://localhost:8000/api/tags_v2",
          headers: {},
        };

        // Get all tags
        const response = await axios.request(config);
        const fetchedTags = response.data;
        setTags(fetchedTags);

        // Get all questions for each tag
        const tagQuestions = await Promise.all(
          fetchedTags.map(async (tag) => {
            return await getQuestions(tag);
          })
        );
        setTagQuestions(tagQuestions);
      } catch (error) {
        console.log(error);
      }
    };

    

    fetchTags();
  }, []);

  const handleTagBlockClick = (tag) => {
    setTagString(tag.name);
    setCurrentPage("Tag Questions");
  };

  return (
    <div className="page">
      <div className="page-top">
        <div className="page-info">
          <h1>{tags.length} Tags</h1>
          <h1 style={{ flex: 1, textAlign: "center" }}>All Tags</h1>
          <button
            id="question-ask-button"
            onClick={() => setCurrentPage("Post Question")}
          >
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
          {tags.map((tag, index) => {
            const questions = tagQuestions[index];
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
