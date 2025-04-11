import React from "react";
import { Box, Typography, Stack } from "@mui/material";
import FolderPlusIcon from "@mui/icons-material/FolderOpenOutlined";

const LogoSetting = () => {
    return ( 
        <Box width={'100%'}>
            <Typography align="left" sx={{mb: 1}}>Ubah Logo</Typography>
            <Stack direction="column" spacing={2} alignItems={'center'}>
            <Box
            sx={{
                width: 562,
                border: '2px solid #E5E6EF',
                borderRadius: '4px',
                backgroundColor: '#FAFBFD',
            }}
            >
            <Stack direction="column" padding={1.5} spacing={1} alignItems="flex-start">
                <Typography fontSize={14} fontWeight={600} color="#404040">
                Unggah File
                </Typography>
                <Typography fontSize={12} fontWeight={400} color="#404040">
                Total ukuran berkas yang dapat diproses adalah maksimal 200 MB dengan ekstensi (PDF, JSON)
                </Typography>
                <Box display="flex" justifyContent="flex-end" width="100%" color="white">
                <Box
                    display="flex"
                    justifyContent="flex-end"
                    color="white"
                    paddingY={0.5}
                    paddingX={1}
                    borderRadius={1}
                    alignItems="center"
                    sx={{
                    cursor: 'pointer',
                    backgroundColor: '#4C4DDC',
                    mt: 2,
                    mb: 2,
                    }}
                >
                    <FolderPlusIcon sx={{ color: 'white', marginRight: 1, fontSize: 18 }} />
                    <Typography fontSize={12} fontWeight={400}>
                    Pilih Berkas
                    </Typography>
                </Box>
                </Box>
            </Stack>
            </Box>
        
            {/* Tombol Simpan di kanan */}
            <Box width="100%" display="flex" justifyContent="flex-end">
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                paddingY={0.5}
                paddingX={2}
                borderRadius={2}
                border="1px solid #E0E0E0"
                sx={{
                cursor: 'pointer',
                backgroundColor: '#52BD94',
                }}
            >
                <Typography fontSize={14} fontWeight={400} color="white">
                Simpan
                </Typography>
            </Box>
            </Box>
        </Stack>      
        </Box>
    )
}

export default LogoSetting;