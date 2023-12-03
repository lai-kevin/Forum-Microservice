import { useEffect, useState } from "react";
import { Card, Box, Typography, TextField, Button } from "@mui/material";
import { blue } from "@mui/material/colors";

const LoginPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleLogin = () => {
        // Perform login logic here
    };

    return (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", backgroundColor: "cyan"}}>
            <Card sx={{ display: "flex", flexDirection: "column", width: 300, padding: 20, borderRadius: 10}}>
                <Typography variant="h4">Login</Typography>
                <TextField id="outlined-basic" label="Username" variant="outlined" required="true" value={username} onChange={handleUsernameChange} sx={{ margin: "10px 0" }} />
                <TextField id="outlined-basic" label="Password" variant="outlined" required="true" value={password} onChange={handlePasswordChange} sx={{ margin: "10px 0" }} />
                <Button variant="contained" color="primary" onClick={handleLogin}>Login</Button>
            </Card>
        </Box>
    );
};

export default LoginPage;