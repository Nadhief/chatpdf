import "./App.css";
import { Grid } from "@mui/material";
import Sidebar from "./components/Sidebar";

import { Routes, Route, useLocation } from "react-router-dom";
import Login from "./pages/auth/Login";
import ChatBox from "./pages/Chatbox";
import Dokumen from "./pages/operator/Dokumen";
import ManageDepartmen from "./pages/admin/ManageDepartmen";
import ManageUser from "./pages/admin/ManageUser";
import { useEffect, useState } from "react";

function App() {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [selected, setSelected] = useState("personal");
  const [responseSummarize, setResponseSummarize] = useState(null);
  const [isSummarize, setIsSummarize] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(false);
  const [topicName, setTopicName] = useState("");
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
  }, [location.pathname]);
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
      </Routes>

      <Grid
        container
        sx={{
          backgroundColor: "#EEF0F7",
          height: "100vh",
          width: "100vw",
          overflowX: "hidden",
        }}
      >
        <Grid
          size={{ lg: 3 }}
          sx={{
            display: { xs: "none", sm: "none", md: "none", lg: "block" },
            alignItems: "start",
          }}
        >
          <Sidebar
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
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 12, md: 12, lg: 9 }} sx={{ padding: "1rem" }}>
          {/* user */}
          <Routes>
            <Route
              path="/coofisai"
              element={
                <ChatBox
                  role={"User"}
                  id={user?.id}
                  selected={selected}
                  responseSummarize={responseSummarize}
                  setResponseSummarize={setResponseSummarize}
                  isSummarize={isSummarize}
                  setIsSummarize={setIsSummarize}
                  selectedTopic={selectedTopic}
                  topicName={topicName}
                />
              }
            />
          </Routes>

          {/* operator */}
          <Routes>
            <Route
              path="/operator/coofisai"
              element={
                <ChatBox
                  role={"Operator"}
                  id={user?.id}
                  selected={selected}
                  responseSummarize={responseSummarize}
                  setResponseSummarize={setResponseSummarize}
                  isSummarize={isSummarize}
                  setIsSummarize={setIsSummarize}
                  selectedTopic={selectedTopic}
                  topicName={topicName}
                />
              }
            />
            <Route
              path="/operator/coofisai/dokumen"
              element={<Dokumen id={user?.id} />}
            />
          </Routes>

          {/* admin */}
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
                />
              }
            />
            <Route
              path="/admin/coofisai/dokumen"
              element={<Dokumen id={user?.id} />}
            />
            <Route path="/admin/coofisai/manageuser" element={<ManageUser />} />
            <Route
              path="/admin/coofisai/managedepartment"
              element={<ManageDepartmen />}
            />
          </Routes>
        </Grid>
        {/* <Grid
          size={{ xs: 12, sm: 12, md: 12, lg: 3 }}
          sx={{ padding: "1rem", backgroundColor: "#D8DAE5" }}
        >
          <PdfViewer />
        </Grid> */}
      </Grid>
    </>
  );
}

export default App;
