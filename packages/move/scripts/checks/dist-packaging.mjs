#!/usr/bin/env node
/**
 * Published-artifact guard — runs against `dist/`, not `src/`.
 *
 * Every other check in this repo reads source. None of them can see the one
 * thing a consumer actually installs. Two of the worst bugs an external team hit
 * were invisible to all of them, because both were properties of the BUILD:
 *
 *   - `jsxDEV` in the shipped bundle. A dev-mode build got packed, so every
 *     consumer production build crashed. They shipped a local shim, and watched
 *     it come back with each tarball — because "fixed" meant one good build, not
 *     a guarantee.
 *   - React bundled into `dist/node_modules/react`. The consumer then ran two
 *     copies of React; hook state lives in a module-level global, so components
 *     called `useState` against one copy while the app rendered with the other.
 *     Both projects independently rediscovered `resolve.dedupe`.
 *
 * Both are one build-config change away from returning, and both return at pack
 * time — the moment nobody is looking. This asserts on the artifact instead.
 *
 * Wired into `pack` (between build and `npm pack`), where dist is guaranteed
 * fresh. It also runs in `check:all`, where dist may be absent or stale: it
 * SKIPS in that case and says so. A silent skip would be worse than no check,
 * because a green line that verified nothing is exactly the false assurance
 * these findings were about.
 *
 * @enforces exports-4 exports-5
 * @instead keep React and other peers in `external` in vite.config.ts, and build in production
 *   mode, so the package ships bare specifiers and no second copy of anything.
 */

import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const MOVE_ROOT = join(HERE, '..', '..');
const DIST = join(MOVE_ROOT, 'dist');

if (!existsSync(DIST)) {
  console.log('– dist-packaging: SKIPPED — no dist/. Run `npm run build` first (pack always does).');
  process.exit(0);
}

/** Every file under a directory, recursively. */
function walkFiles(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walkFiles(full, out);
    else out.push(full);
  }
  return out;
}

const files = walkFiles(DIST);
const js = files.filter((f) => /\.(mjs|js|cjs)$/.test(f));
const errors = [];

// 1. No dev-mode JSX runtime. `jsxDEV` is emitted only by a development build;
//    it does not exist in react/jsx-runtime's production export, so a consumer's
//    production build fails to resolve it.
const devJsx = js.filter((f) => /\bjsxDEV\b/.test(readFileSync(f, 'utf8')));
if (devJsx.length) {
  errors.push(
    `dev-mode JSX in the bundle — ${devJsx.length} file(s) reference jsxDEV, starting with ` +
      `${relative(MOVE_ROOT, devJsx[0])}. This is a development build being packed; every ` +
      `consumer production build will crash on it. Rebuild in production mode.`,
  );
}

// 2. No second copy of React. A bundled react/react-dom gives the consumer two
//    Reacts and breaks every hook and context across the boundary.
const bundledReact = files.filter((f) =>
  /[/\\]node_modules[/\\](react|react-dom)[/\\]/.test(f),
);
if (bundledReact.length) {
  errors.push(
    `React is bundled into the package — ${relative(MOVE_ROOT, bundledReact[0])}. React must ` +
      `stay external so the consumer's copy is the only one. Add it to \`external\` in ` +
      `vite.config.ts.`,
  );
}

// 3. React is reached by BARE specifier everywhere. A relative or absolute path
//    to React is the same defect as (2) with the copy somewhere else — and it is
//    what (2) alone would miss.
const badSpecifier = [];
for (const f of js) {
  const src = readFileSync(f, 'utf8');
  for (const m of src.matchAll(/from\s*["']([^"']*react(?:-dom)?(?:\/[^"']*)?)["']/g)) {
    const spec = m[1];
    const isBare = /^react(-dom)?(\/.*)?$/.test(spec);
    // A path into a bundled package that merely has "react" in its NAME
    // (react-remove-scroll, @radix-ui/react-slot) is fine — those are Radix's
    // own deps and legitimately vendored.
    const isVendoredDep = spec.includes('node_modules') || spec.startsWith('.');
    if (!isBare && !isVendoredDep) badSpecifier.push(`${relative(MOVE_ROOT, f)}: '${spec}'`);
  }
}
if (badSpecifier.length) {
  errors.push(
    `React reached by a non-bare specifier, so it resolves to something other than the ` +
      `consumer's copy:\n      ${badSpecifier.slice(0, 5).join('\n      ')}`,
  );
}

if (errors.length) {
  console.error(`\n✗ dist-packaging: ${errors.length} problem(s) in the published artifact.\n`);
  for (const e of errors) console.error(`  - ${e}\n`);
  process.exit(1);
}

console.log(
  `✓ dist-packaging: ${js.length} bundled file(s) — no dev-mode JSX, no second React, ` +
    `React reached by bare specifier.`,
);
