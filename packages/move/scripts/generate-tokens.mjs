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

import {
  PALETTE,
  SHADES,
  STATIC_COLORS,
  fgSolidToken,
  semanticShades,
} from '../src/styles/themes/palette.ts';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..');
const TARGET = join(ROOT, 'src/styles/tokens/primitives/colors.css');
const SEMANTIC_TARGET = join(ROOT, 'src/styles/tokens/palette-semantic.css');

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

/**
 * The per-palette semantic roles, as the no-theme fallback.
 *
 * defineTheme emits these as theme tokens and ThemeProvider applies them, so this
 * block only renders when Move's CSS is used without a theme. It was hand-written
 * in semantic.css and had drifted from darkTheme in 8 of 26 values — invisible
 * precisely because a theme normally covers it. Same source now, so it can't.
 */
function renderSemantic() {
  const rows = PALETTE.flatMap((p) => {
    const s = semanticShades(p.name, 'dark');
    return [
      `  --move-${p.name}-text: var(--move-${p.name}-${s.text});`,
      `  --move-${p.name}-soft-bg: var(--move-${p.name}-${s.softBg});`,
      `  --move-${p.name}-fg-solid: var(${fgSolidToken(p.name)});`,
    ];
  });

  return `/*
 * Palette — semantic roles per categorical color.
 *
 * Three roles, the categorical counterpart of the brand's --move-primary /
 * --move-link / --move-primary-fg:
 *   -text:     colored text readable on the page background AND on -soft-bg
 *   -soft-bg:  subtle tinted background
 *   -fg-solid: text/icon on a solid fill of shades 5–9
 *
 * Each owes a contrast ratio against a specific background, which is what makes
 * them semantic rather than primitive (the raw ramps are in primitives/colors.css).
 * accents.css maps them onto the --move-accent-* roles per [data-color].
 *
 * These are the DARK-theme values, serving as the no-theme fallback; defineTheme
 * emits the per-appearance set and ThemeProvider applies it over this.
 *
 * GENERATED from src/styles/themes/palette.ts — do not edit by hand.
 * Run \`npm run gen:tokens\` after changing a shade choice.
 */

:root {
${rows.join('\n')}
}
`;
}

const OUTPUTS = [
  { path: TARGET, render, label: `${PALETTE.length * SHADES.length + STATIC_COLORS.length} primitives` },
  { path: SEMANTIC_TARGET, render: renderSemantic, label: `${PALETTE.length * 3} semantic roles` },
];

const check = process.argv.includes('--check');
const summary = [];

for (const out of OUTPUTS) {
  const next = out.render();
  const rel = relative(ROOT, out.path);

  if (!check) {
    writeFileSync(out.path, next);
    console.log(`✓ gen:tokens: wrote ${rel}`);
    continue;
  }

  const current = readFileSync(out.path, 'utf8');
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
  summary.push(out.label);
}

if (check) console.log(`✓ tokens-surface: colors.css + palette-semantic.css match palette.ts (${summary.join(', ')}).`);
