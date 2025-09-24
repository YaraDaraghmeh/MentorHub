// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  base: "/", // ensure correct root path
  plugins: [react(), tailwindcss()],
  server: {
    port: 5175,
    proxy: {
      "/api": {
        target: "https://mentor-hub.runasp.net",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
