import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { syncPlugin } from "./server/syncPlugin";

export default defineConfig({
  plugins: [react(), syncPlugin()],
  /**
   * One canonical origin per mode. Without strictPort, a new dev server quietly
   * moves to 5174 while an older process keeps answering on 5173 — and that
   * older process may predate the sync endpoint, so /api/sync 404s as HTML.
   * Failing to start is far easier to diagnose than a stale twin.
   */
  server: { port: 5173, strictPort: true },
  preview: { port: 4173, strictPort: true },
});
