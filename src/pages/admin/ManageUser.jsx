import { Box, Button, Grid, Stack, Typography } from "@mui/material";
import React from "react";
import TrashIcon from "@mui/icons-material/DeleteOutlineOutlined";
import InputSearchBar from "../../components/Inputs/InputSearchBar";
import DataTable from "../../components/Table/DataTable";

const ManageUser = () => {
  return (
    <Grid
      sx={{
        height: "95vh",
        backgroundColor: "#fff",
        borderRadius: "10px",
        width: "100%",
      }}
      direction={"column"}
      justifyContent="spavce-between"
    >
      <Grid
        sx={{
          flex: 1,
          overflowY: "auto",
          mx: "auto",
          height: "100%",
          p: 3,
        }}
      >
        <Box
          sx={{
            mx: "auto",
            mb: 4,
            px: 1,
            maxWidth: "100%",
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            width="100%"
            sx={{ mb: 2 }}
          >
            <Box
              display="flex"
              alignItems={"center"}
              paddingY={0.7}
              paddingX={0.7}
              borderRadius={1}
              sx={{
                cursor: "pointer",
                backgroundColor: "#CB3A31",
                color: "white",
              }}
            >
              <TrashIcon sx={{ fontSize: 20 }} />
            </Box>
            <Button
              variant="contained"
              sx={{ backgroundColor: "#474D66", textTransform: "none" }}
            >
              + Add User
            </Button>
          </Box>
          <InputSearchBar />
        </Box>
        <DataTable />
      </Grid>
    </Grid>
  );
};

export default ManageUser;
