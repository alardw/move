/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 6060,
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    // Only .test files are tests — composition `.spec.ts` files are specs, not
    // suites (vitest's default include would collect them and fail on "no tests").
    include: ['src/**/*.test.{ts,tsx}'],
  },
});
