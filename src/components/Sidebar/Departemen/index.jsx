import React from 'react';
import { Box, Stack, Typography, Checkbox, Autocomplete, TextField } from '@mui/material';
import ExpandIcon from '@mui/icons-material/ExpandMore';
import TrashIcon from '@mui/icons-material/DeleteOutlineOutlined';
import FileIcon from '@mui/icons-material/InsertDriveFileOutlined'
import InputSearchBar from '../../Inputs/InputSearchBar';

const Departemen = () => {

    return (
        <Stack direction='column' backgroundColor='white' height={'100%'} width={'100%'} alignItems='center' spacing={2}>
            <Box width="100%" textAlign="left">
                <Typography variant="body2" fontWeight={700} color="#404040">
                Unggah Dokumen Personal
                </Typography>
            </Box>
            <Autocomplete
                options={['Departemen A', 'Departemen B', 'Departemen C']}
                sx={{ width: '100%', boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.1)', borderRadius: 2, border: '2px solid #E0E0E0',
                    '& .MuiOutlinedInput-root': {
                        padding: 0,
                        paddingX: 2,
                        '& .MuiOutlinedInput-notchedOutline': {
                            border: 'none',
                        },
                    },
                }}
                renderInput={(params) => <TextField {...params}/>}
                clearIcon={false}
                defaultValue={'Departemen'}
                popupIcon={<ExpandIcon />}
            />
            <Box
                sx={{
                    width: '100%',
                    border: '2px solid #E0E0E0',
                    borderRadius: '4px',
                    backgroundColor : '#FFFFFF',
                }}
            >
                {/*MAPPING FILE PDF*/}
                <Stack direction={'column'} spacing={1}>
                    <Box sx={{ backgroundColor: '#F5F5F5', borderRadius: '4px 4px 0 0', paddingX: 1, paddingY: 0.5 }}>
                        <Typography fontSize={14} fontWeight={600} color='#404040'> File Saya </Typography>
                    </Box>
                    <Stack direction={'column'} padding={1.5} spacing={1}>
                        <InputSearchBar/>
                        <Stack direction={'row'} spacing={1} alignItems='center'>
                            <Box width={'30%'} display="flex" justifyContent="center" paddingY={0.3} paddingX={0.7} borderRadius={100} border={'1px solid #9E9E9E'} 
                                    sx={{
                                        backgroundColor: '#FAFBFD',
                                        boxShadow: 'none',
                                    }}
                                >
                                    <Typography fontSize={12} fontWeight={400} color='black' > File </Typography>
                            </Box>
                            <Box display="flex" justifyContent="flex-end" width="100%" color='white'>
                                <Box display="flex" justifyContent="flex-end" color='white' paddingY={0.7} paddingX={0.7} borderRadius={1}
                                    sx={{
                                        cursor: 'pointer',
                                        backgroundColor: '#CB3A31',
                                    }}
                                >
                                    <TrashIcon sx={{ color: 'white', fontSize: 20}} />
                                </Box>
                            </Box>
                        </Stack>
                        <Stack direction={'column'} spacing={1}>
                            <Stack direction={'row'} spacing={0.6} padding={0.5} borderRadius={4} alignItems={'center'} sx={{
                                backgroundColor: '#F5F5F5',

                            }}>
                                <Checkbox size='' sx={{padding:0.8}}/>
                                <FileIcon sx={{ color: '#404040', fontSize: 20}} />
                                <Typography fontSize={12} fontWeight={400} color='#404040'> File PDF </Typography>
                            </Stack>
                            <Stack direction={'row'} spacing={0.6} padding={0.5} borderRadius={4} alignItems={'center'} sx={{
                                backgroundColor: '#F5F5F5',

                            }}>
                                <Checkbox size='' sx={{padding:0.8}}/>
                                <FileIcon sx={{ color: '#404040', fontSize: 20}} />
                                <Typography fontSize={12} fontWeight={400} color='#404040'> File PDF </Typography>
                            </Stack>
                            <Stack direction={'row'} spacing={0.6} padding={0.5} borderRadius={4} alignItems={'center'} sx={{
                                backgroundColor: '#F5F5F5',

                            }}>
                                <Checkbox size='' sx={{padding:0.8}}/>
                                <FileIcon sx={{ color: '#404040', fontSize: 20}} />
                                <Typography fontSize={12} fontWeight={400} color='#404040'> File PDF </Typography>
                            </Stack>
                            <Stack direction={'row'} spacing={0.6} padding={0.5} borderRadius={4} alignItems={'center'} sx={{
                                backgroundColor: '#F5F5F5',

                            }}>
                                <Checkbox size='' sx={{padding:0.8}}/>
                                <FileIcon sx={{ color: '#404040', fontSize: 20}} />
                                <Typography fontSize={12} fontWeight={400} color='#404040'> File PDF </Typography>
                            </Stack>
                            <Stack direction={'row'} spacing={0.6} padding={0.5} borderRadius={4} alignItems={'center'} sx={{
                                backgroundColor: '#F5F5F5',

                            }}>
                                <Checkbox size='' sx={{padding:0.8}}/>
                                <FileIcon sx={{ color: '#404040', fontSize: 20}} />
                                <Typography fontSize={12} fontWeight={400} color='#404040'> File PDF </Typography>
                            </Stack>
                            <Stack direction={'row'} spacing={0.6} padding={0.5} borderRadius={4} alignItems={'center'} sx={{
                                backgroundColor: '#F5F5F5',

                            }}>
                                <Checkbox size='' sx={{padding:0.8}}/>
                                <FileIcon sx={{ color: '#404040', fontSize: 20}} />
                                <Typography fontSize={12} fontWeight={400} color='#404040'> File PDF </Typography>
                            </Stack>
                            <Stack direction={'row'} spacing={0.6} padding={0.5} borderRadius={4} alignItems={'center'} sx={{
                                backgroundColor: '#F5F5F5',

                            }}>
                                <Checkbox size='' sx={{padding:0.8}}/>
                                <FileIcon sx={{ color: '#404040', fontSize: 20}} />
                                <Typography fontSize={12} fontWeight={400} color='#404040'> File PDF </Typography>
                            </Stack>
                        </Stack>
                    </Stack>
                </Stack>
            </Box>
            <Stack width={'100%'} direction={'row'} spacing={1} justifyContent={'flex-end'} alignItems={'flex-end'}>
                <Box color='white' paddingY={0.5} paddingX={1} borderRadius={1} alignItems={'center'}
                    sx={{
                        cursor: 'pointer',
                        backgroundColor: '#CB3A31',      
                    }}
                >
                    <Typography fontSize={12} fontWeight={400}> Summarize </Typography>
                </Box>
            </Stack>
        </Stack>
    );
}

export default Departemen;