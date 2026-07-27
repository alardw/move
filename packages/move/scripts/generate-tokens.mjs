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
  PALETTE_ROLES,
  SHADES,
  SOLID_SHADE,
  STATIC_COLORS,
  borderValue,
  fgSolidToken,
  semanticShades,
} from '../src/styles/themes/palette.ts';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..');
const TARGET = join(ROOT, 'src/styles/tokens/primitives/colors.css');
const SEMANTIC_TARGET = join(ROOT, 'src/styles/tokens/palette-semantic.css');
const ACCENTS_TARGET = join(ROOT, 'src/styles/tokens/accents.css');

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
      `  --move-${p.name}-solid: var(--move-${p.name}-${SOLID_SHADE});`,
      `  --move-${p.name}-border: ${borderValue(p.name)};`,
      `  --move-${p.name}-fg-solid: var(${fgSolidToken(p.name)});`,
    ];
  });

  return `/*
 * Palette — semantic roles per categorical color.
 *
 * Five roles, the categorical counterpart of the brand's --move-primary /
 * --move-link / --move-primary-fg:
 *   -text:     colored text readable on the page background AND on -soft-bg
 *   -soft-bg:  subtle tinted background
 *   -solid:    saturated fill
 *   -border:   the fill's edge / an outline
 *   -fg-solid: text/icon on a solid fill
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


/**
 * The [data-color] → role mapping.
 *
 * Purely mechanical: each palette's five semantic tokens onto the five generic
 * role tokens components read. It was 13 hand-written blocks, which is 13 chances
 * to typo a palette name and get a silently unstyled colour.
 */
function renderAccents() {
  const blocks = PALETTE.map((p) =>
    [
      `[data-color='${p.name}'] {`,
      `  --move-accent-solid: var(--move-${p.name}-solid);`,
      `  --move-accent-solid-fg: var(--move-${p.name}-fg-solid);`,
      `  --move-accent-soft: var(--move-${p.name}-soft-bg);`,
      `  --move-accent-soft-fg: var(--move-${p.name}-text);`,
      `  --move-accent-border: var(--move-${p.name}-border);`,
      '}',
    ].join('\n'),
  );

  return `/*
 * Accent role tokens — the theme-owned color contract.
 *
 * The categorical \`color\` prop (Avatar, Badge, ChatBubble, Stepper, Timeline)
 * sets \`data-color\` on a component. These rules map each palette's semantic
 * tokens onto the generic ROLE tokens the components consume:
 *
 *   --move-accent-solid      saturated fill (solid surfaces)
 *   --move-accent-solid-fg   text/icon on a solid fill
 *   --move-accent-soft       soft tinted background
 *   --move-accent-soft-fg    text on a soft background
 *   --move-accent-border     border / outline
 *
 * Every value on the right is a THEME token (see themes/defineTheme.ts), so a
 * theme owns all five and nothing here reaches past it into a raw ramp stop.
 *
 * A consumer theme adds a color with one rule — after augmenting the
 * \`MoveColors\` type — and it renders across every categorical component:
 *
 *   declare module 'move' { interface MoveColors { sage: true } }   // types
 *
 *   [data-color='sage'] {                                            // styling
 *     --move-accent-solid:    #5b7f5b;
 *     --move-accent-solid-fg: #ffffff;
 *     --move-accent-soft:     #eef3ee;
 *     --move-accent-soft-fg:  #2c3f2c;
 *     --move-accent-border:   #466446;
 *   }
 *
 * Those five are on you to make legible: the engine clamps the palettes it
 * generates, and cannot reach a color it has never seen.
 *
 * GENERATED from src/styles/themes/palette.ts — do not edit by hand.
 * Run \`npm run gen:tokens\` after adding a palette.
 */

${blocks.join('\n')}
`;
}

const OUTPUTS = [
  { path: TARGET, render, label: `${PALETTE.length * SHADES.length + STATIC_COLORS.length} primitives` },
  { path: SEMANTIC_TARGET, render: renderSemantic, label: `${PALETTE.length * PALETTE_ROLES.length} semantic roles` },
  {
    path: ACCENTS_TARGET,
    render: renderAccents,
    label: `${PALETTE.length} × ${PALETTE_ROLES.length} role mappings`,
  },
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

if (check)
  console.log(`✓ tokens-surface: colors.css + palette-semantic.css + accents.css match palette.ts (${summary.join(', ')}).`);
