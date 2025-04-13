import React from 'react'
import { Stack, Typography } from '@mui/material'
import SettingIcon from '@mui/icons-material/SettingsOutlined';
import PersonIcon from '@mui/icons-material/PersonOutlined';
import DepartmentIcon from '@mui/icons-material/ApartmentOutlined';
import FileIcon from '@mui/icons-material/InsertDriveFileOutlined';
import ChatIcon from '@mui/icons-material/ChatOutlined';
import { useNavigate } from 'react-router-dom';

const MenuAdmin = ({ itemSelected, setItemSelected, setSettingPage }) => {
    const navigate = useNavigate();
    return (
        <Stack direction={'column'} width={'100%'} spacing={1.8}>
            <Typography fontSize={16} fontWeight={600} color='#404040'> Menu Admin </Typography>
            <Stack spacing={1} direction={'row'} alignItems={'center'} color={'black'} sx={{
                cursor:'pointer',
                backgroundColor: itemSelected === 'dokumen' ? '#F5F5F5' : 'none',
                paddingY: 0.7,
                paddingX: 1.2,
                borderRadius: 2
                }}
                onClick={() => {
                    setItemSelected('dokumen');
                    navigate("/admin/coofisai/dokumen");
                }}>
                <FileIcon sx={{fontSize: 20, color: itemSelected === 'dokumen' ? '#EA001E' : '#404040'}} />
                <Typography fontSize={20} fontWeight={400} color = {itemSelected === 'dokumen' ? '#EA001E' : '#404040'}> Dokumen </Typography>
            </Stack>
            <Stack spacing={1} direction={'row'} alignItems={'center'} color={'black'} sx={{
                cursor:'pointer',
                backgroundColor: itemSelected === 'user' ? '#F5F5F5' : 'none',
                paddingY: 0.7,
                paddingX: 1.2,
                borderRadius: 2
                }}
                onClick={() => {
                    setItemSelected('user');
                    navigate("/admin/coofisai/manageuser");
                }}>
                <PersonIcon sx={{fontSize: 20, color: itemSelected === 'user' ? '#EA001E' : '#404040'}} />
                <Typography fontSize={20} fontWeight={400} color = {itemSelected === 'user' ? '#EA001E' : '#404040'}> User </Typography>
            </Stack>
            <Stack spacing={1} direction={'row'} alignItems={'center'} color={'black'} sx={{
                cursor:'pointer',
                backgroundColor: itemSelected === 'departemen' ? '#F5F5F5' : 'none',
                paddingY: 0.7,
                paddingX: 1.2,
                borderRadius: 2
                }}
                onClick={() => {
                    setItemSelected('departemen');
                    navigate('/admin/coofisai/managedepartment')
                }}>
                <DepartmentIcon sx={{fontSize: 20, color: itemSelected === 'departemen' ? '#EA001E' : '#404040'}} />
                <Typography fontSize={20} fontWeight={400} color = {itemSelected === 'departemen' ? '#EA001E' : '#404040'}> Departemen </Typography>
            </Stack>
            {/* <Stack spacing={1} direction={'row'} alignItems={'center'} color={'black'} sx={{
                cursor:'pointer',
                backgroundColor: itemSelected === 'pengaturan' ? '#F5F5F5' : 'none',
                paddingY: 0.7,
                paddingX: 1.2,
                borderRadius: 2
                }}
                onClick={() => {
                    setItemSelected('pengaturan');
                }}
                >
                <SettingIcon sx={{fontSize: 20, color: itemSelected === 'pengaturan' ? '#EA001E' : '#404040'}} />
                <Typography fontSize={20} fontWeight={400} color = {itemSelected === 'pengaturan' ? '#EA001E' : '#404040'}> Pengaturan </Typography>
            </Stack> */}
            <Stack spacing={1} direction={'row'} alignItems={'center'} color={'black'} sx={{
                cursor:'pointer',
                paddingY: 0.7,
                paddingX: 1.2
                }}
                onClick={() => {
                    setSettingPage(false);
                    setItemSelected('dokumen');
                    navigate("/admin/coofisai");
                }}
                >
                <ChatIcon sx={{fontSize: 20}} />
                <Typography fontSize={20} fontWeight={400} color='#404040'> Ask Chatalize AI </Typography>
            </Stack>
        </Stack>
    )
}

export default MenuAdmin