import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteAgentPlugin } from './scripts/viteAgentPlugin.js'

const requestedBindHost = String(process.env.TCAI_BIND_HOST || '127.0.0.1').trim()
const bindHost = ['localhost', '127.0.0.1', '::1'].includes(requestedBindHost)
  ? requestedBindHost
  : '127.0.0.1'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), viteAgentPlugin()],
  // O dashboard e as APIs auxiliares são locais por padrão. Para uma exposição
  // controlada, use um proxy autenticado e configure isso explicitamente.
  server: {
    host: bindHost,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('three') || id.includes('@react-three')) {
            return 'vendor-three';
          }
          if (id.includes('lucide-react')) {
            return 'vendor-icons';
          }
        },
      },
    },
  },
})
