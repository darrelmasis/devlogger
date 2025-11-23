import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'
import svgr from 'vite-plugin-svgr'

export default defineConfig({
  plugins: [
    react(),
    cssInjectedByJsPlugin(),
    svgr()
  ],
  build: {
    lib: {
      entry: 'src/index.js',
      name: 'Logger',
      fileName: 'logger',
      formats: ['es', 'cjs']
    },
    minify: 'esbuild',
    target: 'es2015',
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM'
        },
        compact: true,
        generatedCode: {
          constBindings: true
        }
      }
    },
    cssMinify: true,
    reportCompressedSize: true
  }
})
