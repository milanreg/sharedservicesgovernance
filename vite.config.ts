import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { syncPlugin } from "./server/syncPlugin";

export default defineConfig({
  plugins: [react(), syncPlugin()],
});
