import { useEffect, useState } from "react";
import { Card, Box, Typography, TextField, Button } from "@mui/material";
import { blue } from "@mui/material/colors";
import axios from "axios";
import Image from "../../images/collage-with-statue-meadow.jpg";

const AccountCreationPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [usernameValid, setUsernameValid] = useState(true);
  const [passwordValid, setPasswordValid] = useState(true);
  const [emailValid, setEmailValid] = useState(true);

  const handleCreateAccount = () => {
    let data = JSON.stringify({
      email: email,
      username: username,
      password: password,
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "http://localhost:8000/api/users/register",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
      })
      .catch((error) => {
        if (error === "Email already exists") {
          setEmailValid(false);
          console.log("Email already exists");
        }
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
        <Typography variant="h4" sx={{ color: "white" }}>
          Create an Account
        </Typography>
        <TextField
          id="outlined-basic"
          label="E-mail"
          variant="outlined"
          required={true}
          sx={{ margin: "10px 0", color: "white" }}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          id="outlined-basic"
          label="Username"
          variant="outlined"
          required={true}
          sx={{ margin: "10px 0", color: "white" }}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          id="outlined-basic"
          label="Password"
          variant="outlined"
          required={true}
          sx={{ margin: "10px 0", color: "white" }}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button variant="contained" color="primary" onClick={handleCreateAccount}>
          Create Account
        </Button>
      </Card>
    </Box>
  );
};

export default AccountCreationPage;
