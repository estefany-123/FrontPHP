import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          heroUI: ['@heroicons/react', '@heroui/react'],
        },
      },
    },
    chunkSizeWarningLimit: 1000, // Opcional: sube el límite si aún quieres evitar la advertencia
  },
})
