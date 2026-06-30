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
import { readdirSync, statSync, readFileSync, existsSync } from 'node:fs';
import { join, dirname, relative, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const MOVE_ROOT = join(HERE, '..', '..');
const COMPONENTS = join(MOVE_ROOT, 'src', 'components');

// Inline-<svg> exemptions: loading animations + Radix indicator glyphs.
const SVG_EXEMPT = /\/(Loader|Checkbox)\//;

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
  // A1: the main component file ({Name}.tsx in a {Name}/ folder) opens with 'use client'.
  if (basename(f, '.tsx') === basename(dirname(f)) && (lines[0] ?? '').trim() !== "'use client';") {
    violations.push({ file: f, line: 1, rule: 'A1', msg: "missing 'use client'; at line 1" });
  }
  lines.forEach((line, i) => {
    if (/<svg[\s>]/.test(line) && !SVG_EXEMPT.test(f)) {
      violations.push({ file: f, line: i + 1, rule: 'A20', msg: 'inline <svg> — render via useResolvedIcon/<Icon>' });
    }
    if (/aria-label="/.test(line)) {
      violations.push({ file: f, line: i + 1, rule: 'E1', msg: 'hardcoded aria-label literal — source it from the labels object' });
    }
    if (/from\s+['"]\.\.\/(?:\.\.\/)*core[/'"]/.test(line)) {
      violations.push({ file: f, line: i + 1, rule: 'A11', msg: 'import from ../core — use the engine barrel' });
    }
  });
}

// Per-component structural rules: exports (C2), test file (G1), spec review
// (A17), and css token scope (B3).
const indexSrc = readFileSync(join(MOVE_ROOT, 'src', 'index.ts'), 'utf8');
for (const cat of readdirSync(COMPONENTS)) {
  const catDir = join(COMPONENTS, cat);
  if (!statSync(catDir).isDirectory()) continue;
  for (const comp of readdirSync(catDir)) {
    const compDir = join(catDir, comp);
    const specPath = join(compDir, `${comp}.spec.ts`);
    if (!statSync(compDir).isDirectory() || !existsSync(specPath)) continue;
    if (!new RegExp(`\\b${comp}\\b`).test(indexSrc)) {
      violations.push({ file: join(compDir, `${comp}.tsx`), line: 0, rule: 'C2', msg: 'not exported from src/index.ts' });
    }
    if (!existsSync(join(compDir, `${comp}.test.tsx`))) {
      violations.push({ file: join(compDir, `${comp}.test.tsx`), line: 0, rule: 'G1', msg: 'no test file' });
    }
    if (!/status:\s*'approved'/.test(readFileSync(specPath, 'utf8'))) {
      violations.push({ file: specPath, line: 0, rule: 'A17', msg: "defaultReview.status is not 'approved'" });
    }
    const cssPath = join(compDir, `${comp}.module.css`);
    if (existsSync(cssPath) && /:root\b/.test(readFileSync(cssPath, 'utf8'))) {
      violations.push({ file: cssPath, line: 0, rule: 'B3', msg: 'tokens on :root — scope to .root' });
    }
  }
}

if (!violations.length) {
  console.log('✓ component-conformance: clear (A1 A11 A17 A20 B3 C2 E1 G1).');
  process.exit(0);
}
console.error(`✗ component-conformance: ${violations.length} violation(s).\n`);
for (const v of violations) console.error(`  [${v.rule}] ${relative(MOVE_ROOT, v.file)}:${v.line} — ${v.msg}`);
process.exit(1);
