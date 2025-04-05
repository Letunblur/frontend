import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  root: '.', // dein Startpunkt ist der aktuelle Ordner
  build: {
    outDir: 'dist', // wohin gebaut wird
  },
  resolve: {
    alias: {
      '/src': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: '0.0.0.0', // wichtig für lokale & Cloud-Deployments
    port: process.env.PORT || 4173,
  },
  preview: {
    host: '0.0.0.0',
    port: process.env.PORT || 4173,
    allowedHosts: ['letunblur-frontend.onrender.com'], // ✅ damit Render funktioniert
  }
});
