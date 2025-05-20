import {
  Box,
  Button,
  Checkbox,
  IconButton,
  InputBase,
  MenuItem,
  Pagination,
  FormControl,
  InputLabel,
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
import { Navigate, useNavigate } from "react-router-dom";
import { add } from "lodash";
import {
  addDatabaseDepartment,
  addDatabasePersonal,
  addTableDepartment,
  addTablePersonal,
  deleteDatabaseDepartment,
  deleteDatabasePersonal,
  getDatabaseDepartment,
  getDatabasePersonal,
  getDepartmentList,
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
  const [departmen, setDepartmen] = useState(() => {
    const stored = localStorage.getItem("departmendb");
    return stored ? parseInt(stored, 10) : 7;
  });
  const [checkedItemsFileDepartment, setCheckedItemsFileDepartment] = useState(
    {}
  );
  const [departmentList, setDepartmentList] = useState([]);
  const departmentOptions = departmentList.map(([id, name, code]) => ({
    id,
    label: name,
    code,
  }));

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
        id: String(departmen),
        db_name: databaseName,
        overwrite: false,
      };
      addDatabaseDepartment(payload)
        .then((res) => {
          setOpenDialog(false);
          setDatabaseName("");
          fetchDatabaseDept(departmen);
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (type === "table") {
      const payload = {
        id: String(departmen),
        db_name: selectedItem?.name,
        table_name: tableName,
      };
      addTableDepartment(payload)
        .then((res) => {
          setOpenDialogAddTable(false);
          setTableName("");
          fetchDatabaseDept(departmen);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const fetchDatabaseDept = (dept) => {
    getDatabaseDepartment({
      dept_id: String(dept),
      keyword: keyword,
      page: page,
      per_page: showEntry,
    })
      .then((res) => {
        setDatabaseList(res);
      })
      .catch((err) => {
        console.log(err);
        setDatabaseList([]);
      });
  };

  const handleDeleteConfirmed = () => {
    const payload = {
      id: String(departmen),
      db_name: selectedDatabaseDelete.map((item) => item.name),
    };

    deleteDatabaseDepartment(payload)
      .then((res) => {
        setOpenDeleteDialog(false);
        setSelectedDatabaseDelete([]);
        fetchDatabaseDept(departmen);
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
        fetchDatabaseDept(departmen);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleChangePage = (event, value) => {
    setPage(value);
  };

  const handledepartmen = (event) => {
    const value = event.target.value;
    setDepartmen(value);
    localStorage.setItem("departmendb", value);
    fetchDatabaseDept(value);
  };

  const fetchDepartmentList = async () => {
    try {
      const data = await getDepartmentList();
      setDepartmentList(data.response);
    } catch (error) {
      console.error("Gagal mengambil file personal:", error);
    }
  };

  useEffect(() => {
    fetchDatabaseDept(departmen);
  }, [showEntry, keyword, page]);

  useEffect(() => {
    fetchDepartmentList();
  }, []);
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
        <Typography variant="h5">Database Departemen</Typography>
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
        <Box sx={{ mt: 2 }}>
          <FormControl fullWidth>
            <Typography fontWeight="bold">Departemen</Typography>
            <Select
              labelId="departemen-label"
              value={departmen}
              onChange={handledepartmen}
              onClick={() => setCheckedItemsFileDepartment([])}
            >
              {departmentOptions.map((dept) => (
                <MenuItem key={dept.id} value={dept.id}>
                  {dept.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ border: "1px solid #ccc", borderRadius: 2, mt: 2, p: 2 }}>
          {!departmen ? (
            <Typography>Silahkan Pilih Departemen Terlebih Dahulu</Typography>
          ) : (
            <>
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
                          !!selectedDatabaseDelete.find(
                            (i) => i.name === item.name
                          )
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
                          navigate(
                            `/admin/coofisai/database_dept/${item.name}/${departmen}`
                          );
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
                  Menampilkan {databaseList?.per_page * (page - 1) + 1 || 0}{" "}
                  sampai {databaseList?.per_page * page || 0}
                </Typography>
                <Pagination
                  count={databaseList?.total_pages || 1}
                  page={page}
                  onChange={handleChangePage}
                  size="small"
                />
              </Box>
            </>
          )}
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
