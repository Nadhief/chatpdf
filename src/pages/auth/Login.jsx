import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  Card,
  CardContent,
  Link,
  Stack,
} from "@mui/material";
// import { loginUser } from "../../services/authServices";
import { useNavigate } from "react-router-dom";
import CoofisImage from "../../assets/images/Coofis.png"; // Adjust the path as necessary
import { login } from "../../services/authservices";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    const payload = {
      username: username,
      password: password,
    };

    login(payload)
      .then((response) => {
        const userData = response;
        localStorage.setItem("user", JSON.stringify(userData));
        console.log("Login successful:", userData);
        switch (userData.role) {
          case "Admin":
            navigate("/admin/coofisai");
            break;
          case "User":
            navigate("/coofisai");
            break;
          case "Operator":
            navigate("/operator/coofisai");
            break;
          default:
            navigate("/");
        }
      })
      .catch((error) => {
        console.error(
          "Login failed:",
          error.response?.data?.message || error.message
        );
      });
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
    >
      <Card sx={{ width: "454px", height: "595px", p: 2, boxShadow: 3 }}>
        <CardContent>
          <Stack alignItems={"center"} justifyContent="center">
            <img
              src={CoofisImage}
              alt="Chatbot"
              style={{ marginBottom: "80px", width: "250px" }}
            />
          </Stack>
          <Typography variant="body1" align="start" fontWeight={"bold"}>
            Username
          </Typography>
          <TextField
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
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            margin="normal"
            sx={{ mt: 0 }}
          />
          {/* <Typography align="start" sx={{ mt: 2 }}>
            <Link
              href="/register"
              underline="hover"
              align="start"
              color="#E42313"
            >
              Forgot Password
            </Link>
          </Typography> */}
          <Stack alignItems="center">
            <Button
              variant="contained"
              onClick={handleLogin}
              sx={{
                mt: 2,
                backgroundColor: "#E42313",
                color: "white",
                width: "70%",
              }}
            >
              Login
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Login;
