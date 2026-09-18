#!/usr/bin/env node
/**
 * A hook beside a component is called by something, and its spec says so.
 *
 * `useDatePicker` was 444 lines of public API that nothing called. Not the
 * component — `DatePicker.tsx` keeps its own state and never imported it — not
 * the docs, not a test. It was a second implementation of the picker's
 * behaviour, exported from the package root, and it drifted: a bug fixed in the
 * component in the morning was still present in the hook in the afternoon,
 * because fixing one place cannot fix the other. Both copies then had to be
 * found by hand.
 *
 * That is the cost this catches. A hook nobody calls is not dormant, it is
 * WRONG — it says the library behaves in a way that nothing demonstrates, and a
 * consumer who reaches for it gets the version of the behaviour that stopped
 * being maintained.
 *
 * A caller can be anywhere that exercises it: the component, a sibling hook
 * (`useCarousel` drives `useCarouselAnimation`), a test, or a docs sample —
 * `useTableSelection` is called by no component, and rightly so, because the
 * selection it holds belongs to the call site; the docs sample is what proves
 * it works.
 *
 * The second half keeps the spec honest about it. `hasHook` is what the
 * generator reads and what the docs print, so a spec claiming a hook the folder
 * does not ship promises an import that fails, and a spec denying one it does
 * ship hides it from every reader.
 *
 * @enforces exports-7
 * @instead delete the hook and its exports, or give it a caller — a docs sample
 *   is the honest one, because it is also the thing that shows a consumer what
 *   the hook is for. If the component keeps its own copy of the state, the hook
 *   is a duplicate and the copy is the one being maintained.
 *
 * Exit: 0 = clean, 1 = a hook nobody calls, or a spec that misreports one.
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, dirname, relative, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const MOVE = join(HERE, '..', '..');
const SRC = join(MOVE, 'src');
const COMPONENTS = join(SRC, 'components');
const DOCS = join(MOVE, '..', 'docs', 'src');

/** Every .ts/.tsx under a root, as [path, source]. */
function sources(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      if (entry === 'node_modules' || entry === 'dist') continue;
      sources(full, out);
    } else if (/\.tsx?$/.test(entry)) {
      out.push([full, readFileSync(full, 'utf8')]);
    }
  }
  return out;
}

const library = sources(SRC);
const docs = sources(DOCS);
const problems = [];

/** `src/components/{category}/{Name}` */
const componentDirs = [];
for (const category of readdirSync(COMPONENTS)) {
  const catDir = join(COMPONENTS, category);
  if (!statSync(catDir).isDirectory()) continue;
  for (const name of readdirSync(catDir)) {
    const dir = join(catDir, name);
    if (statSync(dir).isDirectory() && !name.startsWith('_')) componentDirs.push({ name, dir });
  }
}

for (const { name, dir } of componentDirs) {
  const hookFiles = readdirSync(dir).filter((f) => /^use[A-Z][A-Za-z]*\.ts$/.test(f));
  const barrel = join(dir, 'index.ts');
  const barrelSrc = existsSync(barrel) ? readFileSync(barrel, 'utf8') : '';

  // ── Every hook has a caller ────────────────────────────────────────────────
  for (const file of hookFiles) {
    const hook = basename(file, '.ts');
    const self = join(dir, file);
    const word = new RegExp(`\\b${hook}\\b`);
    // A barrel re-export is not a use: it is the door, not someone walking
    // through it. That distinction is the whole check — `useDatePicker` was
    // named in two barrels and called from nowhere.
    const calledInLibrary = library.some(
      ([p, s]) => p !== self && basename(p) !== 'index.ts' && word.test(s),
    );
    const calledInDocs = docs.some(([, s]) => word.test(s));
    if (!calledInLibrary && !calledInDocs) {
      problems.push(
        `exports-7|${relative(MOVE, self)} — nothing calls ${hook}. Not ${name}, not a sibling, ` +
          `not a test, not a docs sample. It is only named by the barrels that export it`,
      );
    }
  }

  // ── The spec reports what the folder ships ─────────────────────────────────
  const specPath = join(dir, `${name}.spec.ts`);
  if (!existsSync(specPath)) continue;
  const claim = readFileSync(specPath, 'utf8').match(/\bhasHook:\s*(true|false)/);
  const ships = hookFiles.some((f) => new RegExp(`\\b${basename(f, '.ts')}\\b`).test(barrelSrc));
  if (!claim) {
    if (ships) problems.push(`exports-7|${name}.spec.ts declares no hasHook, but the component exports a hook`);
    continue;
  }
  const claimed = claim[1] === 'true';
  if (claimed && !ships) {
    problems.push(
      `exports-7|${name}.spec.ts says hasHook: true, but ${name}/index.ts exports no hook — ` +
        `the docs print a hook a consumer cannot import`,
    );
  }
  if (!claimed && ships) {
    problems.push(
      `exports-7|${name}.spec.ts says hasHook: false, but ${name}/index.ts exports one — ` +
        `a hook no reader is told about`,
    );
  }
}

if (problems.length) {
  console.error(`\n✗ component-hooks: ${problems.length} problem(s).\n`);
  for (const p of problems) {
    const [rule, ...rest] = p.split('|');
    console.error(`  [${rule}] ${rest.join('|')}`);
  }
  console.error(
    `\n  A hook with no caller is a second implementation of behaviour the component\n` +
      `  already has, and it is the copy that stops being maintained.\n`,
  );
  process.exit(1);
}

const hookCount = componentDirs.reduce(
  (n, { dir }) => n + readdirSync(dir).filter((f) => /^use[A-Z][A-Za-z]*\.ts$/.test(f)).length,
  0,
);
console.log(
  `✓ component-hooks: ${hookCount} component hook(s) — every one is called, and every spec reports what it ships.`,
);
