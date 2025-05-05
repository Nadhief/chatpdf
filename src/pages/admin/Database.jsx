import {
  Box,
  Button,
  Checkbox,
  IconButton,
  InputBase,
  MenuItem,
  Pagination,
  Paper,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import UploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Navigate, useNavigate } from "react-router-dom";

const DummyData = [
  { id: 1, name: "Nama Database", isDetail: true },
  { id: 2, name: "Nama Database", isDetail: false },
  { id: 3, name: "Nama Database", isDetail: false },
  { id: 4, name: "Nama Database", isDetail: false },
];

const Database = () => {
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  const [openDialogAddTable, setOpenDialogAddTable] = useState(false);
  const [databaseName, setDatabaseName] = useState("");
  const [tableName, setTableName] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);

  const handleSubmit = (type) => {
    console.log(type);
    console.log(selectedItem);
  };
  return (
    <Stack
      sx={{
        height: "95vh",
        backgroundColor: "#fff",
        borderRadius: "10px",
        width: "100%",
      }}
      direction="column"
    >
      <Stack
        sx={{
          flex: 1,
          overflowY: "auto",
          height: "100%",
          padding: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 2,
          }}
        >
          
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{ backgroundColor: "#2f68ff", textTransform: "none" }}
            onClick={() => setOpenDialog(true)}
          >
            Tambah Database
          </Button>
          <Button
            variant="contained"
            startIcon={<UploadIcon />}
            sx={{ backgroundColor: "#3c3f52", textTransform: "none" }}
          >
            Upload Database
          </Button>
          <Button
            variant="contained"
            sx={{
              minWidth: "40px",
              px: 0,
              backgroundColor: "#e53935",
              "&:hover": { backgroundColor: "#d32f2f" },
            }}
          >
            <DeleteIcon />
          </Button>
        </Box>
        <Typography variant="h5">Database</Typography>
        <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
          {/* Kiri: Dropdown Tampilkan */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography fontWeight="bold">Tampilkan</Typography>
            <Select
              value={10}
              onChange={() => {}}
              size="small"
              sx={{
                borderRadius: 3,
                backgroundColor: "#f5f5f5",
                minWidth: 60,
              }}
            >
              <MenuItem value={5}>5</MenuItem>
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={25}>25</MenuItem>
            </Select>
          </Box>

          {/* Kanan: Kolom Search */}
          <Paper
            component="form"
            sx={{
              display: "flex",
              alignItems: "center",
              width: 250,
              borderRadius: 5,
              backgroundColor: "#f5f5f5",
              px: 2,
              boxShadow: "none",
            }}
          >
            <InputBase
              sx={{ flex: 1 }}
              placeholder="Search....."
              inputProps={{ "aria-label": "search" }}
            />
            <IconButton type="submit" sx={{ p: 0.5 }} aria-label="search">
              <SearchIcon />
            </IconButton>
          </Paper>
        </Box>
        <Box sx={{ border: "1px solid #ccc", borderRadius: 2, mt: 2, p: 2 }}>
          {/* List */}
          <Stack spacing={1}>
            {DummyData.map((item) => (
              <Box
                key={item.id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  backgroundColor: "#f9f9f9",
                  borderRadius: 2,
                  px: 2,
                  py: 1,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Checkbox />
                  <Typography fontWeight={500}>{item.name}</Typography>
                </Box>
                {item.isDetail === true ? (
                  <IconButton
                    size="small"
                    sx={{
                      backgroundColor: "#1976d2", // warna biru
                      color: "white",
                      "&:hover": { backgroundColor: "#1565c0" },
                    }}
                    onClick={() => {
                      navigate(`/admin/coofisai/database/${item.id}`);
                    }}
                  >
                    <VisibilityIcon fontSize="small" />
                  </IconButton>
                ) : (
                  <IconButton
                    size="small"
                    sx={{
                      backgroundColor: "#4caf50",
                      color: "white",
                      "&:hover": { backgroundColor: "#43a047" },
                    }}
                    onClick={() => {
                      setOpenDialogAddTable(true);
                      setSelectedItem(item);
                    }}
                  >
                    <AddIcon fontSize="small" />
                  </IconButton>
                )}
              </Box>
            ))}
          </Stack>

          {/* Footer Pagination */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mt: 2,
              px: 1,
            }}
          >
            <Typography variant="body2">
              Menampilkan 1 sampai 1 entri
            </Typography>
            <Pagination count={3} page={2} size="small" />
          </Box>
        </Box>
      </Stack>

      {/* Dialog Tambah Database */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            Nama Database
          </Typography>
          <IconButton onClick={() => setOpenDialog(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <Typography mb={1}>Database</Typography>
          <TextField
            fullWidth
            placeholder="Masukan nama Database"
            variant="outlined"
            size="small"
            value={databaseName}
            onChange={(e) => setDatabaseName(e.target.value)}
          />
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            variant="contained"
            onClick={() => handleSubmit("database")}
            sx={{
              backgroundColor: "#4caf50",
              textTransform: "none",
              "&:hover": { backgroundColor: "#43a047" },
            }}
          >
            Tambahkan
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Tambah Table */}
      <Dialog
        open={openDialogAddTable}
        onClose={() => setOpenDialogAddTable(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            Nama Tabel
          </Typography>
          <IconButton onClick={() => setOpenDialogAddTable(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <Typography mb={1}>Tabel</Typography>
          <TextField
            fullWidth
            placeholder="Masukan nama Tabel"
            variant="outlined"
            size="small"
            value={tableName}
            onChange={(e) => setTableName(e.target.value)}
          />
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            variant="contained"
            onClick={() => handleSubmit("table")}
            sx={{
              backgroundColor: "#4caf50",
              textTransform: "none",
              "&:hover": { backgroundColor: "#43a047" },
            }}
          >
            Tambahkan
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};

export default Database;