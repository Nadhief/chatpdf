import { Route, Routes } from "react-router-dom";
import "./App.css";
import Layout from "./pages/Layout";
import Login from "./pages/auth/Login";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
      </Routes>
      <Layout />
    </>
  );
}

export default App;
