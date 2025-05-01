// DynamicTable.jsx
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

const DynamicTable = ({ columns, rows }) => {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell />
            {columns.map((col, idx) => (
              <TableCell key={idx} sx={{ fontWeight: "bold" }}>
                {col}
              </TableCell>
            ))}
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, i) => (
            <TableRow key={i}>
              <TableCell padding="checkbox">
                <input type="checkbox" />
              </TableCell>
              {columns.map((col, j) => (
                <TableCell key={j}>{row[col]}</TableCell>
              ))}
              <TableCell>
                <IconButton size="small">
                  <EditIcon fontSize="small" sx={{ color: "#2f68ff" }} />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DynamicTable;
