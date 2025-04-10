import "./App.css";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import ChatUser from "./pages/user/ChatUser";

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/user" element={<ChatUser />} />
        <Route path="/admin" element={<ChatUser />} />
        <Route path="/operator" element={<ChatUser />} />
      </Routes>
    </>
  );
}

export default App;
