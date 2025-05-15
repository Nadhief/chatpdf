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
  uploadPersonalFile,
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
      fetchDataTopicsWithPagination(newPage + 1, topicRowsPerPage);
    }
  };

  const fetchDataTopicsWithPagination = async (pageNum = 1, perPage = 5) => {
    try {
      const data = await getTopic({
        user_id: id,
        page: pageNum,
        per_page: perPage,
      });

      if (data && data.list_files && Array.isArray(data.list_files)) {
        const startIndex = (pageNum - 1) * perPage;
        const endIndex = startIndex + perPage;

        const paginatedTopics = data.list_files.slice(startIndex, endIndex);

        const paginatedData = {
          ...data,
          list_files: paginatedTopics,
          total_files: data.total_files || data.list_files.length,
        };

        setPersonalTopics(paginatedData);
      } else {
        setPersonalTopics(data);
      }

      if (!pageNum || pageNum === 1) {
        setSearchQuery("");
      }
    } catch (error) {
      console.error("Gagal mengambil topik:", error);
    }
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
          // If the API returns all results, manually paginate them
          if (res && res.results && Array.isArray(res.results)) {
            const paginatedResults = res.results.slice(0, newRowsPerPage);

            setPersonalTopics((prev) => ({
              ...prev,
              list_files: paginatedResults,
              total_files: res.total || res.results.length,
            }));
          } else {
            setPersonalTopics((prev) => ({
              ...prev,
              list_files: res.results,
              total_files: res.total || res.results.length,
            }));
          }
        })
        .catch((err) => {
          console.error("Search error:", err);
        });
    } else {
      fetchDataTopicsWithPagination(1, newRowsPerPage);
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
    setCheckedItems((prev) => ({
      ...prev,
      [idx]: value,
    }));
  };

  const handleSelectTopic = (idx) => {
    setSelectedTopicIndex(idx);
    // If a topic is selected, set the topic name
    if (personalTopics.list_files && personalTopics.list_files[idx]) {
      setTopicName(personalTopics.list_files[idx].topic_name);
    }
  };

    const handleSelectDatabase = (idx) => {
    setSelectedTopicIndex(idx);
    // If a topic is selected, set the topic name
    if (databaseList.list_files && databaseList.list_files[idx]) {
      setTopicName(databaseList.list_files[idx].name);
    }
  };

  const selectedFiles = Object.entries(checkedItems)
    .filter(([idx, isChecked]) => isChecked)
    .map(([idx]) => personalFiles.list_files[idx]);

  // Get the selected topic (only one)
  const selectedTopic =
    selectedTopicIndex !== null && personalTopics.list_files
      ? [personalTopics.list_files[selectedTopicIndex]]
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

  const fetchDataTopics = async () => {
    fetchDataTopicsWithPagination(1, topicRowsPerPage);
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
      const formData = new FormData();
      formData.append("id", String(id));

      selectedUploadFiles.forEach((file) => {
        formData.append("files_upload", file);
      });
      uploadPersonalFile(formData)
        .then((res) => {
          console.log("Upload berhasil:", res);
          setSelectedUploadFiles([]);
          setCheckedItems({});
          fetchDataFile();
          setIsLoading(false);
          openSnackbar("berhasil", "File berhasil diunggah!");
        })
        .catch((error) => {
          console.error("Gagal upload:", error);
          setIsLoading(false);
          openSnackbar("gagal", "File gagal diunggah!");
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
          setOpenTrash(false);
          setSelectedUploadFiles([]);
          setCheckedItems({});
          fetchDataFile();
          setIsLoading(false);
          openSnackbar("berhasil", "File berhasil dihapus!");
        })
        .catch((error) => {
          console.error("Gagal menghapus file:", error);
          setIsLoading(false);
          openSnackbar("gagal", "File gagal dihapus!");
        });
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
  // Improved search function for files with pagination
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
            // Replace entire object to include total_files for pagination
            setPersonalFiles(res);
          })
          .catch((err) => {
            console.error("Search error:", err);
          });
      }, 300),
    [id, rowsPerPage]
  );

  // Improved search function for topics
  const debouncedSearchTopic = useMemo(
    () =>
      debounce((value) => {
        setSearchQuery(value);
        setTopicPage(0); // Reset to first page on new search

        if (value.trim() === "") {
          fetchDataTopicsWithPagination(1, topicRowsPerPage);
          return;
        }

        searchTopic({
          user_id: String(id),
          keywords: value,
          page: 1,
          per_page: topicRowsPerPage,
        })
          .then((res) => {
            console.log("Search result topics:", res);
            setPersonalTopics((prev) => ({
              ...prev,
              list_files: res.results,
              total_files: res.total || res.results.length,
            }));
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

  const [databaseList, setDatabaseList] = useState(null);

  const fetchDatabasePersonal = () => {
    getDatabasePersonal({
      user_id: String(id),
      keyword: "",
      page: 1,
      per_page: 10,
    })
      .then((res) => {
        setDatabaseList(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

   useEffect(() => {
    fetchDataFile();
    fetchDataTopics();
    fetchDatabasePersonal();
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
                  dengan ekstensi (PDF, JSON)
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
                      accept=".pdf,.json"
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
                      setSearchQuery(""); // Clear search when switching tabs
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
                <>
                  {databaseList?.list_files?.map((item, idx) => (
                    <Database
                      key={idx}
                      label={item.name}
                      status={item.status_table}
                      selected={selectedTopicIndex === idx}
                      onSelect={() => handleSelectDatabase(idx)}
                    />
                  ))}
                </>
              ) : (
                <>
                  {/*MAPPING FILE PDF*/}
                  {selected === "file"
                    ? personalFiles?.list_files?.map((item, idx) => (
                        <Documents
                          key={idx}
                          label={item.name}
                          status={item.status}
                          checked={checkedItems[idx] || false}
                          onCheck={(val) => handleCheckFile(idx, val)}
                        />
                      ))
                    : selected === "topik"
                    ? personalTopics?.list_files?.map((item, idx) => (
                        <Topics
                          key={idx}
                          label={item.topic_name}
                          selected={selectedTopicIndex === idx}
                          onSelect={() => handleSelectTopic(idx)}
                        />
                      ))
                    : null}
                </>
              )}
            </Stack>
          </Stack>
        </Stack>
      </Box>

      {!isAnalyst && (
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

            {selectedTopicc === false &&
              selected === "file" &&
              selectedFiles.length > 0 && (
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
