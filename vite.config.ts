import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react()],
    define: {
      // This is crucial: It makes 'process.env.API_KEY' available in your client-side code
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    }
  }
})