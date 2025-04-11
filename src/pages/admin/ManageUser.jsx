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

const ManageUser = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  
  const [departemen, setDepartemen] = useState('');
  const [namaDepan, setNamaDepan] = useState('');
  const [namaBelakang, setNamaBelakang] = useState('');
  const [gender, setGender] = useState('');
  const [posisi, setPosisi] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [telepon, setTelepon] = useState('');
  const [telegram, setTelegram] = useState('');
  

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!departemen || !namaDepan || !namaBelakang || !gender || !posisi || !username || !password || !email || !telepon || !telegram) {
      alert("Mohon isi semua field.");
      return;
    }

    const newDepartment = {
      departemen,
      namaDepan,
      namaBelakang,
      gender,
      posisi,
      username,
      password,
      email,
      telepon,
      telegram,
    };

    console.log("Departemen baru:", newDepartment);


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
        <DataTable />
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
                <Typography sx={{ mb:1 }}>Departemen</Typography>
                <TextField
                size="small"
                sx={{ mb: 1 }}
                  fullWidth
                  placeholder="Masukkan departemen"
                  select
                  value={departemen}
                  onChange={(e) => setDepartemen(e.target.value)}
                >
                  <MenuItem value="Finansial">Finansial</MenuItem>
                  <MenuItem value="Marketing">Marketing</MenuItem>
                  {/* Tambahkan lainnya sesuai kebutuhan */}
                </TextField>
              </Grid>

              {/* Nama Depan & Nama Belakang */}
              <Grid item size={6}>
                <Typography sx={{ mb:1 }}>Nama Depan</Typography>
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
                <Typography sx={{ mb:1 }}>Nama Belakang</Typography>
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
                <Typography sx={{ mb:1 }}>Gender</Typography>
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
                <Typography sx={{ mb:1 }}>Posisi</Typography>
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
                <Typography sx={{ mb:1 }}>Username</Typography>
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
                <Typography sx={{ mb:1 }}>Kata Sandi</Typography>
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
                <Typography sx={{ mb:1 }}>Email</Typography>
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
                <Typography sx={{ mb:1 }}>No. Telepon</Typography>
                <TextField
                size="small"
                sx={{ mb: 1 }}
                  fullWidth
                  placeholder="Masukkan no. telepon"
                  value={telepon}
                  onChange={(e) => setTelepon(e.target.value)}
                />
              </Grid>

              {/* Telegram Username */}
              <Grid item size={6}>
                <Typography sx={{ mb:1 }}>Telegram Username</Typography>
                <TextField
                size="small"
                sx={{ mb: 1 }}
                  fullWidth
                  placeholder="Masukkan username telegram"
                  value={telegram}
                  onChange={(e) => setTelegram(e.target.value)}
                />
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
    </Grid>
  );
};

export default ManageUser;
