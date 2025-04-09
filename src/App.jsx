import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Button, Typography } from "@mui/material";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        <Typography variant="h4" gutterBottom>
          Welcom to chat pdf
        </Typography>
        <Button variant="contained" color="primary">
          Button
        </Button>
      </div>
    </>
  );
}

export default App;
