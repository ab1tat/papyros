import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    base: '/',  
    build: {
      outDir: 'dist',
      sourcemap: mode !== 'production',
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom'],
            charts: ['recharts'],
          },
        },
      },
    },
    server: {
      port: 5173,
      proxy: {
        '/api/rapsodia': {
          target: env.VITE_RAPSODIA_API_URL || 'http://localhost:5073',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/rapsodia/, '')
        },
        '/api/malebolge': {
          target: env.VITE_MALEBOLGE_API_URL || 'http://localhost:5074',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/malebolge/, '')
        }
      }
    }
  }
})