import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { copyFileSync, mkdirSync } from 'fs'
import { resolve } from 'path'

// Plugin to copy locales to dist
const copyLocalesPlugin = () => {
  return {
    name: 'copy-locales',
    writeBundle() {
      const localesDir = resolve('dist/locales')
      try {
        mkdirSync(localesDir, { recursive: true })
        copyFileSync('public/locales/en.json', 'dist/locales/en.json')
        copyFileSync('public/locales/vi.json', 'dist/locales/vi.json')
        copyFileSync('public/locales/ko.json', 'dist/locales/ko.json')
        copyFileSync('public/locales/zh.json', 'dist/locales/zh.json')
        copyFileSync('public/locales/ja.json', 'dist/locales/ja.json')
        console.log('✅ Locales copied to dist/')
      } catch (err) {
        console.warn('⚠️  Could not copy locales:', err.message)
      }
    }
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), copyLocalesPlugin()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
}) 