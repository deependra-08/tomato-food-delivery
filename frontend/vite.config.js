import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Pin the port so this is always the customer-facing app on 5173.
  // Without this, whichever of frontend/admin starts first grabs 5173
  // and the other gets bumped to 5174 - which breaks the Stripe
  // redirect URL the backend uses after checkout.
  server: {
    port: 5173,
    strictPort: true,
  },
})
