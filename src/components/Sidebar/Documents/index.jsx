import React from "react";
import { Stack, Checkbox, Typography, Box } from "@mui/material";
import FileIcon from "@mui/icons-material/InsertDriveFileOutlined";

const Documents = ({ label, status, checked, onCheck }) => {
  const handleStackClick = () => {
    onCheck(!checked);
  };

  return (
    <Stack
      direction="row"
      spacing={0.6}
      padding={0.5}
      paddingRight={2}
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

      <FileIcon sx={{ color: "#404040", fontSize: 20 }} />
      <Stack direction="row" alignItems="center" spacing={1.5} width={"100%"}>
        <Typography
          fontSize={14}
          fontWeight={400}
          color="#404040"
          sx={{
            overflowWrap: "anywhere",
            wordBreak: "break-word", 
            whiteSpace: "normal", 
            flexGrow: 1,
          }}
        >
          {label}
        </Typography>
        
        <Box 
          sx={{ 
            backgroundColor: status === 'private' ? "#EEF0F7" : "#D6E0FF", 
            color: status === 'private' ? "#474D66" : "#3366FF",
            border: status === 'private' ? "1px solid #8F95B2" : "1px solid #9DB5FF",
            paddingX: 2,
            paddingY: 0.2,
            borderRadius: 100,
            minWidth: "30px",
            marginLeft: "auto",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Typography fontSize={10}>
            {status}
          </Typography>
        </Box>
      </Stack>
    </Stack>
  );
};

export default Documents;
