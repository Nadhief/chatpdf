import React from "react";
import { 
  Typography, 
  TextField, 
  Divider, 
  Paper 
} from "@mui/material";

function TopicForm() {
  return (
    <Paper elevation={3} sx={{ padding: 3, maxWidth: 600, margin: "auto" }}>
      {/* Judul "Nama Topik" */}
      <Typography variant="h5" component="h1" gutterBottom>
        Nama Topik
      </Typography>

      {/* Subjudul "Tulis nama topik" */}
      <Typography variant="subtitle1" gutterBottom>
        Tulis nama topik
      </Typography>

      {/* Input Field untuk Topik */}
      <TextField
        label="Topik"
        variant="outlined"
        fullWidth
        margin="normal"
        sx={{ mb: 2 }}
      />

      {/* Garis Pemisah (Divider) */}
      <Divider sx={{ my: 3 }} />

      {/* Section "Answering question and summ" */}
      <Typography variant="body1" color="textSecondary">
        Answering question and summ
      </Typography>
    </Paper>
  );
}

export default TopicForm;