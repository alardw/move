#!/usr/bin/env node
/**
 * Variant-styling guard (source-10).
 *
 * A component's CSS styles by variant/size through attribute selectors —
 * `[data-variant="primary"]`, `[data-size="sm"]`. If the CSS targets one but no
 * source file actually sets the attribute, those rules never match and the
 * variant/size prop has no visual effect — a dead prop.
 *
 * For each component: every `[data-variant` / `[data-size` its CSS targets must be
 * emitted by some .tsx in the same component — as a JSX attribute (`data-x=`) or
 * an object key in a conditional spread (`{ 'data-x': … }`).
 *
 * Scope is variant + size, which the component owns. `data-state` is excluded:
 * Radix primitives set it, so a component legitimately may not write it itself.
 *
 * Escape hatch: `data-attrs-ignore` in the CSS file skips it.
 *
 * Exit 0 = clean, 1 = a CSS-targeted attribute the source never sets.
 */
import { readdirSync, statSync, readFileSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const MOVE_ROOT = join(HERE, '..', '..');
const COMPONENTS = join(MOVE_ROOT, 'src', 'components');
const ATTRS = ['variant', 'size'];
const IGNORE = 'data-attrs-ignore';

function walk(dir, pred, out = []) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p, pred, out);
    else if (pred(p)) out.push(p);
  }
  return out;
}

const cssFiles = walk(COMPONENTS, (p) => p.endsWith('.module.css')).sort();
const violations = [];
let checked = 0;

for (const css of cssFiles) {
  const cssText = readFileSync(css, 'utf8');
  if (cssText.includes(IGNORE)) continue;
  const targeted = ATTRS.filter((a) => new RegExp(`\\[data-${a}[=\\]]`).test(cssText));
  if (targeted.length === 0) continue;

  // The component's own source — every non-test .tsx beside the CSS.
  const dir = dirname(css);
  const src = walk(dir, (p) => p.endsWith('.tsx') && !p.endsWith('.test.tsx'))
    .map((f) => readFileSync(f, 'utf8'))
    .join('\n');

  for (const attr of targeted) {
    checked++;
    const emitted =
      new RegExp(`data-${attr}=`).test(src) || new RegExp(`['"]data-${attr}['"]`).test(src);
    if (!emitted) {
      violations.push(
        `${relative(MOVE_ROOT, css)}: CSS targets [data-${attr}] but no source sets data-${attr} — the ${attr} prop has no visual effect`,
      );
    }
  }
}

if (violations.length) {
  console.error(`✗ data-attrs: ${violations.length} variant/size selector(s) with no matching attribute.\n`);
  for (const v of violations) console.error(`  ${v}`);
  process.exit(1);
}
console.log(`✓ data-attrs: ${checked} variant/size selector group(s) — every styled attribute is set by the source.`);
process.exit(0);
