import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Stack,
  Typography,
  Autocomplete,
  TextField,
  Dialog,
  DialogContent,
  CircularProgress,
} from "@mui/material";
import ExpandIcon from "@mui/icons-material/ExpandMore";
import TrashIcon from "@mui/icons-material/DeleteOutlineOutlined";
import Documents from "../../../components/Sidebar/Documents";
import FolderPlusIcon from "@mui/icons-material/CreateNewFolderOutlined";
import { documents } from "../../../components/Sidebar/Documents/DocumentsConfig";
import InputSearchBar from "../../../components/Inputs/InputSearchBar";
import {
  deleteDepartmentlFile,
  deletePersonalFile,
  getDepartmentFile,
  getDepartmentList,
  searchFileDepartment,
  uploadDepartmentFile,
} from "../../../services";
import CustomSnackbar from "../../../components/CustomSnackbar";
import DeleteFile from "../../../components/Dialog/DeleteFile";
import { debounce } from "lodash";

const DepartemenOperator = ({ id }) => {
  const [departmentList, setDepartmentList] = useState([]);
  const departmentOptions = departmentList.map(([id, name, code]) => ({
    id,
    label: name,
    code,
  }));

  const [departemenSelected, setDepartmenSelected] = useState(false);
  const [departmentFile, setDepartmentFile] = useState([]);

  const [checkedItems, setCheckedItems] = useState({});
  const [selectedDepartmentid, setSelectedDepartmentid] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Loading");

  const [selectedUploadFiles, setSelectedUploadFiles] = useState([]);

  const [openTrash, setOpenTrash] = useState(false);

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

  const handleCheck = (idx, value) => {
    setCheckedItems((prev) => ({
      ...prev,
      [idx]: value,
    }));
  };

  const selectedFiles = Object.entries(checkedItems)
    .filter(([idx, isChecked]) => isChecked)
    .map(([idx]) => departmentFile.list_files[idx]);

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
    fetchDataFileDepartment(department.id);
  };

  const handleSummarize = async () => {
    const payload = {
      id: String(selectedDepartmentid),
      embedding_model: "nomic-embed-text",
      llm_model: "Llama 3.1",
      filename: selectedFiles?.map((file) => file?.name),
    };
    summarizeFileDepartment(payload)
      .then((res) => {
        console.log(res);
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
      const formData = new FormData();

      selectedUploadFiles.forEach((file) => {
        formData.append("files_upload", file);
      });
      //   formData.append("user_id", String(id));
      //   formData.append("dept_id", String(selectedDepartmentid));
      formData.append("id", String(selectedDepartmentid));
      uploadDepartmentFile(formData)
        .then((res) => {
          console.log("Upload berhasil:", res);
          setSelectedUploadFiles([]);
          fetchDataFileDepartment(selectedDepartmentid);
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
        id: String(selectedDepartmentid),
        filename: idx.name,
      };
      deleteDepartmentlFile(payload)
        .then((res) => {
          console.log("Berhasil Menghapus File:", res);
          setOpenTrash(false);
          setCheckedItems({});
          fetchDataFileDepartment(selectedDepartmentid);
          setIsLoading(false);
          openSnackbar("berhasil", "File berhasil dihapus!");
        })
        .catch((error) => {
          console.error("Gagal menghapus file:", error);
          openSnackbar("gagal", "File gagal dihapus!");
        });
    });
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
  
    const handleSearchFileDepartment = (e) => {
      console.log("Search value:", e.target.value, selectedDepartmentid);
      debouncedSearchFileDepartment(e.target.value, selectedDepartmentid);
    };
  return (
    <Stack
      direction="column"
      backgroundColor="white"
      height={"100%"}
      width={"100%"}
      alignItems="center"
      spacing={3}
    >
      <Box width="100%" textAlign="left">
        <Typography fontSize={18} fontWeight={700} color="#404040">
          Unggah Dokumen Departemen
        </Typography>
      </Box>
      <Autocomplete
        options={departmentOptions}
        sx={{
          width: "100%",
          boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.1)",
          borderRadius: 2,
          border: "2px solid #E0E0E0",
          "& .MuiOutlinedInput-root": {
            padding: 0,
            paddingX: 2,
            "& .MuiOutlinedInput-notchedOutline": {
              border: "none",
            },
          },
        }}
        renderInput={(params) => <TextField {...params} />}
        clearIcon={false}
        defaultValue={"Pilih Departemen"}
        popupIcon={<ExpandIcon />}
        onChange={(event, value) => {
          if (value) {
            setDepartmenSelected(true);
            getDepartment(value);
          }
        }}
      />
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
              paddingY: 1,
            }}
          >
            <Typography fontSize={16} fontWeight={600} color="#404040">
              {" "}
              File Departemen{" "}
            </Typography>
          </Box>
          {departemenSelected ? (
            <Stack direction={"column"} padding={1.5} spacing={1}>
            <InputSearchBar handleSearch={handleSearchFileDepartment} />
              <Stack direction={"row"} spacing={1} alignItems="center">
                <Box
                  width={"30%"}
                  display="flex"
                  justifyContent="center"
                  paddingY={0.3}
                  paddingX={0.7}
                  borderRadius={100}
                  border={"1px solid #9E9E9E"}
                  sx={{
                    backgroundColor: "#FAFBFD",
                    boxShadow: "none",
                  }}
                >
                  <Typography fontSize={12} fontWeight={400} color="black">
                    {" "}
                    File{" "}
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
                {departmentFile?.list_files?.map((item, idx) => (
                  <React.Fragment key={idx}>
                    <Documents
                      label={item.name}
                      checked={checkedItems[idx] || false}
                      onCheck={(val) => handleCheck(idx, val)}
                    />
                  </React.Fragment>
                ))}
              </Stack>
            </Stack>
          ) : (
            <Typography padding={2} fontSize={14} fontWeight={400} color="#404040">
              Silakan pilih departemen terlebih dahulu
            </Typography>
          )}
          
        </Stack>
      </Box>
      {/* <Stack
        width={"100%"}
        direction={"row"}
        spacing={1}
        justifyContent={"flex-end"}
        alignItems={"flex-end"}
      >
        <Box
          onClick={() => {
            handleSummarize();
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
      </Stack> */}

      <DeleteFile
        open={openTrash}
        onClose={() => setOpenTrash(false)}
        handleDelete={handleDeleteFile}
      />

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

export default DepartemenOperator;
