import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        host: true,
        open: true,
    },
    optimizeDeps: {
        include: ["date-fns", "date-fns-tz"],
    },
});