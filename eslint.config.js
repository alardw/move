import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import tseslint from 'typescript-eslint';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  globalIgnores(['dist', 'demo', 'node_modules', '.storybook']),
  {
    files: ['src/**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      // The withMoveComponent factory calls setup() during render — hooks inside
      // setup are valid but the plugin can't understand this pattern.
      // The withMoveComponent factory calls setup() during render — hooks inside
      // setup are valid but the plugin can't understand this pattern.
      'react-hooks/rules-of-hooks': 'off',
      'react-hooks/refs': 'off',
      // React compiler rules — too strict for animation-heavy imperative code
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/react-compiler': 'off',
      'react-hooks/preserve-manual-memoization': 'off',
      'react-hooks/immutability': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      '@typescript-eslint/no-unused-expressions': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      'no-useless-assignment': 'warn',
    },
  },
]);
