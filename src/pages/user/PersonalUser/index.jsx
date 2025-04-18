import React, { useEffect, useMemo } from "react";
import { useState } from "react";
import {
  Box,
  CircularProgress,
  Dialog,
  DialogContent,
  Stack,
  Typography,
} from "@mui/material";
import FolderPlusIcon from "@mui/icons-material/CreateNewFolderOutlined";
import TrashIcon from "@mui/icons-material/DeleteOutlineOutlined";
import Documents from "../../../components/Sidebar/Documents";
import { documents } from "../../../components/Sidebar/Documents/DocumentsConfig";
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
  searchFileDepartment,
  searchFilePersonal,
} from "../../../services";
import CustomSnackbar from "../../../components/CustomSnackbar";
import { debounce } from "lodash";
import Topics from "../../../components/Sidebar/Topics";

const PersonalUser = ({
  id,
  setResponseSummarize,
  setIsSummarize,
  selectedTopicc,
  setSelectedTopic,
  setTopicName,
  model,
  setModel,
  vectorizer,
  setVectorizer,
}) => {
  const [selected, setSelected] = useState("file");
  const [openPaper, setOpenPaper] = useState(false);
  const [openTrash, setOpenTrash] = useState(false);

  const [personalFiles, setPersonalFiles] = useState([]);
  const [personalTopics, setPersonalTopics] = useState([]);

  const [checkedItems, setCheckedItems] = useState({});
  const [selectedTopicIndex, setSelectedTopicIndex] = useState(null);

  const [selectedUploadFiles, setSelectedUploadFiles] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Loading");

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

  // Replace handleCheckTopic with handleSelectTopic
  const handleSelectTopic = (idx) => {
    setSelectedTopicIndex(idx);
    // If a topic is selected, set the topic name
    if (personalTopics.list_files && personalTopics.list_files[idx]) {
      setTopicName(personalTopics.list_files[idx].topic_name);
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

  useEffect(() => {
    fetchDataFile();
    fetchDataTopics();
  }, []);

  const fetchDataFile = async () => {
    try {
      const data = await getPersonalFile({
        user_id: id,
        page: 1,
        per_page: 20,
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
          console.log("Berhasil Menghapus File:", res);
          setOpenTrash(false);
          setSelectedUploadFiles([]);
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
        openSnackbar("gagal", "Topik gagal ditambah!");
      });
  };

  const handleDeleteTopic = () => {
    // setIsLoading(true);
    if (selectedTopic.length === 0) return;

    const payload = {
      id: String(id),
      topic_name: selectedTopic[0]?.topic_name,
    };
    deleteTopic(payload)
      .then((res) => {
        console.log("Berhasil Menghapus topik:", res);
        setOpenTrash(false);
        setSelectedTopicIndex([]); // Reset selected topic
        fetchDataTopics();
        setIsLoading(false);
        openSnackbar("berhasil", "Topik berhasil dihapus!");
      })
      .catch((error) => {
        console.error("Gagal menambahkan topik:", error);
        openSnackbar("gagal", "Topik gagal dihapus!");
      });
  };

  const handleSummarize = async () => {
    const payload = {
      id: String(id),
      embedding_model: vectorizer,
      llm_model: model,
      filename: selectedFiles?.map((file) => file?.name),
    };
    summarizeFilePersonal(payload)
      .then((res) => {
        setResponseSummarize(res);
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

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
            // Reset selected topic when search results change
            setSelectedTopicIndex(null);
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

  const handleSearchTopic = (e) => {
    debouncedSearchTopic(e.target.value);
  };

  const getSearchHandler = () => {
    if (selected === "file") return handleSearchFilePersonal;
    if (selected === "topik") return handleSearchTopic;
    return () => {};
  };

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
          lg: 'auto'
        },
        margin: '0 auto'
      }}
      spacing={3}
    >
      <Box width="100%" textAlign="left">
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
              File Saya
            </Typography>
          </Box>
          <Stack direction={"column"} padding={1.5} spacing={1}>
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
                  setSelectedTopicIndex([]);
                }}
                sx={{
                  cursor: selected === "file" ? "default" : "pointer",
                  backgroundColor: selected === "file" ? "#FAFBFD" : "white",
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
                }}
                sx={{
                  cursor: selected === "topik" ? "default" : "pointer",
                  backgroundColor: selected === "topik" ? "#FAFBFD" : "white",
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
                  {" "}
                  Topik{" "}
                </Typography>
              </Box>
              <Box
                display="flex"
                justifyContent="flex-end"
                width="100%"
                color="white"
              >
                <Box
                  display="flex"
                  justifyContent="flex-end"
                  color="white"
                  paddingY={0.7}
                  paddingX={0.7}
                  borderRadius={1}
                  sx={{
                    cursor: "pointer",
                    backgroundColor: "#CB3A31",
                  }}
                  onClick={() => setOpenTrash(true)}
                >
                  <TrashIcon sx={{ color: "white", fontSize: 20 }} />
                </Box>
              </Box>
            </Stack>
            <Stack direction={"column"} spacing={1}>
              {/*MAPPING FILE PDF*/}
              {selected === "file"
                ? personalFiles?.list_files?.map((item, idx) => (
                    <Documents
                      key={idx}
                      label={item.name}
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
            </Stack>
          </Stack>
        </Stack>
      </Box>
      <Stack
        width={"100%"}
        direction={"row"}
        spacing={1}
        justifyContent={"flex-end"}
        alignItems={"flex-end"}
      >
        {selectedFiles.length > 0 && (
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
            <AddIcon sx={{ color: "black", marginRight: 1, fontSize: 18 }} />
            <Typography fontSize={12} fontWeight={400}>
              {" "}
              Topik{" "}
            </Typography>
          </Box>
        )}

        {selectedTopicc === false && (
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
              {" "}
              Summarize{" "}
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
    </Stack>
  );
};

export default PersonalUser;
