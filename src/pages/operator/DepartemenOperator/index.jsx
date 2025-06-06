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
  TablePagination,
} from "@mui/material";
import ExpandIcon from "@mui/icons-material/ExpandMore";
import TrashIcon from "@mui/icons-material/DeleteOutlineOutlined";
import Documents from "../../../components/Sidebar/Documents";
import FolderPlusIcon from "@mui/icons-material/CreateNewFolderOutlined";
import { documents } from "../../../components/Sidebar/Documents/DocumentsConfig";
import InputSearchBar from "../../../components/Inputs/InputSearchBar";
import Database from "../../../components/Sidebar/Database";
import {
  deleteDepartmentlFile,
  deleteImageDept,
  deleteJsonDept,
  deletePersonalFile,
  getDatabaseDepartemen,
  getDepartmentFile,
  getDepartmentList,
  searchFileDepartment,
  summarizeFileDepartment,
  uploadDepartmentFile,
  uploadDocxDept,
  uploadImageDept,
  uploadJsonDept,
} from "../../../services";
import CustomSnackbar from "../../../components/CustomSnackbar";
import DeleteFile from "../../../components/Dialog/DeleteFile";
import { debounce } from "lodash";

const DepartemenOperator = ({
  id,
  setDeptID,
  setIsSummarize,
  setResponseSummarize,
  historyId,
  setHistoryId,
  model,
  vectorizer,
  isAnalyst,
  setTableName,
  setTopicName
}) => {
  const [departmentList, setDepartmentList] = useState([]);
  const departmentOptions = departmentList.map(([id, name, code]) => ({
    id,
    label: name,
    code,
  }));

  const [databasePage, setDatabasePage] = useState(0);
  const [databaseRowsPerPage, setDatabaseRowsPerPage] = useState(5);
  const [selectedTopicIndex, setSelectedTopicIndex] = useState(null);
  const [databaseList, setDatabaseList] = useState(null);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

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
    const globalIdx = page * rowsPerPage + idx;
    const file = departmentFile.list_files[idx];
    
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

  const selectedFiles = Object.values(checkedItems);

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

  const fetchDatabaseDepartemen = (dept_id, pageNum = 1, perPage = 5) => {
    getDatabaseDepartemen({
      dept_id: String(dept_id),
      keyword: "",
      page: pageNum,
      per_page: perPage,
    })
      .then((res) => {
        setDatabaseList(res);
      })
      .catch((err) => {
        setDatabaseList(null);
        console.log(err);
      });
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

  const handleSelectDatabase = (idx) => {
    const globalIdx = databasePage * databaseRowsPerPage + idx;
    setSelectedTopicIndex(globalIdx);
    
    if (databaseList?.list_files && databaseList.list_files[idx]) {
      setTopicName(databaseList.list_files[idx].name);
    }
  };

  const handleChangeDatabasePage = (event, newPage) => {
    setDatabasePage(newPage);
    fetchDatabaseDepartemen(selectedDepartmentid, newPage + 1, databaseRowsPerPage);
  };

  const handleChangeDatabaseRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setDatabaseRowsPerPage(newRowsPerPage);
    setDatabasePage(0);
    fetchDatabaseDepartemen(selectedDepartmentid, 1, newRowsPerPage);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    fetchDataFileDepartment(selectedDepartmentid, newPage + 1, rowsPerPage);
  };
  
  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
    fetchDataFileDepartment(selectedDepartmentid, 1, newRowsPerPage);
  };    

  const getDepartment = (department) => {
    setSelectedDepartmentid(department.id);
    if (isAnalyst) {
      setDatabasePage(0);
      fetchDatabaseDepartemen(department.id, 1, databaseRowsPerPage);
    } else {
      setPage(0);
      fetchDataFileDepartment(department.id, 1, rowsPerPage);
    }
    setDeptID(department.id);
  };

  const handleSummarize = async () => {
    if (historyId) {
      const payload = {
        id: String(selectedDepartmentid),
        embedding_model: vectorizer,
        llm_model: model,
        filename: selectedFiles?.map((file) => file?.name),
        history_id: String(historyId),
      };
      summarizeFileDepartment(payload)
        .then((res) => {
          setResponseSummarize(res);
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      const payload = {
        id: String(selectedDepartmentid),
        embedding_model: vectorizer,
        llm_model: model,
        filename: selectedFiles?.map((file) => file?.name),
        history_id: "",
      };
      summarizeFileDepartment(payload)
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

  const handleSelectUploadFiles = (event) => {
    const files = Array.from(event.target.files || []);
    setSelectedUploadFiles(files);
  };

  const handleCancel = () => {
    setSelectedUploadFiles([]);
  };

  const handleUploadDepartmentFiles = () => {
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
          uploadFunction = uploadDepartmentFile;
        } else if (extension === "json") {
          formData.append("files_upload", file);
          uploadFunction = uploadJsonDept;
        } else if (["png", "jpg", "jpeg", "webp", "svg"].includes(extension)) {
          formData.append("image", file);
          uploadFunction = uploadImageDept;
        } else if (["docx"].includes(extension)) {
          formData.append("files_upload", file);
          uploadFunction = uploadDocxDept;
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
            console.log("Search result:", res);
            setDepartmentFile(res);
          })
          .catch((err) => {
            console.error("Search error:", err);
          });
      }, 300),
    [rowsPerPage]
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
      sx={{ 
        width: {
          xs: 260,
          sm: 260,
          md: 280,
          lg: 'auto'
        },
        margin: '0 auto'
      }}
      spacing={1}
    >
      {!isAnalyst && (
        <Box width="100%" textAlign="left" paddingBottom={1}>
          <Typography fontSize={18} fontWeight={700} color="#404040">
            Unggah Dokumen Departemen
          </Typography>
        </Box>
      )}
      <Stack width="100%" direction={"column"} spacing={3}>
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
              setCheckedItems([]);
            }
          }}
        />
        {departemenSelected && !isAnalyst ? (
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
                  Total ukuran berkas yang dapat diproses adalah maksimal 200 MB dengan ekstensi (PDF, JSON ,DOCX, PNG, JPG, JPEG, WEBP, SVG)
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
                      onClick={handleUploadDepartmentFiles}
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
                      accept=".pdf, .json, .docx, .png, .jpg, .jpeg, .webp, .svg"
                      hidden
                      onChange={handleSelectUploadFiles}
                    />
                  </Box>
                )}
              </Box>
            </Stack>
          </Box>
        ) : null}
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
                {isAnalyst ? (
                  "Database Departemen"
                ) : (
                  "File Departemen"
                )}
              </Typography>
            </Box>
            {departemenSelected ? (
              isAnalyst ? (
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
                  <Typography paddingLeft={2} fontSize={14} fontWeight={400} color="#404040" sx={{ py: 2 }}>
                    Tidak ada database
                  </Typography>
                )
              ) : (
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
                    {departmentFile?.list_files?.map((item, idx) => {
                      const globalIdx = page * rowsPerPage + idx;
                      return (
                        <Documents
                          key={idx}
                          label={item.name}
                          status={item.status}
                          checked={checkedItems[globalIdx] || false}
                          onCheck={(val) => handleCheck(idx, val)}
                        />
                      );
                    })}
                  </Stack>
                </Stack>
              )
            ) : (
              <Typography
                padding={2}
                fontSize={14}
                fontWeight={400}
                color="#404040"
              >
                Silakan pilih departemen terlebih dahulu
              </Typography>
            )}
          </Stack>
        </Box>
      </Stack>
      {(departmentFile?.list_files || databaseList?.list_files) && (
        isAnalyst ? (
          <TablePagination
            component="div"
            count={databaseList?.total_files || 0}
            page={databasePage}
            onPageChange={handleChangeDatabasePage}
            rowsPerPage={databaseRowsPerPage}
            onRowsPerPageChange={handleChangeDatabaseRowsPerPage}
            rowsPerPageOptions={[5, 10]}
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
        ) : (
          <TablePagination
            component="div"
            count={departmentFile.total_files || 0}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10]}
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
        )
      )}
      {selectedFiles.length !== 0 ? 
        <Stack
          width={"100%"}
          direction={"row"}
          spacing={1}
          justifyContent={"flex-end"}
          alignItems={"flex-end"}
        >
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
        </Stack>
      : null}

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
