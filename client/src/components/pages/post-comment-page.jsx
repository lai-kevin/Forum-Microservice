import React, { useState, useContext } from "react";
import { UserContext } from "../../contexts/user-context";
import axios from "axios";

const PostCommentPage = ({
  setCurrentPage,
  currentQuestion,
  currentAnswer,
}) => {
  const [user, setUser] = useContext(UserContext);
  const [commentText, setCommentText] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!user || user.reputation < 50) {
      alert("You must have at least 50 reputation to post a comment");
      return;
    }

    if (currentAnswer) {
      let data = JSON.stringify({
        answer_id: currentAnswer._id,
        text: commentText,
        question_id: "",
      });
      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "http://localhost:8000/api/comments",
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
        withCredentials: true,
      };

      await axios
        .request(config)
        .then((response) => {
          console.log(JSON.stringify(response.data));
        })
        .catch((error) => {
          alert("Error posting comment");
          console.log(error);
        });
      return;
    }

    if (currentQuestion) {
      let data = JSON.stringify({
        answer_id: "",
        text: commentText,
        question_id: currentQuestion._id,
      });
      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "http://localhost:8000/api/comments",
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
        withCredentials: true,
      };

      await axios
        .request(config)
        .then((response) => {
          console.log(JSON.stringify(response.data));
        })
        .catch((error) => {
          alert("Error posting comment");
          console.log(error);
        });
      return;
    }
  };

  return (
    <div className="form">
      <form onSubmit={ async (event) => await handleSubmit(event)} style={{ flexGrow: 1 }}>
        <h1>Post a Comment</h1>
        <p>
          <i>
            Commenters must have at least 50 reputation. Max Length: 140
            Characters
          </i>
        </p>
        <h1>Comment Text*</h1>
        <textarea
          className="multi-line-textbox"
          id="question-text-input"
          required
          maxLength={140}
          onChange={(event) => setCommentText(event.target.value)}
        ></textarea>

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

export default PostCommentPage;
