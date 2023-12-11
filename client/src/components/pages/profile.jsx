import { UserContext } from "../../contexts/user-context";
import { useContext, useEffect, useState } from "react";
import { Divider, Button } from "@mui/material";
import axios from "axios";
import ModifyQuestionPage from "./modifyQuestionPage";

const UserInfo = ({ user }) => {
  const accountAgeInSeconds = Math.floor(
    (Date.now() - new Date(user.createdAt)) / 1000
  );

  return (
    <div>
      <h1>Username: {user.username}</h1>
      <h2>Email: {user.email}</h2>
      <h2>Admin: {user.admin}</h2>
      <h2>Reputation: {user.reputation}</h2>
      <h2>Account Age (seconds): {accountAgeInSeconds}</h2>
    </div>
  );
};

const UserQuestions = ({ user, setShowModifyScreen, setQuestion }) => {
  const [questions, setQuestions] = useState([]);
  useEffect(() => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: "http://localhost:8000/api/questions_v2",
      headers: {},
    };

    axios
      .request(config)
      .then((response) => {
        const filteredQuestions = response.data.filter(question => question.posted_by === user._id);
        setQuestions(filteredQuestions);
      })
      .catch((error) => {
        console.log(error);
      });
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
        <h1>Questions</h1>
      </div>
      {questions.map((question) => (
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
              setShowModifyScreen(true);
            }}
          >
            {question.title}
          </h3>
        </div>
      ))}
    </div>
  );
};

const UserAnswers = ({ user }) => {};

const UserTags = ({ user }) => {};

const Profile = ({ setCurrentPage }) => {
  const [user, setUser] = useContext(UserContext);
  const [display, setDisplay] = useState("questions");
  const [showModifyScreen, setShowModifyScreen] = useState(false);
  const [question, setQuestion] = useState(null);
  let list;
  switch (display) {
    case "questions":
      list = (
        <UserQuestions user={user} setShowModifyScreen={setShowModifyScreen} setQuestion={setQuestion}/>
      );
      break;
    case "answers":
      list = <UserAnswers user={user} />;
      break;
    case "tags":
      list = <UserTags user={user} />;
      break;
    default:
      list = <UserQuestions user={user} />;
      break;
  }

  let profilePageComponent = (
    <div style={{ justifyContent: "center", textAlign: "center" }}>
      <h1>Profile</h1>
      {user && (
        <div>
          <div>
            <UserInfo user={user.user} />
          </div>
          <div>
            <Button onClick={() => setDisplay("questions")}>Questions</Button>
            <Button onClick={() => setDisplay("answers")}>Answers</Button>
            <Button onClick={() => setDisplay("tags")}>Answers</Button>
          </div>
          {list}
        </div>
      )}
    </div>
  );

  let modifyScreen = (
    <ModifyQuestionPage
      setShowModifyScreen={setShowModifyScreen}
      question={question}
    />
  );
  return <div>{showModifyScreen ? modifyScreen : profilePageComponent}</div>;
};

export default Profile;
