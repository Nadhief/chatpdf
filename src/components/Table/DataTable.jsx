import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';

export default function DataTable({ userList, fetchUserList, selectedIds, setSelectedIds }) {
  const columns = [
    { field: "id", headerName: "ID", width: 110  },
    { field: "department_id", headerName: "ID Department", width: 110  },
    { field: "Department", headerName: "Department", width: 110  },
    { field: "Nama Depan", headerName: "Nama Depan", width: 110 },
    { field: "Nama Belakang", headerName: "Nama Belakang", width: 110},
    { field: "Gender", headerName: "Gender", width: 110},
    { field: "Username", headerName: "Username", width: 110},
    { field: "Email", headerName: "Email", width: 110},
    { field: "Phone", headerName: "Phone", width: 110},
    { field: "Role", headerName: "Role", width: 110},
    { field: "Status", headerName: "Status", width: 110},
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
  
  const userRow = userList.map((
    [id, department_id, Department, first_name, last_name, Gender, Username, Email, Phone, Role, Status]
  ) => ({
    id,
    department_id,
    Department,
    'Nama Depan': first_name,
    'Nama Belakang': last_name,
    Gender,
    Username,
    Email,
    Phone,
    Role,
    Status,
  }));
  
  const paginationModel = { page: 0, pageSize: 5 };

  return (
    <Paper sx={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={userRow}
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
