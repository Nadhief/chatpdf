import { debounce } from "lodash";
import React, { useEffect, useMemo, useState, useRef } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { Grid, Box } from "@mui/material";
import Sidebar from "../components/Sidebar";
import ChatBox from "./Chatbox";
import Dokumen from "./operator/Dokumen";
import LogoSetting from "../components/LogoSetting";
import ManageDepartmen from "./admin/ManageDepartmen";
import ManageUser from "./admin/ManageUser";
import PDFViewer from "../components/PdfViewer";
import LoadingScreen from "../components/LoadingScreen/LoadingScreen";
import Database from "./admin/DatabasePersonal/Database";
import Table from "./admin/DatabasePersonal/Table";
import TableDetail from "./admin/DatabasePersonal/TableDetail";
import DatabaseDept from "./admin/DatabaseDepartment/Database";
import TableDept from "./admin/DatabaseDepartment/Table";
import TableDetailDept from "./admin/DatabaseDepartment/TableDetail";
import ChatBoxanalyst from "./Chatboxanalyst";
const Layout = () => {
  const logoUrl = import.meta.env.VITE_API_BASE_URL + "logo";

  let link =
    document.querySelector("link[rel*='icon']") ||
    document.createElement("link");
  link.type = "image/svg+xml";
  link.rel = "icon";
  link.href = logoUrl;

  document.getElementsByTagName("head")[0].appendChild(link);
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [selected, setSelected] = useState("personal");
  const [responseSummarize, setResponseSummarize] = useState(null);
  const [isSummarize, setIsSummarize] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(false);
  const [topicName, setTopicName] = useState("");
  const [tableName, setTableName] = useState("");
  const [deptID, setDeptID] = useState("");
  const [isViewPdf, setIsViewPdf] = useState(false);
  const [pdfSource, setPdfSource] = useState(null);
  const [type, setType] = useState("");
  const [isMenu, setIsMenu] = useState(false);

  const [model, setModel] = useState("Llama 3.1");
  const [vectorizer, setVectorizer] = useState("nomic-embed-text");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [historyId, setHistoryId] = useState(null);

  const [isHistory, setIsHistory] = useState(false);

  const [isCheckingUser, setIsCheckingUser] = useState(true);

  const [newChat, setNewChat] = useState(false);

  const sidebarRef = useRef(null);

  const [isAnalyst, setIsAnalyst] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isSidebarOpen && window.innerWidth < 1200) {
        if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
          const isAutocompleteElement =
            event.target.closest(".MuiAutocomplete-popper") ||
            event.target.closest(".MuiAutocomplete-listbox") ||
            event.target.closest(".MuiAutocomplete-option");

          if (!isAutocompleteElement) {
            setIsSidebarOpen(false);
          }
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isSidebarOpen]);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
    setIsCheckingUser(false);
  }, [location.pathname]);

  if (isCheckingUser) return <LoadingScreen />;
  if (!user) return null;

  return (
    <>
      <Grid
        container
        sx={{
          backgroundColor: "#EEF0F7",
          height: "100vh",
          width: "100vw",
          overflowX: "hidden",
        }}
      >
        {isSidebarOpen && window.innerWidth < 1200 && (
          <Box
            sx={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.3)",
              zIndex: 999,
            }}
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
        {/* sidebar */}
        <Grid
          item
          size={{ lg: isViewPdf ? 2.4 : 3 }}
          sx={{
            display: {
              xs: isSidebarOpen ? "block" : "none",
              sm: isSidebarOpen ? "block" : "none",
              md: isSidebarOpen ? "block" : "none",
              lg: "block",
            },
            position: {
              xs: isSidebarOpen ? "absolute" : "static",
              sm: isSidebarOpen ? "absolute" : "static",
              md: isSidebarOpen ? "absolute" : "static",
              lg: "static",
            },
            zIndex: 1000,
            height: "100vh",
            backgroundColor: "#EEF0F7",
          }}
          ref={sidebarRef}
        >
          <Sidebar
            dept_id={user?.department_id}
            role={user?.role?.toLowerCase()}
            id={user?.id}
            username={user?.username}
            selected={selected}
            setSelected={setSelected}
            setResponseSummarize={setResponseSummarize}
            setIsSummarize={setIsSummarize}
            selectedTopic={selectedTopic}
            setSelectedTopic={setSelectedTopic}
            setTopicName={setTopicName}
            setTableName={setTableName}
            setDeptID={setDeptID}
            setIsMenu={setIsMenu}
            model={model}
            vectorizer={vectorizer}
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
            setHistoryId={setHistoryId}
            historyId={historyId}
            setIsHistorys={setIsHistory}
            setNewChat={setNewChat}
            isAnalyst={isAnalyst}
            setIsAnalyst={setIsAnalyst}
          />
        </Grid>

        {/* content */}
        <Grid
          size={{ xs: 12, sm: 12, md: 12, lg: isViewPdf ? 5.2 : 9 }}
          sx={{ padding: "1rem" }}
        >
          {/* route user */}
          <Routes>
            <Route
              path="/coofisai"
              element={
                <ChatBox
                  role={user?.username}
                  id={user?.id}
                  selected={selected}
                  responseSummarize={responseSummarize}
                  setResponseSummarize={setResponseSummarize}
                  isSummarize={isSummarize}
                  setIsSummarize={setIsSummarize}
                  selectedTopic={selectedTopic}
                  topicName={topicName}
                  deptID={deptID}
                  setIsViewPdf={setIsViewPdf}
                  setPdfSource={setPdfSource}
                  setType={setType}
                  model={model}
                  setModel={setModel}
                  vectorizer={vectorizer}
                  setVectorizer={setVectorizer}
                  toggleSidebar={toggleSidebar}
                  isViewPdf={isViewPdf}
                  isHistory={isHistory}
                  newChat={newChat}
                  historyId={historyId}
                  setHistoryId={setHistoryId}
                />
              }
            />
            <Route
              path="/coofisanalyst"
              element={
                <ChatBoxanalyst
                  role={"User"}
                  id={user?.id}
                  selected={selected}
                  responseSummarize={responseSummarize}
                  setResponseSummarize={setResponseSummarize}
                  isSummarize={isSummarize}
                  setIsSummarize={setIsSummarize}
                  selectedTopic={selectedTopic}
                  topicName={topicName}
                  deptID={deptID}
                  setIsViewPdf={setIsViewPdf}
                  setPdfSource={setPdfSource}
                  setType={setType}
                  model={model}
                  setModel={setModel}
                  vectorizer={vectorizer}
                  setVectorizer={setVectorizer}
                  toggleSidebar={toggleSidebar}
                  isViewPdf={isViewPdf}
                  isHistory={isHistory}
                  newChat={newChat}
                  historyId={historyId}
                  setHistoryId={setHistoryId}
                  isAnalyst={isAnalyst}
                  setIsAnalyst={setIsAnalyst}
                  tableName={tableName}
                />
              }
            />
          </Routes>

          {/* route operator */}
          <Routes>
            <Route
              path="/operator/coofisai"
              element={
                <ChatBox
                  role={user?.username}
                  id={user?.id}
                  selected={selected}
                  responseSummarize={responseSummarize}
                  setResponseSummarize={setResponseSummarize}
                  isSummarize={isSummarize}
                  setIsSummarize={setIsSummarize}
                  selectedTopic={selectedTopic}
                  topicName={topicName}
                  deptID={deptID}
                  setIsViewPdf={setIsViewPdf}
                  setPdfSource={setPdfSource}
                  setType={setType}
                  model={model}
                  setModel={setModel}
                  vectorizer={vectorizer}
                  setVectorizer={setVectorizer}
                  toggleSidebar={toggleSidebar}
                  isViewPdf={isViewPdf}
                  isHistory={isHistory}
                  newChat={newChat}
                  historyId={historyId}
                  setHistoryId={setHistoryId}
                />
              }
            />
            <Route
              path="/operator/coofisanalyst"
              element={
                <ChatBoxanalyst
                  role={"Operator"}
                  id={user?.id}
                  selected={selected}
                  responseSummarize={responseSummarize}
                  setResponseSummarize={setResponseSummarize}
                  isSummarize={isSummarize}
                  setIsSummarize={setIsSummarize}
                  selectedTopic={selectedTopic}
                  topicName={topicName}
                  deptID={deptID}
                  setIsViewPdf={setIsViewPdf}
                  setPdfSource={setPdfSource}
                  setType={setType}
                  model={model}
                  setModel={setModel}
                  vectorizer={vectorizer}
                  setVectorizer={setVectorizer}
                  toggleSidebar={toggleSidebar}
                  isViewPdf={isViewPdf}
                  isHistory={isHistory}
                  newChat={newChat}
                  historyId={historyId}
                  setHistoryId={setHistoryId}
                  isAnalyst={isAnalyst}
                  setIsAnalyst={setIsAnalyst}
                  tableName={tableName}
                />
              }
            />
            <Route
              path="/operator/coofisai/dokumen"
              element={<Dokumen id={user?.id} toggleSidebar={toggleSidebar} />}
            />
            <Route
              path="/operator/coofisai/pengaturan"
              element={
                <LogoSetting id={user?.id} toggleSidebar={toggleSidebar} />
              }
            />
            <Route
              path="/operator/coofisai/database"
              element={<Database id={user?.id} toggleSidebar={toggleSidebar} />}
            />
            <Route
              path="/operator/coofisai/database/:name"
              element={<Table id={user?.id} toggleSidebar={toggleSidebar} />}
            />
            <Route
              path="/operator/coofisai/database/:name/:nameTable"
              element={
                <TableDetail id={user?.id} toggleSidebar={toggleSidebar} />
              }
            />
            <Route
              path="/operator/coofisai/database_dept"
              element={
                <DatabaseDept id={user?.id} toggleSidebar={toggleSidebar} />
              }
            />
            <Route
              path="/operator/coofisai/database_dept/:name/:deptId"
              element={
                <TableDept id={user?.id} toggleSidebar={toggleSidebar} />
              }
            />
            <Route
              path="/operator/coofisai/database_dept/:name/:deptId/:nameTable"
              element={
                <TableDetailDept id={user?.id} toggleSidebar={toggleSidebar} />
              }
            />
          </Routes>

          {/* route admin */}
          <Routes>
            <Route
              path="/admin/coofisai"
              element={
                <ChatBox
                  role={"Admin"}
                  id={user?.id}
                  selected={selected}
                  responseSummarize={responseSummarize}
                  setResponseSummarize={setResponseSummarize}
                  isSummarize={isSummarize}
                  setIsSummarize={setIsSummarize}
                  selectedTopic={selectedTopic}
                  topicName={topicName}
                  deptID={deptID}
                  setIsViewPdf={setIsViewPdf}
                  setPdfSource={setPdfSource}
                  setType={setType}
                  model={model}
                  setModel={setModel}
                  vectorizer={vectorizer}
                  setVectorizer={setVectorizer}
                  toggleSidebar={toggleSidebar}
                  isViewPdf={isViewPdf}
                  isHistory={isHistory}
                  newChat={newChat}
                  historyId={historyId}
                  setHistoryId={setHistoryId}
                />
              }
            />
            <Route
              path="/admin/coofisanalyst"
              element={
                <ChatBoxanalyst
                  role={"Admin"}
                  id={user?.id}
                  selected={selected}
                  responseSummarize={responseSummarize}
                  setResponseSummarize={setResponseSummarize}
                  isSummarize={isSummarize}
                  setIsSummarize={setIsSummarize}
                  selectedTopic={selectedTopic}
                  topicName={topicName}
                  deptID={deptID}
                  setIsViewPdf={setIsViewPdf}
                  setPdfSource={setPdfSource}
                  setType={setType}
                  model={model}
                  setModel={setModel}
                  vectorizer={vectorizer}
                  setVectorizer={setVectorizer}
                  toggleSidebar={toggleSidebar}
                  isViewPdf={isViewPdf}
                  isHistory={isHistory}
                  newChat={newChat}
                  historyId={historyId}
                  setHistoryId={setHistoryId}
                  isAnalyst={isAnalyst}
                  setIsAnalyst={setIsAnalyst}
                  tableName={tableName}
                />
              }
            />
            <Route
              path="/admin/coofisai/dokumen"
              element={<Dokumen id={user?.id} toggleSidebar={toggleSidebar} />}
            />
            <Route
              path="/admin/coofisai/manageuser"
              element={<ManageUser toggleSidebar={toggleSidebar} />}
            />
            <Route
              path="/admin/coofisai/managedepartment"
              element={<ManageDepartmen toggleSidebar={toggleSidebar} />}
            />
            <Route
              path="/admin/coofisai/pengaturan"
              element={
                <LogoSetting id={user?.id} toggleSidebar={toggleSidebar} />
              }
            />
            <Route
              path="/admin/coofisai/database"
              element={<Database id={user?.id} toggleSidebar={toggleSidebar} />}
            />
            <Route
              path="/admin/coofisai/database/:name"
              element={<Table id={user?.id} toggleSidebar={toggleSidebar} />}
            />
            <Route
              path="/admin/coofisai/database/:name/:nameTable"
              element={
                <TableDetail id={user?.id} toggleSidebar={toggleSidebar} />
              }
            />
            <Route
              path="/admin/coofisai/database_dept"
              element={
                <DatabaseDept id={user?.id} toggleSidebar={toggleSidebar} />
              }
            />
            <Route
              path="/admin/coofisai/database_dept/:name/:deptId"
              element={
                <TableDept id={user?.id} toggleSidebar={toggleSidebar} />
              }
            />
            <Route
              path="/admin/coofisai/database_dept/:name/:deptId/:nameTable"
              element={
                <TableDetailDept id={user?.id} toggleSidebar={toggleSidebar} />
              }
            />
          </Routes>
        </Grid>

        {/* pdf */}
        {isViewPdf && (
          <Grid
            size={{ xs: 12, sm: 12, md: 12, lg: 4.4 }}
            sx={{ backgroundColor: "#D8DAE5", padding: 0 }}
          >
            <PDFViewer
              id={user?.id}
              source={pdfSource}
              type={type}
              setIsViewPdf={setIsViewPdf}
              selected={selected}
              dept_id={deptID}
            />
          </Grid>
        )}
      </Grid>
    </>
  );
};

export default Layout;
