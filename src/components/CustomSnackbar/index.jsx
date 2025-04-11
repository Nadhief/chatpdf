import React from "react";
import { Snackbar, Slide, Alert } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircleOutlined";
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';

const CustomSnackbar = ({ status = "berhasil", open, onClose, message }) => {
  const SlideTransition = (props) => {
    return <Slide {...props} direction="down" />;
  };

  const isSuccess = status === "berhasil";

  const backgroundColor = isSuccess ? "#F0FFF4" : "#FFF5F5";
  const textColor = isSuccess ? "#276749" : "#9B2C2C";
  const borderColor = isSuccess ? "#C6F6D5" : "#FED7D7";
  const iconColor = isSuccess ? "#38A169" : "#E53E3E";

  return (
    <Snackbar
      open={open}
      onClose={onClose}
      TransitionComponent={SlideTransition}
      autoHideDuration={3500}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      sx={{
        paddingRight: 3
      }}
    >
      <Alert
        icon={isSuccess ? <CheckCircleIcon sx={{ color: iconColor }} fontSize="small" /> : <CancelOutlinedIcon sx={{ color: iconColor }} fontSize="small" />}
        severity={isSuccess ? "success" : "error"}
        sx={{
          backgroundColor,
          color: textColor,
          border: `1px solid ${borderColor}`,
          boxShadow: "0px 1px 5px rgba(0, 0, 0, 0.1)",
          borderRadius: "8px",
          padding: "8px 16px",
          fontSize: 14,
          fontWeight: 500,
          alignItems: "center",
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default CustomSnackbar;
