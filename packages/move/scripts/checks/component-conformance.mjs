#!/usr/bin/env node
/**
 * Component source conformance (spec rules A20 + E1) — the grep-able subset of
 * /component-validate, promoted to CI.
 *
 *  A20 — Icons render through the resolver (`useResolvedIcon` / `<Icon>`), never a
 *        hardcoded inline `<svg>`. Exempt: genuine loading animations (Spinner,
 *        Loader), indicator glyphs that are part of a Radix primitive's own
 *        rendering (Checkbox's checkmark, like the Radix Arrows), and any
 *        `adapters/` folder — a renderer adapter draws graphics, not icons, and
 *        its SVG output is the whole point of the seam (Chart's built-in
 *        renderer). The rule still applies to the component's own source.
 *  E1  — User-facing strings (incl. every aria-label) come from the component's
 *        `labels` object — never a hardcoded `aria-label="…"` literal in source.
 *
 * Internal rule IDs (A1 B4 …) map to these coverage rules:
 * @enforces source-1 source-11 styles-3 styles-1 icons-1 exports-2 exports-3 i18n-1 fileLocation-1 fileLocation-2 unit-1
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

// Inline-<svg> exemptions: loading animations, Radix indicator glyphs, and
// renderer adapters (drawing layers, where emitting SVG is the contract).
const SVG_EXEMPT = /\/(Loader|Checkbox)\/|\/adapters\//;

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
    // Comments are prose, not source. Every rule below matches on TEXT, so a
    // comment that names the thing it is warning about trips the rule warning
    // about it — twice in one day: a JSDoc example writing `<Icon name="moon">`
    // was read as a missing icon, and the comment explaining this very fix was
    // read as an inline <svg>. Stripping them costs nothing; a line that is only
    // a comment has nothing else to check.
    if (/^\s*(?:\/\/|\/\*|\*)/.test(line)) return;

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
    // fileLocation-1 (F1): spec.category matches the folder it lives in.
    const catM = readFileSync(specPath, 'utf8').match(/category:\s*'([^']+)'/);
    if (catM && catM[1] !== cat) {
      violations.push({ file: specPath, line: 0, rule: 'F1', msg: `spec.category '${catM[1]}' != folder '${cat}'` });
    }
    // fileLocation-2 (F2): src/index.ts exports it from its real path.
    const pathM = new RegExp(`from '(\\./components/[^']*/${comp})'`).exec(indexSrc);
    if (pathM && pathM[1] !== `./components/${cat}/${comp}`) {
      violations.push({ file: specPath, line: 0, rule: 'F2', msg: `src/index.ts path '${pathM[1]}' != './components/${cat}/${comp}'` });
    }
    if (!new RegExp(`\\b${comp}\\b`).test(indexSrc)) {
      violations.push({ file: join(compDir, `${comp}.tsx`), line: 0, rule: 'C2', msg: 'not exported from src/index.ts' });
    }
    if (!existsSync(join(compDir, `${comp}.test.tsx`))) {
      violations.push({ file: join(compDir, `${comp}.test.tsx`), line: 0, rule: 'G1', msg: 'no test file' });
    }
    const cssPath = join(compDir, `${comp}.module.css`);
    if (existsSync(cssPath) && /:root\b/.test(readFileSync(cssPath, 'utf8'))) {
      violations.push({ file: cssPath, line: 0, rule: 'B3', msg: 'tokens on :root — scope to .root' });
    }
    // exports-3 (D1): a headless hook must be exported from the component's index.ts.
    const hookPath = join(compDir, `use${comp}.ts`);
    const compIndex = join(compDir, 'index.ts');
    if (existsSync(hookPath) && existsSync(compIndex) && !new RegExp(`\\buse${comp}\\b`).test(readFileSync(compIndex, 'utf8'))) {
      violations.push({ file: hookPath, line: 0, rule: 'D1', msg: `use${comp} hook not exported from index.ts` });
    }
    // styles-1 (B4): every declared slot has a matching .{slot} class in the CSS.
    const tsxPath = join(compDir, `${comp}.tsx`);
    if (existsSync(tsxPath) && existsSync(cssPath)) {
      const tsx = readFileSync(tsxPath, 'utf8');
      const css = readFileSync(cssPath, 'utf8');
      const slots = new Set();
      for (const m of tsx.matchAll(/slots:\s*\[([^\]]*)\]/g))
        for (const s of m[1].matchAll(/'([^']+)'/g)) slots.add(s[1]);
      for (const slot of slots)
        if (!new RegExp(`\\.${slot}\\b`).test(css)) violations.push({ file: cssPath, line: 0, rule: 'B4', msg: `slot '${slot}' has no .${slot} class` });
    }
  }
}

if (!violations.length) {
  console.log('✓ component-conformance: clear (A1 A11 A20 B3 B4 C2 D1 E1 F1 F2 G1).');
  process.exit(0);
}
console.error(`✗ component-conformance: ${violations.length} violation(s).\n`);
for (const v of violations) console.error(`  [${v.rule}] ${relative(MOVE_ROOT, v.file)}:${v.line} — ${v.msg}`);
process.exit(1);
