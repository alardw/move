import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    globals: true,
    // src = library components; patterns = design-pattern spec validators (they
    // import the registry via the alias below).
    include: ['src/**/*.test.{ts,tsx}', 'patterns/**/*.test.{ts,tsx}'],
    // Real-browser invariant tests run via vitest.browser.config.ts, not jsdom.
    exclude: ['**/node_modules/**', '**/dist/**', '**/*.browser.test.{ts,tsx}'],
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      // Recipe sources/tests `import { ... } from 'move'`; resolve that to the
      // live source so the in-repo copy behaves exactly like the vendored one.
      move: resolve(__dirname, 'src/index.ts'),
    },
  },
});
