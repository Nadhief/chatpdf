import React from "react";
import { Stack, Radio, Typography } from "@mui/material";

const Topics = ({ label, selected, onSelect }) => {
  const handleStackClick = () => {
    onSelect();
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
      <Radio
        checked={selected}
        onChange={onSelect}
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

export default Topics;