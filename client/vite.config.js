import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    plugins: [react()],
    root: path.resolve(__dirname, '.'), // Explicit root path
    build: {
        outDir: 'dist',
        rollupOptions: {
            input: {
                main: path.resolve(__dirname, 'public/index.html') // Absolute path
            }
        }
    },
    publicDir: 'public', // Explicit public directory
    server: {
        port: 3000
    }
});