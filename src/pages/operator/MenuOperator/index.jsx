import React from 'react';
import { Stack, Typography } from '@mui/material';
import SettingIcon from '@mui/icons-material/SettingsOutlined';
import FileIcon from '@mui/icons-material/InsertDriveFileOutlined';
import ChatIcon from '@mui/icons-material/ChatOutlined';
import { useNavigate } from 'react-router-dom';

const MenuOperator = ({ itemSelected, setItemSelected, setSettingPage }) => {
  const navigate = useNavigate();

  const MenuItem = ({ label, icon: Icon, selected, onClick }) => (
    <Stack
      spacing={1}
      direction={'row'}
      alignItems={'center'}
      sx={{
        cursor: 'pointer',
        backgroundColor: selected ? '#F5F5F5' : 'transparent',
        paddingY: 0.7,
        paddingX: 1.2,
        borderRadius: 2,
        transition: 'all 0.3s',
        '&:hover': {
          backgroundColor: '#F5F5F5',
        },
        '&:hover .hover-color': {
          color: '#EA001E',
        },
      }}
      onClick={onClick}
    >
      <Icon
        className="hover-color"
        sx={{
          fontSize: 20,
          color: selected ? '#EA001E' : '#404040',
          transition: 'color 0.3s',
        }}
      />
      <Typography
        className="hover-color"
        fontSize={20}
        fontWeight={400}
        color={selected ? '#EA001E' : '#404040'}
        sx={{ transition: 'color 0.3s' }}
      >
        {label}
      </Typography>
    </Stack>
  );

  return (
    <Stack direction={'column'} width={'100%'} spacing={1.8}>
      <Typography fontSize={16} fontWeight={600} color="#404040">
        Menu Operator
      </Typography>

      <MenuItem
        label="Dokumen"
        icon={FileIcon}
        selected={itemSelected === 'dokumen'}
        onClick={() => {
          setItemSelected('dokumen');
          navigate('/operator/coofisai/dokumen');
        }}
      />

      <MenuItem
        label="Pengaturan"
        icon={SettingIcon}
        selected={itemSelected === 'pengaturan'}
        onClick={() => {
          setItemSelected('pengaturan');
          navigate('/operator/coofisai/pengaturan');
        }}
      />

      <MenuItem
        label="Ask Chatalize AI"
        icon={ChatIcon}
        selected={false}
        onClick={() => {
          setSettingPage(false);
          setItemSelected('dokumen');
          navigate('/operator/coofisai');
        }}
      />
    </Stack>
  );
};

export default MenuOperator;
