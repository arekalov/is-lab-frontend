import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/~s409449/build/",
  build: {
    outDir: "build",
  },
});
