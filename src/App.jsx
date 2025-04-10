import "./App.css";
import { Grid } from "@mui/material";
import Sidebar from "./components/Sidebar";

import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/Login";
import ChatBox from "./pages/Chatbox";
import Dokumenop from "./pages/operator/Dokumen";
import Dokumenadm from "./pages/admin/Dokumen";
import ManageDepartmen from "./pages/admin/ManageDepartmen";
import ManageUser from "./pages/admin/ManageUser";
import ChatOperator from "./pages/operator/ChatOperator";
import ChatAdmin from "./pages/admin/ChatAdmin";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        {/* <Route path="/user" element={<ChatUser />} /> */}
        <Route path="/admin" element={<ChatAdmin />} />
        <Route path="/operator" element={<ChatOperator />} />
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
          <Sidebar />
        </Grid>
        <Grid size={{ xs: 12, sm: 12, md: 12, lg: 9 }} sx={{ padding: "1rem" }}>
          {/* user */}
          <Routes>
            <Route path="/" element={<Navigate to="/coofisai" />} />
            <Route path="/coofisai" element={<ChatBox role={'User'} />} />
          </Routes>

          {/* operator */}
          <Routes>
            <Route path="/" element={<Navigate to="/operator/coofisai" />} />
            <Route path="/operator/coofisai" element={<ChatBox role={'Operator'} />} />
            <Route path="/operator/coofisai/dokumen" element={<Dokumenop />} />
          </Routes>

          {/* admin */}
          <Routes>
            <Route path="/" element={<Navigate to="/admin/coofisai" />} />
            <Route path="/admin/coofisai" element={<ChatBox role={'Admin'} />} />
            <Route path="/admin/coofisai/dokumen" element={<Dokumenadm />} />
            <Route path="/admin/coofisai/manageuser" element={<ManageUser />} />
            <Route path="/admin/coofisai/managedepartment" element={<ManageDepartmen />} />

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
