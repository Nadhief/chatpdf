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
import { Navigate, useNavigate, useParams } from "react-router-dom";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import DataColumn from "../../components/Table/DataColumn";

const columns = ["Kolom 1", "Kolom 2", "Kolom 3"];
const rows = [
  { "Kolom 1": "Cell A1", "Kolom 2": "Cell A2", "Kolom 3": "Cell A3" },
  { "Kolom 1": "Cell B1", "Kolom 2": "Cell B2", "Kolom 3": "Cell B3" },
  { "Kolom 1": "Cell C1", "Kolom 2": "Cell C2", "Kolom 3": "Cell C3" },
];

const TableDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [openDialogAddData, setOpenDialogAddData] = useState(false);
  const [openDialogAddColumn, setOpenDialogAddColumn] = useState(false);
  const [openDialogCSV, setOpenDialogCSV] = useState(false);
  const [fileName, setFileName] = useState("");

  const [selectedItem, setSelectedItem] = useState(null);
  const dataTypes = ["String", "Number", "Boolean", "Date"];
  const [newColumns, setNewColumns] = useState([{ name: "", type: "" }]);

  const handleSubmit = (type) => {
    console.log(type);
    console.log(selectedItem);
  };

  const handleAddRow = () => {
    setNewColumns([...newColumns, { name: "", type: "" }]);
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
    }
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
            sx={{
              backgroundColor: "#EEAFAF",
              textTransform: "none",
              color: "#EA001E",
            }}
            onClick={() => navigate(`/admin/coofisai/database/${id}`)}
          >
            Kembali
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{
              backgroundColor: "#D6E0FF",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "#D6E0FF",
              },
              color: "#1F3D99",
            }}
            onClick={() => setOpenDialogAddData(true)}
          >
            Tambah Data
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{ backgroundColor: "#2f68ff", textTransform: "none" }}
            onClick={() => setOpenDialogAddColumn(true)}
          >
            Tambah Kolom
          </Button>
          <Button
            variant="contained"
            sx={{
              minWidth: "40px",
              px: 0,
              backgroundColor: "#FFB020",
              "&:hover": { backgroundColor: "#FFB020" },
            }}
            onClick={() => setOpenDialogCSV(true)}
          >
            <FileUploadOutlinedIcon />
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
        <Typography variant="h5">Nama Table</Typography>
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
          <DataColumn columns={columns} rows={rows} />
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

      {/* Dialog Tambah Data */}
      <Dialog
        open={openDialogAddData}
        onClose={() => {
          setNewColumns([{ name: "", type: "" }]);
          setOpenDialogAddData(false);
        }}
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
          <IconButton
            onClick={() => {
              setNewColumns([{ name: "", type: "" }]);
              setOpenDialogAddData(false);
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          {columns.map((col, idx) => (
            <>
              <Typography>{col}</Typography>
              <Grid
                key={idx}
                container
                spacing={2}
                alignItems="center"
                sx={{ mb: 2 }}
              >
                <Grid item size={12}>
                  <TextField
                    fullWidth
                    placeholder="Masukan nama kolom"
                    size="small"
                    value={col.name}
                    onChange={(e) => handleChange(idx, "name", e.target.value)}
                  />
                </Grid>
              </Grid>
            </>
          ))}
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

      {/* Dialog Tambah Column */}
      <Dialog
        open={openDialogAddColumn}
        onClose={() => {
          setNewColumns([{ name: "", type: "" }]);
          setOpenDialogAddColumn(false);
        }}
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
          <IconButton
            onClick={() => {
              setNewColumns([{ name: "", type: "" }]);
              setOpenDialogAddColumn(false);
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          {newColumns.map((col, idx) => (
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

      {/* Dialog Upload CSV */}
      <Dialog
        open={openDialogCSV}
        onClose={() => {
          setOpenDialogCSV(false);
        }}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle sx={{ m: 0, p: 2 }}>
          Unggah File
          <IconButton
            aria-label="close"
            onClick={() => {
              setOpenDialogCSV(false);
            }}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Button
            variant="outlined"
            component="label"
            fullWidth
            sx={{
              justifyContent: "flex-start",
              borderColor: "#D8DAE5",
              color: "#3F3F3F",
              textTransform: "none",
            }}
          >
            📄 {fileName || "File CSV"}
            <input
              type="file"
              accept=".csv"
              hidden
              onChange={handleFileChange}
            />
            <Typography
              variant="body2"
              sx={{
                marginLeft: "auto",
                color: "#007BFF",
                fontWeight: 500,
              }}
            >
              Ubah
            </Typography>
          </Button>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#4CAF8E",
              color: "white",
              "&:hover": {
                backgroundColor: "#4CAF8E",
              },
              textTransform: "none",
            }}
            onClick={() => {
              // upload logic
              setOpenDialogCSV(false);
            }}
          >
            Unggah
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};

export default TableDetail;
