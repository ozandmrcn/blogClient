import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // The editor and markdown viewer alone account for a large part of the
    // bundle, so they are split out and cached separately from app code.
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom", "react-router-dom"],
          editor: ["easymde", "react-simplemde-editor", "react-markdown"],
        },
      },
    },
  },
});
