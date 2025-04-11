import React, { useState } from "react";
import { Stack, Checkbox, Typography } from "@mui/material";
import FileIcon from "@mui/icons-material/InsertDriveFileOutlined";

const Documents = ({ label, checked, onCheck, filter }) => {
  const handleStackClick = () => {
    onCheck(!checked);
  };

  return (
    <Stack
      direction="row"
      spacing={0.6}
      padding={0.5}
      borderRadius={4}
      alignItems="center"
      sx={{
        backgroundColor: "#F5F5F5",
        cursor: "pointer",
      }}
      onClick={handleStackClick}
    >
      <Checkbox
        checked={checked}
        onChange={(e) => onCheck(e.target.checked)}
        sx={{
          padding: 0.8,
          "&.Mui-checked": {
            color: "#bf2600",
          },
          "& .MuiSvgIcon-root": {
            fontSize: 16,
          },
        }}
        onClick={(e) => e.stopPropagation()}
      />

      {filter === "file" ? (
        <FileIcon sx={{ color: "#404040", fontSize: 20 }} />
      ) : null}
      <Typography
        fontSize={12}
        fontWeight={400}
        color="#404040"
        sx={{
          overflowWrap: "anywhere",
          wordBreak: "break-word", 
          whiteSpace: "normal", 
        }}
      >
        {label}
      </Typography>
    </Stack>
  );
};

export default Documents;
