import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  CircularProgress,
  Dialog,
  DialogContent,
  TablePagination,
  Stack,
  Typography,
} from "@mui/material";
import FolderPlusIcon from "@mui/icons-material/CreateNewFolderOutlined";
import TrashIcon from "@mui/icons-material/DeleteOutlineOutlined";
import Documents from "../../../components/Sidebar/Documents";
import Database from "../../../components/Sidebar/Database";
import GlobalIcon from "@mui/icons-material/Language";
import AddIcon from "@mui/icons-material/ControlPoint";
import InputSearchBar from "../../../components/Inputs/InputSearchBar";
import AddTopic from "../../../components/Dialog/AddTopic";
import DeleteFile from "../../../components/Dialog/DeleteFile";
import {
  createTopic,
  deleteTopic,
  getPersonalFile,
  getTopic,
  summarizeFilePersonal,
  deletePersonalFile,
  deleteImagePersonal,
  deleteJsonPersonal,
  uploadPersonalFile,
  uploadJsonPersonal,
  uploadImagePersonal,
  uploadDocxPersonal,
  searchTopic,
  searchFilePersonal,
  personalToGlobal,
  getDatabasePersonal,
} from "../../../services";
import CustomSnackbar from "../../../components/CustomSnackbar";
import { debounce } from "lodash";
import Topics from "../../../components/Sidebar/Topics";
import ConvertToGlobal from "../../../components/Dialog/ConvertToGlobal";

const PersonalUser = ({
  id,
  setResponseSummarize,
  setIsSummarize,
  selectedTopicc,
  setSelectedTopic,
  setTopicName,
  setTableName,
  historyId,
  setHistoryId,
  model,
  vectorizer,
  isAnalyst,
  setIsAnalyst,
}) => {
  const [selected, setSelected] = useState("file");
  const [openPaper, setOpenPaper] = useState(false);
  const [openTrash, setOpenTrash] = useState(false);
  const [openConvert, setOpenConvert] = useState(false);

  const [personalFiles, setPersonalFiles] = useState([]);
  const [personalTopics, setPersonalTopics] = useState([]);
  const [databaseList, setDatabaseList] = useState(null);

  const [checkedItems, setCheckedItems] = useState({});
  const [selectedTopicIndex, setSelectedTopicIndex] = useState(null);

  const [selectedUploadFiles, setSelectedUploadFiles] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Loading");

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");

  const [topicPage, setTopicPage] = useState(0);
  const [topicRowsPerPage, setTopicRowsPerPage] = useState(5);

  const [databasePage, setDatabasePage] = useState(0);
  const [databaseRowsPerPage, setDatabaseRowsPerPage] = useState(5);

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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    if (searchQuery && selected === "file") {
      searchFilePersonal({
        user_id: String(id),
        keywords: searchQuery,
        page: newPage + 1,
        per_page: rowsPerPage,
      })
        .then((res) => {
          setPersonalFiles(res);
        })
        .catch((err) => {
          console.error("Search error:", err);
        });
    } else {
      fetchDataFile(newPage + 1, rowsPerPage);
    }
  };

  const handleTopicChangePage = (event, newPage) => {
    setTopicPage(newPage);
    if (searchQuery && selected === "topik") {
      searchTopic({
        user_id: String(id),
        keywords: searchQuery,
        page: newPage + 1,
        per_page: topicRowsPerPage,
      })
        .then((res) => {
          setPersonalTopics((prev) => ({
            ...prev,
            list_files: res.results,
            total_files: res.total || res.results.length,
          }));
        })
        .catch((err) => {
          console.error("Search error:", err);
        });
    } else {
      fetchDataTopics(newPage + 1, topicRowsPerPage);
    }
  };

  const handleDatabaseChangePage = (event, newPage) => {
    setDatabasePage(newPage);
    fetchDatabasePersonal(newPage + 1, databaseRowsPerPage);
  };

  const handleDatabaseChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setDatabaseRowsPerPage(newRowsPerPage);
    setDatabasePage(0);
    fetchDatabasePersonal(1, newRowsPerPage);
  };

  const handleTopicChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setTopicRowsPerPage(newRowsPerPage);
    setTopicPage(0); // Reset to first page when changing rows per page

    if (searchQuery && selected === "topik") {
      searchTopic({
        user_id: String(id),
        keywords: searchQuery,
        page: 1, // Reset to first page
        per_page: newRowsPerPage,
      })
        .then((res) => {
          setPersonalTopics(res);
        })
        .catch((err) => {
          console.error("Search error:", err);
        });
    } else {
      fetchDataTopics(1, newRowsPerPage);
    }
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);

    if (searchQuery && selected === "file") {
      // If there's an active search, fetch search results with new rows per page
      searchFilePersonal({
        user_id: String(id),
        keywords: searchQuery,
        page: 1,
        per_page: newRowsPerPage,
      })
        .then((res) => {
          setPersonalFiles(res);
        })
        .catch((err) => {
          console.error("Search error:", err);
        });
    } else {
      // Otherwise fetch regular data with new rows per page
      fetchDataFile(1, newRowsPerPage);
    }
  };

