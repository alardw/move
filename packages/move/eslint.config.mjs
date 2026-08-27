import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  globalIgnores(['dist', 'demo', 'node_modules']),
  {
    files: ['src/**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      // Last: turn off any ESLint rules that would conflict with Prettier.
      prettier,
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

      // Complexity signals — target per-FUNCTION tangledness, not file line count
      // (a big file of small functions is fine; a single gnarly function is not).
      // Warnings for now: surface what trips before we commit to blocking thresholds.
      // Metric rules tuned to flag only genuine outliers, not the house style.
      // A warning nobody acts on is noise that buries the real ones, so the
      // thresholds sit just above the codebase's normal band — only the handful
      // of true monsters (complexity >25, >350 lines, depth >5) still warn.
      complexity: ['warn', 25],
      'max-depth': ['warn', 5],
      'max-lines-per-function': ['warn', { max: 350, skipBlankLines: true, skipComments: true }],
    },
  },
  {
    // Tests and specs legitimately nest long callbacks (describe/it) and large
    // data literals — the per-function length/complexity signals are just noise
    // there. Keep them scoped to real component/runtime code.
    files: ['src/**/*.{test,spec}.{ts,tsx}'],
    rules: {
      'max-lines-per-function': 'off',
      complexity: 'off',
      'max-depth': 'off',
    },
  },
  {
    // Component sources, for length only.
    //
    // A factory `setup` returns ONE render tree, so its length is the markup the
    // component has — a colour picker is a saturation field, three sliders, a
    // format toggle and a swatch grid, and a video player is its whole control
    // bar. Splitting by line count scatters that across helpers without making
    // any of it clearer, which is the same reason this repo has no file-size cap
    // and the same exemption tests already get.
    //
    // `complexity` and `max-depth` stay ON here on purpose: those measure
    // tangle, which is worth acting on wherever it appears. Length alone is not
    // gnarliness.
    files: ['src/components/**/*.tsx'],
    rules: {
      'max-lines-per-function': 'off',
    },
  },
]);
