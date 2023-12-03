import { useEffect, useState } from "react";
import { Card, Box, Typography, TextField, Button } from "@mui/material";
import { blue } from "@mui/material/colors";

const AccountCreationPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", backgroundColor: "cyan"}}>
      <Card sx={{ display: "flex", flexDirection: "column", width: 300, padding: 20, borderRadius: 10}}>
        <Typography variant="h4">Create an Account</Typography>
        <TextField id="outlined-basic" label="E-mail" variant="outlined" required="true" sx={{ margin: "10px 0" }} />
        <TextField id="outlined-basic" label="Username" variant="outlined" required="true" sx={{ margin: "10px 0" }} />
        <TextField id="outlined-basic" label="Password" variant="outlined" required="true" sx={{ margin: "10px 0" }} />
        <Button variant="contained" color="primary">Create Account</Button>
      </Card>
    </Box>
  );
};

export default AccountCreationPage;
