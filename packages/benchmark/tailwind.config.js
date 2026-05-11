import { heroui } from '@heroui/react';

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: { extend: {} },
  darkMode: 'class',
  // Preflight would reset Move's component styles globally. Disabled so
  // Tailwind only contributes utility + component layers HeroUI depends on.
  corePlugins: { preflight: false },
  plugins: [heroui()],
};
