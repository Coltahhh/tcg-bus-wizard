import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    root: './',       // Explicitly set the root directory
    build: {
        outDir: 'dist', // Ensure this matches your build output
        rollupOptions: {
            input: {
                main: './index.html', // Explicit path to index.html
            },
        },
    },
});