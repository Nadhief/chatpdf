import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";

const columns = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "Department", headerName: "Department", width: 130 },
  { field: "Nama Depan", headerName: "Nama Depan", width: 130 },
  { field: "Nama Belakang", headerName: "Nama Belakang", width: 90 },
  { field: "Gender", headerName: "Gender", width: 90 },
  { field: "Username", headerName: "Username", width: 90 },
  { field: "Tele Username", headerName: "Tele Username", width: 90 },
  { field: "Email", headerName: "Email", width: 90 },
  { field: "Phone", headerName: "Phone", width: 90 },
  { field: "Role", headerName: "Role", width: 90 },
];

const rows = [
  {
    id: 1,
    Department: "Finansial",
    "Nama Depan": "Budi",
    "Nama Belakang": "Handoko",
    Gender: "Male",
    Username: "budi",
    "Tele Username": "budi",
    Email: "budi@mail.id",
    Phone: "08192010109290",
    Role: "Operator",
  },
  {
    id: 2,
    Department: "Marketing",
    "Nama Depan": "Kirana",
    "Nama Belakang": "Kennedy",
    Gender: "Female",
    Username: "kirana",
    "Tele Username": "kirana",
    Email: "kirana@mail.id",
    Phone: "08192010109290",
    Role: "Admin",
  },
];

const paginationModel = { page: 0, pageSize: 5 };

export default function DataTable() {
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
