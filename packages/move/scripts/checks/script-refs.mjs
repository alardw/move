#!/usr/bin/env node
/**
 * Script-reference guard — every `npm run <script>` invoked by a git hook
 * (.githooks/*) or a CI workflow (.github/workflows/*) must resolve to a real
 * package script in the targeted workspace.
 *
 * Renaming or removing a script without updating the hook/workflow that calls it
 * silently breaks the gate: the hook errors "missing script" and reads as a
 * failure (exactly what `check:recipes` → `check:purity` did). check:all can't
 * catch this because it doesn't run the hooks/workflows. This does.
 *
 * Exit 0 = every reference resolves, 1 = at least one dangling reference.
 */
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = join(HERE, '..', '..', '..', '..'); // packages/move/scripts/checks → repo root

// ── workspace identifier → its package scripts ───────────────────────────────
// Keyed by both the package `name` and its directory basename, since
// `npm run … --workspace move` may reference either. '' = root (no --workspace).
const wsScripts = new Map();
const addPkg = (pkgPath, ...ids) => {
  if (!existsSync(pkgPath)) return;
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
  const scripts = new Set(Object.keys(pkg.scripts ?? {}));
  for (const id of ids) wsScripts.set(id, scripts);
  if (pkg.name) wsScripts.set(pkg.name, scripts);
};

addPkg(join(REPO, 'package.json'), ''); // root
const pkgDir = join(REPO, 'packages');
if (existsSync(pkgDir)) {
  for (const d of readdirSync(pkgDir)) {
    const p = join(pkgDir, d);
    if (statSync(p).isDirectory()) addPkg(join(p, 'package.json'), d);
  }
}

// ── files that invoke npm scripts ────────────────────────────────────────────
const files = [];
const pushDir = (dir, filter) => {
  if (!existsSync(dir)) return;
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isFile() && filter(f)) files.push(p);
  }
};
pushDir(join(REPO, '.githooks'), () => true);
pushDir(join(REPO, '.github', 'workflows'), (f) => /\.ya?ml$/.test(f));

// ── scan: `npm run <script> [--workspace <ws> | -w <ws>]` (per line) ──────────
const RUN = /npm run ([\w:.\-]+)/g;
const WS = /(?:--workspace[= ]|-w[= ])([\w@/.\-]+)/;

const errors = [];
let refs = 0;
for (const file of files) {
  const rel = relative(REPO, file);
  for (const line of readFileSync(file, 'utf8').split('\n')) {
    const wsMatch = line.match(WS);
    const ws = wsMatch ? wsMatch[1] : '';
    let m;
    RUN.lastIndex = 0;
    while ((m = RUN.exec(line))) {
      const script = m[1];
      refs++;
      const scripts = wsScripts.get(ws);
      if (!scripts) {
        errors.push(`${rel}: 'npm run ${script}' targets unknown workspace '${ws || '(root)'}'`);
      } else if (!scripts.has(script)) {
        errors.push(`${rel}: 'npm run ${script}${ws ? ` --workspace ${ws}` : ''}' — no such package script`);
      }
    }
  }
}

if (errors.length) {
  console.error(`✗ script-refs: ${errors.length} hook/workflow reference(s) point at a missing script`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}
console.log(`✓ script-refs: ${refs} hook/workflow npm-script references all resolve.`);
