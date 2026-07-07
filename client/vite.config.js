import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
    // Load env file based on `mode` in the current working directory.
    const env = loadEnv(mode, process.cwd(), '')
    // Fallback to localhost if not found, and strip /api if present since the proxy appends it
    const apiUrl = env.VITE_API_URL 
        ? env.VITE_API_URL.replace(/\/api$/, '') 
        : 'http://localhost:3000'

    return {
        plugins: [react({
            jsxRuntime: 'automatic',
        })],
        server: {
            port: 5173,
            proxy: {
                '/api': {
                    target: apiUrl,
                    changeOrigin: true
                }
            }
        },
    build: {
        // Enable minification
        minify: 'terser',
        terserOptions: {
            compress: {
                drop_console: true, // Remove console.log in production
            },
        },
        // Code splitting
        rollupOptions: {
            output: {
                manualChunks: {
                    'react-vendor': ['react', 'react-dom', 'react-router-dom'],
                    'charts': ['recharts'],
                    'query': ['@tanstack/react-query'],
                },
            },
        },
        // Increase chunk size warning limit
        chunkSizeWarningLimit: 1000,
    }
  }
})
