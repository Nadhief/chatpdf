import React, { useState } from 'react';
import { Stack, Checkbox, Typography } from '@mui/material';
import FileIcon from '@mui/icons-material/InsertDriveFileOutlined';

const Documents = ({ label }) => {
  const [checked, setChecked] = useState(false);

  const handleStackClick = () => {
    setChecked((prev) => !prev);
  };

  return (
    <Stack
      direction="row"
      spacing={0.6}
      padding={0.5}
      borderRadius={4}
      alignItems="center"
      sx={{
        backgroundColor: '#F5F5F5',
        cursor: 'pointer',
      }}
      onClick={handleStackClick}
    >
      <Checkbox
        checked={checked}
        onChange={handleStackClick}
        sx={{
          padding: 0.8,
          '&.Mui-checked': {
            color: '#bf2600',
          },
          '& .MuiSvgIcon-root': {
            fontSize: 16,
          },
        }}
        onClick={(e) => e.stopPropagation()}
      />
      <FileIcon sx={{ color: '#404040', fontSize: 20 }} />
      <Typography fontSize={12} fontWeight={400} color="#404040">
        {label}
      </Typography>
    </Stack>
  );
};

export default Documents;