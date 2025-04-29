import React, { useState } from "react";
import { Stack, Checkbox, Typography, Box } from "@mui/material";
import ProfilPict from '../../../assets/femalePict.svg'

const Mails = ({ username, label, checked, onCheck }) => {
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
        <Box
            component="img"
            src={ProfilPict}
            alt="Gambar"
            sx={{ width: 35, height: 35, paddingRight: 1 }}
        />
        <Stack direction={'column'}>
            <Typography
            fontSize={16}
            fontWeight={700}
            color="#404040"
            >
            {username}
            </Typography>
            <Typography
            fontSize={13}
            fontWeight={400}
            color="#404040"
            >
            {label}
            </Typography>
        </Stack>
    </Stack>
  );
};

export default Mails;