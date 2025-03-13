// vite.config.js
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  // Configure the project
  resolve: {
    alias: {
      // Add any aliases you need here
    }
  },
  // Base path for assets - useful for GitHub Pages deployment
  base: './',
  // Development server config
  server: {
    port: 3000,
    open: true
  },
  // Build options
  build: {
    outDir: 'dist',
    // Generate sourcemaps for better debugging
    sourcemap: true,
    // Ensure public directory is copied to the build output
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        download: resolve(__dirname, 'download.html')
      }
    }
  },
  // Configure public folder to be copied as-is to build directory
  publicDir: 'public'
});