import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import CustomSnackbar from "../CustomSnackbar";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { editUser } from "../../services";

export default function DataTable({
  userList,
  fetchUserList,
  selectedIds,
  setSelectedIds,
  departmentOptions,
}) {
  const [open, setOpen] = useState(false);
  const [id, setId] = useState("");
  const [departemen, setDepartemen] = useState("");
  const [namaDepan, setNamaDepan] = useState("");
  const [namaBelakang, setNamaBelakang] = useState("");
  const [gender, setGender] = useState("");
  const [posisi, setPosisi] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [telepon, setTelepon] = useState("");
  const [status, setStatus] = useState("");

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

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
    setDepartemen(row.Department);
    setNamaDepan(row["Nama Depan"]);
    setNamaBelakang(row["Nama Belakang"]);
    setGender(row.Gender);
    setPosisi(row.Role);
    setUsername(row.Username);
    setPassword(row.Password);
    setEmail(row.Email);
    setTelepon(row.Phone);
    setStatus(row.Status);
    setId(row.id);
    handleOpen();
  };

  const handleSubmitEdit = (e) => {
    e.preventDefault();

    // Cari department_id dari departmentOptions berdasarkan nama departemen
    const selectedDepartment = departmentOptions.find(
      (dept) => dept.name === departemen
    );

    if (!selectedDepartment) {
      alert("Departemen tidak ditemukan.");
      return;
    }

    // if (!kodeDept || !namaDept) {
    //   alert("Mohon isi semua field.");
    //   return;
    // }

    const editedUser = {
      department_id: String(selectedDepartment.id),
      department: selectedDepartment.name,
      first_name: namaDepan,
      last_name: namaBelakang,
      gender: gender,
      username: username,
      email: email,
      phone_number: telepon,
      role: posisi,
      status: status,
      id: String(id),
    };

    console.log("Departemen di edit:", editedUser);

    editUser(editedUser)
      .then((res) => {
        console.log("User berhasil diubah:", res);
        openSnackbar("berhasil", "User berhasil diubah!");
        handleClose();
    fetchUserList();
      })
      .catch((error) => {
        console.error("Gagal mengubah User:", error);
        openSnackbar("gagal", "Gagal mengubah User!");
      });
  };

  const columns = [
    { field: "id", headerName: "ID", width: 110 },
    { field: "department_id", headerName: "ID Department", width: 110 },
    { field: "Department", headerName: "Department", width: 110 },
    { field: "Nama Depan", headerName: "Nama Depan", width: 110 },
    { field: "Nama Belakang", headerName: "Nama Belakang", width: 110 },
    { field: "Gender", headerName: "Gender", width: 110 },
    { field: "Username", headerName: "Username", width: 110 },
    { field: "Email", headerName: "Email", width: 110 },
    { field: "Phone", headerName: "Phone", width: 110 },
    { field: "Role", headerName: "Role", width: 110 },
    { field: "Status", headerName: "Status", width: 110 },
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

  const userRow = userList.map(
    ([
      id,
      department_id,
      Department,
      first_name,
      last_name,
      Gender,
      Username,
      Email,
      Phone,
      Role,
      Status,
    ]) => ({
      id,
      department_id,
      Department,
      "Nama Depan": first_name,
      "Nama Belakang": last_name,
      Gender,
      Username,
      Email,
      Phone,
      Role,
      Status,
    })
  );

  const paginationModel = { page: 0, pageSize: 5 };
  return (
    <Paper sx={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={userRow}
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
            <Grid container spacing={2}>
              {/* Departemen */}
              <Grid item size={12}>
                <Typography sx={{ mb: 1 }}>Departemen</Typography>
                <TextField
                  size="small"
                  sx={{ mb: 1 }}
                  fullWidth
                  placeholder="Masukkan departemen"
                  select
                  value={departemen}
                  onChange={(e) => setDepartemen(e.target.value)}
                >
                  {departmentOptions.map((dept) => (
                    <MenuItem key={dept.id} value={dept.name}>
                      {dept.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              {/* Nama Depan & Nama Belakang */}
              <Grid item size={6}>
                <Typography sx={{ mb: 1 }}>Nama Depan</Typography>
                <TextField
                  size="small"
                  sx={{ mb: 1 }}
                  fullWidth
                  placeholder="Masukkan nama depan"
                  value={namaDepan}
                  onChange={(e) => setNamaDepan(e.target.value)}
                />
              </Grid>
              <Grid item size={6}>
                <Typography sx={{ mb: 1 }}>Nama Belakang</Typography>
                <TextField
                  size="small"
                  sx={{ mb: 1 }}
                  fullWidth
                  placeholder="Masukkan nama belakang"
                  value={namaBelakang}
                  onChange={(e) => setNamaBelakang(e.target.value)}
                />
              </Grid>

              {/* Gender & Posisi */}
              <Grid item size={6}>
                <Typography sx={{ mb: 1 }}>Gender</Typography>
                <TextField
                  size="small"
                  sx={{ mb: 1 }}
                  fullWidth
                  select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                </TextField>
              </Grid>
              <Grid item size={6}>
                <Typography sx={{ mb: 1 }}>Posisi</Typography>
                <TextField
                  size="small"
                  sx={{ mb: 1 }}
                  fullWidth
                  select
                  value={posisi}
                  onChange={(e) => setPosisi(e.target.value)}
                >
                  <MenuItem value="Admin">Admin</MenuItem>
                  <MenuItem value="User">User</MenuItem>
                  <MenuItem value="Operator">Operator</MenuItem>
                </TextField>
              </Grid>

              {/* Username & Kata Sandi */}
              <Grid item size={6}>
                <Typography sx={{ mb: 1 }}>Username</Typography>
                <TextField
                  size="small"
                  sx={{ mb: 1 }}
                  fullWidth
                  placeholder="Masukkan username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </Grid>

              {/* Email & No. Telepon */}
              <Grid item size={6}>
                <Typography sx={{ mb: 1 }}>Email</Typography>
                <TextField
                  size="small"
                  sx={{ mb: 1 }}
                  fullWidth
                  placeholder="Masukkan email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Grid>
              <Grid item size={6}>
                <Typography sx={{ mb: 1 }}>No. Telepon</Typography>
                <TextField
                  size="small"
                  sx={{ mb: 1 }}
                  fullWidth
                  placeholder="Masukkan no. telepon"
                  value={telepon}
                  onChange={(e) => setTelepon(e.target.value)}
                />
              </Grid>

              {/* Status */}
              <Grid item size={6}>
                <Typography sx={{ mb: 1 }}>Status</Typography>
                <TextField
                  size="small"
                  sx={{ mb: 1 }}
                  fullWidth
                  select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="User">Inactive</MenuItem>
                </TextField>
              </Grid>
            </Grid>
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
