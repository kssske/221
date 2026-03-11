import { defineConfig } from 'vite';

export default defineConfig({
    server: {
        host: true,
        proxy: {
            '/api': {
                target: 'http://app:3000',
                changeOrigin: true
            }
        }
    }
});