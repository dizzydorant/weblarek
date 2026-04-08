import { defineConfig } from 'vite'

export default defineConfig({
  base: '/weblarek/',
   build: {
    outDir: 'dist',
  },
  css: {
    preprocessorOptions: {
      scss: {
        loadPaths: [
          './src/scss'
        ],
      },
    },
  },
})