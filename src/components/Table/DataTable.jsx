import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';

const columns = [
  { field: "id", headerName: "ID", width: 110  },
  { field: "Department", headerName: "Department", width: 110  },
  { field: "Nama Depan", headerName: "Nama Depan", width: 110 },
  { field: "Nama Belakang", headerName: "Nama Belakang", width: 110},
  { field: "Gender", headerName: "Gender", width: 110},
  { field: "Username", headerName: "Username", width: 110},
  { field: "Tele Username", headerName: "Tele Username", width: 110},
  { field: "Email", headerName: "Email", width: 110},
  { field: "Phone", headerName: "Phone", width: 110},
  { field: "Role", headerName: "Role", width: 110},
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
