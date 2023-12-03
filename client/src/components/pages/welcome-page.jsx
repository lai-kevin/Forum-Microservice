import React from "react";
import { Box, Typography, Card, Button } from "@mui/material";
import { Link } from "react-router-dom";
import Image from "../../images/collage-with-statue-meadow.jpg";

const WelcomePage = () => {
  return (
    <Box
      sx={{
        backgroundImage: `url(${Image})`,
        backgroundSize: "cover",
        height: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 255, 0.1)", // Add a slight blue background
      }}
    >
      <Card
        sx={{
          backgroundColor: "rgba(255, 255, 255, 0)", // Set the background color with transparency
          borderRadius: "10px",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "10px",
          boxShadow: "none",
        }}
      >
        <Typography
          sx={{
            color: "white",
            fontSize: 70,
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          Fake Stack Overflow
        </Typography>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to="/login"
          style={{ textDecoration: "none", color: "white", backgroundColor: "green" }}
        >
          Login
        </Button>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to="/register"
          style={{ textDecoration: "none", color: "white", backgroundColor: "green" }}
        >
          Register
        </Button>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to="/fakestackoverflow"
          style={{ textDecoration: "none", color: "white", backgroundColor: "green" }}
        >
          Guest
        </Button>
      </Card>
    </Box>
  );
};

export default WelcomePage;
