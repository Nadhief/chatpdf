import React from "react";
import { CircularProgress, Box, Typography } from "@mui/material";

const LoadingScreen = () => {
  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        backgroundColor: "#EEF0F7",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <CircularProgress color="primary" />
      <Typography variant="h6" sx={{ marginTop: 2, color: "#555" }}>
        {/* Memuat data... */}
      </Typography>
    </Box>
  );
};

export default LoadingScreen;
