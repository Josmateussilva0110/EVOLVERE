import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react(), tailwindcss(),],
  
  server: {
    historyApiFallback: true // <-- isso permite SPA funcionar em todas as rotas
  },
  build: {
    rollupOptions: {
      input: '/index.html'
    }
  }
})
