import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        replaceAttrValues: {
          '#000000': 'currentColor',
          '#000': 'currentColor',
        },
      },
    }),
  ],
  server: {
    port: 6042,
  },
  resolve: {
    dedupe: ['react', 'react-dom'],
    alias: [
      { find: 'move/styles.css', replacement: path.resolve('../move/src/styles/system.css') },
      { find: 'move', replacement: path.resolve('../move/src/index.ts') },
      { find: 'react', replacement: path.resolve('./node_modules/react') },
      { find: 'react-dom', replacement: path.resolve('./node_modules/react-dom') },
    ],
  },
})
