import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Stack,
  Dialog,
  DialogContent,
  CircularProgress,
} from "@mui/material";
import TrashIcon from "@mui/icons-material/DeleteOutlineOutlined";
import FolderPlusIcon from "@mui/icons-material/CreateNewFolderOutlined";
import CorporateFareIcon from "@mui/icons-material/CorporateFare";
import InputSearchBar from "../../components/Inputs/InputSearchBar";
import { documents } from "../../components/Sidebar/Documents/DocumentsConfig";
import Documents from "../../components/Sidebar/Documents";
import {
  deleteDepartmentlFile,
  deletePersonalFile,
  deleteTopic,
  getDepartmentFile,
  getDepartmentList,
  getPersonalFile,
  getTopic,
  uploadPersonalFile,
  uploadPersonalToDepartmentFile,
} from "../../services";
import CustomSnackbar from "../../components/CustomSnackbar";
import DeleteFile from "../../components/Dialog/DeleteFile";
import AddToDepartement from "../../components/Dialog/AddToDepartment";

const Dokumen = ({ id }) => {
  const [mainSelect, setMainSelect] = useState("Personal");
  // const [people, setPeople] = useState("");
  const [departmen, setDepartmen] = useState("");
  const [selected, setSelected] = useState("file");
  const [openPaper, setOpenPaper] = useState(false);
  const [openTrash, setOpenTrash] = useState(false);

  const [selectedFile, setSelectedFile] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Loading");

  const [personalFiles, setPersonalFiles] = useState([]);
  const [personalTopics, setPersonalTopics] = useState([]);

  const [checkedItems, setCheckedItems] = useState({});
  const [checkedItemsTopics, setCheckedItemsTopics] = useState({});
  const [checkedItemsFileDepartment, setCheckedItemsFileDepartment] = useState({});

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

  const handleCheckFile = (idx, value) => {
    setCheckedItems((prev) => ({
      ...prev,
      [idx]: value,
    }));
  };

  const handleCheckTopic = (idx, value) => {
    setCheckedItemsTopics((prev) => ({
      ...prev,
      [idx]: value,
    }));
  };

  const handleCheckFileDepartment = (idx, value) => {
    setCheckedItemsFileDepartment((prev) => ({
      ...prev,
      [idx]: value,
    }));
  };
  console.log("awikok", checkedItems)
  console.log("awikok", checkedItemsFileDepartment)
  const [selectedDepartmentid, setSelectedDepartmentid] = useState(null);
  const [departmentFile, setDepartmentFile] = useState([]);

  const selectedFiles = Object.entries(checkedItems)
    .filter(([idx, isChecked]) => isChecked)
    .map(([idx]) => personalFiles.list_files[idx]);

  const selectedTopic = Object.entries(checkedItemsTopics)
    .filter(([idx, isChecked]) => isChecked)
    .map(([idx]) => personalTopics.list_files[idx]);

    const selectedFileDepartment = Object.entries(checkedItemsFileDepartment)
    .filter(([idx, isChecked]) => isChecked)
    .map(([idx]) => departmentFile.list_files[idx]);

  useEffect(() => {
    fetchDataFile();
    fetchDataTopics();
  }, []);

  const fetchDataFile = async () => {
    try {
      const data = await getPersonalFile({
        user_id: id,
        page: 1,
        per_page: 10,
      });
      setPersonalFiles(data);
    } catch (error) {
      console.error("Gagal mengambil file personal:", error);
    }
  };

  const fetchDataTopics = async () => {
    try {
      const data = await getTopic({
        user_id: id,
      });
      setPersonalTopics(data);
    } catch (error) {
      console.error("Gagal mengambil topik:", error);
    }
  };

  const handleMainDeptChange = (event) => {
    setMainSelect(event.target.value);
  };

  const handleCancel = () => {
    setSelectedFile(null);
  };

  const handledepartmen = (event) => {
    setDepartmen(event.target.value);
    fetchDataFileDepartment(event.target.value);
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files || []);
    setSelectedFile(files);
  };

  const handleUploadPersonalFiles = () => {
    if (selectedFile) {
      setIsLoading(true);
      setLoadingMessage("Sedang mengunggah file...");
      console.log("Uploading files:", selectedFile);
      const formData = new FormData();
      formData.append("id", String(id));

      selectedFile.forEach((file) => {
        formData.append("files_upload", file);
      });
      uploadPersonalFile(formData)
        .then((res) => {
          console.log("Upload berhasil:", res);
          setSelectedFile([]);
          fetchDataFile();
          setIsLoading(false);
          openSnackbar("berhasil", "File berhasil diunggah!");
        })
        .catch((error) => {
          console.error("Gagal upload:", error);
          openSnackbar("gagal", "File gagal diunggah!");
          setIsLoading(false);
        });
    }
  };

  const handleDeleteFile = () => {
    setIsLoading(true);
    setLoadingMessage("Sedang menghapus File...");
    selectedFiles?.forEach((idx) => {
      const payload = {
        id: String(id),
        filename: idx.name,
      };
      deletePersonalFile(payload)
        .then((res) => {
          console.log("Berhasil Menghapus File:", res);
          setOpenTrash(false);
          setCheckedItems({});
          fetchDataFile();
          setIsLoading(false);
          openSnackbar("berhasil", "File berhasil dihapus!");
        })
        .catch((error) => {
          console.error("Gagal menghapus file:", error);
          openSnackbar("gagal", "File gagal dihapus!");
        });
    });
  };

  const handleDeleteTopic = (topic) => {
    // setIsLoading(true);
    const payload = {
      id: String(id),
      topic_name: selectedTopic?.[0]?.topic_name,
    };
    deleteTopic(payload)
      .then((res) => {
        console.log("Berhasil Menghapus topik:", res);
        setOpenTrash(false);
        setCheckedItemsTopics({});
        fetchDataTopics();
        setIsLoading(false);
        openSnackbar("berhasil", "Topik berhasil dihapus!");
      })
      .catch((error) => {
        console.error("Gagal menambahkan topik:", error);
        openSnackbar("gagal", "Topik gagal dihapus!");
      });
  };

  const handleSubmitToDepartment = () => {
    setIsLoading(true);
    setLoadingMessage("Sedang menambahkan topik...");
    const payload = {
      filename: selectedFiles?.map((file) => file?.name),
      user_id: String(id),
      dept_id: String(selectedDepartmentid),
    };
    uploadPersonalToDepartmentFile(payload)
      .then((res) => {
        console.log("Berhasil menambahkan topik:", res);
        setOpenPaper(false);
        setCheckedItemsTopics({});
        fetchDataTopics();
        setIsLoading(false);
        openSnackbar("berhasil", "Topik berhasil ditambah!");
      })
      .catch((error) => {
        console.error("Gagal menambahkan topik:", error);
        openSnackbar("gagal", "Topik gagal ditambah!");
      });
  };

  const [departmentList, setDepartmentList] = useState([]);
  const departmentOptions = departmentList.map(([id, name, code]) => ({
    id,
    label: name,
    code,
  }));


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



  const fetchDataFileDepartment = async (dept_id) => {
    console.log(dept_id);
    try {
      const data = await getDepartmentFile({
        dept_id: String(dept_id),
        page: 1,
        per_page: 10,
      });
      setDepartmentFile(data);
    } catch (error) {
      console.error("Gagal mengambil file personal:", error);
    }
  };

  const getDepartment = (department) => {
    setSelectedDepartmentid(department.id);
  };

  const handleDeleteFileDepartment = () => {
    setIsLoading(true);
    setLoadingMessage("Sedang menghapus File...");
    selectedFileDepartment?.forEach((idx) => {
      const payload = {
        id: String(departmen),
        filename: idx.name,
      };
      deleteDepartmentlFile(payload)
        .then((res) => {
          console.log("Berhasil Menghapus File:", res);
          setOpenTrash(false);
          setCheckedItems({});
          fetchDataFileDepartment(departmen);
          setIsLoading(false);
          openSnackbar("berhasil", "File berhasil dihapus!");
        })
        .catch((error) => {
          console.error("Gagal menghapus file:", error);
          openSnackbar("gagal", "File gagal dihapus!");
        });
    });
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
          {/* {mainSelect === "Personal" && (
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
          )} */}

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
                  {departmentOptions.map((dept) => (
                    <MenuItem key={dept.id} value={dept.id}>
                      {dept.label}
                    </MenuItem>
                  ))}
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
                {selectedFile?.length > 0 ? (
                  <Stack spacing={0.5}>
                    {selectedFile.map((file, index) => (
                      <Typography
                        key={index}
                        fontSize={12}
                        fontWeight={400}
                        color="#404040"
                      >
                        {file.name}
                      </Typography>
                    ))}
                  </Stack>
                ) : (
                  <Typography fontSize={12} fontWeight={400} color="#404040">
                    Total ukuran berkas yang dapat diproses adalah maksimal 200
                    MB dengan ekstensi (PDF, JSON)
                  </Typography>
                )}
                <Box display="flex" justifyContent="flex-end" width="100%">
                  {selectedFile?.length > 0 ? (
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
                      <Box
                        component="button"
                        onClick={handleUploadPersonalFiles}
                        sx={{
                          backgroundColor: "#4C4DDC",
                          color: "#fff",
                          borderRadius: 1,
                          fontSize: 12,
                          padding: "4px 12px",
                          cursor: "pointer",
                        }}
                      >
                        Unggah
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
                        accept=".pdf,.json"
                        hidden
                        onChange={handleFileUpload}
                      />
                    </Box>
                  )}
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
                  {mainSelect === "Personal"
                    ? "File Personal"
                    : "File Departemen"}
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
                    {mainSelect === "Personal" && selected === "file" && (
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
                        onClick={() => setOpenPaper(true)}
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
                      onClick={() => setOpenTrash(true)}
                    >
                      <TrashIcon sx={{ fontSize: 20 }} />
                    </Box>
                  </Box>
                </Stack>

                {/* File List */}
                {mainSelect === "Personal" ? (
                  <Stack direction={"column"} spacing={1}>
                    {selected === "file"
                      ? personalFiles?.list_files?.map((item, idx) => (
                          <Documents
                            key={idx}
                            label={item.name}
                            checked={checkedItems[idx] || false}
                            onCheck={(val) => handleCheckFile(idx, val)}
                            filter={selected}
                          />
                        ))
                      : selected === "topik"
                      ? personalTopics?.list_files?.map((item, idx) => (
                          <Documents
                            key={idx}
                            label={item.topic_name}
                            checked={checkedItemsTopics[idx] || false}
                            onCheck={(val) => handleCheckTopic(idx, val)}
                            filter={selected}
                          />
                        ))
                      : null}
                  </Stack>
                ) : (
                  <Stack direction={"column"} spacing={1}>
                    {departmentFile?.list_files?.map((item, idx) => (
                      <React.Fragment key={idx}>
                        <Documents
                          label={item.name}
                          checked={checkedItemsFileDepartment[idx] || false}
                          onCheck={(val) => handleCheckFileDepartment(idx, val)}
                        />
                      </React.Fragment>
                    ))}
                  </Stack>
                )}
              </Stack>
            </Stack>
          </Box>
        </Box>
      </Grid>
      <AddToDepartement
        open={openPaper}
        onClose={() => setOpenPaper(false)}
        handleSubmit={handleSubmitToDepartment}
        departmentOptions={departmentOptions}
        getDepartment={getDepartment}
      />
      {selected === "file" && mainSelect === "Personal" ? (
        <DeleteFile
          open={openTrash}
          onClose={() => setOpenTrash(false)}
          handleDelete={handleDeleteFile}
        />
      ) : selected === "topic" && mainSelect === "Personal" ? (
        <DeleteFile
          open={openTrash}
          onClose={() => setOpenTrash(false)}
          handleDelete={handleDeleteTopic}
        />
      ) : (
        <DeleteFile
          open={openTrash}
          onClose={() => setOpenTrash(false)}
          handleDelete={handleDeleteFileDepartment}
        />
      )}

      <Dialog
        open={isLoading}
        PaperProps={{ sx: { borderRadius: 2, textAlign: "center", p: 4 } }}
      >
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <CircularProgress />
          <Typography variant="body2" color="textSecondary">
            {loadingMessage}
          </Typography>
        </DialogContent>
      </Dialog>
      <CustomSnackbar
        open={snackbar.open}
        onClose={closeSnackbar}
        status={snackbar.status}
        message={snackbar.message}
      />
    </Grid>
  );
};

export default Dokumen;
