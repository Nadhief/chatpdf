import { debounce } from "lodash";
import React, { useEffect, useMemo, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { Grid } from "@mui/material";
import Sidebar from "../components/Sidebar";
import ChatBox from "./Chatbox";
import Dokumen from "./operator/Dokumen";
import LogoSetting from "../components/LogoSetting";
import ManageDepartmen from "./admin/ManageDepartmen";
import ManageUser from "./admin/ManageUser";
import PDFViewer from "../components/PdfViewer";
import LoadingScreen from "../components/LoadingScreen/LoadingScreen";

const Layout = () => {
  const logoUrl = "http://localhost:8001/logo";

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
  const [deptID, setDeptID] = useState("");
  const [isViewPdf, setIsViewPdf] = useState(false);
  const [pdfSource, setPdfSource] = useState(null);
  const [type, setType] = useState("");
  const [isMenu, setIsMenu] = useState(false);

  const [model, setModel] = useState("Llama 3.1");
  const [vectorizer, setVectorizer] = useState("nomic-embed-text");

  const [isCheckingUser, setIsCheckingUser] = useState(true);

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
        {isViewPdf ? (
          <>
            <Grid
              size={{ lg: 2.4 }}
              sx={{
                display: { xs: "none", sm: "none", md: "none", lg: "block" },
                alignItems: "start",
              }}
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
                setDeptID={setDeptID}
                setIsMenu={setIsMenu}
                model={model}
                setModel={setModel}
                vectorizer={vectorizer}
                setVectorizer
              />
            </Grid>
            <Grid
              size={{ xs: 12, sm: 12, md: 12, lg: 5.2 }}
              sx={{ padding: "1rem" }}
            >
              <Routes>
                <Route
                  path="/coofisai"
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
                    />
                  }
                />
              </Routes>

              <Routes>
                <Route
                  path="/operator/coofisai"
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
                    />
                  }
                />
                <Route
                  path="/operator/coofisai/dokumen"
                  element={<Dokumen id={user?.id} />}
                />
                <Route
                  path="/operator/coofisai/pengaturan"
                  element={<LogoSetting id={user?.id} />}
                />
              </Routes>

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
                    />
                  }
                />
                <Route
                  path="/admin/coofisai/dokumen"
                  element={<Dokumen id={user?.id} />}
                />
                <Route
                  path="/admin/coofisai/manageuser"
                  element={<ManageUser />}
                />
                <Route
                  path="/admin/coofisai/managedepartment"
                  element={<ManageDepartmen />}
                />
                <Route
                  path="/admin/coofisai/pengaturan"
                  element={<LogoSetting id={user?.id} />}
                />
              </Routes>
            </Grid>
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
          </>
        ) : (
          <>
            <Grid
              size={{ lg: 3 }}
              sx={{
                display: { xs: "none", sm: "none", md: "none", lg: "block" },
                alignItems: "start",
              }}
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
                setDeptID={setDeptID}
                setIsMenu={setIsMenu}
              />
            </Grid>
            <Grid
              size={{ xs: 12, sm: 12, md: 12, lg: 9 }}
              sx={{ padding: "1rem" }}
            >
              <Routes>
                <Route
                  path="/coofisai"
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
                    />
                  }
                />
              </Routes>

              <Routes>
                <Route
                  path="/operator/coofisai"
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
                    />
                  }
                />
                <Route
                  path="/operator/coofisai/dokumen"
                  element={<Dokumen id={user?.id} />}
                />
                <Route
                  path="/operator/coofisai/pengaturan"
                  element={<LogoSetting id={user?.id} />}
                />
              </Routes>

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
                    />
                  }
                />
                <Route
                  path="/admin/coofisai/dokumen"
                  element={<Dokumen id={user?.id} />}
                />
                <Route
                  path="/admin/coofisai/manageuser"
                  element={<ManageUser />}
                />
                <Route
                  path="/admin/coofisai/managedepartment"
                  element={<ManageDepartmen />}
                />
                <Route
                  path="/admin/coofisai/pengaturan"
                  element={<LogoSetting id={user?.id} />}
                />
              </Routes>
            </Grid>
          </>
        )}
      </Grid>
    </>
  );
};

export default Layout;
