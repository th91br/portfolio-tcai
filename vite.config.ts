import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteAgentPlugin } from './scripts/viteAgentPlugin.js'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), viteAgentPlugin()],
})
