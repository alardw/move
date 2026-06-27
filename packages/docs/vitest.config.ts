import { mergeConfig } from 'vitest/config';
import viteConfig from './vite.config';

// Reuse the app's Vite config (the `move` / `@move-specs` aliases + the React
// plugin + CSS-module handling) so tests resolve and render exactly like the
// docs do. `css: true` makes CSS modules return their real scoped class names,
// which the toast drift test compares.
export default mergeConfig(viteConfig, {
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    css: true,
  },
});
