import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5175,       // 5175'te çalış
    strictPort: true, // doluysa başka porta kaçma, hata ver
    proxy: {
      "^/api": {
        target: "http://localhost:5174",
        changeOrigin: true,
        secure: false,
        rewrite: p => p.replace(/^\/api/, ""),
      },
    },
  },
});