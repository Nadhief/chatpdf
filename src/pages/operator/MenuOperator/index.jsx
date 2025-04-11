import React from 'react'
import { Stack, Typography } from '@mui/material'
import SettingIcon from '@mui/icons-material/SettingsOutlined';
import FileIcon from '@mui/icons-material/InsertDriveFileOutlined';
import ChatIcon from '@mui/icons-material/ChatOutlined';
import { useNavigate } from 'react-router-dom';

const MenuOperator = ({ itemSelected, setItemSelected, setSettingPage }) => {
    const navigate = useNavigate();
    return (
        <Stack direction={'column'} width={'100%'} spacing={1.8}>
            <Typography fontSize={16} fontWeight={600} color='#404040'> Menu Operator </Typography>
            <Stack spacing={1} direction={'row'} alignItems={'center'} color={'black'} sx={{
                cursor:'pointer',
                backgroundColor: itemSelected === 'dokumen' ? '#F5F5F5' : 'none',
                paddingY: 0.7,
                paddingX: 1.2,
                borderRadius: 2
                }}
                onClick={() => {
                    setItemSelected('dokumen');
                }}>
                <FileIcon sx={{fontSize: 20, color: itemSelected === 'dokumen' ? '#EA001E' : '#404040'}} />
                <Typography fontSize={20} fontWeight={400} color = {itemSelected === 'dokumen' ? '#EA001E' : '#404040'}> Dokumen </Typography>
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
                    navigate('/operator/coofisai')
                }}
                >
                <ChatIcon sx={{fontSize: 20}} />
                <Typography fontSize={20} fontWeight={400} color='#404040'> Ask Chatalize AI </Typography>
            </Stack>
        </Stack>
    )
}

export default MenuOperator