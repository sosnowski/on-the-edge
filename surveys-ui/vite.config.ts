import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

// https://vitejs.dev/config/
export default defineConfig({
    build: {
        // minify: false,
        lib: {
            // Could also be a dictionary or array of multiple entry points
            entry: "./src/script.ts",
            name: "Survey",
            // the proper extensions will be added
            fileName: "survey",
            formats: ["iife"],
        },
    },
    plugins: [
        svelte({
            emitCss: false,
        }),
    ],
});
