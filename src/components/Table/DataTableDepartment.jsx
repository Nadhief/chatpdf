import * as React from "react";
import { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  TextField,
  Button,
  Paper,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import CustomSnackbar from "../CustomSnackbar";
import { editDepartment } from "../../services";

export default function DataTableDepartment({ departmentList, fetchDepartmentList, selectedIds, setSelectedIds, }) {
  const [open, setOpen] = useState(false);
  const [id, setId] = useState("");
  const [kodeDept, setKodeDept] = useState("");
  const [namaDept, setNamaDept] = useState("");

  const departmentRow = departmentList.map(([id, name, code]) => ({ 
    id,
    label: name,
    code,
  }));
  
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    status: "berhasil",
  });

  const openSnackbar = (status, message) => {
    setSnackbar({ open: true, status, message });
  };

  const closeSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleOpenEdit = (row) => {
    setId(row.id);
    setKodeDept(row.code);
    setNamaDept(row.label);
    handleOpen();
  };  

  const handleSubmitEdit = (e) => {
    e.preventDefault();

    if (!kodeDept || !namaDept) {
      alert("Mohon isi semua field.");
      return;
    }

    const editedDepartment = {
      id: String(id),
      dept_code: kodeDept,
      dept_name: namaDept,
    };

    console.log("Departemen di edit:", editedDepartment);

    editDepartment(editedDepartment)
      .then((res) => {
        console.log("Departemen berhasil diubah:", res);
        openSnackbar("berhasil", "Departemen berhasil diubah!");
        handleClose();
        fetchDepartmentList();
      })
      .catch((error) => {
        console.error("Gagal mengubah departemen:", error);
        openSnackbar("gagal", "Gagal mengubah departemen!");
      });
  };

  // Kolom tabel
  const columns = [
    { field: "code", headerName: "Kode Department", width: 500 },
    { field: "label", headerName: "Nama Department", width: 500 },
    {
      field: "Aksi",
      headerName: "",
      width: 60,
      renderCell: (params) => (
        <IconButton onClick={() => handleOpenEdit(params.row)}>
          <EditIcon sx={{ color: "#3366FF" }} />
        </IconButton>
      ),
    },
  ];

  const paginationModel = { page: 0, pageSize: 5 };

  return (
    <Paper sx={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={departmentRow}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
        onRowSelectionModelChange={(newSelectionModel) => {
          setSelectedIds(newSelectionModel);
        }}
        rowSelectionModel={selectedIds}
        sx={{
          border: 0,
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#f5f5f5 !important",
            fontWeight: "bold",
          },
        }}
      />

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ m: 0, p: 2 }}>
          <Typography fontWeight="bold">Edit Departemen</Typography>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <form onSubmit={handleSubmitEdit}>
            <Typography sx={{ mb: 1 }}>Kode Departemen</Typography>
            <TextField
              size="small"
              fullWidth
              placeholder="Masukkan kode departemen"
              value={kodeDept}
              onChange={(e) => setKodeDept(e.target.value)}
              sx={{ mb: 3 }}
            />
            <Typography sx={{ mb: 1 }}>Nama Departemen</Typography>
            <TextField
              size="small"
              fullWidth
              placeholder="Masukkan nama departemen"
              value={namaDept}
              onChange={(e) => setNamaDept(e.target.value)}
              sx={{ mb: 3 }}
            />
          </form>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={handleSubmitEdit}
            variant="contained"
            sx={{ backgroundColor: "#52BD94", textTransform: "none" }}
          >
            Ubah
          </Button>
        </DialogActions>
      </Dialog>
      <CustomSnackbar
        open={snackbar.open}
        onClose={closeSnackbar}
        status={snackbar.status}
        message={snackbar.message}
      />
    </Paper>
  );
}