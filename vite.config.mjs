import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./"),
        },
    },
    server: {
        proxy: {
            '/api': {
                target: 'http://localhost:3000',
                changeOrigin: true,
                secure: false,
            }
        }
    },
    build: {
        rollupOptions: {
            input: {
                main: path.resolve(__dirname, 'index.html'),
                contact: path.resolve(__dirname, 'contact.html'),
                dashboard: path.resolve(__dirname, 'dashboard.html'),
                login: path.resolve(__dirname, 'login.html'),
                patients: path.resolve(__dirname, 'patients.html'),
                practitioners: path.resolve(__dirname, 'practitioners.html'),
                specialities: path.resolve(__dirname, 'specialities.html'),
                technology: path.resolve(__dirname, 'technology.html'),
            },
        },
    },
})
