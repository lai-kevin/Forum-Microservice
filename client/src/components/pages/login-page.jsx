import { useEffect, useState } from "react";
import { Card, Box, Typography, TextField, Button, Alert } from "@mui/material";
import Image from "../../images/collage-with-statue-meadow.jpg";
import axios from "axios";

const LoginPage = () => {
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
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        window.location.href = "/fakestackoverflow";
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
