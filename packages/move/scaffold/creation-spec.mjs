/**
 * Creation spec — the single contract for standing up a new Move app.
 *
 * ONE source, two consumers:
 *   • `create-move` (the deterministic scaffolder) GENERATES a project that
 *     satisfies this spec — same options in, identical bytes out.
 *   • `move check` (the `creation` gate) VALIDATES a project against it — so a
 *     scaffold that drifts from the contract fails, and "a valid Move app" is a
 *     checkable fact rather than an assumption.
 *
 * Plain ESM + JSDoc (not a `.ts` `satisfies`) on purpose: the scaffolder and the
 * CLI checks are plain-node, no build step, so both must `import` this directly.
 *
 * @typedef {'sidebar' | 'top-nav' | 'minimal'} Shell
 * @typedef {'react-router' | 'tanstack' | 'none'} Router
 * @typedef {'lucide' | 'none'} Icons
 * @typedef {'light' | 'dark'} Theme
 * @typedef {'github' | 'none'} Ci
 * @typedef {{ shell: Shell, router: Router, icons: Icons, theme: Theme, ci: Ci }} CreationOptions
 *
 * @typedef {Object} ScaffoldFile
 * @property {string} path                 Path relative to the project root.
 * @property {boolean} [dir]               True if this is a directory, not a file.
 * @property {(o: CreationOptions) => boolean | boolean} required  Whether the app must have it.
 * @property {string} role                 One-line description of what it's for.
 * @property {string[]} [mustContain]      Substrings the file must contain (source-file invariants).
 */

export const CREATION_SCHEMA_VERSION = 1;

/** Allowed values per option — the flag surface of `create-move`. */
export const OPTION_VALUES = {
  shell: /** @type {Shell[]} */ (['sidebar', 'top-nav', 'minimal']),
  router: /** @type {Router[]} */ (['react-router', 'tanstack', 'none']),
  // Only lucide + none for now: Move's internal icon vocabulary is Lucide-flavored,
  // so lucide resolves out of the box. A library whose names diverge (Heroicons,
  // etc.) needs a *mapped* resolver, not the naive one — see /customize/icons, and
  // the future app-icon-adapter skill (notes/TODO.md). Bring-your-own is always
  // possible by hand-writing the resolver; it's just not a one-flag scaffold option.
  icons: /** @type {Icons[]} */ (['lucide', 'none']),
  theme: /** @type {Theme[]} */ (['light', 'dark']),
  // Which CI provider binding to drop in. The gates themselves are npm scripts
  // (check + test:a11y) any pipeline can call — `github` just adds an Actions
  // workflow that runs them; `none` leaves CI to the consumer.
  ci: /** @type {Ci[]} */ (['github', 'none']),
};

/** @type {CreationOptions} */
export const DEFAULT_OPTIONS = {
  shell: 'sidebar',
  router: 'react-router',
  icons: 'lucide',
  theme: 'light',
  ci: 'github',
};

// ---------------------------------------------------------------------------
// package.json contract
// ---------------------------------------------------------------------------

/** Dependencies every Move app has, regardless of options. */
export const BASE_DEPS = {
  move: 'latest',
  react: '^19.0.0',
  'react-dom': '^19.0.0',
  animejs: '^4.0.0',
};

/**
 * Dev-dependencies every Move app has — includes the render-time a11y ratchet
 * stack. Kept in line with the versions the `move` package itself builds and
 * tests against, so a scaffolded app and Move never diverge on the toolchain.
 */
export const BASE_DEV_DEPS = {
  '@types/react': '^19.0.0',
  '@types/react-dom': '^19.0.0',
  '@vitejs/plugin-react': '^5.1.2',
  typescript: '^5.6.0',
  vite: '^7.2.7',
  vitest: '^4.0.18',
  jsdom: '^28.1.0',
  'axe-core': '^4.12.0',
  '@testing-library/react': '^16.3.0',
  '@testing-library/jest-dom': '^6.9.0',
};

/** Deps added by each option value. */
export const OPTION_DEPS = {
  router: {
    'react-router': { 'react-router-dom': '^7.0.0' },
    tanstack: { '@tanstack/react-router': '^1.0.0' },
    none: {},
  },
  icons: {
    lucide: { 'lucide-react': '^0.560.0' },
    none: {},
  },
};

/**
 * Scripts every app must expose. The `check` + `test:a11y` pair is what wires the
 * conformance gates in from the first commit — the "gates for free" guarantee.
 */
export const REQUIRED_SCRIPTS = {
  dev: 'vite',
  build: 'tsc -b && vite build',
  preview: 'vite preview',
  typecheck: 'tsc --noEmit',
  check: 'move check',
  test: 'vitest run',
  'test:a11y': 'vitest run src/conformance/accessibility.test.tsx',
};

