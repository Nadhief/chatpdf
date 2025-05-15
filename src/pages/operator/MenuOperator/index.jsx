import React, { useEffect } from "react";
import { Stack, Typography } from "@mui/material";
import StorageIcon from "@mui/icons-material/Storage";
import SettingIcon from "@mui/icons-material/SettingsOutlined";
import FileIcon from "@mui/icons-material/InsertDriveFileOutlined";
import ChatIcon from "@mui/icons-material/ChatOutlined";
import { useNavigate } from "react-router-dom";

const MenuOperator = ({
  itemSelected,
  setItemSelected,
  setSettingPage,
  setIsMenu,
  setIsSidebarOpen,
  isAnalyst,
  setIsAnalyst,
  setHistoryId,
}) => {
  const navigate = useNavigate();

  useEffect(() => {
    const savedSelection = localStorage.getItem("itemSelected");
    if (savedSelection) {
      setItemSelected(savedSelection);
    }
  }, [setItemSelected]);

  const MenuItem = ({ label, icon: Icon, selected, onClick }) => (
    <Stack
      spacing={1}
      direction={"row"}
      alignItems={"center"}
      sx={{
        cursor: "pointer",
        backgroundColor: selected ? "#F5F5F5" : "transparent",
        paddingY: 0.7,
        paddingX: 1.2,
        borderRadius: 2,
        transition: "all 0.3s",
        "&:hover": {
          backgroundColor: "#F5F5F5",
        },
        "&:hover .hover-color": {
          color: "#EA001E",
        },
      }}
      onClick={onClick}
    >
      <Icon
        className="hover-color"
        sx={{
          fontSize: 20,
          color: selected ? "#EA001E" : "#404040",
          transition: "color 0.3s",
        }}
      />
      <Typography
        className="hover-color"
        fontSize={20}
        fontWeight={400}
        color={selected ? "#EA001E" : "#404040"}
        sx={{ transition: "color 0.3s" }}
      >
        {label}
      </Typography>
    </Stack>
  );

  return (
    <Stack direction={"column"} width={"100%"} spacing={1.8}>
      <Typography fontSize={16} fontWeight={600} color="#404040">
        Menu Operator
      </Typography>

      <MenuItem
        label="Dokumen"
        icon={FileIcon}
        selected={itemSelected === "dokumen"}
        onClick={() => {
          setItemSelected("dokumen");
          localStorage.setItem("itemSelected", "dokumen");
          setIsSidebarOpen(false);
          navigate("/operator/coofisai/dokumen");
        }}
      />

      {/* <MenuItem
        label="Database"
        icon={StorageIcon}
        selected={itemSelected === 'daatabase'}
        onClick={() => {
          setItemSelected('database');
          localStorage.setItem('itemSelected', 'database');
          setIsSidebarOpen(false);
          navigate('/operator/coofisai/database');
        }}
      /> */}

      <MenuItem
        label="Pengaturan"
        icon={SettingIcon}
        selected={itemSelected === "pengaturan"}
        onClick={() => {
          setItemSelected("pengaturan");
          localStorage.setItem("itemSelected", "pengaturan");
          setIsSidebarOpen(false);
          navigate("/operator/coofisai/pengaturan");
        }}
      />

      <MenuItem
        label="Ask Chatalize AI Doc Assistant"
        icon={ChatIcon}
        selected={false}
        onClick={() => {
          setSettingPage(false);
          setItemSelected("dokumen");
          localStorage.setItem("itemSelected", "dokumen");
          navigate("/operator/coofisai");
          localStorage.setItem("isMenu", "false");
          setIsAnalyst(false);
          setHistoryId(null);
          localStorage.removeItem("chat_responses");
        }}
      />

      <MenuItem
        label="Ask Chatalize AI Data Analyst"
        icon={ChatIcon}
        selected={false}
        onClick={() => {
          setSettingPage(false);
          setItemSelected("dokumen");
          localStorage.setItem("itemSelected", "dokumen");
          navigate("/operator/coofisanalyst");
          localStorage.setItem("isMenu", "false");
          setIsAnalyst(true);
          setHistoryId(null);
          localStorage.removeItem("chat_responses");
        }}
      />
    </Stack>
  );
};

export default MenuOperator;
