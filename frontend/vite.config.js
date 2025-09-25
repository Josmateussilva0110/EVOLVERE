import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react(), tailwindcss(),],

  server: {
    historyApiFallback: true, 
    
    // ADICIONEI O PROXY AQUI DENTRO
    proxy: {
      '/api': {
        target: 'http://backend:8080', 
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''), // Remove /api do início
      }
    }
  },

  build: {
    rollupOptions: {
      input: '/index.html'
    }
  }
})
