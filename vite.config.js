import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const apiUrl = env.VITE_API_URL || "http://localhost:3000/api";

  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
    server: {
      host: true,
      port: 5173,
      // Local dev proxy: any request to `/api/*` is forwarded to the backend
      // so you can point VITE_API_URL="/api" (avoids CORS while developing).
      proxy: {
        "/api": {
          target: apiUrl.replace(/\/api\/?$/, ""),
          changeOrigin: true,
          secure: false,
        },
      },
    },
    preview: {
      host: true,
      port: 4173,
    },
    build: {
      outDir: "dist",
      sourcemap: mode !== "production",
      target: "es2020",
      chunkSizeWarningLimit: 1500,
      rollupOptions: {
        output: {
          // Basic manual chunking to keep the initial bundle small.
          manualChunks: {
            react: ["react", "react-dom", "react-router", "react-router-dom"],
            redux: ["@reduxjs/toolkit", "react-redux"],
          },
        },
      },
    },
  };
});
