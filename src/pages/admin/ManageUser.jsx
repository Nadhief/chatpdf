import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import TrashIcon from "@mui/icons-material/DeleteOutlineOutlined";
import InputSearchBar from "../../components/Inputs/InputSearchBar";
import DataTable from "../../components/Table/DataTable";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect } from "react";
import {
  createUser,
  getUserList,
  removeUser,
  getDepartmentList,
  removeDepartment,
} from "../../services";
import CustomSnackbar from "../../components/CustomSnackbar";
import DeleteUser from "../../components/Dialog/DeleteUser";

const ManageUser = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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

  const [userList, setUserList] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [departmentList, setDepartmentList] = useState([]);
  const departmentOptions = departmentList.map(([id, name, code]) => ({
    id,
    name,
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

  useEffect(() => {
    fetchDepartmentList();
  }, []);

  const fetchDepartmentList = async () => {
    try {
      const data = await getDepartmentList();
      setDepartmentList(data.response);
    } catch (error) {
      console.error("Gagal mengambil file personal:", error);
    }
  };

  useEffect(() => {
    fetchUserList();
  }, []);

  const fetchUserList = async () => {
    try {
      const data = await getUserList();
      setUserList(data.response);
    } catch (error) {
      console.error("Gagal mengambil list user:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !departemen ||
      !namaDepan ||
      !namaBelakang ||
      !gender ||
      !posisi ||
      !username ||
      !password ||
      !email ||
      !telepon ||
      !status
    ) {
      alert("Mohon isi semua field.");
      return;
    }

    // Cari department_id dari departmentOptions berdasarkan nama departemen
    const selectedDepartment = departmentOptions.find(
      (dept) => dept.name === departemen
    );

    if (!selectedDepartment) {
      alert("Departemen tidak ditemukan.");
      return;
    }

    const newUser = {
      department_id: String(selectedDepartment.id),
      department: selectedDepartment.name,
      first_name: namaDepan,
      last_name: namaBelakang,
      gender: gender,
      username: username,
      email: email,
      phone_number: telepon,
      password: password,
      role: posisi,
      status: status,
    };

    console.log("Pengguna baru:", newUser);

    createUser(newUser)
      .then((res) => {
        console.log("User berhasil ditambahkan:", res);
        setDepartemen("");
        setNamaDepan("");
        setNamaBelakang("");
        setGender("");
        setPosisi("");
        setUsername("");
        setPassword("");
        setEmail("");
        setTelepon("");
        setStatus("");

        handleClose();
        openSnackbar("berhasil", "User berhasil ditambahkan!");
        fetchUserList();
      })
      .catch((error) => {
        console.error("Gagal menambahkan user:", error);
        openSnackbar("gagal", "Gagal menambahkan user!");
      });
  };

  const handleDelete = () => {
    const payload = {
      ids: selectedIds.map((id) => String(id)),
    };
    removeUser(payload)
      .then(() => {
        openSnackbar("berhasil", "User berhasil dihapus!");
        fetchUserList();
      })
      .catch((error) => {
        console.error("Gagal menghapus User:", error);
        openSnackbar("gagal", "Gagal menghapus User");
      })
      .finally(() => {
        setSelectedIds([]);
        setDeleteDialogOpen(false);
      });
  };
  const handleTrashClick = () => {
    if (selectedIds.length === 0) {
      alert("Pilih department yang ingin dihapus.");
      return;
    }
    setDeleteDialogOpen(true);
  };

  console.log(selectedIds);

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
              onClick={() => {
                handleTrashClick();
              }}
            >
              <TrashIcon sx={{ fontSize: 20 }} />
            </Box>
            <Button
              variant="contained"
              onClick={handleOpen}
              sx={{ backgroundColor: "#474D66", textTransform: "none" }}
            >
              + Add User
            </Button>
          </Box>
          <InputSearchBar />
        </Box>
        <DataTable
          userList={userList}
          fetchUserList={fetchUserList}
          selectedIds={selectedIds}
          setSelectedIds={setSelectedIds}
          departmentOptions={departmentOptions}
        />
      </Grid>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle sx={{ m: 0, p: 2 }}>
          <Typography fontWeight="bold">Tambah Data User</Typography>
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
              <Grid item size={6}>
                <Typography sx={{ mb: 1 }}>Kata Sandi</Typography>
                <TextField
                  size="small"
                  sx={{ mb: 1 }}
                  fullWidth
                  placeholder="Masukkan kata sandi"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
      <DeleteUser
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        handleDelete={handleDelete}
      />
    </Grid>
  );
};

export default ManageUser;
