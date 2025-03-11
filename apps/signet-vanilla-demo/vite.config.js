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
    sourcemap: true
  }
});