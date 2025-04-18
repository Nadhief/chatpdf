import React, { useEffect, useMemo, useState } from "react";
import { Box, Stack, Typography, Autocomplete, TextField } from "@mui/material";
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
  model,
  setModel,
  vectorizer,
  setVectorizer,
}) => {
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
    setDeptID(department.id);
  };

  const handleSummarize = async () => {
    const payload = {
      id: String(selectedDepartmentid),
      embedding_model: vectorizer,
      llm_model: model,
      filename: selectedFiles?.map((file) => file?.name),
    };
    summarizeFileDepartment(payload)
      .then((res) => {
        setResponseSummarize(res);
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
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
    </Stack>
  );
};

export default DepartemenUser;
