import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: '/' // Chỉnh lại thành '/' để chạy đúng trên Azure
})
