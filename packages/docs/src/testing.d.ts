// Wire @testing-library/jest-dom's matchers into vitest's `expect` types so
// test files (e.g. recipe tests) typecheck, not just run. The matchers are
// registered at runtime via vitest.setup.ts.
import 'vitest';
import type { TestingLibraryMatchers } from '@testing-library/jest-dom/matchers';

declare module 'vitest' {
  interface Assertion<T = unknown> extends TestingLibraryMatchers<unknown, T> {}
  interface AsymmetricMatchersContaining
    extends TestingLibraryMatchers<unknown, unknown> {}
}
