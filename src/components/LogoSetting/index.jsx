import React, { useState } from "react";
import { Box, Typography, Stack, Grid } from "@mui/material";
import FolderPlusIcon from "@mui/icons-material/FolderOpenOutlined";
import { uploadLogo } from "../../services";
import CustomSnackbar from "../CustomSnackbar";

const LogoSetting = ({ id }) => {
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

  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleCancel = () => {
    setFile(null);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file to upload");
      return;
    }

    try {
      const response = await uploadLogo(file);
      console.log("Logo berhasil diupload:", response);
      openSnackbar("berhasil", "Logo berhasil disimpan!");
      setFile(null)
    } catch (error) {
      console.error("Logo gagal diupload:", error);
      openSnackbar("gagal", "Logo gagal disimpan!");
    }
  };

  return (
    <Grid
      container
      sx={{
        height: "95vh",
        backgroundColor: "#fff",
        borderRadius: "10px",
        width: "100%",
      }}
      direction="column"
    >
      <Grid
        item
        sx={{
          flex: 1,
          overflowY: "auto",
          mx: "auto",
          height: "100%",
          pt: 5,
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
          <Typography align="left" fontWeight={700} fontSize={20} sx={{ mb: 2 }}>
            Ubah Logo
          </Typography>
          <Stack direction="column" spacing={2} alignItems={"center"}>
            <Box
              sx={{
                width: "100%",
                border: "2px solid #E5E6EF",
                borderRadius: "4px",
                backgroundColor: "#FAFBFD",
              }}
            >
              <Stack direction={"column"} padding={1.5} spacing={1}>
                <Typography fontSize={14} fontWeight={600} color="#404040">
                  Unggah File
                </Typography>
                {file ? (
                  <Stack spacing={0.5}>
                    <Typography fontSize={12} fontWeight={400} color="#404040">
                      {file.name}
                    </Typography>
                  </Stack>
                ) : (
                  <Typography fontSize={12} fontWeight={400} color="#404040">
                    Total ukuran berkas yang dapat diproses adalah maksimal 200 MB dengan ekstensi (PDF, JSON)
                  </Typography>
                )}
                <Box display="flex" justifyContent="flex-end" width={700}>
                  {file ? (
                    <>
                      <Box
                        component="button"
                        onClick={handleCancel}
                        sx={{
                          backgroundColor: "#fff",
                          color: "#4C4DDC",
                          border: "1px solid #4C4DDC",
                          borderRadius: 1,
                          fontSize: 12,
                          padding: "4px 12px",
                          cursor: "pointer",
                          marginRight: 1,
                        }}
                      >
                        Batal
                      </Box>
                    </>
                  ) : (
                    <Box
                      component="label"
                      htmlFor="upload-file2"
                      display="flex"
                      justifyContent="flex-end"
                      paddingY={0.5}
                      paddingX={1}
                      borderRadius={1}
                      alignItems="center"
                      sx={{
                        cursor: "pointer",
                        backgroundColor: "#4C4DDC",
                      }}
                    >
                      <FolderPlusIcon
                        sx={{ color: "white", marginRight: 1, fontSize: 18 }}
                      />
                      <Typography fontSize={12} fontWeight={400} color="white">
                        Pilih Berkas
                      </Typography>
                      <input
                        id="upload-file2"
                        type="file"
                        accept=".png"
                        hidden
                        onChange={handleFileChange} // Use handleFileChange here
                      />
                    </Box>
                  )}
                </Box>
              </Stack>
            </Box>
                {/* Tombol Simpan di kanan */}
                <Box width="100%" display="flex" justifyContent="flex-end">
                    <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        paddingY={0.5}
                        paddingX={2}
                        borderRadius={2}
                        border="1px solid #E0E0E0"
                        sx={{
                        cursor: 'pointer',
                        backgroundColor: '#52BD94',
                        }}
                        onClick={handleUpload}
                    >
                        <Typography fontSize={14} fontWeight={400} color="white">
                        Simpan
                        </Typography>
                    </Box>
                </Box>
          </Stack>
        </Box>
      </Grid>
      <CustomSnackbar
        open={snackbar.open}
        onClose={closeSnackbar}
        status={snackbar.status}
        message={snackbar.message}
        />
    </Grid>
  );
};

export default LogoSetting;