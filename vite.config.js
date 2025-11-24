import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve('./src')
    }
  },
  build: {
    outDir: 'temp-assets',
    emptyOutDir: true,
    minify: false, // Disable minification for easier debugging
    rollupOptions: {
      input: 'src/scripts/components.js',
      output: {
        entryFileNames: 'main.js',
        chunkFileNames: 'main.js',
        format: 'es'
      }
    }
  }
})
