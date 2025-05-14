import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

const DataColumn = ({
  data,
  setEditData,
  setSelectedEdit,
  setOpenDialogAddData,
  setSelectedItem,
  selectedItem
}) => {
  const handleCheckboxClick = (row) => {
    setSelectedItem((prev) => {
      const isSelected = prev.some((item) => item.id === row.id);
      if (isSelected) {
        return prev.filter((item) => item.id !== row.id);
      } else {
        return [...prev, row];
      }
    });
  };
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell />
            {data?.column_info?.map((col, idx) => (
              <TableCell key={idx} sx={{ fontWeight: "bold" }}>
                {col.name}
              </TableCell>
            ))}
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.list_data.map((row, i) => (
            <TableRow key={i}>
              <TableCell padding="checkbox">
                <input
                  type="checkbox"
                  // checked={selectedItem.some((item) => item.id === row.id)}
                  onClick={() => {
                    // handleCheckboxClick(row)
                    setSelectedItem(row)
                  }}
                />
              </TableCell>
              {data?.column_info?.map((col, j) => (
                <TableCell key={j}>{row[col.name]}</TableCell>
              ))}
              <TableCell>
                <IconButton
                  size="small"
                  onClick={() => {
                    setEditData(true);
                    setSelectedEdit(i);
                    setOpenDialogAddData(true);
                  }}
                >
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

export default DataColumn;
