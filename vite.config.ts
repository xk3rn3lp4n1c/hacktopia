import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    https: {
      key: resolve(__dirname, "ssl/key.pem"), // Path to your private key
      cert: resolve(__dirname, "ssl/cert.pem"), // Path to your certificate
    },
  },
});
