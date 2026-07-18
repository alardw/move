import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 6044,
  },
  resolve: {
    dedupe: ['react', 'react-dom'],
    alias: [
      { find: 'move/styles.css', replacement: path.resolve('../move/src/styles/system.css') },
      { find: 'move', replacement: path.resolve('../move/src/index.ts') },
      // Direct access to spec files for auto-generated API tables.
      { find: '@move-specs', replacement: path.resolve('../move/src/components') },
      // The creation spec — so the scaffold docs render its file manifest + options.
      { find: '@move-scaffold', replacement: path.resolve('../move/scaffold') },
      { find: '@move-patterns', replacement: path.resolve('../move/patterns') },
    ],
  },
});
