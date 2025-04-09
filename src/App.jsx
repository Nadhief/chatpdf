import "./App.css";
import { Grid } from "@mui/material";
import Sidebar from "./components/Sidebar";

function App() {

  return (
    <Grid container sx={{ backgroundColor:"#EEF0F7", height: "100vh", width: "100vw", overflowX: 'hidden'}}>
      <Grid size={{md:3, lg:3}} sx={{ alignItems: "start" }}>          
        <Sidebar/>
      </Grid>
      <Grid size={{md:9, lg:9}} maxHeight={'100%'}>
        {/* ChatBox */}
      </Grid>
  </Grid>
  );
}

export default App;
