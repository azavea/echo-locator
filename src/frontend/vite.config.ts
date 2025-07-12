import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import svgr from "vite-plugin-svgr";

export default defineConfig({
    plugins: [react(), tailwindcss(), svgr()],
    server: {
        watch: {
            usePolling: true,
        },
        host: true,
        strictPort: true,
        port: 9966,
    },
    /* Configure absolute path imports*/
    resolve: {
        alias: {
            src: "/src",
            assets: "/src/assets",
            components: "/src/components",
            pages: "/src/pages",
            hooks: "/src/hooks",
            libs: "/src/libs",
        },
    },
});
