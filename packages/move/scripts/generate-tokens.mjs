#!/usr/bin/env node
/**
 * Generate primitives/colors.css from the palette source of truth.
 *
 * The ramps live in src/styles/themes/palette.ts so TS can read them — the engine
 * derives the semantic layer from them, and the Theme Builder draws real swatches
 * instead of hand-copied approximations. This writes the CSS the browser needs.
 *
 * `--check` asserts the committed CSS matches the source, so the two can't drift
 * (same contract as generate-api.mjs / check:api-surface). Run `npm run gen:tokens`
 * after editing palette.ts.
 *
 * Usage: node scripts/generate-tokens.mjs [--check]   (via tsx — imports TS)
 *
 * @enforces none  (source↔artifact drift gate, not an entity rule)
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

import { PALETTE, SHADES, STATIC_COLORS } from '../src/styles/themes/palette.ts';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..');
const TARGET = join(ROOT, 'src/styles/tokens/primitives/colors.css');

const RULE = '='.repeat(42);

/** A section comment: the `/* ===` banner the file has always used. */
const banner = (lines) =>
  [`  /* ${RULE}`, ...lines.map((l) => `   * ${l}`), `   * ${RULE} */`].join('\n');

function render() {
  const blocks = PALETTE.map((p) =>
    [
      banner(p.note),
      ...SHADES.map((s, i) => `  --move-${p.name}-${s}: ${p.ramp[i]};`),
    ].join('\n'),
  );

  blocks.push(
    [banner(['Static colors']), ...STATIC_COLORS.map(([k, v]) => `  ${k}: ${v};`)].join('\n'),
  );

  return `/*
 * Primitive Color Tokens
 * Raw color values — Open Color (MIT) + Move gray scale.
 * Ramps ONLY: no value here answers to a contrast floor. The semantic layer
 * over these (-text, -soft-bg, -fg-solid) lives in ../semantic.css.
 *
 * GENERATED from src/styles/themes/palette.ts — do not edit by hand.
 * Run \`npm run gen:tokens\` after changing a ramp.
 */

:root {
${blocks.join('\n\n')}
}
`;
}

const next = render();
const rel = relative(ROOT, TARGET);

if (process.argv.includes('--check')) {
  const current = readFileSync(TARGET, 'utf8');
  if (current !== next) {
    console.error(`✗ tokens-surface: ${rel} does not match palette.ts`);
    console.error('  → run `npm run gen:tokens` and commit the result.');
    const a = current.split('\n');
    const b = next.split('\n');
    for (let i = 0; i < Math.max(a.length, b.length); i += 1) {
      if (a[i] !== b[i]) {
        console.error(`  first difference at line ${i + 1}:`);
        console.error(`    committed: ${JSON.stringify(a[i])}`);
        console.error(`    generated: ${JSON.stringify(b[i])}`);
        break;
      }
    }
    process.exit(1);
  }
  const count = PALETTE.length * SHADES.length + STATIC_COLORS.length;
  console.log(`✓ tokens-surface: ${rel} matches palette.ts (${count} primitives).`);
} else {
  writeFileSync(TARGET, next);
  console.log(`✓ gen:tokens: wrote ${rel}`);
}
