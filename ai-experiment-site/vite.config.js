import { defineConfig, loadEnv } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    base: "/ai-experiment/",
    plugins: [tailwindcss(), react()],
    css: {
      devSourcemap: true
    },
    define: {
      'import.meta.env.VITE_GITHUB_TOKEN': JSON.stringify(env.VITE_GITHUB_TOKEN),
      'import.meta.env.VITE_GITHUB_OWNER': JSON.stringify(env.VITE_GITHUB_OWNER),
      'import.meta.env.VITE_GITHUB_REPO': JSON.stringify(env.VITE_GITHUB_REPO)
    }
  };
});