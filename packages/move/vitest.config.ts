import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    globals: true,
    include: ['src/**/*.test.{ts,tsx}'],
    // Real-browser invariant tests run via vitest.browser.config.ts, not jsdom.
    exclude: ['**/node_modules/**', '**/dist/**', '**/*.browser.test.{ts,tsx}'],
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
});
