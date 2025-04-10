import React from 'react';
import { useState } from 'react';
import { Box, Stack, Typography, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import FolderPlusIcon from '@mui/icons-material/CreateNewFolderOutlined';
import TrashIcon from '@mui/icons-material/DeleteOutlineOutlined';
import CloseIcon from '@mui/icons-material/Close';
import Documents from '../Documents';
import { documents } from '../Documents/DocumentsConfig';
import AddIcon from '@mui/icons-material/ControlPoint'
import InputSearchBar from '../../Inputs/InputSearchBar';

const Personal = () => {
    const [selected, setSelected] = useState('file');
    const [openPaper, setOpenPaper] = useState(false);

    return (
        <Stack direction='column' backgroundColor='white' height={'100%'} width={'100%'} alignItems='center' spacing={3}>
            <Box width="100%" textAlign="left">
                <Typography fontSize={18} fontWeight={700} color="#404040">
                Unggah Dokumen Personal
                </Typography>
            </Box>
            <Box
                sx={{
                    width: '100%',
                    border: '2px solid #E5E6EF',
                    borderRadius: '4px',
                    backgroundColor : '#FAFBFD',
                }}
            >
                <Stack direction={'column'} padding={1.5} spacing={1}>
                    <Typography fontSize={14} fontWeight={600} color='#404040'> Unggah File </Typography>
                    <Typography fontSize={12} fontWeight={400} color='#404040'> Total ukuran berkas yang dapat diproses adalah maksimal 200 MB dengan ekstensi (PDF, JSON) </Typography>
                    <Box display="flex" justifyContent="flex-end" width="100%" color='white'>
                        <Box display="flex" justifyContent="flex-end" color='white' paddingY={0.5} paddingX={1} borderRadius={1} alignItems={'center'}
                            sx={{
                                cursor: 'pointer',
                                backgroundColor: '#4C4DDC',      
                            }}
                        >
                            <FolderPlusIcon sx={{ color: 'white', marginRight: 1, fontSize: 18}} />
                            <Typography fontSize={12} fontWeight={400}> Pilih Berkas </Typography>
                        </Box>
                    </Box>
                </Stack>
            </Box>
            <Box
                sx={{
                    width: '100%',
                    border: '2px solid #E0E0E0',
                    borderRadius: '4px',
                    backgroundColor : '#FFFFFF',
                }}
            >
                <Stack direction={'column'} spacing={1}>
                    <Box sx={{ backgroundColor: '#F5F5F5', borderRadius: '4px 4px 0 0', paddingX: 2, paddingY: 0.5 }}>
                        <Typography fontSize={16} fontWeight={600} color='#404040'> File Saya </Typography>
                    </Box>
                    <Stack direction={'column'} padding={1.5} spacing={1}>
                        <InputSearchBar/>
                        <Stack direction={'row'} spacing={1} alignItems='center'>
                            <Box width={'30%'} display="flex" justifyContent="center" paddingY={0.3} paddingX={0.7} borderRadius={100} border={'1px solid #9E9E9E'} 
                                    onClick={() => setSelected('file')}
                                    sx={{
                                        cursor: selected === 'file' ? 'default' : 'pointer',
                                        backgroundColor: selected === 'file' ? '#FAFBFD' : 'white',
                                        boxShadow: selected === 'file' ? 'none' : '0px 4px 8px rgba(0, 0, 0, 0.14)',
                                    }}
                                >
                                    <Typography fontSize={12} fontWeight={400} color='black' > File </Typography>
                            </Box>
                            <Box width={'30%'} display="flex" justifyContent="center" paddingY={0.3} paddingX={0.7} borderRadius={100} border={'1px solid #9E9E9E'}
                                    onClick={() => setSelected('topik')}
                                    sx={{
                                        cursor: selected === 'topik' ? 'default' : 'pointer',
                                        backgroundColor: selected === 'topik' ? '#FAFBFD' : 'white',
                                        boxShadow: selected === 'topik' ? 'none' : '0px 4px 8px rgba(0, 0, 0, 0.14)',
                                    }}
                                >
                                    <Typography fontSize={12} fontWeight={400} color='black'> Topik </Typography>
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
                            {/*MAPPING FILE PDF*/}
                            {documents.map((item) => (
                                <React.Fragment key={item.id}>
                                    <Documents label={item.label} />
                                </React.Fragment>
                            ))}
                        </Stack>
                    </Stack>
                </Stack>
            </Box>
            <Stack width={'100%'} direction={'row'} spacing={1} justifyContent={'flex-end'} alignItems={'flex-end'}>
                <Box display="flex" justifyContent="flex-end" color='black' paddingY={0.5} paddingX={1} borderRadius={1} alignItems={'center'} border={'1px solid #E0E0E0'}
                    sx={{
                        cursor: 'pointer',
                        backgroundColor: 'white',      
                    }}
                    onClick={() => setOpenPaper(true)}
                >
                    <AddIcon sx={{ color: 'black', marginRight: 1, fontSize: 18}} />
                    <Typography fontSize={12} fontWeight={400}> Topik </Typography>
                </Box>

                <Box color='white' paddingY={0.5} paddingX={1} borderRadius={1} alignItems={'center'}
                    sx={{
                        cursor: 'pointer',
                        backgroundColor: '#CB3A31',      
                    }}
                >
                    <Typography fontSize={12} fontWeight={400}> Summarize </Typography>
                </Box>
            </Stack>
            <Dialog open={openPaper} onClose={() => setOpenPaper(false)}>
                <DialogTitle>
                    <Stack direction='row' spacing={1} justifyContent={'space-between'} alignItems={'center'}>
                        <Typography fontSize={18} fontWeight={400} color="#404040"> Nama Topik </Typography>
                        <CloseIcon onClick={() => setOpenPaper(false)} sx={{ cursor: 'pointer', color: '#A0A3B1' }} />
                    </Stack>
                </DialogTitle>
                <DialogContent>
                    <TextField placeholder='Tulis nama topik' sx={{
                        width: '400px',
                        borderRadius: 2,
                        border: '1px solid #C2C2C2',
                        boxShadow: 'inset 0px 2px 4px rgba(0, 0, 0, 0.1)',
                        '& .MuiOutlinedInput-root': {
                            padding: 0,
                            '& .MuiOutlinedInput-input': {
                                paddingX: 2,
                                paddingY: 1,
                            },
                            '& .MuiOutlinedInput-notchedOutline': {
                                border: 'none',
                            },
                        },
                    }}
                    />
                </DialogContent>
                <DialogActions sx={{ paddingBottom: 3, paddingRight: 3 }}>
                    <Box display="flex" justifyContent="flex-end" color='black' paddingY={1} paddingX={2} borderRadius={2} alignItems={'center'} border={'1px solid #E0E0E0'}
                        sx={{
                            cursor: 'pointer',
                            backgroundColor: '#3366FF',      
                        }}
                        onClick={() => setOpenPaper(false)}
                    >
                        <AddIcon sx={{ color: 'white', marginRight: 1, fontSize: 14}} />
                        <Typography fontSize={14} fontWeight={400} color='white'> Topik </Typography>
                    </Box>
                </DialogActions>
            </Dialog>
        </Stack>
    );
}

export default Personal;