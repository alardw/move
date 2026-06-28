#!/usr/bin/env node
/**
 * Component source conformance (spec rules A20 + E1) — the grep-able subset of
 * /component-validate, promoted to CI.
 *
 *  A20 — Icons render through the resolver (`useResolvedIcon` / `<Icon>`), never a
 *        hardcoded inline `<svg>`. Exempt: genuine loading animations (Spinner,
 *        Loader) and indicator glyphs that are part of a Radix primitive's own
 *        rendering (Checkbox's checkmark, like the Radix Arrows).
 *  E1  — User-facing strings (incl. every aria-label) come from the component's
 *        `labels` object — never a hardcoded `aria-label="…"` literal in source.
 *
 * Scans component source only (`.tsx`, excluding `.test.tsx`).
 * Exit: 0 = clean, 1 = at least one violation.
 */
import { readdirSync, statSync, readFileSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const MOVE_ROOT = join(HERE, '..', '..');
const COMPONENTS = join(MOVE_ROOT, 'src', 'components');

// Inline-<svg> exemptions: loading animations + Radix indicator glyphs.
const SVG_EXEMPT = /\/(Spinner|Loader|Checkbox)\//;

function walk(dir, out = []) {
  for (const e of readdirSync(dir)) {
    const f = join(dir, e);
    if (statSync(f).isDirectory()) walk(f, out);
    else if (f.endsWith('.tsx') && !f.endsWith('.test.tsx')) out.push(f);
  }
  return out;
}

const violations = [];
for (const f of walk(COMPONENTS)) {
  const lines = readFileSync(f, 'utf8').split('\n');
  lines.forEach((line, i) => {
    if (/<svg[\s>]/.test(line) && !SVG_EXEMPT.test(f)) {
      violations.push({ file: f, line: i + 1, rule: 'A20', msg: 'inline <svg> — render via useResolvedIcon/<Icon>' });
    }
    if (/aria-label="/.test(line)) {
      violations.push({ file: f, line: i + 1, rule: 'E1', msg: 'hardcoded aria-label literal — source it from the labels object' });
    }
  });
}

if (!violations.length) {
  console.log('✓ component-conformance: no inline <svg> (A20) or hardcoded aria-label (E1) in component source.');
  process.exit(0);
}
console.error(`✗ component-conformance: ${violations.length} violation(s).\n`);
for (const v of violations) console.error(`  [${v.rule}] ${relative(MOVE_ROOT, v.file)}:${v.line} — ${v.msg}`);
process.exit(1);
