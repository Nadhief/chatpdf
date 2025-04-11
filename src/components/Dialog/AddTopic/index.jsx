import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Stack,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/ControlPoint";

const AddTopic = ({ open, onClose, handleSubmit }) => {
  const [topic, setTopic] = useState("");
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        <Stack
          direction="row"
          spacing={1}
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography fontSize={18} fontWeight={400} color="#404040">
            Nama Topik
          </Typography>
          <CloseIcon
            onClick={onClose}
            sx={{ cursor: "pointer", color: "#A0A3B1" }}
          />
        </Stack>
      </DialogTitle>

      <DialogContent>
        <TextField
          placeholder="Tulis nama topik"
          fullWidth
          sx={{
            width: "400px",
            borderRadius: 2,
            border: "1px solid #C2C2C2",
            boxShadow: "inset 0px 2px 4px rgba(0, 0, 0, 0.1)",
            "& .MuiOutlinedInput-root": {
              padding: 0,
              "& .MuiOutlinedInput-input": {
                paddingX: 2,
                paddingY: 1,
              },
              "& .MuiOutlinedInput-notchedOutline": {
                border: "none",
              },
            },
          }}
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />
      </DialogContent>

      <DialogActions sx={{ paddingBottom: 3, paddingRight: 3 }}>
        <Box
          display="flex"
          justifyContent="flex-end"
          alignItems="center"
          paddingY={1}
          paddingX={2}
          borderRadius={2}
          border="1px solid #E0E0E0"
          sx={{
            cursor: "pointer",
            backgroundColor: "#3366FF",
          }}
          onClick={()=>{
            handleSubmit(topic);
            setTopic("");
            onClose();
          }}
        >
          <AddIcon sx={{ color: "white", marginRight: 1, fontSize: 14 }} />
          <Typography fontSize={14} fontWeight={400} color="white">
            Topik
          </Typography>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default AddTopic;
