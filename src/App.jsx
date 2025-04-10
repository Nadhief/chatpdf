import "./App.css";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import Chatpdf from "./pages/Chatpdf";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Chatpdf />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default App;
