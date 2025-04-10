import "./App.css";
import { Grid } from "@mui/material";
import Sidebar from "./components/Sidebar";

import { Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import Chatpdf from "./pages/Chatpdf";
function App() {
  return (
    <>
      {/* <Routes>
        <Route path="/" element={<Chatpdf />} />
        <Route path="/login" element={<Login />} />
      </Routes> */}
      <Grid
        container
        sx={{
          backgroundColor: "#EEF0F7",
          height: "100vh",
          width: "100vw",
          overflowX: "hidden",
        }}
      >
        <Grid size={{ xs: 0, sm:0, md: 0, lg: 3 }} sx={{ alignItems: "start" }}>
          <Sidebar />
        </Grid>
        <Grid size={{ xs: 12, sm:0, md: 12, lg: 9 }} maxHeight={"100%"}>
          <Chatpdf /> 
        </Grid>
      </Grid>
    </>
  );
}

export default App;
