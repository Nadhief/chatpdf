import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
} from "@mui/material";

const ConvertToGlobal = ({ open, onClose, handleConvert }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        <Typography fontSize={18} fontWeight={400} color="#404040">
          Ubah ke Global
        </Typography>
      </DialogTitle>

      <DialogContent
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          alignItems: "flex-start",
          padding: 0,
          paddingY: 2,
          paddingX: 3,
        }}
      >
        <Typography fontSize={14} fontWeight={400} color="#616161">
          Apakah Anda yakin ingin mengubah file yang dipilih menjadi global?
        </Typography>
      </DialogContent>

      <DialogActions
        sx={{ paddingY: 1, paddingX: 3, backgroundColor: "#F5F5F5" }}
      >
        <Box
          display="flex"
          justifyContent="flex-end"
          alignItems="center"
          paddingY={0.8}
          paddingX={2}
          borderRadius={2}
          border="1px solid #E0E0E0"
          sx={{
            cursor: "pointer",
            backgroundColor: "white",
          }}
          onClick={onClose}
        >
          <Typography fontSize={14} fontWeight={400} color="#0A0A0A">
            Batal
          </Typography>
        </Box>
        <Box
          display="flex"
          justifyContent="flex-end"
          alignItems="center"
          paddingY={0.8}
          paddingX={2}
          borderRadius={2}
          border="1px solid #E0E0E0"
          sx={{
            cursor: "pointer",
            backgroundColor: "#3366FF",
          }}
          onClick={() => {
            handleConvert();
            onClose();
          }}
        >
          <Typography fontSize={14} fontWeight={400} color="white">
            Ya
          </Typography>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default ConvertToGlobal;