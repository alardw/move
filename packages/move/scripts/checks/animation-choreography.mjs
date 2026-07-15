#!/usr/bin/env node
/**
 * Animation-pattern consistency.
 *
 * The spec's `animationPatterns` is the source of truth for which shared
 * animation patterns a component composes. This check verifies:
 *   1. Every `animationPatterns` value is a known shared pattern.
 *   2. The animation-map catalog's `components` list for each pattern matches
 *      exactly the set of components whose spec declares that pattern — so the
 *      generator reference and the specs can't drift.
 *
 * Exit: 0 = in sync, 1 = drift.
 */

import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFileSync } from 'node:fs';
import { loadSpec, listComponents, getProp, asArray } from './_familyShared.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const COMPONENTS_DIR = join(HERE, '..', '..', 'src', 'components');
const ANIMATION_MAP = join(HERE, '..', '..', 'skills', 'references', 'component', 'animation-map.ts');

// The 10 shared patterns (mirror ANIMATION_PATTERNS in spec-type.ts).
const SHARED = [
  'press', 'toggle', 'popupMenu', 'popupSurface', 'sidePanel',
  'disclosure', 'listReveal', 'layoutReveal', 'slidingIndicator', 'loader',
];

const errors = [];

// pattern → components, from the specs (source of truth)
const fromSpecs = Object.fromEntries(SHARED.map((p) => [p, new Set()]));
for (const c of listComponents(COMPONENTS_DIR)) {
  const spec = loadSpec(c.specFile);
  if (!spec) continue;
  const pats = asArray(getProp(spec, 'animationPatterns')) ?? [];
  for (const p of pats) {
    if (!SHARED.includes(p)) errors.push(`${c.name}: unknown animationPattern '${p}'`);
    else fromSpecs[p].add(c.name);
  }
}

// pattern → components, from the animation-map catalog
const mapText = readFileSync(ANIMATION_MAP, 'utf8');
for (const p of SHARED) {
  const m = mapText.match(new RegExp(`\\n  ${p}: \\{[\\s\\S]*?components: \\[([^\\]]*)\\]`));
  const cat = new Set(m ? [...m[1].matchAll(/['"]([^'"]+)['"]/g)].map((x) => x[1]) : []);
  const spec = fromSpecs[p];
  const inSpecNotCat = [...spec].filter((x) => !cat.has(x));
  const inCatNotSpec = [...cat].filter((x) => !spec.has(x));
  if (inSpecNotCat.length) errors.push(`'${p}': specs declare it but animation-map omits: ${inSpecNotCat.join(', ')}`);
  if (inCatNotSpec.length) errors.push(`'${p}': animation-map lists it but no spec declares: ${inCatNotSpec.join(', ')}`);
}

if (errors.length) {
  for (const e of errors) console.error(`  ✗ ${e}`);
  console.error(`\n  animation-patterns: ${errors.length} issue(s).`);
  process.exit(1);
}
console.log(`✓ animation-patterns: ${SHARED.length} shared patterns in sync across specs + catalog.`);
process.exit(0);
