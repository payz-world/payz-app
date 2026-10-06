import path from 'node:path';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

const root = path.resolve(import.meta.dirname);
const port = Number(process.env.PORT ?? 5173);

export default defineConfig({
  base: process.env.BASE_PATH ?? '/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(root, 'src'),
    },
    dedupe: ['react', 'react-dom'],
  },
  root,
  build: {
    outDir: path.resolve(root, 'dist'),
    emptyOutDir: true,
  },
  server: {
    port: Number.isFinite(port) && port > 0 ? port : 5173,
    strictPort: true,
    host: '0.0.0.0',
    allowedHosts: true,
    fs: {
      strict: true,
    },
  },
  preview: {
    port: Number.isFinite(port) && port > 0 ? port : 5173,
    host: '0.0.0.0',
    allowedHosts: true,
  },
});
