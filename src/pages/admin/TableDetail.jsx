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
import { Navigate, useNavigate, useParams } from "react-router-dom";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import DataColumn from "../../components/Table/DataColumn";
import {
  addColumnPersonal,
  addDataPersonal,
  deleteDataPersonal,
  getColumnPersonal,
  updateDataPersonal,
} from "../../services";
import DeleteDatabase from "../../components/Dialog/DeleteDatabase";

const TableDetail = ({ id }) => {
  const navigate = useNavigate();
  const { nameTable } = useParams();
  const { name } = useParams();
  const [openDialogAddData, setOpenDialogAddData] = useState(false);
  const [openDialogAddColumn, setOpenDialogAddColumn] = useState(false);
  const [openDialogCSV, setOpenDialogCSV] = useState(false);
  const [fileName, setFileName] = useState("");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [selectedItem, setSelectedItem] = useState([]);
  const dataTypes = ["NUMERIC", "INTEGER", "TEXT", "REAL", "BLOB", "DATETIME"];
  const [editData, setEditData] = useState(false);
  const [selectedEdit, setSelectedEdit] = useState();
  const [newColumns, setNewColumns] = useState([
    { field_name: "", field_type: "" },
  ]);
  const [newData, setNewData] = useState({});

  const [data, setData] = useState(null);

  const [tableData, setTableData] = useState(data);
  const [showEntry, setShowEntry] = useState(10);
  const [keyword, setKeyword] = useState("");

  const handleSubmit = (type) => {
    if (type === "column") {
      const payload = {
        id: String(id),
        db_name: name,
        table_name: nameTable,
        fields: newColumns,
      };
      addColumnPersonal(payload).then((res) => {
        setOpenDialogAddColumn(false);
        setNewColumns([]);
        fetchKolomPersonal();
      });
    } else if (type === "data") {
      if (editData === true) {
        const payload = {
          id: String(id),
          db_name: name,
          table_name: nameTable,
          identifier: {
            [data?.column_info[0].name]:
              tableData[selectedEdit][data?.column_info[0].name],
          },
          updates: tableData[selectedEdit],
        };
        updateDataPersonal(payload).then((res) => {
          setOpenDialogAddData(false);
          setNewData({});
          fetchKolomPersonal();
        });
      } else if (editData === false) {
        const payload = {
          id: String(id),
          db_name: name,
          table_name: nameTable,
          data: newData,
        };
        console.log(payload);
        addDataPersonal(payload).then((res) => {
          setOpenDialogAddData(false);
          setNewData({});
          fetchKolomPersonal();
        });
      }
    }
  };

  const handleAddRow = () => {
    setNewColumns([...newColumns, { field_name: "", field_type: "" }]);
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
    }
  };

  const fetchKolomPersonal = () => {
    getColumnPersonal({
      id: String(id),
      db_name: name,
      table_name: nameTable,
      page: 1,
      per_page: showEntry,
      keyword: keyword,
    })
      .then((res) => {
        setData(res);
        setTableData(res.list_data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleChange = (index, key, value) => {
    const updated = [...newColumns];
    updated[index][key] = value;
    setNewColumns(updated);
  };

  const handleChangeNewData = (idx, value) => {
    setNewData((prev) => ({
      ...prev,
      [data?.column_info[idx + 1].name]: value,
    }));
  };

  const handleUpdateData = (rowIdx, col, value) => {
    console.log(rowIdx, col, value);
    const updatedData = [...tableData];
    updatedData[rowIdx][col] = value;
    setTableData(updatedData);
  };

  const handleDelete = () => {
    const payload = {
      id: String(id),
      db_name: name,
      table_name: nameTable,
      identifier: {
        [data?.column_info[0].name]: selectedItem.id,
      },
    };
    deleteDataPersonal(payload).then((res) => {
      console.log(res);
      fetchKolomPersonal();
    });
  };

  const getInputType = (sqliteType) => {
    const type = sqliteType.toUpperCase();
    if (type.includes("INT")) return "number";
    if (type.includes("FLOAT") || type.includes("NUMERIC") || type === "NUMBER")
      return "number";
    if (type === "TEXT" || type === "STRING") return "text";
    if (type === "DATE") return "date";
    if (type === "BOOLEAN") return "checkbox";
    return "text";
  };

  useEffect(() => {
    fetchKolomPersonal();
  }, [showEntry, keyword]);

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
            onClick={() => navigate(`/admin/coofisai/database/${name}`)}
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
            onClick={() => {
              setOpenDeleteDialog(true);
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
          <DataColumn
            data={data}
            setEditData={setEditData}
            setSelectedEdit={setSelectedEdit}
            setOpenDialogAddData={setOpenDialogAddData}
            setSelectedItem={setSelectedItem}
            selectedItem={selectedItem}
          />
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
              Menampilkan {data?.page} sampai {data?.per_page}
            </Typography>
            <Pagination
              count={data?.total_pages}
              page={data?.page}
              size="small"
            />
          </Box>
        </Box>
      </Stack>

      {/* Dialog Tambah Data */}
      <Dialog
        open={openDialogAddData}
        onClose={() => {
          setNewColumns([{ name: "", type: "" }]);
          setOpenDialogAddData(false);
          setEditData(false);
          fetchKolomPersonal();
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
          <Typography fontWeight="bold">
            {editData ? "Ubah Data" : "Tambah Data"}
          </Typography>
          <IconButton
            onClick={() => {
              setNewColumns([{ name: "", type: "" }]);
              setOpenDialogAddData(false);
              setEditData(false);
              fetchKolomPersonal();
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          {editData ? (
            <>
              {tableData
                ?.filter((_, rowIdx) => rowIdx === selectedEdit)
                ?.map((row, rowIdx) => (
                  <Stack key={row.id} spacing={2} sx={{ mb: 4 }}>
                    {data?.column_info?.slice(1).map((col, colIdx) => (
                      <Grid
                        key={colIdx}
                        container
                        spacing={2}
                        alignItems="center"
                        sx={{ mb: 2 }}
                      >
                        <Typography>{col.name}</Typography>
                        <Grid item size={12}>
                          <TextField
                            fullWidth
                            size="small"
                            placeholder={`Masukan data untuk kolom ${col.name}`}
                            value={row[col.name] || ""}
                            type={getInputType(col.type)}
                            onChange={(e) =>
                              handleUpdateData(
                                selectedEdit,
                                col.name,
                                e.target.value
                              )
                            }
                          />
                        </Grid>
                      </Grid>
                    ))}
                  </Stack>
                ))}
            </>
          ) : (
            <>
              {data?.column_info?.slice(1).map((col, idx) => (
                <Stack key={idx}>
                  <Typography>{col.name}</Typography>
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
                        placeholder={`Masukan data untuk kolom ${col.name}`}
                        size="small"
                        type={getInputType(col.type)}
                        onChange={(e) =>
                          handleChangeNewData(idx, e.target.value)
                        }
                      />
                    </Grid>
                  </Grid>
                </Stack>
              ))}
            </>
          )}
          <Box display={"flex"} justifyContent={"flex-end"}>
            <Button
              variant="contained"
              onClick={() => handleSubmit("data")}
              sx={{
                backgroundColor: "#4caf50",
                textTransform: "none",
                "&:hover": { backgroundColor: "#43a047" },
              }}
            >
              Ubah
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Dialog Tambah Column */}
      <Dialog
        open={openDialogAddColumn}
        onClose={() => {
          setNewColumns([{ field_name: "", field_type: "" }]);
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
              setNewColumns([{ field_name: "", field_type: "" }]);
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

      {/* Dialog hapus data */}
      <DeleteDatabase
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        handleDelete={()=> handleDelete()}
        title={"Data"}
      />
    </Stack>
  );
};

export default TableDetail;
