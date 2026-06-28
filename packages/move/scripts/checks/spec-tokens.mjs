#!/usr/bin/env node
/**
 * Spec ↔ CSS token-value parity.
 *
 * Every `tokens: [{ name, value }]` entry in a spec must actually be defined in
 * the component's CSS module WITH THE SAME VALUE. Catches the drift the overlays
 * reconciliation surfaced: specs declaring pre-Surface values (e.g.
 * `--move-dialog-content-bg: var(--move-bg-subtle)`) while the CSS was migrated to
 * `var(--move-surface-bg)`, and specs declaring tokens the CSS never defines
 * (phantom tokens, e.g. Drawer's handle tokens hardcoded in CSS).
 *
 *   mismatch — spec value ≠ CSS value (compares the FIRST/base definition).
 *   phantom  — spec declares a token the CSS never defines.
 *
 * Pass --report to list without failing (dry-run).
 * Exit: 0 = parity (or --report), 1 = drift.
 */
import { readdirSync, statSync, readFileSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const MOVE_ROOT = join(HERE, '..', '..');
const COMPONENTS = join(MOVE_ROOT, 'src', 'components');
const REPORT = process.argv.includes('--report');

function walk(dir, out = []) {
  for (const e of readdirSync(dir)) {
    const f = join(dir, e);
    if (statSync(f).isDirectory()) walk(f, out);
    else if (/\.spec\.ts$/.test(e)) out.push(f);
  }
  return out;
}
const norm = (v) => v.replace(/\s+/g, ' ').trim();

const problems = [];
for (const specFile of walk(COMPONENTS).sort()) {
  const dir = dirname(specFile);
  const name = specFile.split('/').pop().replace('.spec.ts', '');
  const spec = readFileSync(specFile, 'utf8');
  // spec tokens: { name: '--move-x', value: '...' }
  const tokens = [...spec.matchAll(/\{\s*name:\s*'(--move-[a-z0-9-]+)'\s*,\s*value:\s*'([^']*)'/g)]
    .map((m) => ({ name: m[1], value: m[2] }));
  if (!tokens.length) continue;

  // Gather CSS from the component dir AND the category's _shared dir (Calendar/
  // players etc. define their tokens in _shared sub-component CSS).
  let css = '';
  const cssDirs = [dir, join(dirname(dir), '_shared')];
  for (const d of cssDirs) {
    let entries = [];
    try { entries = readdirSync(d); } catch { continue; }
    for (const f of entries) if (f.endsWith('.module.css')) css += readFileSync(join(d, f), 'utf8') + '\n';
  }

  for (const t of tokens) {
    // All values this token is defined with (base + any variant overrides).
    const values = [...css.matchAll(new RegExp(`${t.name}\\s*:\\s*([^;]+);`, 'g'))].map((m) => norm(m[1]));
    if (!values.length) {
      problems.push({ name, msg: `phantom — spec declares ${t.name} but CSS never defines it` });
    } else if (!values.includes(norm(t.value))) {
      problems.push({ name, msg: `mismatch — ${t.name}: spec '${norm(t.value)}' not among CSS [${[...new Set(values)].join(' | ')}]` });
    }
  }
}

if (!problems.length) {
  console.log('✓ spec-tokens: every spec token matches its CSS definition.');
  process.exit(0);
}
const head = `${REPORT ? '•' : '✗'} spec-tokens: ${problems.length} token drift(s) across ${new Set(problems.map((p) => p.name)).size} component(s).`;
console[REPORT ? 'log' : 'error'](head + '\n');
for (const p of problems) console[REPORT ? 'log' : 'error'](`  ${p.name}: ${p.msg}`);
process.exit(REPORT ? 0 : 1);
