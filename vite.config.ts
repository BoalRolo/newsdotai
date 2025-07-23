import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  console.log("VITE_BASE:", env.VITE_BASE);
  return {
    base: env.VITE_BASE || "/",
    plugins: [react(), tailwindcss()],
  };
});
