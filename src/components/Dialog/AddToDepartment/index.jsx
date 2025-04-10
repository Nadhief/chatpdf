import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Typography,
    Autocomplete,
    Stack,
    Box
} from '@mui/material';
import ExpandIcon from '@mui/icons-material/ExpandMore';
import CloseIcon from '@mui/icons-material/Close';

const AddToDepartment = ({ open, onClose }) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle width={450} mt={1}>
                <Stack direction="row" spacing={1} justifyContent="space-between" alignItems="center">
                    <Typography fontSize={20} fontWeight={600} color="#404040">Tambahkan Ke Departemen</Typography>
                    <CloseIcon onClick={onClose} sx={{ cursor: 'pointer', color: '#A0A3B1' }} />
                </Stack>
            </DialogTitle>

            <DialogContent>
                <Box mb={0.5}>
                    <Typography fontWeight={700}>Departemen</Typography>
                </Box>
                <Autocomplete
                    options={['Departemen A', 'Departemen B', 'Departemen C']}
                    sx={{ borderRadius: 2, border: '2px solid #E0E0E0',
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
            </DialogContent>

            <DialogActions sx={{ paddingBottom: 3, paddingRight: 3 }}>
                <Box
                    display="flex"
                    justifyContent="flex-end"
                    alignItems="center"
                    paddingY={1}
                    paddingX={2}
                    borderRadius={2}
                    border="1px solid #E0E0E0"
                    sx={{
                        cursor: 'pointer',
                        backgroundColor: '#52BD94',
                    }}
                    onClick={onClose}
                >
                    <Typography fontSize={14} fontWeight={400} color="white">Tambahkan</Typography>
                </Box>
            </DialogActions>
        </Dialog>
    );
};

export default AddToDepartment;