import React, { useEffect, useState } from "react";
import { Box, Stack, Typography, Autocomplete, TextField } from "@mui/material";
import ExpandIcon from "@mui/icons-material/ExpandMore";
import TrashIcon from "@mui/icons-material/DeleteOutlineOutlined";
import Documents from "../../../components/Sidebar/Documents";
import { documents } from "../../../components/Sidebar/Documents/DocumentsConfig";
import InputSearchBar from "../../../components/Inputs/InputSearchBar";
import {
  getDepartmentFile,
  getDepartmentList,
  summarizeFileDepartment,
} from "../../../services";

const DepartemenUser = ({ id }) => {
  const [departmentList, setDepartmentList] = useState([]);
  const departmentOptions = departmentList.map(([id, name, code]) => ({
    id,
    label: name,
    code,
  }));

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

  return (
    <Stack
      direction="column"
      backgroundColor="white"
      height={"100%"}
      width={"100%"}
      alignItems="center"
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
        defaultValue={"Departemen"}
        popupIcon={<ExpandIcon />}
        onChange={(event, value) => {
          if (value) {
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
          <Stack direction={"column"} padding={1.5} spacing={1}>
            <InputSearchBar />
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
