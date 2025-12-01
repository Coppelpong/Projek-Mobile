import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Konfigurasi proxy supaya frontend bisa memanggil API backend di IP lokal
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',       // biar bisa diakses dari jaringan lokal juga
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://192.168.31.112:8000', // IP backend kamu
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
