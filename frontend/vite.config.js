import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      components: path.resolve(__dirname, 'src/components'),
      examples: path.resolve(__dirname, 'src/examples'),
      assets: path.resolve(__dirname, 'src/assets'),
      layouts: path.resolve(__dirname, 'src/layouts'),
      context: path.resolve(__dirname, 'src/context'),
      services: path.resolve(__dirname, 'src/services'),
      auth: path.resolve(__dirname, 'src/auth'),
      data: path.resolve(__dirname, 'src/data'),
      routes: path.resolve(__dirname, 'src/routes.jsx'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'build',
  },
});
