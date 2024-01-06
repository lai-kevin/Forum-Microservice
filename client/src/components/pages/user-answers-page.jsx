import axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../../contexts/user-context";  

import "../../stylesheets/index.css";
import {
  QuestionMetaData,
  getQuestionMetaData,
} from "../../utils/metadata_generators";
import { Button } from "@mui/material";
/**
 * Represents a JSX element for a tag item.
 *
 * @param {object} tag - The tag object
 * @returns {JSX.Element} - The JSX element displaying the name property of the tag object.
 */
function tagsListItem(tag) {
  return (
    <div className="tag-item" key={JSON.stringify(tag)}>
      <p>{tag.name}</p>
    </div>
  );
}

/**
 * Renders a single item in a list of search results for homepage and search result page.
 *
 * @param {Object} appModel - The application model object.
 * @param {Object} question - The question object that represents the question to be displayed.
 * @returns {JSX.Element} The rendered JSX code for the ResultListItem component.
 */
const ResultListItem = ({ question, setShowModifyAnswerScreen, setCurrentQuestion }) => {
  const [user, setUser] = useContext(UserContext);
  const [votes, setVotes] = useState(question.votes.length);
  const handleUpvote = async () => {
    let config = {
      method: "patch",
      maxBodyLength: Infinity,
      url: `http://localhost:8000/api/questions_v2/upvote/?question_id=${question._id}`,
      headers: {},
      withCredentials: true,
    };

    axios
      .request(config)
      .then((response) => {
        console.log(response)
        setVotes(response.data.votes)
        console.log(JSON.stringify(response.data));
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleDownvote = async () => {
    let config = {
      method: "patch",
      maxBodyLength: Infinity,
      url: `http://localhost:8000/api/questions_v2/downvote/?question_id=${question._id}`,
      headers: {},
      withCredentials: true,
    };

    axios
      .request(config)
      .then((response) => {
        console.log(response)
        setVotes(response.data.votes)
        console.log(JSON.stringify(response.data));
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <div className="result-item-original">
      <div className="result-item-stats">
        <p>{question.answers.length} answers</p>
        <p>{question.views} views</p>
        <p>{votes} votes</p>
      </div>
      <div className="result-item-title-and-tag">
        <p
          className="question-title"
          onClick={() => {
            setCurrentQuestion(question);
            setShowModifyAnswerScreen(true);
          }}
        >
          {question.title}
        </p>
        <p>{question.summary}</p>
        <div className="result-item-tag-list">
          {question.tags.map((tag) => tagsListItem(tag))}
        </div>
      </div>
      <div className="result-item-author-and-time">
        <div>
          <QuestionMetaData question={question} />
        </div>
      </div>
      {user && (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Button onClick={() => handleUpvote()}>Upvote</Button>
          <Button onClick={() => handleDownvote()}>Downvote</Button>
        </div>
      )}
    </div>
  );
};

const UserAnswersPage = ({ setShowModifyAnswerScreen, setQuestion , showModifyAnswerScreen }) => {
    const [answers, setAnswers] = useState([]);
    const [user, setUser] = useContext(UserContext);
    const fetchAnswers = async () => {
      let config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `http://localhost:8000/api/answers_v2?user_id=${user.user._id}`,
        headers: {},
      };

      await axios
        .request(config)
        .then((response) => {
          const filteredAnswers = response.data.filter(answer => answer.asked_by === user.user._id);
          console.log(response.data)
          setAnswers(filteredAnswers);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  
    useEffect(() => {
      fetchAnswers();
  
      const interval = setInterval(() => {
        fetchAnswers();
      }, 1000);
  
      return () => {
        clearInterval(interval);
      };
    }, []);
  
    return (
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            border: "solid",
            borderTop: "none",
            borderLeft: "none",
            borderRight: "none",
          }}
        >
          <h1>Answered Questions</h1>
        </div>
        {answers.map((question) => (
          <div
            style={{
              border: "dotted",
              borderTop: "none",
              borderLeft: "none",
              borderRight: "none",
            }}
          >
            <h3
              onClick={() => {
                setQuestion(question);
                setShowModifyAnswerScreen(true);
              }}
            >
            <ResultListItem question={question} setCurrentQuestion={setQuestion} setShowModifyAnswerScreen={setShowModifyAnswerScreen} />
            </h3>
          </div>
        ))}
      </div>
    );
  };

export default UserAnswersPage;