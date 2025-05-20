import React, { useState, useEffect } from "react";
import StorageIcon from '@mui/icons-material/Storage';
import { Stack, Radio, Typography, Accordion, AccordionSummary, AccordionDetails, Box } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Topics from "../Topics";
import { getTableDepartemen, getTablePersonal } from "../../../services";

const Index = ({ dept_id, id, label, selected, onSelect, status, setTableName }) => {
  const [expanded, setExpanded] = useState(false);
  const [selectedTableIndex, setSelectedTableIndex] = useState(null);
  const [tableList, setTableList] = useState(null);

  const handleSelectTable = (idx) => {
    setSelectedTableIndex(idx);
    if (tableList?.list_table && tableList.list_table[idx]) {
      setTableName(tableList.list_table[idx].name);
    }
  };

  const fetchTablePersonal = () => {
    getTablePersonal({
      id: String(id),
      db_name: label,
      keyword: "",
      page: 1,
      per_page: 10,
    })
      .then((res) => {
        setTableList(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

    const fetchTableDepartemen = () => {
    getTableDepartemen({
      id: String(dept_id),
      db_name: label,
      keyword: "",
      page: 1,
      per_page: 10,
    })
      .then((res) => {
        setTableList(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (status === "exist" && id) {
      fetchTablePersonal();
    } else if (status === "exist" && dept_id) {
      fetchTableDepartemen();
    }
  }, [status, id, dept_id, label]);

  useEffect(() => {
    if (!selected) {
      setExpanded(false);
      setSelectedTableIndex(null);
      setTableName(null);
    }
  }, [selected]);

  const handleClick = () => {
    onSelect();
    if (!selected) {
      setExpanded(true);
    }
  };

  const handleAccordionChange = (event, isExpanded) => {
    setExpanded(isExpanded);
  };

  return status !== "exist" ? (
    <Box paddingBottom={2}>
      <Stack
        direction="row"
        spacing={0.6}
        padding={0.5}
        borderRadius={4}
        alignItems="center"
        sx={{
          backgroundColor: selected ? "#EFEFEF" : "#F5F5F5",
          cursor: "pointer",
        }}
        onClick={onSelect}
      >
        <StorageIcon sx={{paddingLeft : 0.8, fontSize : 'medium'}}/>
        <Typography
          fontSize={14}
          fontWeight={selected ? 700 : 400}
          color="#404040"
          p={0.8}
          sx={{
            overflowWrap: "anywhere",
            wordBreak: "break-word",
            whiteSpace: "normal",
          }}
        >
          {label}
        </Typography>
      </Stack>
    </Box>
  ) : (
    <Accordion
      expanded={expanded && selected}
      onChange={handleAccordionChange}
      sx={{
        backgroundColor: selected ? "#EFEFEF" : "#F5F5F5",
        borderRadius: 4,
        '&:before': {
          display: 'none',
        },
        boxShadow: 'none',
        margin: '0 !important', 
        marginBottom: '8px !important',
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        sx={{
          paddingX: 0.8,
          paddingY: 0.5,
          minHeight: 'unset !important',
          '& .MuiAccordionSummary-content': {
            margin: '0 !important',
            alignItems: 'center',
          }
        }}
        onClick={handleClick}
      >
        <StorageIcon sx={{paddingLeft : 0.5, paddingRight : 0.6, fontSize : 'medium'}}/>
        <Typography
          fontSize={14}
          fontWeight={selected ? 700 : 400}
          color="#404040"
          p={0.8}
          sx={{
            overflowWrap: "anywhere",
            wordBreak: "break-word",
            whiteSpace: "normal",
          }}
        >
          {label}
        </Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ padding: '0 0 5px 0' }}>
        {tableList?.list_table?.map((item, idx) => (
          <Box paddingBottom={0} key={idx}>
            <Topics
              label={item.name}
              selected={selectedTableIndex === idx}
              onSelect={() => handleSelectTable(idx)}
              accord={true}
            />
          </Box>
        ))}
      </AccordionDetails>
    </Accordion>
  );
};

export default Index;