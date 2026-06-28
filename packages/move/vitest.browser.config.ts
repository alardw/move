import { defineConfig } from 'vitest/config';
import { resolve } from 'path';
import { playwright } from '@vitest/browser-playwright';

// Real-browser invariant tests (Chromium via Playwright) — for things jsdom
// can't see: layout, paint, rAF-driven animation, getBoundingClientRect.
// Files: src/**/*.browser.test.{ts,tsx}. Run: npm run test:browser
export default defineConfig({
  test: {
    include: ['src/**/*.browser.test.{ts,tsx}'],
    browser: {
      enabled: true,
      provider: playwright(),
      headless: true,
      instances: [{ browser: 'chromium' }],
    },
  },
  resolve: {
    alias: { '@': resolve(__dirname, 'src') },
  },
});
