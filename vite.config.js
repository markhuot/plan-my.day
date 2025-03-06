import { defineConfig } from 'vite';
import path from 'path';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import {synapse} from '@markhuot/synapse/vite';

export default defineConfig({
    plugins: [
        react(),
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            refresh: true,
        }),
        synapse(),
    ],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./resources/lib"),
        },
    },
});
