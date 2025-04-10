import React, { useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Stack,
} from "@mui/material";
import TrashIcon from "@mui/icons-material/DeleteOutlineOutlined";
import FolderPlusIcon from "@mui/icons-material/CreateNewFolderOutlined";
import CorporateFareIcon from "@mui/icons-material/CorporateFare";
import InputSearchBar from "../../components/Inputs/InputSearchBar";
import { documents } from "../../components/Sidebar/Documents/DocumentsConfig";
import Documents from "../../components/Sidebar/Documents";

const Dokumen = () => {
  const [mainSelect, setMainSelect] = useState("Personal");
  const [people, setPeople] = useState("");
  const [departmen, setDepartmen] = useState("");
  const [selected, setSelected] = useState("file");

  const [selectedFile, setSelectedFile] = useState(null);

  const handleMainDeptChange = (event) => {
    setMainSelect(event.target.value);
  };

  const handlepeople = (event) => {
    setPeople(event.target.value);
  };

  const handledepartmen = (event) => {
    setDepartmen(event.target.value);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  return (
    <Grid
      sx={{
        height: "95vh",
        backgroundColor: "#fff",
        borderRadius: "10px",
        width: "100%",
      }}
      direction="column"
    >
      <Grid
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
            maxWidth: "70%",
          }}
        >
          {/* Dropdown Personal Departemen */}
          <Box>
            <Box width="100%" textAlign="left" sx={{ mb: 2 }}>
              <Typography fontSize={18} fontWeight={700} color="#404040">
                Personal / Departemen
              </Typography>
            </Box>
            <FormControl fullWidth sx={{ mb: 4 }}>
              <InputLabel id="departemen-label">
                Personal / Departemen
              </InputLabel>
              <Select
                labelId="departemen-label"
                value={mainSelect}
                onChange={handleMainDeptChange}
                label="Personal / Departemen"
              >
                <MenuItem value="Personal">Personal</MenuItem>
                <MenuItem value="Departemen">Departemen</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Pilih orang*/}
          {mainSelect === "Personal" && (
            <Box>
              <Box width="100%" textAlign="left" sx={{ mb: 2 }}>
                <Typography fontSize={18} fontWeight={700} color="#404040">
                  Personal
                </Typography>
              </Box>
              <FormControl fullWidth sx={{ mb: 4 }}>
                <InputLabel id="personal-label">Personal</InputLabel>
                <Select
                  labelId="personal-label"
                  value={people}
                  onChange={handlepeople}
                  label="Personal"
                >
                  <MenuItem value="Personal 1">Personal 1</MenuItem>
                  <MenuItem value="Personal 2">Personal 2</MenuItem>
                </Select>
              </FormControl>
            </Box>
          )}

          {/* Pilih departemen*/}
          {mainSelect === "Departemen" && (
            <Box>
              <Box width="100%" textAlign="left" sx={{ mb: 2 }}>
                <Typography fontSize={18} fontWeight={700} color="#404040">
                  Departemen
                </Typography>
              </Box>
              <FormControl fullWidth sx={{ mb: 4 }}>
                <InputLabel id="departemen-label">Departemen</InputLabel>
                <Select
                  labelId="departemen-label"
                  value={departmen}
                  onChange={handledepartmen}
                  label="Departemen"
                >
                  <MenuItem value="Departemen A">Departemen A</MenuItem>
                  <MenuItem value="Departemen B">Departemen B</MenuItem>
                </Select>
              </FormControl>
            </Box>
          )}

          {/* Upload Dokumen */}
          <Box sx={{ width: "100%", mb: 4 }}>
            <Box width="100%" textAlign="left" sx={{ mb: 2 }}>
              <Typography fontSize={18} fontWeight={700} color="#404040">
                Unggah Dokumen Personal
              </Typography>
            </Box>
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
                <Typography fontSize={12} fontWeight={400} color="#404040">
                  Total ukuran berkas yang dapat diproses adalah maksimal 200 MB
                  dengan ekstensi (PDF, JSON)
                </Typography>
                <Box display="flex" justifyContent="flex-end" width="100%">
                  <Box
                    component="label"
                    htmlFor="upload-file"
                    display="flex"
                    justifyContent="flex-end"
                    paddingY={0.5}
                    paddingX={1}
                    borderRadius={1}
                    alignItems={"center"}
                    sx={{
                      cursor: "pointer",
                      backgroundColor: "#4C4DDC",
                      color: "white",
                    }}
                  >
                    <FolderPlusIcon sx={{ marginRight: 1, fontSize: 18 }} />
                    <Typography fontSize={12} fontWeight={400}>
                      Pilih Berkas
                    </Typography>
                    <input
                      id="upload-file"
                      type="file"
                      hidden
                      onChange={handleFileUpload}
                    />
                  </Box>
                </Box>
              </Stack>
            </Box>
          </Box>

          {/* File List */}
          <Box
            sx={{
              width: "100%",
              border: "2px solid #E0E0E0",
              borderRadius: "4px",
              backgroundColor: "#FFFFFF",
            }}
          >
            <Stack direction={"column"} spacing={1}>
              <Box
                sx={{
                  backgroundColor: "#F5F5F5",
                  borderRadius: "4px 4px 0 0",
                  paddingX: 2,
                  paddingY: 0.5,
                }}
              >
                <Typography fontSize={18} fontWeight={700} color="#404040">
                  File Personal
                </Typography>
              </Box>
              <Stack direction={"column"} padding={1.5} spacing={1}>
                <InputSearchBar />
                <Stack direction={"row"} spacing={1} alignItems="center">
                  {mainSelect === "Personal" ? (
                    <>
                      {["file", "topik"].map((type) => (
                        <Box
                          key={type}
                          width={"30%"}
                          display="flex"
                          justifyContent="center"
                          paddingY={0.3}
                          paddingX={0.7}
                          borderRadius={100}
                          border={"1px solid #9E9E9E"}
                          onClick={() => setSelected(type)}
                          sx={{
                            cursor: selected === type ? "default" : "pointer",
                            backgroundColor:
                              selected === type ? "#FAFBFD" : "white",
                            boxShadow:
                              selected === type
                                ? "none"
                                : "0px 4px 8px rgba(0, 0, 0, 0.14)",
                          }}
                        >
                          <Typography
                            fontSize={12}
                            fontWeight={400}
                            color="black"
                          >
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </Typography>
                        </Box>
                      ))}
                    </>
                  ) : (
                    <>
                      {["file"].map((type) => (
                        <Box
                          key={type}
                          width={"30%"}
                          display="flex"
                          justifyContent="center"
                          paddingY={0.3}
                          paddingX={0.7}
                          borderRadius={100}
                          border={"1px solid #9E9E9E"}
                          onClick={() => setSelected(type)}
                          sx={{
                            cursor: selected === type ? "default" : "pointer",
                            backgroundColor:
                              selected === type ? "#FAFBFD" : "white",
                            boxShadow:
                              selected === type
                                ? "none"
                                : "0px 4px 8px rgba(0, 0, 0, 0.14)",
                          }}
                        >
                          <Typography
                            fontSize={12}
                            fontWeight={400}
                            color="black"
                          >
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </Typography>
                        </Box>
                      ))}
                    </>
                  )}

                  <Box display="flex" justifyContent="flex-end" width="100%">
                    {mainSelect === "Personal" && (
                      <Box
                        display="flex"
                        alignItems={"center"}
                        paddingY={0.5}
                        paddingX={1}
                        borderRadius={1}
                        sx={{
                          cursor: "pointer",
                          backgroundColor: "#4C4DDC",
                          color: "white",
                          mr: 1,
                        }}
                      >
                        <CorporateFareIcon
                          sx={{ marginRight: 1, fontSize: 18 }}
                        />
                        <Typography fontSize={12} fontWeight={400}>
                          Tambah ke Departemen
                        </Typography>
                      </Box>
                    )}
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
                  </Box>
                </Stack>

                {/* File List */}
                <Stack direction={"column"} spacing={1}>
                  {documents.map((item) => (
                    <React.Fragment key={item.id}>
                      <Documents label={item.label} />
                    </React.Fragment>
                  ))}
                </Stack>
              </Stack>
            </Stack>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Dokumen;
