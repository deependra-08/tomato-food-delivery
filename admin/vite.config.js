import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Pin the port so this is always the admin app on 5174, separate
  // from the customer-facing frontend on 5173.
  server: {
    port: 5174,
    strictPort: true,
  },
})
