// vite.config.mjs
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command, mode }) => ({
  plugins: [react()],
  // Render (statik site) için kök path:
  base: '/',
  // Build çıktısı Render'ın beklediği klasöre düşsün
  build: { outDir: 'dist' },

  // Yerelde çalışırken (npm run dev) geçerli
  server: {
    host: true,
    port: 5175,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5174',
        changeOrigin: true,
        secure: false,
        rewrite: p => p.replace(/^\/api/, ''),
      },
    },
  },

  // npm run preview (yerel prod önizleme) için
  preview: {
    port: 5175,
    strictPort: true,
  },
}))