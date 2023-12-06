import { useContext, useEffect, useState } from "react";
import { Card, Box, Typography, TextField, Button, Alert } from "@mui/material";
import Image from "../../images/collage-with-statue-meadow.jpg";
import axios from "axios";
import { UserContext } from "../../contexts/user-context";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navi = useNavigate();
  const [user, setUser] = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [credentialsValid, setCredentialsValid] = useState(true);

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleLogin = () => {
      setCredentialsValid(true);
      let data = JSON.stringify({
        email: email,
        password: password,
      });

      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "http://localhost:8000/api/users/login",
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
        withCredentials: true,
      };

      axios
        .request(config)
        .then((response) => {
          // set the user in the context, and save it to local storage, then redirect to the home page
          console.log(response.data);
          setUser(response.data);
          navi("/fakestackoverflow");
        })
        .catch((error) => {
          setCredentialsValid(false);
          console.log(error);
        });
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundImage: `url(${Image})`,
        backgroundSize: "cover",
      }}
    >
      <Card
        sx={{
          display: "flex",
          flexDirection: "column",
          width: 300,
          padding: 5,
          borderRadius: 10,
          backdropFilter: "blur(10px)",
          backgroundColor: "rgba(255, 255, 255, 0.5)",
        }}
      >
        <Typography variant="h3" color="white" textAlign="center">
          Login
        </Typography>
        <TextField
          id="outlined-basic"
          label="E-mail"
          variant="outlined"
          required={true}
          value={email}
          onChange={handleEmailChange}
          sx={{ margin: "10px 0" }}
        />
        <TextField
          id="outlined-basic"
          label="Password"
          variant="outlined"
          required={true}
          value={password}
          onChange={handlePasswordChange}
          sx={{ margin: "10px 0" }}
        />
        {!credentialsValid && (
          <Alert severity="error">Invalid credentials</Alert>
        )}
        <Button variant="contained" color="primary" onClick={handleLogin}>
          Login
        </Button>
      </Card>
    </Box>
  );
};

export default LoginPage;
