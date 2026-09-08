import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 4000,
    host: "0.0.0.0",
  },
  preview: {
    port: 4000,
    host: "0.0.0.0",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("ckeditor5") || id.includes("@ckeditor")) {
              return "vendor-ckeditor";
            }
            if (id.includes("recharts")) {
              return "vendor-recharts";
            }
            if (id.includes("exceljs")) {
              return "vendor-exceljs";
            }
            if (id.includes("lucide-react") || id.includes("framer-motion")) {
              return "vendor-icons-motion";
            }
            if (id.includes("react-router-dom") || id.includes("react-dom") || id.includes("react")) {
              return "vendor-react";
            }
          }
        },
      },
    },
  },
  define: {
    "process.env.NEXT_PUBLIC_API_URL": JSON.stringify(
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v2"
    ),
    "process.env.NEXT_PUBLIC_APP_URL": JSON.stringify(
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:4000/"
    ),
    "process.env.NEXT_PUBLIC_DEMO": JSON.stringify(
      process.env.NEXT_PUBLIC_DEMO || "0"
    ),
    "process.env.NEXT_EXPORT": JSON.stringify(
      process.env.NEXT_EXPORT || "false"
    ),
  },
});
