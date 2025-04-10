import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  Card,
  CardContent,
  Link,
} from "@mui/material";
// import { loginUser } from "../../services/authServices";
import { useNavigate } from "react-router-dom";
import CoofisImage from "../../assets/images/Coofis.png"; // Adjust the path as necessary

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    // try {
    //   const response = await loginUser(username, password);
    //   alert(response.message);
    //   localStorage.setItem("token", response.token);
    //   localStorage.setItem("username", response.username);
    //   navigate("/layoutmanagerv4");
    // } catch (error) {
    //   alert(error.message);
    // }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="89vh"
    >
      <Card sx={{ width: "454px", height: "595px", p: 2, boxShadow: 3 }}>
        <CardContent>
          <img src={CoofisImage} alt="Chatbot" style={{ marginBottom:"100px" }} />
          <Typography variant="body1" align="start" fontWeight={"bold"}>
            Username
          </Typography>
          <TextField
            // label="Username"
            // variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            fullWidth
            margin="normal"
            sx={{ mt: 0 }}
          />
          <Typography
            variant="body1"
            align="start"
            fontWeight={"bold"}
            sx={{ mt: 2 }}
          >
            Password
          </Typography>
          <TextField
            // label="Password"
            // variant="outlined"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            margin="normal"
            sx={{ mt: 0 }}
          />
          <Typography align="start" sx={{ mt: 2, }}>
            <Link
              href="/register"
              underline="hover"
              align="start"
              color="#E42313"
            >
              Forgot Password
            </Link>
          </Typography>
          <Button
            variant="contained"
            onClick={handleLogin}
            sx={{ mt: 2, backgroundColor: "#E42313", color: "white", width: "70%" }}
          >
            Login
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Login;
