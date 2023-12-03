import React from "react";
import { Box, Typography, Card, Button } from "@mui/material";
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
          backgroundColor: "rgba(255, 255, 255)",
          borderRadius: "10px",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <Typography
          sx={{
            color: "blue",
            fontSize: 50,
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          Fake Stack Overflow
        </Typography>
        <Button variant="contained" color="primary">
          Login
        </Button>
        <Button variant="contained" color="primary">
          Register
        </Button>
        <Button variant="contained" color="primary">
          Guest
        </Button>
      </Card>
    </Box>
  );
};

export default WelcomePage;

