import react from '@vitejs/plugin-react-swc';
import { defineConfig, splitVendorChunkPlugin } from 'vite';

export default defineConfig({
  base: './',
  build: {
    sourcemap: true,
    reportCompressedSize: false,
  },
  server: {
    port: 3000,
  },
  preview: {
    port: 3000,
  },
  esbuild: {
    keepNames: true,
  },
  plugins: [react(), splitVendorChunkPlugin()],
});