// ---------------------------------------------------------------------------
// move.config.json contract — where the gates look
// ---------------------------------------------------------------------------
// A Move app holds two kinds of authored code, each with its own home + gate:
//   • src/components — custom components from the /component-generate-* pipeline
//     (checked by strict-props + theme; a component MAY use raw HTML, it's a primitive)
//   • src/composites — compositions from /app-compose (checked by purity +
//     composite-spec-drift; a composite is 100% Move components)
// Both are stated explicitly so the consumer sees both homes in their config.

export const MOVE_CONFIG = {
  check: {
    components: 'src/components',
    composites: 'src/composites',
  },
};

// ---------------------------------------------------------------------------
// File manifest — what a valid app contains, with per-file invariants
// ---------------------------------------------------------------------------

/** @type {ScaffoldFile[]} */
export const FILES = [
  { path: 'package.json', required: true, role: 'Deps + the dev/build/check/test:a11y scripts', mustContain: ['"move"', '"check"'] },
  { path: 'move.config.json', required: true, role: 'Points the conformance gates at src/components + src/composites', mustContain: ['"check"', 'components', 'composites'] },
  { path: 'index.html', required: true, role: 'Vite HTML entry' },
  { path: 'tsconfig.json', required: true, role: 'TypeScript config' },
  { path: 'vite.config.ts', required: true, role: 'Vite config', mustContain: ['@vitejs/plugin-react'] },
  { path: 'src/App.tsx', required: true, role: 'Root — MoveRoot + shell + routes', mustContain: ['MoveRoot', 'move/styles.css'] },
  { path: 'src/components', dir: true, required: true, role: 'Where the /component-generate-* pipeline writes your custom components' },
  { path: 'src/composites', dir: true, required: true, role: 'Where /app-compose writes your compositions' },

  // The conformance harness — the render-time a11y ratchet, scaffolded in from day
  // one. Grouped under src/conformance/ so the gate is self-contained, not loose
  // among app code.
  { path: 'src/conformance/accessibility.test.tsx', required: true, role: 'Render-time a11y ratchet (axe over rendered composites)', mustContain: ['axe', 'MoveRoot'] },
  { path: 'src/conformance/accessibility.baseline.json', required: true, role: 'a11y ratchet baseline (starts empty)' },
  // Provider-specific CI binding — dropped in by default, but not part of the
  // required contract: the portable guarantee is the `check` + `test:a11y` npm
  // scripts above, which any pipeline (GitLab, Circle, …) can call. Required only
  // when the app opted into the GitHub binding.
  { path: '.github/workflows/checks.yml', required: (o) => o.ci === 'github', role: 'Optional GitHub Actions binding: runs check + test:a11y', mustContain: ['move check', 'test:a11y'] },

  // AI tooling — the skills, installed into both agents' folders.
  { path: '.claude/skills', dir: true, required: true, role: 'Move skills for Claude Code' },
  { path: '.agents/skills', dir: true, required: true, role: 'Move skills for Codex' },

  { path: 'README.md', required: true, role: 'Getting-started readme' },
  { path: '.gitignore', required: true, role: 'Ignore node_modules, dist, etc.' },
];

/**
 * Resolve the full dependency + devDependency maps for a given option set.
 * Pure — same options in, same maps out. The scaffolder writes these; the
 * creation gate re-derives them to check package.json.
 * @param {CreationOptions} options
 */
export function resolveDeps(options) {
  const deps = { ...BASE_DEPS };
  const devDeps = { ...BASE_DEV_DEPS };
  Object.assign(deps, OPTION_DEPS.router[options.router] ?? {});
  Object.assign(deps, OPTION_DEPS.icons[options.icons] ?? {});
  return { deps, devDeps };
}

/**
 * The files a project must contain for a given option set (resolves any
 * option-conditional `required` predicates).
 * @param {CreationOptions} options
 */
export function requiredFiles(options) {
  return FILES.filter((f) => (typeof f.required === 'function' ? f.required(options) : f.required));
}

/** The whole contract, as one object, for convenience. */
export const creationSpec = {
  schemaVersion: CREATION_SCHEMA_VERSION,
  optionValues: OPTION_VALUES,
  defaultOptions: DEFAULT_OPTIONS,
  packageJson: {
    baseDeps: BASE_DEPS,
    baseDevDeps: BASE_DEV_DEPS,
    optionDeps: OPTION_DEPS,
    requiredScripts: REQUIRED_SCRIPTS,
  },
  moveConfig: MOVE_CONFIG,
  files: FILES,
};
