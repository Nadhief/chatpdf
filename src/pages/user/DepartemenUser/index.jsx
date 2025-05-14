import React, { useEffect, useMemo, useState } from "react";
import { Box, Stack, Typography, Autocomplete, TextField, TablePagination, } from "@mui/material";
import ExpandIcon from "@mui/icons-material/ExpandMore";
import TrashIcon from "@mui/icons-material/DeleteOutlineOutlined";
import Documents from "../../../components/Sidebar/Documents";
import { documents } from "../../../components/Sidebar/Documents/DocumentsConfig";
import InputSearchBar from "../../../components/Inputs/InputSearchBar";
import {
  getDepartmentFile,
  getDepartmentList,
  searchFileDepartment,
  summarizeFileDepartment,
} from "../../../services";
import { debounce } from "lodash";

const DepartemenUser = ({
  id,
  setDeptID,
  setResponseSummarize,
  setIsSummarize,
  historyId,
  setHistoryId,
  model,
  vectorizer
}) => {
  const [departmentList, setDepartmentList] = useState([]);
  const departmentOptions = departmentList.map(([id, name, code]) => ({
    id,
    label: name,
    code,
  }));
  
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [departemenSelected, setDepartmenSelected] = useState(false);
  const [departmentFile, setDepartmentFile] = useState([]);

  const [checkedItems, setCheckedItems] = useState({});
  const [selectedDepartmentid, setSelectedDepartmentid] = useState(null);

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
    setPage(0);
    fetchDataFileDepartment(department.id, 1, rowsPerPage);
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
          lg: "auto",
        },
        margin: "0 auto",
      }}
      spacing={1}
    >
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
                  ></Box>
                </Stack>
                <Stack direction={"column"} spacing={1}>
                  {/*MAPPING FILE PDF*/}
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
      {departmentFile?.list_files && (
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
    </Stack>
  );
};

export default DepartemenUser;
