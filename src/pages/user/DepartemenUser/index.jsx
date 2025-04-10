import React from 'react';
import { Box, Stack, Typography, Autocomplete, TextField } from '@mui/material';
import ExpandIcon from '@mui/icons-material/ExpandMore';
import TrashIcon from '@mui/icons-material/DeleteOutlineOutlined';
import Documents from '../../../components/Sidebar/Documents';
import { documents } from '../../../components/Sidebar/Documents/DocumentsConfig';
import InputSearchBar from '../../../components/Inputs/InputSearchBar';

const DepartemenUser = () => {

    return (
        <Stack direction='column' backgroundColor='white' height={'100%'} width={'100%'} alignItems='center' spacing={3}>
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
                <Stack direction={'column'} spacing={1}>
                    <Box sx={{ backgroundColor: '#F5F5F5', borderRadius: '4px 4px 0 0', paddingX: 2, paddingY: 1 }}>
                        <Typography fontSize={16} fontWeight={600} color='#404040'> File Departemen </Typography>
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

export default DepartemenUser;