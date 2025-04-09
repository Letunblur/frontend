import { defineConfig } from 'vite';
import path from 'path';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  plugins: [svgr()],
  root: '.', // Startpunkt des Projekts, aktuelles Verzeichnis
  build: {
    outDir: 'dist', // Zielordner für den Build
  },
  resolve: {
    alias: {
      '/src': path.resolve(__dirname, './src'), // Alias für '/src'
    },
  },
  server: {
    host: '0.0.0.0', // Wichtig für lokale und Cloud-Deployments
    port: process.env.PORT || 4173, // Port, falls nicht in der Umgebung gesetzt
  },
  preview: {
    host: '0.0.0.0', // Preview-Server-Host
    port: process.env.PORT || 4173, // Preview-Server-Port
    allowedHosts: ['letunblur-frontend.onrender.com'], // Hier fügst du die erlaubte Domain hinzu
  }
});
