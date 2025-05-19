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
import React, { useEffect, useState } from "react";
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
import {
  addColumnPersonal,
  addTablePersonal,
  deleteTablePersonal,
  getTablePersonal,
} from "../../services";
import DeleteDatabase from "../../components/Dialog/DeleteDatabase";

const DummyData = [
  { id: 1, name: "Nama Table", isDetail: true },
  { id: 2, name: "Nama Table", isDetail: false },
  { id: 3, name: "Nama Table", isDetail: false },
  { id: 4, name: "Nama Table", isDetail: false },
];

const Table = ({ id, toggleSidebar }) => {
  const navigate = useNavigate();
  const { name } = useParams();
  const [openDialogAddTable, setOpenDialogAddTable] = useState(false);
  const [openDialogAddColumn, setOpenDialogAddColumn] = useState(false);
  const [tableName, setTableName] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const dataTypes = ["String", "Number", "Boolean", "Date"];
  const [columns, setColumns] = useState([{ field_name: "", field_type: "" }]);
  const [tableList, setTableList] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedTableDelete, setSelectedTableDelete] = useState([]);
  const [showEntry, setShowEntry] = useState(10);
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);

  const handleAddRow = () => {
    setColumns([...columns, { field_name: "", field_type: "" }]);
  };

  const handleChange = (index, key, value) => {
    const updated = [...columns];
    updated[index][key] = value;
    setColumns(updated);
  };

  const handleSubmit = (type) => {
    if (type === "table") {
      const payload = {
        id: String(id),
        db_name: String(name),
        table_name: tableName,
      };
      addTablePersonal(payload)
        .then((res) => {
          setOpenDialogAddTable(false);
          setTableName("");
          fetchTablePersonal();
        })
        .catch((err) => {});
    } else if (type === "column") {
      const payload = {
        id: String(id),
        db_name: name,
        table_name: selectedItem?.name,
        fields: columns,
      };
      addColumnPersonal(payload).then((res) => {
        setOpenDialogAddColumn(false);
        setColumns([]);
        fetchTablePersonal();
      });
    }
  };

  const fetchTablePersonal = () => {
    getTablePersonal({
      id: String(id),
      db_name: name,
      keyword: keyword,
      page: page,
      per_page: showEntry,
    })
      .then((res) => {
        setTableList(res);
      })
      .catch((err) => {});
  };

  const handleCheckboxChange = (item) => {
    setSelectedTableDelete((prev) => {
      const exists = prev.find((i) => i.name === item.name);
      if (exists) {
        return prev.filter((i) => i.name !== item.name);
      } else {
        return [...prev, item];
      }
    });
  };

  const handleDeleteConfirmed = () => {
    const payload = {
      id: String(id),
      db_name: name,
      table_name: selectedTableDelete.map((item) => item.name),
    };

    deleteTablePersonal(payload)
      .then((res) => {
        setOpenDeleteDialog(false);
        setSelectedTableDelete([]);
        fetchTablePersonal();
      })
      .catch((err) => {});
  };

  const handleChangePage = (event, value) => {
    setPage(value);
  };

  useEffect(() => {
    fetchTablePersonal();
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
            sx={{
              backgroundColor: "#EEAFAF",
              textTransform: "none",
              color: "#EA001E",
            }}
            onClick={() => navigate("/admin/coofisai/database")}
          >
            Kembali
          </Button>
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
            onClick={() => {
              setOpenDeleteDialog(true);
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
            {tableList?.list_table?.map((item, idx) => (
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
                      !!selectedTableDelete.find((i) => i.name === item.name)
                    }
                    onChange={() => handleCheckboxChange(item)}
                  />
                  <Typography fontWeight={500}>{item.name}</Typography>
                </Box>
                {item.status_column === "exist" ? (
                  <IconButton
                    size="small"
                    sx={{
                      backgroundColor: "#1976d2",
                      color: "white",
                      "&:hover": { backgroundColor: "#1565c0" },
                    }}
                    onClick={() => {
                      setSelectedItem(item);
                      navigate(`/admin/coofisai/database/${name}/${item.name}`);
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
              Menampilkan {tableList?.per_page * (page - 1) + 1} sampai {tableList?.per_page * page}
            </Typography>
            <Pagination
              count={tableList?.total_pages}
              page={page}
              onChange={handleChangePage}
              size="small"
            />
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
                  value={col.field_name}
                  onChange={(e) =>
                    handleChange(idx, "field_name", e.target.value)
                  }
                />
              </Grid>
              <Grid item size={6}>
                <TextField
                  fullWidth
                  select
                  size="small"
                  value={col.field_type}
                  onChange={(e) =>
                    handleChange(idx, "field_type", e.target.value)
                  }
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

      {/* Dialog Delete Table */}
      <DeleteDatabase
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        handleDelete={handleDeleteConfirmed}
        title={"Table"}
      />
    </Stack>
  );
};

export default Table;
