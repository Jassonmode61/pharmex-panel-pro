import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  // Render statik hosting kökten servis eder, base '/' kalsın
  base: "/",

  // Geliştirme sunucusu (lokalde işine yarar, Render'da kullanılmıyor)
  server: {
    host: true,
    port: 5175,
    strictPort: true,
    proxy: {
      "/api": {
        target: "http://localhost:5174",
        changeOrigin: true,
        secure: false,
        rewrite: p => p.replace(/^\/api/, ""),
      },
    },
  },

  // Önemli kısım: modern hedef, TLA desteği
  build: {
    target: "esnext",   // Top-level await için
    outDir: "dist",
    modulePreload: { polyfill: false },
  },

  // esbuild’e de aynı sinyali verelim
  esbuild: {
    target: "esnext",
    supported: { "top-level-await": true },
  },
});