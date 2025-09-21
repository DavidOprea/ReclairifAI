import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/ReclairifAI/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // This ensures assets are properly handled
    assetsInclude: ['**/*.mp3']
  }
})