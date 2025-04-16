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
    host: true,
    allowedHosts: [
      '94bf-2407-0-3007-441e-3d22-b7a5-9a75-64f.ngrok-free.app'
    ]
  }
});
