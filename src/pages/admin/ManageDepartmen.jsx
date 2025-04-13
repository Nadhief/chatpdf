import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import TrashIcon from "@mui/icons-material/DeleteOutlineOutlined";
import InputSearchBar from "../../components/Inputs/InputSearchBar";
import DataTableDepartment from "../../components/Table/DataTableDepartment";
import CloseIcon from "@mui/icons-material/Close";
import { createDepartment, getDepartmentList, removeDepartment } from "../../services";
import CustomSnackbar from "../../components/CustomSnackbar";
import DeleteDepartment from '../../components/Dialog/DeleteDepartment';

const ManageDepartmen = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [kodeDept, setKodeDept] = useState("");
  const [namaDept, setNamaDept] = useState("");

  const [departmentList, setDepartmentList] = useState([]);

  const [selectedIds, setSelectedIds] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleTrashClick = () => {
    if (selectedIds.length === 0) {
      alert("Pilih department yang ingin dihapus.");
      return;
    }
    setDeleteDialogOpen(true);
  };

  useEffect(() => {
      fetchDepartmentList();
    }, []);
  
  const fetchDepartmentList = async () => {
    try {
      const data = await getDepartmentList();
      setDepartmentList(data.response);
    } catch (error) {
      console.error("Gagal mengambil list department:", error);
    }
  };

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

  const handleDelete = () => {
    const payload = {
      ids: selectedIds.map(id => String(id))
    };
    
    removeDepartment(payload)
      .then(() => {
        openSnackbar("berhasil", "Departemen berhasil dihapus!");
        fetchDepartmentList();
      })
      .catch((error) => {
        console.error("Gagal menghapus departemen:", error);
        openSnackbar("gagal", "Gagal menghapus departemen");
      })
      .finally(() => {
        setSelectedIds([]);
        setDeleteDialogOpen(false);
      });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!kodeDept || !namaDept) {
      alert("Mohon isi semua field.");
      return;
    }

    const newDepartment = {
      dept_code: kodeDept,
      dept_name: namaDept,
    };

    console.log("Departemen baru:", newDepartment);
    
    createDepartment(newDepartment)
    .then((res) => {
      console.log("Departemen berhasil ditambahkan:", res);
      setKodeDept("");
      setNamaDept("");
      handleClose();
      openSnackbar("berhasil", "Departemen berhasil ditambahkan!");
      fetchDepartmentList();
    })
    .catch((error) => {
      console.error("Gagal menambahkan departemen:", error);
      openSnackbar("gagal", "Gagal menambahkan departemen!");
    })
    .finally(() => {
      setKodeDept("");
      setNamaDept("");
    });

    handleClose();
  };

  return (
    <Grid
      sx={{
        height: "95vh",
        backgroundColor: "#fff",
        borderRadius: "10px",
        width: "100%",
      }}
      direction={"column"}
      justifyContent="spavce-between"
    >
      <Grid
        sx={{
          flex: 1,
          overflowY: "auto",
          mx: "auto",
          height: "100%",
          p: 3,
        }}
      >
        <Box
          sx={{
            mx: "auto",
            mb: 4,
            px: 1,
            maxWidth: "100%",
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            width="100%"
            sx={{ mb: 2 }}
          >
            <Box
              display="flex"
              alignItems={"center"}
              paddingY={0.7}
              paddingX={0.7}
              borderRadius={1}
              sx={{
                cursor: "pointer",
                backgroundColor: "#CB3A31",
                color: "white",
              }}
              onClick={() => {handleTrashClick()}}
              
            >
              <TrashIcon sx={{ fontSize: 20 }} />
            </Box>
            <Button
              variant="contained"
              onClick={handleOpen}
              sx={{ backgroundColor: "#474D66", textTransform: "none" }}
            >
              + Add Department
            </Button>
          </Box>
          <InputSearchBar />
        </Box>
        <DataTableDepartment
          departmentList={departmentList}
          fetchDepartmentList={fetchDepartmentList}
          selectedIds={selectedIds}
          setSelectedIds={setSelectedIds}
        />
      </Grid>
      
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ m: 0, p: 2 }}>
          <Typography fontWeight="bold">Tambah Departemen</Typography>
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
          <form onSubmit={handleSubmit}>
            <Typography sx={{ mb: 1 }}>Kode Departemen</Typography>
            <TextField
              size="small"
              fullWidth
              placeholder="Masukan kode Departemen"
              value={kodeDept}
              onChange={(e) => setKodeDept(e.target.value)}
              sx={{ mb: 3 }}
            />
            <Typography sx={{ mb: 1 }}>Nama Departemen</Typography>
            <TextField
              size="small"
              fullWidth
              placeholder="MMasukan nama Departemen"
              value={namaDept}
              onChange={(e) => setNamaDept(e.target.value)}
              sx={{ mb: 3 }}
            />
          </form>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{ backgroundColor: "#52BD94", textTransform: "none" }}
          >
            Tambahkan
          </Button>
        </DialogActions>
      </Dialog>
      <CustomSnackbar
        open={snackbar.open}
        onClose={closeSnackbar}
        status={snackbar.status}
        message={snackbar.message}
      />
      <DeleteDepartment
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        handleDelete={handleDelete}
      />

    </Grid>
  );
};

export default ManageDepartmen;
