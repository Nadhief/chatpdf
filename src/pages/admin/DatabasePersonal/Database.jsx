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
import React, { use, useEffect, useRef, useState } from "react";
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
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { add } from "lodash";
import {
  addDatabasePersonal,
  addTablePersonal,
  deleteDatabasePersonal,
  getDatabasePersonal,
  uploadDbPersonal,
} from "../../../services";
import DeleteDatabase from "../../../components/Dialog/DeleteDatabase";

const Database = ({ id, toggleSidebar }) => {
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  const [openDialogAddTable, setOpenDialogAddTable] = useState(false);
  const [databaseName, setDatabaseName] = useState("");
  const [tableName, setTableName] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [databaseList, setDatabaseList] = useState(null);
  const [selectedDatabaseDelete, setSelectedDatabaseDelete] = useState([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [showEntry, setShowEntry] = useState(10);
  const [keyword, setKeyword] = useState("");
  const [openDialogDB, setOpenDialogDB] = useState(false);
  const [file, setFile] = useState(null);
  const [page, setPage] = useState(1);

  const handleCheckboxChange = (item) => {
    setSelectedDatabaseDelete((prev) => {
      const exists = prev.find((i) => i.name === item.name);
      if (exists) {
        // Jika sudah ada, hapus dari list
        return prev.filter((i) => i.name !== item.name);
      } else {
        // Jika belum ada, tambahkan ke list
        return [...prev, item];
      }
    });
  };

  const handleSubmit = (type) => {
    if (type === "database") {
      const payload = {
        id: String(id),
        db_name: databaseName,
        overwrite: false,
      };
      addDatabasePersonal(payload)
        .then((res) => {
          setOpenDialog(false);
          setDatabaseName("");
          fetchDatabasePersonal();
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (type === "table") {
      const payload = {
        id: String(id),
        db_name: selectedItem?.name,
        table_name: tableName,
      };
      addTablePersonal(payload)
        .then((res) => {
          setOpenDialogAddTable(false);
          setTableName("");
          fetchDatabasePersonal();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const fetchDatabasePersonal = () => {
    console.log("sercing pak eko");
    getDatabasePersonal({
      user_id: String(id),
      keyword: keyword,
      page: page,
      per_page: showEntry,
    })
      .then((res) => {
        setDatabaseList(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleDeleteConfirmed = () => {
    const payload = {
      id: String(id),
      db_name: selectedDatabaseDelete.map((item) => item.name),
    };

    deleteDatabasePersonal(payload)
      .then((res) => {
        setOpenDeleteDialog(false);
        setSelectedDatabaseDelete([]);
        fetchDatabasePersonal();
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.name.endsWith(".db")) {
      setFile(file);
      console.log("Selected .db file:", file);
    } else {
      alert("Please select a valid .db file");
    }
  };

  const handleUploadFile = () => {
    const formData = new FormData();
    formData.append("id", String(id));
    formData.append("db_name", file.name.replace(/\.db$/i, ""));
    formData.append("file", file);

    uploadDbPersonal(formData)
      .then((res) => {
        console.log(res);
        fetchDatabasePersonal();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleChangePage = (event, value) => {
    setPage(value);
  };
  const location = useLocation();

  useEffect(() => {
    fetchDatabasePersonal();
  }, [showEntry, keyword, page]);

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
          {/* <>
            <Button
              variant="contained"
              startIcon={<UploadIcon />}
              onClick={() => setOpenDialogDB(true)}
              sx={{ backgroundColor: "#3c3f52", textTransform: "none" }}
            >
              Upload Database
            </Button>
          </> */}
          <Button
            variant="contained"
            sx={{
              minWidth: "40px",
              px: 0,
              backgroundColor: "#e53935",
              "&:hover": { backgroundColor: "#d32f2f" },
            }}
            onClick={() => {
              setOpenDeleteDialog(true);
            }}
          >
            <DeleteIcon />
          </Button>
        </Box>
        <Typography variant="h5">Database Personal</Typography>
        <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
          {/* Kiri: Dropdown Tampilkan */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography fontWeight="bold">Tampilkan</Typography>
            <Select
              value={showEntry}
              onChange={(e) => setShowEntry(e.target.value)}
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
              <MenuItem value={50}>50</MenuItem>
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
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <IconButton type="submit" sx={{ p: 0.5 }} aria-label="search">
              <SearchIcon />
            </IconButton>
          </Paper>
        </Box>
        <Box sx={{ border: "1px solid #ccc", borderRadius: 2, mt: 2, p: 2 }}>
          {/* List */}
          <Stack spacing={1}>
            {databaseList?.list_files?.map((item, idx) => (
              <Box
                key={idx}
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
                  <Checkbox
                    checked={
                      !!selectedDatabaseDelete.find((i) => i.name === item.name)
                    }
                    onChange={() => handleCheckboxChange(item)}
                  />
                  <Typography fontWeight={500}>{item.name}</Typography>
                </Box>
                {item.status_table === "exist" ? (
                  <IconButton
                    size="small"
                    sx={{
                      backgroundColor: "#1976d2", // warna biru
                      color: "white",
                      "&:hover": { backgroundColor: "#1565c0" },
                    }}
                    onClick={() => {
                      const currentPath = location.pathname;
                      navigate(`${currentPath}/${item.name}`);
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
                      setSelectedItem(item);
                      setOpenDialogAddTable(true);
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
              Menampilkan {databaseList?.per_page * (page - 1) + 1} sampai{" "}
              {databaseList?.per_page * page}
            </Typography>
            <Pagination
              count={databaseList?.total_pages || 1}
              page={page}
              onChange={handleChangePage}
              size="small"
            />
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

      {/* Dialog Upload DB */}
      <Dialog
        open={openDialogDB}
        onClose={() => {
          setOpenDialogDB(false);
        }}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle sx={{ m: 0, p: 2 }}>
          Unggah Database
          <IconButton
            aria-label="close"
            onClick={() => {
              setOpenDialogDB(false);
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
            📄 {file?.name || "pilih file"}
            <input
              type="file"
              accept=".db"
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
              Pilih Database
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
              handleUploadFile();
              setOpenDialogDB(false);
            }}
          >
            Unggah
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Hapus Database */}
      <DeleteDatabase
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        handleDelete={handleDeleteConfirmed}
        title={"Database"}
      />
    </Stack>
  );
};

export default Database;
