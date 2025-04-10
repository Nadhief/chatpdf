import React from "react";
import { useState } from "react";
import { Box, Stack, Typography } from "@mui/material";
import { scrollbar } from "../../utils/scrollbar";
import AdminIcon from '@mui/icons-material/ManageAccountsOutlined';
import Logo from "../../assets/coofisLogo.svg";
import ProfilPict from "../../assets/malePict.svg";
import PersonalUser from "../../pages/user/PersonalUser";
import DepartemenUser from "../../pages/user/DepartemenUser";
import PersonalOperator from "../../pages/operator/PersonalOperator";
import DepartemenOperator from "../../pages/operator/DepartemenOperator";
import MenuOperator from "../../pages/operator/MenuOperator";
import MenuAdmin from "../../pages/admin/MenuAdmin";


const Sidebar = ({role}) => {
    const [selected, setSelected] = useState("personal");
    const [itemSelected, setItemSelected] = useState("dokumen");
    const [settingPage, setSettingPage] = useState(false);

    return (
        <Stack direction='column' backgroundColor='white' alignItems='center' spacing={2} padding={3} height={'93vh'} boxShadow={'5px 0px 10px rgba(0, 0, 0, 0.15)'} sx={{ ...scrollbar('#9E9E9E'), overflowX: 'hidden', overflowY: 'auto'}}>
            <Box
                component="img"
                src={Logo}
                alt="Gambar"
                sx={{width: 180, height: 72}}
            />
            <Box justifyContent={'flex-start'} padding={2} width={'100%'}>
                <Stack direction='row' spacing={3} alignItems='center'>
                    <Box
                        component="img"
                        src={ProfilPict}
                        alt="Gambar"
                        sx={{width: 50, height: 50}}
                    />
                    <Stack direction='column' alignItems='flex-start' justifyContent='flex-start'>
                        <Typography variant="h6" fontWeight={600} color="#2E3A59">Nama User</Typography>
                        <Typography variant="body2" fontWeight={400} color="#A0A3B1">Departemen</Typography>
                    </Stack>
                </Stack>
            </Box>
            {settingPage ? (
                role === 'operator' ? (
                    <MenuOperator itemSelected={itemSelected} setItemSelected={setItemSelected} setSettingPage={setSettingPage} />
                ) : role === 'admin' ? (
                    <MenuAdmin itemSelected={itemSelected} setItemSelected={setItemSelected} setSettingPage={setSettingPage} />
                ) : null
            ) : (
                <>
                    {role === 'operator' ? (
                        <Box width={'100%'}>
                            <Stack direction={'row'} spacing={1} alignItems={'center'} justifyContent={'flex-start'} width={'fit-content'} paddingLeft={2} sx={{
                                cursor: 'pointer',
                            }}
                            onClick = {() => setSettingPage(true)}
                            >
                                <AdminIcon sx={{fontSize: 20}} />
                                <Typography fontSize={20} fontWeight={400} color='#404040'> Menu Operator </Typography>
                            </Stack>
                        </Box>
                    ) : role === 'admin' ? (
                        <Box width={'100%'}>
                            <Stack direction={'row'} spacing={1} alignItems={'center'} justifyContent={'flex-start'} width={'fit-content'} paddingLeft={2} sx={{
                                cursor: 'pointer',
                            }}
                            onClick = {() => setSettingPage(true)}
                            >
                                <AdminIcon sx={{fontSize: 20}} />
                                <Typography fontSize={20} fontWeight={400} color='#404040'> Menu Admin </Typography>
                            </Stack>
                        </Box>
                    ) : null} 

                    <Box width={'97%'} sx={{
                        backgroundColor: '#EEF0F7',
                        borderRadius: 10,
                        border: '1px solid #E0E0E0',
                        paddingY: 0.7,
                        paddingX: 1,
                    }}>
                        <Stack direction='row' spacing={2} alignItems='center'>
                            <Box alignContent={'center'} justifyContent='center' width={'100%'} height={'100%'} display='flex' alignItems='center'
                                sx={{
                                    backgroundColor: selected === 'personal' ? 'white' : 'none',
                                    borderRadius: 10,
                                    cursor: 'pointer',
                                    boxShadow: selected === 'personal' ? '0px 2px 4px rgba(0, 0, 0, 0.1)' : 'none',
                                    paddingY: 0.8
                                }}
                                onClick={() => setSelected("personal")}
                            >
                                <Typography color={selected === 'personal' ? "black" : "#9E9E9E"}> Personal </Typography>
                            </Box>
                            <Box alignContent={'center'} justifyContent='center' width={'100%'} height={'100%'} display='flex' alignItems='center'
                                sx={{
                                    backgroundColor: selected === 'departemen' ? 'white' : 'none',
                                    borderRadius: 10,
                                    cursor: 'pointer',
                                    boxShadow: selected === 'departemen' ? '0px 2px 4px rgba(0, 0, 0, 0.1)' : 'none',
                                    paddingY: 0.8
                                }}
                                onClick={() => setSelected("departemen")}
                            >
                                <Typography color={selected === 'departemen' ? "black" : "#9E9E9E"}> Departemen </Typography>
                            </Box>
                        </Stack>
                    </Box>
                    <Box width={'100%'} paddingTop={1}>
                        {selected === 'personal' ? (
                            role === 'user' ? ( 
                                <PersonalUser /> 
                            ) : role === 'operator' || 'admin' ? ( 
                                <PersonalOperator /> 
                            ) : null
                        ) : selected === 'departemen' ? (
                            role === 'user' ? ( 
                                <DepartemenUser /> 
                            ) : role === 'operator' || 'admin' ? ( 
                                <DepartemenOperator /> 
                            ) : null
                        ) : null}
                    </Box>
                </>
            )}
        </Stack>
    )
}

export default Sidebar;