const handleCheckFile = (idx, value) => {
    const globalIdx = page * rowsPerPage + idx;
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

  const handleSelectTopic = (idx) => {
    const globalIdx = topicPage * topicRowsPerPage + idx;
    
    setSelectedTopicIndex(globalIdx);
    
    if (personalTopics.list_files && personalTopics.list_files[idx]) {
      setTopicName(personalTopics.list_files[idx].topic_name);
    }
  };

  const handleSelectDatabase = (idx) => {
    const globalIdx = databasePage * databaseRowsPerPage + idx;
    setSelectedTopicIndex(globalIdx);
    
    if (databaseList?.list_files && databaseList.list_files[idx]) {
      setTopicName(databaseList.list_files[idx].name);
    }
  };

  const selectedFiles = Object.entries(checkedItems)
    .filter(([idx, isChecked]) => isChecked)
    .map(([idx]) => personalFiles.list_files[idx]);

  const selectedTopic = 
    selectedTopicIndex !== null
      ? (() => {
          const pageOfSelection = Math.floor(selectedTopicIndex / topicRowsPerPage);
          const indexInPage = selectedTopicIndex % topicRowsPerPage;
          
          if (pageOfSelection === topicPage &&
              personalTopics.list_files &&
              indexInPage < personalTopics.list_files.length) {
            return [personalTopics.list_files[indexInPage]];
          }
          return [];
        })()
    : [];

  const fetchDataFile = async (pageNum = 1, perPage = 5) => {
    try {
      const data = await getPersonalFile({
        user_id: id,
        page: pageNum,
        per_page: perPage,
      });
      setPersonalFiles(data);
      // Reset search query when fetching all files
      if (!pageNum || pageNum === 1) {
        setSearchQuery("");
      }
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

const fetchDatabasePersonal = (pageNum = 1, perPage = 5) => {
  getDatabasePersonal({
    user_id: String(id),
    keyword: "",
    page: pageNum,
    per_page: perPage,
  })
    .then((res) => {
      setDatabaseList(res);
    })
    .catch((err) => {
      console.log(err);
    });
};

  const handleSelectUploadFiles = (event) => {
    const files = Array.from(event.target.files || []);
    setSelectedUploadFiles(files);
  };

  const handleCancel = () => {
    setSelectedUploadFiles([]);
  };

  const handleUploadPersonalFiles = () => {
    if (selectedUploadFiles.length > 0) {
      setIsLoading(true);
      setLoadingMessage("Sedang mengunggah file...");
      console.log("Uploading files:", selectedUploadFiles);

      const uploadPromises = selectedUploadFiles.map((file) => {
        const extension = file.name.split(".").pop().toLowerCase();
        const formData = new FormData();
        formData.append("id", String(id));

        let uploadFunction;

        if (extension === "pdf") {
          formData.append("files_upload", file);
          uploadFunction = uploadPersonalFile;
        } else if (extension === "json") {
          formData.append("files_upload", file);
          uploadFunction = uploadJsonPersonal;
        } else if (["png", "jpg", "jpeg", "webp"].includes(extension)) {
          formData.append("image", file);
          uploadFunction = uploadImagePersonal;
        } else if (["docx"].includes(extension)) {
          formData.append("files_upload", file);
          uploadFunction = uploadDocxPersonal;
        } else {
          return Promise.reject(new Error(`Format tidak didukung: .${extension}`));
        }

        return uploadFunction(formData);
      });

      Promise.all(uploadPromises)
        .then((results) => {
          console.log("Upload berhasil:", results);
          setSelectedUploadFiles([]);
          setCheckedItems({});
          fetchDataFile();
          openSnackbar("berhasil", "Semua file berhasil diunggah!");
        })
        .catch((error) => {
          console.error("Gagal upload:", error);
          openSnackbar("gagal", "Beberapa atau semua file gagal diunggah!");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
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

  const handleSubmitTopic = (topic) => {
    setIsLoading(true);
    setLoadingMessage("Sedang menambahkan topik...");
    const payload = {
      files: selectedFiles?.map((file) => file?.name),
      user_id: String(id),
      topic: topic,
    };
    createTopic(payload)
      .then((res) => {
        console.log("Berhasil menambahkan topik:", res);
        setOpenPaper(false);
        setSelectedTopicIndex(null);
        setSelectedUploadFiles([]);
        setCheckedItems({});
        fetchDataTopics();
        setIsLoading(false);
        openSnackbar("berhasil", "Topik berhasil ditambah!");
      })
      .catch((error) => {
        console.error("Gagal menambahkan topik:", error);
        setIsLoading(false);
        openSnackbar("gagal", "Topik gagal ditambah!");
      });
  };

  const handleDeleteTopic = () => {
    if (selectedTopic.length === 0) return;

    setIsLoading(true);
    setLoadingMessage("Sedang menghapus Topik...");

    const payload = {
      id: String(id),
      topic_name: selectedTopic[0]?.topic_name,
    };
    deleteTopic(payload)
      .then((res) => {
        setOpenTrash(false);
        setSelectedTopicIndex(null); // Reset selected topic
        fetchDataTopics();
        setIsLoading(false);
        openSnackbar("berhasil", "Topik berhasil dihapus!");
      })
      .catch((error) => {
        console.error("Gagal menghapus topik:", error);
        setIsLoading(false);
        openSnackbar("gagal", "Topik gagal dihapus!");
      });
  };

  const handleSummarize = async () => {
    if (historyId) {
      const payload = {
        id: String(id),
        embedding_model: vectorizer,
        llm_model: model,
        filename: selectedFiles?.map((file) => file?.name),
        history_id: String(historyId),
      };
      summarizeFilePersonal(payload)
        .then((res) => {
          setResponseSummarize(res);
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      const payload = {
        id: String(id),
        embedding_model: vectorizer,
        llm_model: model,
        filename: selectedFiles?.map((file) => file?.name),
        history_id: "",
      };
      summarizeFilePersonal(payload)
        .then((res) => {
          setResponseSummarize(res);
          setHistoryId(res?.current_history_id);
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const debouncedSearchFilePersonal = useMemo(
    () =>
      debounce((value) => {
        setSearchQuery(value); // Store current search query
        setPage(0); // Reset to first page on new search

        if (value.trim() === "") {
          // If search is cleared, reset to regular data fetching
          fetchDataFile(1, rowsPerPage);
          return;
        }

        searchFilePersonal({
          user_id: String(id),
          keywords: value,
          page: 1, // Always start from page 1 for new searches
          per_page: rowsPerPage, // Use current rowsPerPage
        })
          .then((res) => {
            console.log("Search result:", res);
            setPersonalFiles(res);
          })
          .catch((err) => {
            console.error("Search error:", err);
          });
      }, 300),
    [id, rowsPerPage]
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
              // In case the response is already in the expected format
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

  const handleSearchTopic = (e) => {
    debouncedSearchTopic(e.target.value);
  };

  const getSearchHandler = () => {
    if (selected === "file") return handleSearchFilePersonal;
    if (selected === "topik") return handleSearchTopic;
    return () => {};
  };

  const handleConvertToGlobal = () => {
    setIsLoading(true);
    setLoadingMessage("Sedang mengubah file menjadi global...");

    const payload = {
      filename: selectedFiles.map((file) => file.name),
      user_id: String(id),
    };

    personalToGlobal(payload)
      .then((res) => {
        setOpenConvert(false);
        setSelectedUploadFiles([]);
        setCheckedItems({});
        fetchDataFile();
        setIsLoading(false);
        openSnackbar("berhasil", "File berhasil diubah menjadi global!");
      })
      .catch((error) => {
        console.error("Gagal mengubah file menjadi global:", error);
        setIsLoading(false);
        openSnackbar("gagal", "File gagal diubah menjadi global!");
      });
  };

   useEffect(() => {
    fetchDataFile();
    fetchDataTopics();
    fetchDatabasePersonal(1, databaseRowsPerPage);
  }, [isAnalyst]);

  return (
    <Stack
      direction="column"
      backgroundColor="white"
      height={"100%"}
      width={"100%"}
      alignItems="center"
      sx={{
        width: {
          xs: 260,
          sm: 260,
          md: 280,
          lg: "auto",
        },
        margin: "0 auto",
      }}
    >
      {!isAnalyst && (
        <>
          <Box width="100%" textAlign="left">
            <Typography
              paddingBottom={3}
              fontSize={18}
              fontWeight={700}
              color="#404040"
            >
              Unggah Dokumen Personal
            </Typography>
          </Box>
          <Box
            sx={{
              width: "100%",
              border: "2px solid #E5E6EF",
              borderRadius: "4px",
              backgroundColor: "#FAFBFD",
              mb: 3,
            }}
          >
          <Stack direction="column" padding={1.5} spacing={1}>
            <Typography fontSize={14} fontWeight={600} color="#404040">
              Unggah File
            </Typography>

            {selectedUploadFiles.length > 0 ? (
              <Stack spacing={0.5}>
                {selectedUploadFiles.map((file, index) => (
                  <Typography
                    key={index}
                    fontSize={12}
                    fontWeight={400}
                    color="#404040"
                    sx={{
                      overflowWrap: "anywhere",
                      wordBreak: "break-word",
                      whiteSpace: "normal",
                    }}
                  >
                    {file.name}
                  </Typography>
                ))}
              </Stack>
            ) : (
              <Typography fontSize={12} fontWeight={400} color="#404040">
                Total ukuran berkas yang dapat diproses adalah maksimal 200 MB
                dengan ekstensi (PDF, JSON ,DOCX, PNG, JPG, JPEG, WEBP)
              </Typography>
            )}

            <Box
              display="flex"
              justifyContent="flex-end"
              width="100%"
              color="white"
              gap={1}
            >
              {selectedUploadFiles.length > 0 ? (
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
                  htmlFor="upload-file"
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
                  <Typography fontSize={12} fontWeight={400}>
                    Pilih Berkas
                  </Typography>
                  <input
                    id="upload-file"
                    type="file"
                    accept=".pdf, .json, .docx, .png, .jpg, .jpeg, .webp"
                    hidden
                    onChange={handleSelectUploadFiles}
                  />
                </Box>
              )}
            </Box>
          </Stack>
          </Box>
        </>
      )}

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
            <Typography fontSize={16} fontWeight={600} color="#404040">
              {isAnalyst ? "Database Saya" : "File Saya"}
            </Typography>
          </Box>
          <Stack direction={"column"} padding={1.5} spacing={1}>
            {!isAnalyst && (
              <>
                <InputSearchBar handleSearch={getSearchHandler()} />
                <Stack direction={"row"} spacing={1} alignItems="center">
                  <Box
                    width={"30%"}
                    display="flex"
                    justifyContent="center"
                    paddingY={0.3}
                    paddingX={0.7}
                    borderRadius={100}
                    border={
                      selected === "file"
                        ? "1px solid #EA001E"
                        : "1px solid #9E9E9E"
                    }
                    onClick={() => {
                      setSelectedTopic(false);
                      setSelected("file");
                      setSelectedTopicIndex(null);
                      setSearchQuery(""); // Clear search when switching tabs
                      fetchDataFile();
                    }}
                    sx={{
                      cursor: selected === "file" ? "default" : "pointer",
                      backgroundColor:
                        selected === "file" ? "#FAFBFD" : "white",
                      boxShadow:
                        selected === "file"
                          ? "none"
                          : "0px 4px 8px rgba(0, 0, 0, 0.14)",
                    }}
                  >
                    <Typography
                      fontSize={12}
                      fontWeight={400}
                      color={selected === "file" ? "#EA001E" : "black"}
                    >
                      File
                    </Typography>
                  </Box>
                  <Box
                    width={"30%"}
                    display="flex"
                    justifyContent="center"
                    paddingY={0.3}
                    paddingX={0.7}
                    borderRadius={100}
                    border={
                      selected === "topik"
                        ? "1px solid #EA001E"
                        : "1px solid #9E9E9E"
                    }
                    onClick={() => {
                      setSelectedUploadFiles([]);
                      setCheckedItems({});
                      setSelectedTopic(true);
                      setSelected("topik");
                      setSearchQuery("");
                      fetchDataTopics();
                    }}
                    sx={{
                      cursor: selected === "topik" ? "default" : "pointer",
                      backgroundColor:
                        selected === "topik" ? "#FAFBFD" : "white",
                      boxShadow:
                        selected === "topik"
                          ? "none"
                          : "0px 4px 8px rgba(0, 0, 0, 0.14)",
                    }}
                  >
                    <Typography
                      fontSize={12}
                      fontWeight={400}
                      color={selected === "topik" ? "#EA001E" : "black"}
                    >
                      Topik
                    </Typography>
                  </Box>
                  <Box
                    display="flex"
                    justifyContent="flex-end"
                    width="100%"
                    color="white"
                    gap={1}
                  >
                    {selected === "file" ? (
                      <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        color="white"
                        paddingY={0.7}
                        paddingX={2}
                        borderRadius={2}
                        gap={0.7}
                        sx={{
                          cursor: "pointer",
                          backgroundColor: "#474D66",
                        }}
                        onClick={() => {
                          if (selectedFiles.length > 0) {
                            setOpenConvert(true);
                          } else {
                            alert("Pilih file terlebih dahulu!");
                          }
                        }}
                      >
                        <GlobalIcon sx={{ color: "white", fontSize: 16 }} />
                        <Typography fontSize={12}> Global </Typography>
                      </Box>
                    ) : null}

                    <Box
                      display="flex"
                      justifyContent="flex-end"
                      color="white"
                      paddingY={0.7}
                      paddingX={0.7}
                      borderRadius={2}
                      sx={{
                        cursor: "pointer",
                        backgroundColor: "#CB3A31",
                      }}
                      onClick={() => {
                        if (
                          (selected === "file" && selectedFiles.length > 0) ||
                          (selected === "topik" && selectedTopicIndex !== null)
                        ) {
                          setOpenTrash(true);
                        } else {
                          alert(
                            selected === "file"
                              ? "Pilih file terlebih dahulu!"
                              : "Pilih topik terlebih dahulu!"
                          );
                        }
                      }}
                    >
                      <TrashIcon sx={{ color: "white", fontSize: 20 }} />
                    </Box>
                  </Box>
                </Stack>
              </>
            )}
            <Stack direction={"column"} spacing={1}>
              {isAnalyst ? (
                databaseList?.list_files && databaseList.list_files.length > 0 ? (
                  <Stack direction={"column"} padding={1.5} spacing={1}>
                    <Stack direction={"column"} spacing={1}>
                      {databaseList.list_files.map((item, idx) => {
                        const globalIdx = databasePage * databaseRowsPerPage + idx;
                        return (
                          <Database
                            key={idx}
                            dept_id={selectedDepartmentid}
                            label={item.name}
                            status={item.status_table}
                            selected={selectedTopicIndex === globalIdx}
                            onSelect={() => handleSelectDatabase(idx)}
                            setTableName={setTableName}
                          />
                        );
                      })}
                    </Stack>
                  </Stack>
                ) : (
                  <Typography paddingLeft={0.5} fontSize={14} fontWeight={400} color="#404040" >
                    Tidak ada database
                  </Typography>
                )
              ) : (
                <>
              {/*MAPPING FILE PDF*/}
              {selected === "file"
                ? personalFiles?.list_files?.map((item, idx) => {
                    const globalIdx = page * rowsPerPage + idx;
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
                        <Topics
                          key={idx}
                          label={item.topic_name}
                          selected={selectedTopicIndex === globalIdx}
                          onSelect={() => handleSelectTopic(idx)}
                        />
                      );
                    })
                  : null}
                </>
              )}
            </Stack>
          </Stack>
        </Stack>
      </Box>

      {!isAnalyst ? (
        <>
          {selected === "file" && (
            <TablePagination
              component="div"
              count={personalFiles?.total_files || 0}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10]}
              labelRowsPerPage="Rows:"
              sx={{
                ".MuiTablePagination-selectLabel, .MuiTablePagination-select, .MuiTablePagination-selectIcon": {
                  fontSize: "12px",
                },
                ".MuiTablePagination-displayedRows": {
                  fontSize: "12px",
                },
              }}
            />
          )}

          {selected === "topik" && (
            <TablePagination
              component="div"
              count={personalTopics?.total_files || 0} // Use total_files for pagination count
              page={topicPage}
              onPageChange={handleTopicChangePage}
              rowsPerPage={topicRowsPerPage}
              onRowsPerPageChange={handleTopicChangeRowsPerPage}
              rowsPerPageOptions={[5, 10]}
              labelRowsPerPage="Rows:"
              sx={{
                ".MuiTablePagination-selectLabel, .MuiTablePagination-select, .MuiTablePagination-selectIcon":
                  {
                    fontSize: "12px",
                  },
                ".MuiTablePagination-displayedRows": {
                  fontSize: "12px",
                },
              }}
            />
          )}

          {/*Tombol +Topik dan Summarize*/}
          <Stack
            width={"100%"}
            direction={"row"}
            spacing={1}
            justifyContent={"flex-end"}
            alignItems={"flex-end"}
          >
            {selected === "file" && selectedFiles.length > 0 && (
              <Box
                display="flex"
                justifyContent="flex-end"
                color="black"
                paddingY={0.5}
                paddingX={1}
                borderRadius={1}
                alignItems={"center"}
                border={"1px solid #E0E0E0"}
                sx={{
                  cursor: "pointer",
                  backgroundColor: "white",
                }}
                onClick={() => setOpenPaper(true)}
              >
                <AddIcon
                  sx={{ color: "black", marginRight: 1, fontSize: 18 }}
                />
                <Typography fontSize={12} fontWeight={400}>
                  Topik
                </Typography>
              </Box>
            )}

            {selectedTopicc === false && selected === "file" && selectedFiles.length > 0 && selectedFiles.every(file => {
                const extension = file?.name?.split('.').pop().toLowerCase();
                return ['pdf', 'docx'].includes(extension);
              }) && (
              <Box
                onClick={() => {
                  handleSummarize();
                  setIsSummarize(true);
                }}
                color="white"
                paddingY={0.5}
                paddingX={1}
                borderRadius={1}
                alignItems={"center"}
                sx={{
                  cursor: "pointer",
                  backgroundColor: "#CB3A31",
                }}
              >
                <Typography fontSize={12} fontWeight={400}>
                  Summarize
                </Typography>
              </Box>
            )}
          </Stack>

          <AddTopic
            open={openPaper}
            onClose={() => setOpenPaper(false)}
            handleSubmit={handleSubmitTopic}
          />
          {selected === "file" ? (
            <DeleteFile
              open={openTrash}
              onClose={() => setOpenTrash(false)}
              handleDelete={handleDeleteFile}
            />
          ) : (
            <DeleteFile
              open={openTrash}
              onClose={() => setOpenTrash(false)}
              handleDelete={handleDeleteTopic}
            />
          )}
        </>
      ) : (
        databaseList && (
          <TablePagination
          component="div"
          count={databaseList?.total_files || 0}
          page={databasePage}
          onPageChange={handleDatabaseChangePage}
          rowsPerPage={databaseRowsPerPage}
          onRowsPerPageChange={handleDatabaseChangeRowsPerPage}
          rowsPerPageOptions={[5, 10]}
          labelRowsPerPage="Rows:"
          sx={{
            ".MuiTablePagination-selectLabel, .MuiTablePagination-select, .MuiTablePagination-selectIcon":
              {
                fontSize: "12px",
              },
            ".MuiTablePagination-displayedRows": {
              fontSize: "12px",
            },
          }}
        />
        )
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
      <ConvertToGlobal
        open={openConvert}
        onClose={() => setOpenConvert(false)}
        handleConvert={handleConvertToGlobal}
      />
      <CustomSnackbar
        open={snackbar.open}
        onClose={closeSnackbar}
        status={snackbar.status}
        message={snackbar.message}
      />
    </Stack>
  );
};

export default PersonalUser;
