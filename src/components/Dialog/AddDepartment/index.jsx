import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Typography,
    Stack,
    Box
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const AddDepartment = ({ open, onClose }) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle mt={1}>
                <Stack direction="row" spacing={1} justifyContent="space-between" alignItems="center">
                    <Typography fontSize={20} fontWeight={600} color="#404040">Tambah Departemen</Typography>
                    <CloseIcon onClick={onClose} sx={{ cursor: 'pointer', color: '#A0A3B1' }} />
                </Stack>
            </DialogTitle>

            <DialogContent>
                <Box mb={0.5}>
                    <Typography fontWeight={700}>Kode Departemen</Typography>
                </Box>
                <TextField
                    placeholder="Masukan Kode Departemen"
                    fullWidth
                    sx={{
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
                <Box mt={4} mb={0.5}>
                    <Typography fontWeight={700}>Nama Departemen</Typography>
                </Box>
                <TextField
                    placeholder="Masukan Nama Departemen"
                    fullWidth
                    sx={{
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

export default AddDepartment;