import React from "react";
import { Snackbar, Slide } from "@mui/material";

const CustomSnackbar = ({ open, onClose, status, message }) => {
  const SlideTransition = (props) => {
    return <Slide {...props} direction="down" />;
  };

  return (
    <Snackbar
      open={open}
      onClose={onClose}
      TransitionComponent={SlideTransition}
      message={message}
      key={SlideTransition.name}
      autoHideDuration={2000}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    />
  );
};

export default CustomSnackbar;
