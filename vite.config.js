import { defineConfig } from 'vite';

export default defineConfig({
  base: '/david-phaser-speckit-demo-claude/',
  root: './',
  publicDir: 'public',
  build: {
    outDir: 'docs',
    emptyOutDir: true
  },
  server: {
    port: 5173,
    open: false
  }
});
