import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path'; // Impor modul 'path'
// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        tailwindcss()
    ],
    assetsInclude: ['**/*.glb'],
    resolve: {
        alias: {
            // Gunakan path.resolve untuk mendapatkan path absolut ke folder 'src'
            '@': path.resolve(__dirname, './src'),
        },
    },
});
