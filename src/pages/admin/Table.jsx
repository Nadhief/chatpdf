import {
  Box,
  Button,
  Checkbox,
  Grid,
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
import { useNavigate, useParams } from "react-router-dom";

const DummyData = [
  { id: 1, name: "Nama Table", isDetail: true },
  { id: 2, name: "Nama Table", isDetail: false },
  { id: 3, name: "Nama Table", isDetail: false },
  { id: 4, name: "Nama Table", isDetail: false },
];

const Table = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [openDialogAddTable, setOpenDialogAddTable] = useState(false);
  const [openDialogAddColumn, setOpenDialogAddColumn] = useState(false);
  const [tableName, setTableName] = useState("");
  const [columnName, setColumnName] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const dataTypes = ["String", "Number", "Boolean", "Date"];
  const [columns, setColumns] = useState([{ name: "", type: "" }]);

  const handleAddRow = () => {
    setColumns([...columns, { name: "", type: "" }]);
  };

  const handleChange = (index, key, value) => {
    const updated = [...columns];
    updated[index][key] = value;
    setColumns(updated);
  };

  const handleSubmit = (type) => {
    console.log(type);
    console.log(columns);
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
            onClick={() => setOpenDialogAddTable(true)}
          >
            Tambah Table
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
        <Typography variant="h5">Table</Typography>
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
                      backgroundColor: "#1976d2",
                      color: "white",
                      "&:hover": { backgroundColor: "#1565c0" },
                    }}
                    onClick={() => {
                      setSelectedItem(item);
                      navigate(`/admin/coofisai/database/${id}/${item.id}`);
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
                      setOpenDialogAddColumn(true);
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

      {/* Dialog Tambah Column */}
      <Dialog
        open={openDialogAddColumn}
        onClose={() => setOpenDialogAddColumn(false)}
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
            Tambah Kolom
          </Typography>
          <IconButton onClick={() => setOpenDialogAddColumn(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          {columns.map((col, idx) => (
            <Grid
              key={idx}
              container
              spacing={2}
              alignItems="center"
              sx={{ mb: 2 }}
            >
              <Grid item size={6}>
                <TextField
                  fullWidth
                  placeholder="Masukan nama kolom"
                  size="small"
                  value={col.name}
                  onChange={(e) => handleChange(idx, "name", e.target.value)}
                />
              </Grid>
              <Grid item size={6}>
                <TextField
                  fullWidth
                  select
                  size="small"
                  value={col.type}
                  onChange={(e) => handleChange(idx, "type", e.target.value)}
                >
                  {dataTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
          ))}

          <Button
            fullWidth
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddRow}
            sx={{
              mb: 2,
              backgroundColor: "#3c3f52",
              "&:hover": { backgroundColor: "#2f2f3f" },
              textTransform: "none",
            }}
          >
            Tambah
          </Button>
          <Box display={"flex"} justifyContent={"flex-end"}>
            <Button
              variant="contained"
              onClick={() => handleSubmit("column")}
              sx={{
                backgroundColor: "#4caf50",
                textTransform: "none",
                "&:hover": { backgroundColor: "#43a047" },
              }}
            >
              Tambahkan
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Stack>
  );
};

export default Table;
