import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'build',
  },
  server: {
    proxy: {
      '/is-lab1/api': {
        target: 'http://localhost:28600',
        changeOrigin: true,
        secure: false
      },
      '/is-lab1/websocket': {
        target: 'ws://localhost:28600',
        ws: true,
        changeOrigin: true,
        secure: false
      }
    }
  }
})
