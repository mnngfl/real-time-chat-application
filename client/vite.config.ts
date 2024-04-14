import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import svgr from "vite-plugin-svgr";
import { visualizer } from "rollup-plugin-visualizer";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), svgr(), visualizer()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes("socket.io-client") || id.includes("axios")) {
            return "@networking-vendor";
          }
          if (id.includes("emoji-picker-react")) {
            return "@emoji-vendor";
          }
          if (id.includes("node_modules/react/") || id.includes("node_modules/react-dom/")) {
            return "@react-vendor";
          }
        },
      },
    },
  },
});
