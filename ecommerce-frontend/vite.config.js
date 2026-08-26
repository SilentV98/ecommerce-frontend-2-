import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // السماح بالوصول عبر الشبكة المحلية
    port: 5173  // أو الرقم الافتراضي الخاص بك
  }
})