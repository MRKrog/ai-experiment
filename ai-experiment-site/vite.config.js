import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/ai-experiment/",
  plugins: [tailwindcss(), react()],
  css: {
    devSourcemap: true
  }
});