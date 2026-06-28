#!/usr/bin/env node
/**
 * CSS token validity (spec rule B7).
 *
 * Every `var(--move-*)` reference WITHOUT a fallback must resolve to a real
 * token — otherwise the declaration silently does nothing (e.g. a typo'd
 * `--move-spacing-xxs` produces no padding). A `var(--move-x, fallback)` is
 * allowed even when `--move-x` is undefined: that's the intentional
 * consumer-overridable-token pattern, and the fallback keeps it working.
 *
 * Defined = any `--move-x:` declared in CSS (global tokens + component modules)
 * ∪ any `--move-x` referenced in a .ts/.tsx file (tokens set at runtime via JS,
 * e.g. Card's `--move-card-max-width`) ∪ tokens declared in the same file.
 *
 * Exit: 0 = all resolve, 1 = at least one undefined no-fallback reference.
 */
import { readdirSync, statSync, readFileSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const MOVE_ROOT = join(HERE, '..', '..');
const SRC = join(MOVE_ROOT, 'src');
const VERBOSE = process.argv.includes('--verbose');

function walk(dir, out = []) {
  for (const e of readdirSync(dir)) {
    const f = join(dir, e);
    if (statSync(f).isDirectory()) walk(f, out);
    else out.push(f);
  }
  return out;
}

const all = walk(SRC);
const defined = new Set();
for (const f of all) {
  const t = readFileSync(f, 'utf8');
  if (f.endsWith('.css')) for (const m of t.matchAll(/(--move-[a-z0-9-]+)\s*:/g)) defined.add(m[1]);
  if (f.endsWith('.ts') || f.endsWith('.tsx')) for (const m of t.matchAll(/(--move-[a-z0-9-]+)/g)) defined.add(m[1]);
}

const violations = [];
for (const f of all.filter((f) => f.endsWith('.module.css'))) {
  const t = readFileSync(f, 'utf8');
  const lines = t.split('\n');
  const local = new Set([...t.matchAll(/(--move-[a-z0-9-]+)\s*:/g)].map((m) => m[1]));
  // var(--move-x) with NO fallback → the closing paren follows the token directly.
  lines.forEach((line, i) => {
    for (const m of line.matchAll(/var\(\s*(--move-[a-z0-9-]+)\s*\)/g)) {
      const tok = m[1];
      if (!defined.has(tok) && !local.has(tok)) {
        violations.push({ file: f, line: i + 1, tok });
      }
    }
  });
}

if (!violations.length) {
  console.log(`✓ css-tokens: every no-fallback var(--move-*) resolves.`);
  process.exit(0);
}
console.error(`✗ css-tokens: ${violations.length} undefined token reference(s).\n`);
for (const v of violations) console.error(`  ${relative(MOVE_ROOT, v.file)}:${v.line} — var(${v.tok}) is not defined (add the token or a fallback)`);
process.exit(1);
