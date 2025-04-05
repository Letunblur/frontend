// vite.config.js
export default {
  root: '.',
  build: {
    outDir: 'dist',
  },
  server: {
    host: '0.0.0.0',
    port: process.env.PORT || 4173,
  },
  preview: {
    host: '0.0.0.0',
    port: process.env.PORT || 4173,
  }
};
