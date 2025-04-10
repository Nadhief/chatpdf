export const scrollbar = (thumbColor) => ({
    '&::-webkit-scrollbar': {
        width: '8px', // Lebar scrollbar
    },
    '&::-webkit-scrollbar-track': {
        background: 'transparent', // Warna track scrollbar
        borderRadius: '12px',
    },
    '&::-webkit-scrollbar-thumb': {
        background: thumbColor || '#E0E0E0', // Warna thumb scrollbar, dengan fallback
        borderRadius: '12px',
    },
    '&::-webkit-scrollbar-thumb:hover': {
        background: '#555', // Warna thumb saat hover
    }
});