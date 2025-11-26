import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'

// Configuración para construir la DEMO (GitHub Pages)
// NO afecta el build de la librería (vite.config.js)
export default defineConfig({
  plugins: [
    react(),
    svgr()
  ],
  base: '/devlogger/', // Importante: debe coincidir con el nombre del repositorio
  build: {
    outDir: 'dist-demo', // Output separado del build de la librería
    emptyOutDir: true,
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  }
})
