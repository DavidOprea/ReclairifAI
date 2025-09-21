import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/ReclairifAI/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // Add this to ensure public files are copied:
    copyPublicDir: true
  },
  publicDir: 'public' // Ensure this is set
})