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
import { Alert, Snackbar } from "@mui/material";

const Login = () => {
  const logoUrl = "http://localhost:8001/logo";

  const [openError, setOpenError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleClose = () => {
    setOpenError(false);
  };

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
        const msg = error.response?.data?.message || error.message;
        console.error("Login failed:", msg);

        if (
          msg.toLowerCase().includes("invalid") ||
          msg.toLowerCase().includes("unauthorized") ||
          msg.toLowerCase().includes("username") ||
          msg.toLowerCase().includes("password")
        ) {
          setErrorMessage("Username or password doesn't match.");
        } else {
          setErrorMessage("Username or password doesn't match.");
        }

        setOpenError(true);
      });
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
    >
      <Snackbar
        open={openError}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        sx={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
          {errorMessage}
        </Alert>
      </Snackbar>

      <Card sx={{ width: "454px", height: "595px", p: 2, boxShadow: 3 }}>
        <CardContent>
          <Stack
            direction={"column"}
            spacing={2}
            width={"100%"}
            alignItems={"center"}
            justifyContent="flex-start"
          >
            <Box
              paddingX={5}
              paddingTop={3.6}
              paddingBottom={4}
              borderRadius={8}
              width={"fit-content"}
              boxShadow="0px 6px 8px rgba(0, 0, 0, 0.15)"
            >
              <Box
                component="img"
                src={logoUrl}
                alt="Logo"
                sx={{ width: "100%", height: "auto", maxWidth: 120 }}
              />
            </Box>
            <Typography fontSize={35} fontWeight={700}>
              Chatalize AI
            </Typography>
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
