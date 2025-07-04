import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, 
    port: 5174,
    proxy: {
        '/api': {
            target: 'http://localhost:9999',
            changeOrigin: true,
            secure: false
        }
    }
}
})

