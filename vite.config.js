import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import process from 'node:process'

export default defineConfig(({ mode }) => {
  const config = loadEnv(mode, process.cwd(), '')
  return {
  plugins: [
    react(),
    tailwindcss()
  ],
  server: {
    proxy: {
      '/api': {
        target: config.VITE_DEV_API_TARGET || 'http://localhost:5000',
        changeOrigin: true,
      },
      '/socket.io': {
        target: config.VITE_DEV_API_TARGET || 'http://localhost:5000',
        changeOrigin: true,
        ws: true,
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom", "react-router-dom"],
          antd: ["antd", "@ant-design/icons"],
          query: ["@tanstack/react-query", "axios", "zustand"],
          motion: ["framer-motion"],
        },
      },
    },
  },
  }
})
