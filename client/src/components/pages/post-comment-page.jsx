import React, { useState, useContext } from "react";
import { UserContext } from "../../contexts/user-context";
import axios from "axios";

const PostCommentPage = ({setCurrentPage, currentQuestion}) => {
  const [user, setUser] = useContext(UserContext);
  const [commentText, setCommentText] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!user ||  user.reputation < 50) {
      alert("You must have at least 50 reputation to post a comment");
      return;
    }
    
  }

  return (
    <div className="form">
      <form
        onSubmit={(event) => handleSubmit(event) }
        style={{ flexGrow: 1 }}
      >
        <h1>Post a Comment</h1>
        <p>
          <i>Commenters must have at least 50 reputation. Max Length: 140 Characters</i>
        </p>
        <h1>Comment Text*</h1>
        <textarea
          className="multi-line-textbox"
          id="question-text-input"
          required
          maxLength={140}
          onChange={(event) => setCommentText(event.target.value) }
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
