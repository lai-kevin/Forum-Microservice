import { UserContext } from "../../contexts/user-context";
import { useContext, useEffect, useState } from "react";
import { Divider, Button } from "@mui/material";
import axios from "axios";
import ModifyQuestionPage from "./modifyQuestionPage";
import UserTagsPage from "./user-tags-page";
import ModifyTagPage from "./modify-tag-page";
import UserAnswersPage from "./user-answers-page";
import QuestionAnswersPage from "./question-answers-page";

const UserInfo = ({ user }) => {
  const accountAgeInSeconds = Math.floor(
    (Date.now() - new Date(user.createdAt)) / 1000
  );

  return (
    <div>
      <h1>Username: {user.username}</h1>
      <h2>Email: {user.email}</h2>
      <h2>Admin: {user.admin ? "yes" : "no"}</h2>
      <h2>Reputation: {user.reputation}</h2>
      <h2>Account Age (seconds): {accountAgeInSeconds}</h2>
    </div>
  );
};

const UserQuestions = ({
  user,
  setShowModifyScreen,
  setQuestion,
  showModifyScreen,
}) => {
  const [questions, setQuestions] = useState([]);

  const fetchQuestions = async () => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: "http://localhost:8000/api/questions_v2",
      headers: {},
    };

    axios
      .request(config)
      .then((response) => {
        const filteredQuestions = response.data.filter(
          (question) => question.posted_by === user.user._id
        );
        setQuestions(filteredQuestions);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchQuestions();

    const interval = setInterval(() => {
      fetchQuestions();
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

const AdminUsersList = ({ setDisplay }) => {
  const [user, setUser] = useContext(UserContext);
  const [users, setUsers] = useState([]);

  const handleDeleteUser = (user) => {
    let config = {
      method: 'delete',
      maxBodyLength: Infinity,
      url: 'http://localhost:8000/api/users',
      headers: { },
      withCredentials: true,
    };
    
    axios.request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
    })
    .catch((error) => {
      console.log(error);
    });
  }
  useEffect(() => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: "http://localhost:8000/api/users",
      headers: {},
      withCredentials: true,
    };

    axios
      .request(config)
      .then((response) => {
        setUsers(response.data);
        console.log(JSON.stringify(response.data));
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div>
      <h1>Users</h1>
      <Divider style={{ backgroundColor: "black", height: "3px" }} />
      {users.map((normal_user) => (
        <div>
          <h3
            onClick={() => {
              const userCopy = user;
              userCopy.adminUser = user.user
              userCopy.user = normal_user;
              setUser(userCopy);
              setDisplay("questions");
            }}
          >
            {normal_user.username}
          </h3>
          <Button onClick={() => handleDeleteUser(normal_user)}>Delete User</Button>
        </div>
      ))}
    </div>
  );
};

const Profile = ({ setCurrentPage }) => {
  const [user, setUser] = useContext(UserContext);
  const [display, setDisplay] = useState("questions");
  const [showModifyScreen, setShowModifyScreen] = useState(false);
  const [showModifyTagScreen, setShowModifyTagScreen] = useState(false);
  const [showModifyAnswerScreen, setShowModifyAnswerScreen] = useState(false);
  const [tag, setTag] = useState(null);
  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  const UserTags = () => {
    return (
      <div>
        <UserTagsPage
          setShowModifyTagScreen={setShowModifyTagScreen}
          showModifyTagScreen={showModifyTagScreen}
          setTag={setTag}
        />
      </div>
    );
  };

  const UserAnswers = ({ user }) => {
    return (
      <UserAnswersPage
        setShowModifyAnswerScreen={setShowModifyAnswerScreen}
        showModifyAnswerScreen={showModifyAnswerScreen}
        setQuestion={setQuestion}
      />
    );
  };

  let list;
  switch (display) {
    case "questions":
      list = (
        <UserQuestions
          user={user}
          setShowModifyScreen={setShowModifyScreen}
          setQuestion={setQuestion}
          showModifyScreen={showModifyScreen}
        />
      );
      break;
    case "answers":
      list = <UserAnswers user={user} />;
      break;
    case "tags":
      list = (
        <UserTags
          user={user}
          setShowModifyTagScreen={setShowModifyTagScreen}
          showModifyTagScreen={showModifyTagScreen}
        />
      );
      break;
    default:
      list = <UserQuestions user={user} />;
      break;
  }
  let profilePageComponent = (
    <div style={{ justifyContent: "center", textAlign: "center" }}>
      <h1>Profile</h1>
      {user ? (
        <div>
          <div>
            {(!user.user.admin && !user.adminUser) ? (
              <UserInfo user={user.user} />
            ) : (
              <UserInfo user={user.adminUser ? user.adminUser : user.user} />
            )}
          </div>
          {(!user.user.admin) ? (
            <div>
              <div>
                <Button onClick={() => setDisplay("questions")}>
                  Questions
                </Button>
                <Button onClick={() => setDisplay("answers")}>Answers</Button>
                <Button onClick={() => setDisplay("tags")}>Tags</Button>
              </div>
              {list}
            </div>
          ) : (
            <AdminUsersList setDisplay={setDisplay}/>
          )}
        </div>
      ) : (
        <h1>Not logged in</h1>
      )}
    </div>
  );

  let modifyScreen = (
    <ModifyQuestionPage
      setShowModifyScreen={setShowModifyScreen}
      question={question}
    />
  );

  let modifyTagScreen = (
    <ModifyTagPage setShowModifyTagScreen={setShowModifyTagScreen} tag={tag} />
  );

  let modifyAnswerScreen = (
    <QuestionAnswersPage
      setCurrentPage={setCurrentPage}
      question={question}
      userMode={true}
    />
  );
  return (
    <div>
      {showModifyScreen ? modifyScreen : null}
      {showModifyTagScreen ? modifyTagScreen : null}
      {showModifyAnswerScreen ? modifyAnswerScreen : null}
      {showModifyScreen || showModifyTagScreen || showModifyAnswerScreen
        ? null
        : profilePageComponent}
    </div>
  );
};

export default Profile;
