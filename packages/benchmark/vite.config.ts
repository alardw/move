import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 6043,
  },
  resolve: {
    dedupe: ['react', 'react-dom'],
    alias: [
      { find: 'move/styles.css', replacement: path.resolve('../move/src/styles/system.css') },
      { find: 'move', replacement: path.resolve('../move/src/index.ts') },
    ],
  },
});
