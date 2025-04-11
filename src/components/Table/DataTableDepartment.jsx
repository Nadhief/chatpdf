import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';

const columns = [
  { field: "Kode Department", headerName: "Kode Department", width: 500 },
  { field: "Nama Department", headerName: "Nama Department", width: 500 },
  {
    field: "Aksi",
    headerName: "",
    width: 60,
    renderCell: (params) => (
      <IconButton onClick={() => handleEdit(params.row)}>
        <EditIcon sx={{ color:"#3366FF" }} />
      </IconButton>
    ),
  },
];

const rows = [
  {
    id: 1,
    "Kode Department": "K01",
    "Nama Department": "IT",
  },
  {
    id: 2,
    "Kode Department": "K02",
    "Nama Department": "Finance",
  },
];

const paginationModel = { page: 0, pageSize: 5 };

export default function DataTableDepartment() {
  return (
    <Paper sx={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
        sx={{
          border: 0,
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#f5f5f5 !important",
            fontWeight: "bold",
          },
        }}
      />
    </Paper>
  );
}
