import React, { useEffect, useMemo, useState } from "react";
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
  IconButton,
} from "@mui/material";
import TrashIcon from "@mui/icons-material/DeleteOutlineOutlined";
import FolderPlusIcon from "@mui/icons-material/CreateNewFolderOutlined";
import CorporateFareIcon from "@mui/icons-material/CorporateFare";
import InputSearchBar from "../../components/Inputs/InputSearchBar";
import { documents } from "../../components/Sidebar/Documents/DocumentsConfig";
import Documents from "../../components/Sidebar/Documents";
import MenuIcon from "@mui/icons-material/Menu";
import {
  deleteDepartmentlFile,
  deletePersonalFile,
  deleteGlobalFile,
  deleteTopic,
  getDepartmentFile,
  getDepartmentList,
  getGlobalFile,
  getPersonalFile,
  getTopic,
  searchFileDepartment,
  searchFilePersonal,
  searchTopic,
  uploadDepartmentFile,
  uploadPersonalFile,
  uploadPersonalToDepartmentFile,
} from "../../services";
import CustomSnackbar from "../../components/CustomSnackbar";
import DeleteFile from "../../components/Dialog/DeleteFile";
import AddToDepartement from "../../components/Dialog/AddToDepartment";
import { debounce } from "lodash";

const Dokumen = ({ id, toggleSidebar }) => {
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
  const [checkedItemsFileDepartment, setCheckedItemsFileDepartment] = useState(
    {}
  );

  const [selectedDepartmentid, setSelectedDepartmentid] = useState(null);
  const [departmentFile, setDepartmentFile] = useState([]);

  const [globalFiles, setGlobalFiles] = useState([]);
  const [checkedItemsFileGlobal, setCheckedItemsFileGlobal] = useState({});

  const selectedFiles = Object.entries(checkedItems)
    .filter(([idx, isChecked]) => isChecked)
    .map(([idx]) => personalFiles?.list_files[idx]);

  const selectedTopic = Object.entries(checkedItemsTopics)
    .filter(([idx, isChecked]) => isChecked)
    .map(([idx]) => personalTopics?.list_files[idx]);

  const selectedFileDepartment = Object.entries(checkedItemsFileDepartment)
    .filter(([idx, isChecked]) => isChecked)
    .map(([idx]) => departmentFile?.list_files[idx]);

  useEffect(() => {
    fetchDataFile();
    fetchDataTopics();
  }, []);

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
    if (event.target.value === "Global") {
      fetchGlobalFiles();
    }
  };

  const handleCheckFileGlobal = (idx, value) => {
    setCheckedItemsFileGlobal((prev) => ({
      ...prev,
      [idx]: value,
    }));
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

  const handleUploadFile = () => {
    if (selectedFile) {
      setIsLoading(true);
      setLoadingMessage("Sedang mengunggah file...");
      console.log("Uploading files:", selectedFile);
      const formData = new FormData();

      selectedFile.forEach((file) => {
        formData.append("files_upload", file);
      });

      if (mainSelect === "Departemen") {
        formData.append("id", String(departmen));

        uploadDepartmentFile(formData)
          .then((res) => {
            console.log("Upload berhasil:", res);
            setSelectedFile([]);
            fetchDataFileDepartment(departmen);
            setIsLoading(false);
            openSnackbar("berhasil", "File berhasil diunggah!");
          })
          .catch((error) => {
            console.error("Gagal upload:", error);
            openSnackbar("gagal", "File gagal diunggah!");
            setIsLoading(false);
          });
      } else if (mainSelect === "Personal") {
        formData.append("id", String(id));

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
          fetchDataFile().then(() => {
            setIsLoading(false);
            openSnackbar("berhasil", "File berhasil dihapus!");
          });          
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
    setLoadingMessage("Sedang menambahkan file Personal ke Departemen...");
    const payload = {
      filename: selectedFiles?.map((file) => file?.name),
      user_id: String(id),
      dept_id: String(selectedDepartmentid),
    };
    uploadPersonalToDepartmentFile(payload)
      .then((res) => {
        console.log("Berhasil menambahkan file Personal ke Departemen:", res);
        setOpenPaper(false);
        setCheckedItemsTopics({});
        fetchDataTopics();
        setIsLoading(false);
        openSnackbar(
          "berhasil",
          "File Personal berhasil ditambah ke Departemen!"
        );
      })
      .catch((error) => {
        console.error("Gagal menambahkan File:", error);
        setIsLoading(false);
        openSnackbar("gagal", "File gagal ditambah!");
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

  const debouncedSearchGlobalFile = useMemo(
    () =>
      debounce((value) => {
        getGlobalFile({
          keyword: value, 
          page: 1,
          per_page: 10,
        })
        .then((res) => {
          console.log("Global search result:", res.list_files);
          setGlobalFiles(res); 
        })
        .catch((err) => {
          console.error("Global search error:", err);
        });
      }, 300),
    []
  );

  const debouncedSearchFilePersonal = useMemo(
    () =>
      debounce((value) => {
        searchFilePersonal({
          user_id: String(id),
          keywords: value,
          page: 1,
          per_page: 10,
        })
          .then((res) => {
            console.log("Search result:", res.list_files);
            setPersonalFiles((prev) => ({
              ...prev,
              list_files: res.list_files,
            }));            
          })
          .catch((err) => {
            console.error("Search error:", err);
          });
      }, 300),
    [id] 
  );

  const handleSearchGlobalFile = (e) => {
    debouncedSearchGlobalFile(e.target.value);
  };
  
  const debouncedSearchFileDepartment = useMemo(
    () =>
      debounce((value, dept_id) => {
        searchFileDepartment({
          dept_id: String(dept_id),
          keywords: value,
          page: 1,
          per_page: 10,
        })
        .then((res) => {
          console.log("Search result:", res.list_files);
          setDepartmentFile((prev) => ({
            ...prev,
            list_files: res.list_files,
          }));            
        })
        .catch((err) => {
          console.error("Search error:", err);
        });
      }, 300),
    []
  );

  const debouncedSearchTopic = useMemo(
    () =>
      debounce((value) => {
        searchTopic({
          user_id: String(id),
          keywords: value,
        })
        .then((res) => {
          console.log("Search result:", res.results);
          setPersonalTopics((prev) => ({
            ...prev,
            list_files: res.results,
          }));            
        })
        .catch((err) => {
          console.error("Search error:", err);
        });
      }, 300),
    []
  );

  const handleSearchFilePersonal = (e) => {
    debouncedSearchFilePersonal(e.target.value);
  };

  const handleSearchFileDepartment = (e) => {
    debouncedSearchFileDepartment(e.target.value, departmen);
  };

  const handleSearchTopic = (e) => {
    debouncedSearchTopic(e.target.value);
  };

  const getSearchHandler = () => {
    if (mainSelect === "Personal" && selected === "file")
      return handleSearchFilePersonal;
    if (mainSelect === "Departemen" && selected === "file")
      return handleSearchFileDepartment;
    if (mainSelect === "Personal" && selected === "topik")
      return handleSearchTopic;
    if (mainSelect === "Global" && selected === "file")
      return handleSearchGlobalFile;
    return () => {};
  };

  const fetchGlobalFiles = async () => {
    try {
      const data = await getGlobalFile({
        page: 1,
        per_page: 10,
      });
      setGlobalFiles(data);
      console.log("Global files:", data);
    } catch (error) {
      console.error("Gagal mengambil file global:", error);
    }
  };


  const handleDeleteFileGlobal = () => {
    setIsLoading(true);
    setLoadingMessage("Sedang menghapus File...");
    
    const selectedFilesGlobal = Object.entries(checkedItemsFileGlobal)
      .filter(([idx, isChecked]) => isChecked)
      .map(([idx]) => globalFiles?.list_files[idx]);
    
    let completedCount = 0;
    const totalFiles = selectedFilesGlobal?.length || 0;
    
    if (totalFiles === 0) {
      setIsLoading(false);
      return;
    }
    
    selectedFilesGlobal?.forEach((file) => {
      const payload = {
        filename: file.name,
      };
      
      deleteGlobalFile(payload)
        .then((res) => {
          console.log("Berhasil Menghapus File Global:", res);
          completedCount++;
          
          if (completedCount === totalFiles) {
            setOpenTrash(false);
            setCheckedItemsFileGlobal({});
            
            // First refresh global files
            fetchGlobalFiles()
              .then(() => {
                // Then refresh personal files
                return fetchDataFile();
              })
              .then(() => {
                setIsLoading(false);
                openSnackbar("berhasil", "File global berhasil dihapus!");
              });
          }
        })
        .catch((error) => {
          console.error("Gagal menghapus file global:", error);
          completedCount++;
          
          if (completedCount === totalFiles) {
            setOpenTrash(false);
            setCheckedItemsFileGlobal({});
            
            // First refresh global files
            fetchGlobalFiles()
              .then(() => {
                // Then refresh personal files
                return fetchDataFile();
              })
              .then(() => {
                setIsLoading(false);
                openSnackbar("gagal", "File global gagal dihapus!");
              });
          }
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
      <IconButton
        onClick={toggleSidebar}
        sx={{
          position: "absolute",
          top: 48,
          left: 22,
          zIndex: 100,
          display: { xs: "flex", sm: "flex", md: "flex", lg: "none" },
          backgroundColor: "#f0f0f0",
          "&:hover": {
            backgroundColor: "#e0e0e0",
          },
        }}
      >
        <MenuIcon />
      </IconButton>
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
                Personal / Departemen / Global
              </Typography>
            </Box>
            <FormControl fullWidth sx={{ mb: 4 }}>
              <InputLabel id="departemen-label">
                Personal / Departemen / Global
              </InputLabel>
              <Select
                labelId="departemen-label"
                value={mainSelect}
                onChange={handleMainDeptChange}
                label="Personal / Departemen"
              >
                <MenuItem value="Personal">Personal</MenuItem>
                <MenuItem value="Departemen">Departemen</MenuItem>
                <MenuItem value="Global">Global</MenuItem>
              </Select>
            </FormControl>
          </Box>

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
          {mainSelect === "Personal" || mainSelect === "Departemen" ?
            <Box sx={{ width: "100%", mb: 4 }}>
            <Box width="100%" textAlign="left" sx={{ mb: 2 }}>
              <Typography fontSize={18} fontWeight={700} color="#404040">
                Unggah Dokumen
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
                        onClick={handleUploadFile}
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
          : null}

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
                  : mainSelect === "Departemen"
                  ? "File Departemen"
                  : "File Global"}
                  </Typography>
                </Box>
                {mainSelect === "Departemen" && !departmen ? (
                  <Box sx={{ p: 3, textAlign: "left" }}>
                    <Typography fontSize={16} fontWeight={500} color="#404040">
                      Silakan pilih departemen terlebih dahulu
                    </Typography>
                  </Box>
                ) : (
                  <Stack direction={"column"} padding={1.5} spacing={1}>
                    <InputSearchBar handleSearch={getSearchHandler()} />
                    <Stack
                        direction={{ 
                          xs: "column",
                          sm: "column", 
                          md: "row",
                          lg: "row" 
                        }}
                        spacing={1.2}
                        alignItems="center"
                      >
                      {mainSelect === "Personal" ? (
                        <Stack direction={'row'} spacing={2} justifyContent="flex-start" >
                        {["file", "topik"].map((type) => (
                          <Box
                            key={type}
                            sx={{
                              borderRadius: 100,
                              border: selected === type ? "1px solid #EA001E" : "1px solid #9E9E9E",
                              cursor: "pointer",
                              backgroundColor: "white",
                              boxShadow: selected === type ? "none" : "0px 2px 4px rgba(0, 0, 0, 0.2)",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              minWidth: { xs: "80px", sm: "90px", md: "100px" }, // Responsive width
                              maxWidth: "100%",
                              padding: "0px 8px",
                              
                            }}
                            onClick={() => setSelected(type)}
                          >
                            <Typography
                              fontSize={{ xs: 12, sm: 13, md: 14 }} // Responsive font size
                              fontWeight={500}
                              color={selected === type ? "#EA001E" : "black"}
                              noWrap
                            >
                              {type.charAt(0).toUpperCase() + type.slice(1)}
                            </Typography>
                          </Box>
                        ))}
                      </Stack>
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

                      <Box display="flex" width="100%" sx={{
                        justifyContent: {
                          xs: "center",     
                          sm: "center",
                          md: "flex-end",  
                          lg: "flex-end"
                        }
                      }}>
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
                                status={item.status}
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
                        ) : mainSelect === "Departemen" ? (
                          <Stack direction={"column"} spacing={1}>
                            {departmentFile?.list_files?.map((item, idx) => (
                              <React.Fragment key={idx}>
                                <Documents
                                  label={item.name}
                                  status={item.status}
                                  checked={checkedItemsFileDepartment[idx] || false}
                                  onCheck={(val) => handleCheckFileDepartment(idx, val)}
                                />
                              </React.Fragment>
                            ))}
                          </Stack>
                        ) : (
                          // Global Files
                          <Stack direction={"column"} spacing={1}>
                            {globalFiles?.list_files?.map((item, idx) => (
                              <React.Fragment key={idx}>
                                <Documents
                                  label={item.name}
                                  status={item.status}
                                  checked={checkedItemsFileGlobal[idx] || false}
                                  onCheck={(val) => handleCheckFileGlobal(idx, val)}
                                />
                              </React.Fragment>
                            ))}
                          </Stack>
                        )}
                  </Stack>
                )}
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
      ) : selected === "topik" && mainSelect === "Personal" ? (
        <DeleteFile
          open={openTrash}
          onClose={() => setOpenTrash(false)}
          handleDelete={handleDeleteTopic}
        />
      ) : selected === "file" && mainSelect === "Departemen" ? (
        <DeleteFile
          open={openTrash}
          onClose={() => setOpenTrash(false)}
          handleDelete={handleDeleteFileDepartment}
        />
      ) : selected === "file" && mainSelect === "Global" ? (
        <DeleteFile
          open={openTrash}
          onClose={() => setOpenTrash(false)}
          handleDelete={handleDeleteFileGlobal}
        />
      ) : null}

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
