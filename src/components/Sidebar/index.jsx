import React from "react";
import { useState, useEffect } from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import { scrollbar } from "../../utils/scrollbar";
import AdminIcon from "@mui/icons-material/ManageAccountsOutlined";
import MailIcon from "@mui/icons-material/Mail";
import LogoutIcon from "@mui/icons-material/logout";
import Logo from "../../assets/ChatalizeLogo.svg";
import ProfilPict from "../../assets/malePict.svg";
import PersonalUser from "../../pages/user/PersonalUser";
import DepartemenUser from "../../pages/user/DepartemenUser";
import PersonalOperator from "../../pages/operator/PersonalOperator";
import DepartemenOperator from "../../pages/operator/DepartemenOperator";
import MenuOperator from "../../pages/operator/MenuOperator";
import MenuAdmin from "../../pages/admin/MenuAdmin";
import PersonalAdmin from "../../pages/admin/PersonalAdmin";
import DepartemenAdmin from "../../pages/admin/DepartemenAdmin";
import { useNavigate } from "react-router-dom";
import { getDepartmentName } from "../../services";

const Sidebar = ({
  dept_id,
  role,
  id,
  username,
  selected,
  setSelected,
  setResponseSummarize,
  setIsSummarize,
  selectedTopic,
  setSelectedTopic,
  setTopicName,
  setDeptID,
  setIsMenu,
}) => {
  const logoUrl = "http://localhost:8001/logo";

  const [departmentName, setDepartmentName] = useState("");

  const ismenu = localStorage.getItem("isMenu") === "true";

  const [itemSelected, setItemSelected] = useState("dokumen");
  const [settingPage, setSettingPage] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (dept_id) {
      console.log(dept_id);
      getDepartmentName(dept_id)
        .then((name) => {
          setDepartmentName(name || "Tidak diketahui");
        })
        .catch((error) => {
          console.error("Gagal memuat nama departemen:", error);
          setDepartmentName("Gagal memuat");
        });
    }
  }, [dept_id]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <Stack
      direction="column"
      backgroundColor="white"
      alignItems="center"
      spacing={2}
      padding={3}
      height={"93vh"}
      boxShadow={"5px 0px 10px rgba(0, 0, 0, 0.15)"}
      sx={{ ...scrollbar("#9E9E9E"), overflowX: "hidden", overflowY: "auto" }}
    >
      <Stack
        direction={"row"}
        spacing={3}
        width={"100%"}
        alignItems={"center"}
        justifyContent="flex-start"
      >
        <Box
          paddingX={1.5}
          paddingTop={1.2}
          paddingBottom={0.8}
          border={"2px solid #E0E0E0"}
          borderRadius={4}
          width={"fit-content"}
          boxShadow="0px 2px 4px rgba(0, 0, 0, 0.2)"
        >
          <Box
            component="img"
            src={logoUrl}
            alt="Logo"
            sx={{ width: "100%", height: "auto", maxWidth: 40 }}
          />
        </Box>
        <Typography fontSize={35} fontWeight={700}>
          Chatalize AI
        </Typography>
      </Stack>
      <Box justifyContent={"flex-start"} padding={2} width={"100%"}>
        <Stack direction="row" spacing={3} alignItems="center" width="100%">
          <Box
            component="img"
            src={ProfilPict}
            alt="Gambar"
            sx={{ width: 50, height: 50 }}
          />

          <Stack
            direction="column"
            alignItems="flex-start"
            justifyContent="flex-start"
          >
            <Typography variant="h6" fontWeight={600} color="#2E3A59">
              {username}
            </Typography>
            <Typography variant="body2" fontWeight={400} color="#A0A3B1">
              {departmentName}
            </Typography>
          </Stack>

          <Box sx={{ flexGrow: 1 }} />

          <Button
            variant="contained"
            sx={{ backgroundColor: "#BF2600" }}
            onClick={() => {
              localStorage.removeItem("chat_responses");
              handleLogout();
            }}
          >
            <LogoutIcon />
          </Button>
        </Stack>
      </Box>

      {ismenu ? (
        role === "operator" ? (
          <MenuOperator
            itemSelected={itemSelected}
            setItemSelected={setItemSelected}
            setSettingPage={setSettingPage}
            setIsMenu={setIsMenu}
          />
        ) : role === "admin" ? (
          <MenuAdmin
            itemSelected={itemSelected}
            setItemSelected={setItemSelected}
            setSettingPage={setSettingPage}
            setIsMenu={setIsMenu}
          />
        ) : null
      ) : (
        <>
          {role === "operator" ? (
            <Box width={"100%"} paddingRight={3} paddingLeft={1}>
              <Stack
                paddingY={0.8}
                borderRadius={2}
                direction={"row"}
                spacing={1}
                alignItems={"center"}
                justifyContent={"flex-start"}
                width={"100%"}
                paddingLeft={2}
                sx={{
                  cursor: "pointer",
                  transition: "background-color 0.3s",
                  "&:hover": {
                    backgroundColor: "#f5f5f5",
                  },
                  "&:hover .hover-color": {
                    color: "#EA001E",
                  },
                }}
                onClick={() => {
                  setSettingPage(true);
                  navigate("/operator/coofisai/dokumen");
                  setIsMenu(true);
                  localStorage.setItem("isMenu", "true");
                }}
              >
                <AdminIcon className="hover-color" sx={{ fontSize: 20 }} />
                <Typography
                  className="hover-color"
                  fontSize={20}
                  fontWeight={400}
                  color="#404040"
                >
                  Menu Operator
                </Typography>
              </Stack>
            </Box>
          ) : role === "admin" ? (
            <Box width={"100%"} paddingRight={3} paddingLeft={1}>
              <Stack
                paddingY={0.8}
                borderRadius={2}
                direction={"row"}
                spacing={1}
                alignItems={"center"}
                justifyContent={"flex-start"}
                width={"100%"}
                paddingLeft={2}
                sx={{
                  cursor: "pointer",
                  transition: "background-color 0.3s",
                  "&:hover": {
                    backgroundColor: "#f5f5f5",
                  },
                  "&:hover .hover-color": {
                    color: "#EA001E",
                  },
                }}
                onClick={() => {
                  setSettingPage(true);
                  navigate("/admin/coofisai/dokumen");
                  setIsMenu(true);
                  localStorage.setItem("isMenu", "true");
                }}
              >
                <AdminIcon className="hover-color" sx={{ fontSize: 20 }} />
                <Typography
                  className="hover-color"
                  fontSize={20}
                  fontWeight={400}
                  color="#404040"
                >
                  Menu Admin
                </Typography>
              </Stack>
            </Box>
          ) : null}
          {/* <Box width={"100%"} paddingRight={3} paddingLeft={1}>
            <Stack
              paddingBottom={0.8}
              borderRadius={2}
              direction={"row"}
              spacing={1}
              alignItems={"center"}
              justifyContent={"flex-start"}
              width={"100%"}
              paddingLeft={2}
              sx={{
                cursor: "pointer",
                transition: "background-color 0.3s",
                "&:hover": {
                  backgroundColor: "#f5f5f5",
                },
                "&:hover .hover-color": {
                  color: "#EA001E",
                },
              }}
              onClick={() => {

              }}
            >
              <MailIcon className="hover-color" sx={{ fontSize: 20 }} />
              <Typography
                className="hover-color"
                fontSize={20}
                fontWeight={400}
                color="#404040"
              >
                Surat Saya
              </Typography>
            </Stack>
          </Box> */}
          <Box
            width={"97%"}
            sx={{
              backgroundColor: "#EEF0F7",
              borderRadius: 10,
              border: "1px solid #E0E0E0",
              paddingY: 0.7,
              paddingX: 1,
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Box
                alignContent={"center"}
                justifyContent="center"
                width={"100%"}
                height={"100%"}
                display="flex"
                alignItems="center"
                sx={{
                  backgroundColor: selected === "personal" ? "white" : "none",
                  borderRadius: 10,
                  cursor: "pointer",
                  boxShadow:
                    selected === "personal"
                      ? "0px 2px 4px rgba(0, 0, 0, 0.1)"
                      : "none",
                  paddingY: 0.8,
                }}
                onClick={() => setSelected("personal")}
              >
                <Typography
                  color={selected === "personal" ? "black" : "#9E9E9E"}
                >
                  {" "}
                  Personal{" "}
                </Typography>
              </Box>
              <Box
                alignContent={"center"}
                justifyContent="center"
                width={"100%"}
                height={"100%"}
                display="flex"
                alignItems="center"
                sx={{
                  backgroundColor: selected === "departemen" ? "white" : "none",
                  borderRadius: 10,
                  cursor: "pointer",
                  boxShadow:
                    selected === "departemen"
                      ? "0px 2px 4px rgba(0, 0, 0, 0.1)"
                      : "none",
                  paddingY: 0.8,
                }}
                onClick={() => {
                  setSelected("departemen");
                  setSelectedTopic(false);
                }}
              >
                <Typography
                  color={selected === "departemen" ? "black" : "#9E9E9E"}
                >
                  {" "}
                  Departemen{" "}
                </Typography>
              </Box>
            </Stack>
          </Box>
          <Box width={"100%"} paddingTop={1}>
            {selected === "personal" ? (
              <PersonalUser
                id={id}
                setResponseSummarize={setResponseSummarize}
                setIsSummarize={setIsSummarize}
                selectedTopicc={selectedTopic}
                setSelectedTopic={setSelectedTopic}
                setTopicName={setTopicName}
              />
            ) : selected === "departemen" ? (
              role === "user" ? (
                <DepartemenUser
                  id={id}
                  setDeptID={setDeptID}
                  setResponseSummarize={setResponseSummarize}
                  setIsSummarize={setIsSummarize}
                />
              ) : role === "operator" || "admin" ? (
                <DepartemenOperator
                  id={id}
                  setDeptID={setDeptID}
                  setIsSummarize={setIsSummarize}
                  setResponseSummarize={setResponseSummarize}
                />
              ) : null
            ) : null}
          </Box>
        </>
      )}
    </Stack>
  );
};

export default Sidebar;
