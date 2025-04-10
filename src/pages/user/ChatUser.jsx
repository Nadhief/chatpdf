import { Grid } from '@mui/material'
import React from 'react'
import Sidebar from '../../components/Sidebar'
import Chatpdf from '../Chatbox'
import PdfViewer from '../../components/PdfViewer'

const ChatUser = () => {
  return (
    <Grid
        container
        sx={{
          backgroundColor: "#D8DAE5",
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
        <Grid size={{ xs: 12, sm: 12, md: 12, lg: 6 }} sx={{ padding: "1rem" }}>
          <Chatpdf />
        </Grid>
        <Grid
          size={{ xs: 12, sm: 12, md: 12, lg: 3 }}
          sx={{ padding: "1rem", backgroundColor: "#D8DAE5" }}
        >
          
          <PdfViewer/>
        </Grid>
      </Grid>
  )
}

export default ChatUser
