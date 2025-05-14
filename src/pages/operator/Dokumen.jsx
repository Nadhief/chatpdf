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
  TablePagination,
} from "@mui/material";
import TrashIcon from "@mui/icons-material/DeleteOutlineOutlined";
import FolderPlusIcon from "@mui/icons-material/CreateNewFolderOutlined";
import CorporateFareIcon from "@mui/icons-material/CorporateFare";
import InputSearchBar from "../../components/Inputs/InputSearchBar";
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
  uploadJsonDept,
  uploadJsonPersonal,
  uploadImageDept,
  uploadImagePersonal,
  deleteJsonDept,
  deleteImageDept,
  deleteJsonPersonal,
  deleteImagePersonal,
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
  const [globalFiles, setGlobalFiles] = useState([]);

  const [checkedItems, setCheckedItems] = useState({});
  const [checkedItemsTopics, setCheckedItemsTopics] = useState({});
  const [checkedItemsFileDepartment, setCheckedItemsFileDepartment] = useState({});
  const [checkedItemsFileGlobal, setCheckedItemsFileGlobal] = useState({});

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [personalPage, setPersonalPage] = useState(0);
  const [personalRowsPerPage, setPersonalRowsPerPage] = useState(5);
  const [topicPage, setTopicPage] = useState(0);
  const [topicRowsPerPage, setTopicRowsPerPage] = useState(5);
  const [globalPage, setGlobalPage] = useState(0);
  const [globalRowsPerPage, setGlobalRowsPerPage] = useState(5);

  const [selectedDepartmentid, setSelectedDepartmentid] = useState(null);
  const [departmentFile, setDepartmentFile] = useState([]);



  const [searchQuery, setSearchQuery] = useState("");

  const selectedFiles = Object.values(checkedItems);

  const selectedTopic = Object.values(checkedItemsTopics);
  
  const selectedFileDepartment = Object.values(checkedItemsFileDepartment);

  const selectedFilesGlobal = Object.values(checkedItemsFileGlobal);

  useEffect(() => {
    if (mainSelect === "Personal") {
      if (selected === "file") {
        fetchDataFile(1, personalRowsPerPage);
      } else if (selected === "topik") {
        fetchDataTopics(1, topicRowsPerPage);
      }
    } else if (mainSelect === "Global") {
      fetchGlobalFiles(1, globalRowsPerPage);
    }
  }, [mainSelect, selected]);

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
    const globalIdx = personalPage * personalRowsPerPage + idx;
    const file = personalFiles.list_files[idx];
    
    setCheckedItems(prev => {
      if (value) {
        return { ...prev, [globalIdx]: file };
      } else {
        const newCheckedItems = { ...prev };
        delete newCheckedItems[globalIdx];
        return newCheckedItems;
      }
    });
  };

  const handleCheckTopic = (idx, value) => {
        const globalIdx = topicPage * topicRowsPerPage + idx;
    const file = personalTopics.list_files[idx];
    
    setCheckedItemsTopics(prev => {
      if (value) {
        return { ...prev, [globalIdx]: file };
      } else {
        const newCheckedItems = { ...prev };
        delete newCheckedItems[globalIdx];
        return newCheckedItems;
      }
    });
  };

  const handleCheckFileDepartment = (idx, value) => {
    const globalIdx = page * rowsPerPage + idx;
    const file = departmentFile.list_files[idx];
    
    setCheckedItemsFileDepartment(prev => {
      if (value) {
        return { ...prev, [globalIdx]: file };
      } else {
        const newCheckedItems = { ...prev };
        delete newCheckedItems[globalIdx];
        return newCheckedItems;
      }
    });
  };

  const handleCheckFileGlobal = (idx, value) => {
    const globalIdx = globalPage * globalRowsPerPage + idx;
    const file = globalFiles.list_files[idx];
    
    setCheckedItemsFileGlobal(prev => {
      if (value) {
        return { ...prev, [globalIdx]: file };
      } else {
        const newCheckedItems = { ...prev };
        delete newCheckedItems[globalIdx];
        return newCheckedItems;
      }
    });
  };

  const handlePersonalChangePage = (event, newPage) => {
    setPersonalPage(newPage);
    fetchDataFile(newPage + 1, personalRowsPerPage);
  };
  
  const handlePersonalChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setPersonalRowsPerPage(newRowsPerPage);
    setPersonalPage(0);
    fetchDataFile(1, newRowsPerPage);
  };

  const fetchDataFile = async (pageNum = 1, perPage = personalRowsPerPage) => {
    try {
      const data = await getPersonalFile({
        user_id: id,
        page: pageNum,
        per_page: perPage,
      });
      setPersonalFiles(data);
    } catch (error) {
      console.error("Gagal mengambil file personal:", error);
    }
  };  

  const fetchDataTopics = async (pageNum = 1, perPage = 5) => {
    try {
      const data = await getTopic({
        user_id: id,
        page: pageNum,
        per_page: perPage,
      });
      
      setPersonalTopics(data);
      
      if (!pageNum || pageNum === 1) {
        setSearchQuery("");
      }
    } catch (error) {
      console.error("Gagal mengambil topik:", error);
    }
  };

  const handleTopicChangePage = (event, newPage) => {
    setTopicPage(newPage);
    fetchDataTopics(newPage + 1, topicRowsPerPage);
  };
  
  const handleTopicChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setTopicRowsPerPage(newRowsPerPage);
    setTopicPage(0);
    fetchDataTopics(1, newRowsPerPage);
  };

  const handleMainDeptChange = (event) => {
    setMainSelect(event.target.value);
    if (event.target.value === "Global") {
      fetchGlobalFiles();
    }
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
    if (!selectedFile || selectedFile.length === 0) return;

    setIsLoading(true);
    setLoadingMessage("Sedang mengunggah file...");
    console.log("Uploading files:", selectedFile);

    const uploadPromises = selectedFile.map((file) => {
      const extension = file.name.split(".").pop().toLowerCase();
      const payload = {
        id: mainSelect === "Departemen" ? String(departmen) : String(id),
      };

      if (["pdf", "docx"].includes(extension)) {
        const formData = new FormData();
        formData.append("files_upload", file);
        formData.append("id", payload.id);
        return mainSelect === "Departemen"
          ? uploadDepartmentFile(formData)
          : uploadPersonalFile(formData);
      } else if (extension === "json") {
        payload.file_upload = file;
        return mainSelect === "Departemen"
          ? uploadJsonDept(payload)
          : uploadJsonPersonal(payload);
      } else if (["png", "jpg", "jpeg", "webp", "svg"].includes(extension)) {
        payload.image = file;
        return mainSelect === "Departemen"
          ? uploadImageDept(payload)
          : uploadImagePersonal(payload);
      } else {
        return Promise.reject(new Error(`Tipe file tidak didukung: ${extension}`));
      }
    });

    Promise.allSettled(uploadPromises).then((results) => {
      const allSuccess = results.every((res) => res.status === "fulfilled");

      setSelectedFile([]);
      setIsLoading(false);

      if (mainSelect === "Departemen") {
        fetchDataFileDepartment(departmen);
      } else {
        fetchDataFile();
      }

      if (allSuccess) {
        openSnackbar("berhasil", "Semua file berhasil diunggah!");
      } else {
        openSnackbar("gagal", "Beberapa file gagal diunggah. Cek konsol.");
        console.error("Detail kegagalan:", results);
      }
    });
  };
  
  const handleDeleteFile = () => {
    setIsLoading(true);
    setLoadingMessage("Sedang menghapus File...");

    const deletePromises = selectedFiles.map((file) => {
      const payload = {
        id: String(id),
        filename: file.name,
      };

      const extension = file.name.split(".").pop().toLowerCase();

      if (["pdf", "docx"].includes(extension)) {
        return deletePersonalFile(payload);
      } else if (extension === "json") {
        return deleteJsonPersonal(payload);
      } else if (["png", "jpg", "jpeg", "webp", "svg"].includes(extension)) {
        return deleteImagePersonal(payload);
      } else {
        return Promise.reject(new Error("Tipe file tidak didukung"));
      }
  });

    Promise.allSettled(deletePromises).then((results) => {
      const allSuccess = results.every((res) => res.status === "fulfilled");

      setOpenTrash(false);
      setCheckedItems({});
      fetchDataFile();
      setIsLoading(false);

      if (allSuccess) {
        openSnackbar("berhasil", "Semua file berhasil dihapus!");
      } else {
        openSnackbar("gagal", "Beberapa file gagal dihapus. Lihat konsol.");
        console.error("Detail kegagalan:", results);
      }
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

  useEffect(() => {
    if (departmen) {
      fetchDataFileDepartment(departmen, 1, rowsPerPage);
    }
  }, [departmen]);

  useEffect(() => {
    if (mainSelect === "Personal") {
      if (selected === "file") {
        fetchDataFile(1, personalRowsPerPage);
        setPersonalPage(0);
      } else if (selected === "topik") {
        fetchDataTopics(1, topicRowsPerPage);
        setTopicPage(0);
      }
    }
  }, [selected]);

  const fetchDepartmentList = async () => {
    try {
      const data = await getDepartmentList();
      setDepartmentList(data.response);
    } catch (error) {
      console.error("Gagal mengambil file personal:", error);
    }
  };

  const fetchDataFileDepartment = async (dept_id, pageNum = 1, perPage = rowsPerPage) => {
    try {
      const data = await getDepartmentFile({
        dept_id: String(dept_id),
        page: pageNum,
        per_page: perPage,
      });
      setDepartmentFile(data);
    } catch (error) {
      console.error("Gagal mengambil file departemen:", error);
    }
  };

  const handleDeptChangePage = (event, newPage) => {
    setPage(newPage);
    fetchDataFileDepartment(departmen, newPage + 1, rowsPerPage);
  };
  
  const handleDeptChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
    fetchDataFileDepartment(departmen, 1, newRowsPerPage);
  };

  const getDepartment = (department) => {
    setSelectedDepartmentid(department.id);
    setPage(0);
    fetchDataFileDepartment(department.id, 1, rowsPerPage);
  };

  const handleDeleteFileDepartment = () => {
    setIsLoading(true);
    setLoadingMessage("Sedang menghapus File...");

    const deletePromises = selectedFileDepartment.map((file) => {
      const payload = {
        id: String(id),
        filename: file.name,
      };

      const extension = file.name.split(".").pop().toLowerCase();

      if (["pdf", "docx"].includes(extension)) {
        return deleteDepartmentlFile(payload);
      } else if (extension === "json") {
        return deleteJsonDept(payload);
      } else if (["png", "jpg", "jpeg", "webp", "svg"].includes(extension)) {
        return deleteImageDept(payload);
      } else {
        return Promise.reject(new Error("Tipe file tidak didukung"));
      }
  });

    Promise.allSettled(deletePromises).then((results) => {
      const allSuccess = results.every((res) => res.status === "fulfilled");

      setOpenTrash(false);
      setCheckedItems({});
      fetchDataFile();
      setIsLoading(false);

      if (allSuccess) {
        openSnackbar("berhasil", "Semua file berhasil dihapus!");
      } else {
        openSnackbar("gagal", "Beberapa file gagal dihapus. Lihat konsol.");
        console.error("Detail kegagalan:", results);
      }
    });
  };

  const debouncedSearchGlobalFile = useMemo(
    () =>
      debounce((value) => {
        getGlobalFile({
          keyword: value, 
          page: 1,
          per_page: globalRowsPerPage,
        })
        .then((res) => {
          console.log("Global search result:", res.list_files);
          setGlobalFiles(res);
          setGlobalPage(0);
        })
        .catch((err) => {
          console.error("Global search error:", err);
        });
      }, 300),
    [globalRowsPerPage]
  );

  const debouncedSearchFilePersonal = useMemo(
    () =>
      debounce((value) => {
        searchFilePersonal({
          user_id: String(id),
          keywords: value,
          page: 1,
          per_page: personalRowsPerPage,
        })
          .then((res) => {
            console.log("Search result:", res.list_files);
            setPersonalFiles(res);
            setPersonalPage(0);           
          })
          .catch((err) => {
            console.error("Search error:", err);
          });
      }, 300),
    [id, personalRowsPerPage]
  );

  const handleSearchGlobalFile = (e) => {
    debouncedSearchGlobalFile(e.target.value);
  };
  
  const debouncedSearchFileDepartment = useMemo(
    () =>
      debounce((value, dept_id) => {
        setPage(0);

        searchFileDepartment({
          dept_id: String(dept_id),
          keywords: value,
          page: 1,
          per_page: rowsPerPage,
        })
        .then((res) => {
          console.log("Search result:", res.list_files);
          setDepartmentFile(res);       
        })
        .catch((err) => {
          console.error("Search error:", err);
        });
      }, 300),
    [rowsPerPage]
  );

  const debouncedSearchTopic = useMemo(
    () =>
      debounce((value) => {
        setSearchQuery(value);
        setTopicPage(0); // Reset to first page on new search
        
        if (value.trim() === "") {
          fetchDataTopics(1, topicRowsPerPage);
          return;
        }
        
        searchTopic({
          user_id: String(id),
          keywords: value,
          page: 1,
          per_page: topicRowsPerPage,
        })
          .then((res) => {
            // Transform the search response format to match the expected format
            if (res.results) {
              // Handle the search response format
              setPersonalTopics({
                ...res,
                list_files: res.results,
                total_files: res.total || res.results.length
              });
            } else {
              // In case the response is already in the expected formats
              setPersonalTopics(res);
            }
            setSelectedTopicIndex(null);
          })
          .catch((err) => {
            console.error("Search error:", err);
          });
      }, 300),
    [id, topicRowsPerPage]
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

  const handleGlobalChangePage = (event, newPage) => {
    setGlobalPage(newPage);
    fetchGlobalFiles(newPage + 1, globalRowsPerPage);
  };
  
  const handleGlobalChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setGlobalRowsPerPage(newRowsPerPage);
    setGlobalPage(0);
    fetchGlobalFiles(1, newRowsPerPage);
  };

  const fetchGlobalFiles = async (pageNum = 1, perPage = globalRowsPerPage) => {
    try {
      const data = await getGlobalFile({
        page: pageNum,
        per_page: perPage,
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
            
            fetchGlobalFiles()
              .then(() => {
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
            
            fetchGlobalFiles()
              .then(() => {
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

  console.log(selectedFilesGlobal, checkedItemsFileGlobal)
  
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
                  onClick={()=> setCheckedItemsFileDepartment([])}
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
          {mainSelect === "Personal" || (mainSelect === "Departemen" && departmen) ?
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
                    MB dengan ekstensi (PDF, JSON ,DOCX, PNG, JPG, JPEG, WEBP, SVG)
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
                        accept=".pdf, .json, .docx, .png, .jpg, .jpeg, .webp, .svg"
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
                          ? personalFiles?.list_files?.map((item, idx) => {
                              const globalIdx = personalPage * personalRowsPerPage + idx;
                              return (
                                <Documents
                                  key={idx}
                                  label={item.name}
                                  status={item.status}
                                  checked={checkedItems[globalIdx] || false}
                                  onCheck={(val) => handleCheckFile(idx, val)}
                                />
                              );
                          })
                          : selected === "topik"
                          ? personalTopics?.list_files?.map((item, idx) => {
                              const globalIdx = topicPage * topicRowsPerPage + idx;
                              return (
                                <Documents
                                  key={idx}
                                  label={item.topic_name}
                                  status={item.status}
                                  checked={checkedItemsTopics[globalIdx] || false}
                                  onCheck={(val) => handleCheckTopic(idx, val)}
                                />
                              );
                          })
                          : null}
                      </Stack>
                        ) : mainSelect === "Departemen" ? (
                          <Stack direction={"column"} spacing={1}>
                            {departmentFile?.list_files?.map((item, idx) => {
                              const globalIdx = page * rowsPerPage + idx;
                              return (
                                <Documents
                                  key={idx}
                                  label={item.name}
                                  status={item.status}
                                  checked={checkedItemsFileDepartment[globalIdx] || false}
                                  onCheck={(val) => handleCheckFileDepartment(idx, val)}
                                />
                              );
                            })}
                          </Stack>
                        ) : (
                          // Global Files
                          <Stack direction={"column"} spacing={1}>
                            {globalFiles?.list_files?.map((item, idx) => {
                              const globalIdx = globalPage * globalRowsPerPage + idx;
                              return (
                                <Documents
                                  key={idx}
                                  label={item.name}
                                  status={item.status}
                                  checked={checkedItemsFileGlobal[globalIdx] || false}
                                  onCheck={(val) => handleCheckFileGlobal(idx, val)}
                                />
                              );
                            })}
                          </Stack>
                        )}
                    {mainSelect === "Personal" && selected === "file" && (
                      <TablePagination
                        component="div"
                        count={personalFiles.total_files || 0}
                        page={personalPage}
                        onPageChange={handlePersonalChangePage}
                        rowsPerPage={personalRowsPerPage}
                        onRowsPerPageChange={handlePersonalChangeRowsPerPage}
                        rowsPerPageOptions={[5, 10, 25]}
                        labelRowsPerPage="Rows:"
                        sx={{ 
                          '.MuiTablePagination-selectLabel, .MuiTablePagination-select, .MuiTablePagination-selectIcon': {
                            fontSize: '12px',
                          },
                          '.MuiTablePagination-displayedRows': {
                            fontSize: '12px',
                          }
                        }}
                      />
                    )}
                    {mainSelect === "Personal" && selected === "topik" && (
                      <TablePagination
                        component="div"
                        count={personalTopics.total_files || 0}
                        page={topicPage}
                        onPageChange={handleTopicChangePage}
                        rowsPerPage={topicRowsPerPage}
                        onRowsPerPageChange={handleTopicChangeRowsPerPage}
                        rowsPerPageOptions={[5, 10, 25]}
                        labelRowsPerPage="Rows:"
                        sx={{ 
                          '.MuiTablePagination-selectLabel, .MuiTablePagination-select, .MuiTablePagination-selectIcon': {
                            fontSize: '12px',
                          },
                          '.MuiTablePagination-displayedRows': {
                            fontSize: '12px',
                          }
                        }}
                      />
                    )}
                    {mainSelect === "Departemen" && (
                      <TablePagination
                        component="div"
                        count={departmentFile.total_files || 0}
                        page={page}
                        onPageChange={handleDeptChangePage}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={handleDeptChangeRowsPerPage}
                        rowsPerPageOptions={[5, 10, 25]}
                        labelRowsPerPage="Rows:"
                        sx={{ 
                          '.MuiTablePagination-selectLabel, .MuiTablePagination-select, .MuiTablePagination-selectIcon': {
                            fontSize: '12px',
                          },
                          '.MuiTablePagination-displayedRows': {
                            fontSize: '12px',
                          }
                        }}
                      />
                    )}
                    {mainSelect === "Global" && (
                      <TablePagination
                        component="div"
                        count={globalFiles.total_files || 0}
                        page={globalPage}
                        onPageChange={handleGlobalChangePage}
                        rowsPerPage={globalRowsPerPage}
                        onRowsPerPageChange={handleGlobalChangeRowsPerPage}
                        rowsPerPageOptions={[5, 10, 25]}
                        labelRowsPerPage="Rows:"
                        sx={{ 
                          '.MuiTablePagination-selectLabel, .MuiTablePagination-select, .MuiTablePagination-selectIcon': {
                            fontSize: '12px',
                          },
                          '.MuiTablePagination-displayedRows': {
                            fontSize: '12px',
                          }
                        }}
                      />
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
