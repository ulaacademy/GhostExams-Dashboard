import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": "/src",
      "@/components": "/src/components",
      "@/utils": "/src/utils",
      "@/hooks": "/src/hooks",
      "@/api": "/src/api",
      "@/store": "/src/store",
    },
  },

  // ✅ أضفنا هذا الجزء فقط
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:4100", // ✅ هون بورت الباك اند
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
