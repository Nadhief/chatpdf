import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          pdfjsWorker: ['pdfjs-dist/build/pdf.worker.entry'],
        },
      },
    },
  },
  server: {
    host:"0.0.0.0",
    port: 5174, 
    allowedHosts: true
  }
});
