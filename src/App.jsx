import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/Login";
import ChatUser from "./pages/user/ChatUser";
import ChatOperator from "./pages/operator/ChatOperator";
import ChatAdmin from "./pages/admin/ChatAdmin";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/user" element={<ChatUser />} />
        <Route path="/admin" element={<ChatAdmin />} />
        <Route path="/operator" element={<ChatOperator />} />
      </Routes>
    </>
  );
}

export default App;
