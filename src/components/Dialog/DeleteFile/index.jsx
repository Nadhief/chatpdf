import React, { useCallback } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    Box
} from '@mui/material';
import { deletePersonalFile } from '../../../services';


const DeleteFile = ({ open, onClose, handleDelete }) => {

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>
                <Typography fontSize={18} fontWeight={400} color="#404040">Hapus File</Typography>
            </DialogTitle>

            <DialogContent     sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    alignItems: 'flex-start', // opsional, bisa disesuaikan
                    padding: 0,
                    paddingY: 2,
                    paddingX: 3
                }}>
                <Typography fontSize={14} fontWeight={400} color="#616161">
                    Apakah Anda yakin ingin menghapus File yang dipilih ?
                </Typography>
            </DialogContent>

            <DialogActions sx={{ paddingY: 1, paddingX: 3, backgroundColor: '#F5F5F5' }}>
                <Box
                    display="flex"
                    justifyContent="flex-end"
                    alignItems="center"
                    paddingY={0.8}
                    paddingX={2}
                    borderRadius={2}
                    border="1px solid #E0E0E0"
                    sx={{
                        cursor: 'pointer',
                        backgroundColor: 'white',
                    }}
                    onClick={onClose}
                >

                    <Typography fontSize={14} fontWeight={400} color="#0A0A0A">Batal</Typography>
                </Box>
                <Box
                    display="flex"
                    justifyContent="flex-end"
                    alignItems="center"
                    paddingY={0.8}
                    paddingX={2}
                    borderRadius={2}
                    border="1px solid #E0E0E0"
                    sx={{
                        cursor: 'pointer',
                        backgroundColor: '#3366FF',
                    }}
                    onClick={() => {
                        handleDelete()
                        onClose()
                    }}
                >

                    <Typography fontSize={14} fontWeight={400} color="white">Ya</Typography>
                </Box>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteFile;
