import React from "react";
import { useState } from "react";
import { Box, Stack, Typography } from "@mui/material";
import Logo from "../../assets/coofisLogo.svg";
import ProfilPict from "../../assets/malePict.svg";
import Personal from "./Personal";
import Departemen from "./Departemen";
import { scrollbar } from "../../utils/scrollbar";


const Sidebar = () => {
    const [selected, setSelected] = useState("personal");
    const [role, setRole] = useState("admin");

    return (
        <Stack direction='column' backgroundColor='white' alignItems='center' spacing={2} padding={3} height={'92vh'} boxShadow={'5px 0px 10px rgba(0, 0, 0, 0.15)'} sx={{ ...scrollbar('#9E9E9E'), overflowX: 'hidden', overflowY: 'auto'}}>
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
                    <Personal />
                ) : selected === 'departemen' ? (
                    <Departemen />
                ) : null}
            </Box>
        </Stack>
    )
}

export default Sidebar;