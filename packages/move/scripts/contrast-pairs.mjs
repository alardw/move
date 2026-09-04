#!/usr/bin/env node
/**
 * Which palette fills read against a given background?
 *
 * Two contrast guarantees look alike and only one of them exists. Every palette
 * colour pairs a fill with a foreground that is AA against THAT fill — that is
 * what `--move-{color}-fg-solid` means, and what check:theme-contrast verifies.
 * Nothing says anything about the surface the filled thing is placed ON, because
 * that is the call site's choice, not the palette's. A Badge on a filled nav
 * row, a Badge in a solid Button, a marker on a coloured Timeline: all the same
 * shape, and all invisible to every check we have.
 *
 * So this answers the question directly. Give it a background and it reports
 * every palette fill against it, at the WCAG 1.4.11 bar of 3:1 for a boundary
 * that carries meaning.
 *
 * A query tool, not a gate — it exits 0 whatever it finds, and is not in
 * check:all. The failures it reports are combinations nobody has written yet.
 *
 * Usage:
 *   node scripts/contrast-pairs.mjs                     # the sidebar's active row
 *   node scripts/contrast-pairs.mjs "#4c6ef5"
 *   node scripts/contrast-pairs.mjs --move-primary
 *   node scripts/contrast-pairs.mjs --move-surface-bg --shades
 */
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const SRC = join(HERE, '..', 'src');

const primitives = readFileSync(join(SRC, 'styles/tokens/primitives/colors.css'), 'utf8');
const semantic = readFileSync(join(SRC, 'styles/tokens/semantic.css'), 'utf8');
const badgeCss = readFileSync(join(SRC, 'components/data-display/Badge/Badge.module.css'), 'utf8');

const HEXES = Object.fromEntries(
  [...primitives.matchAll(/(--move-[a-z]+-\d+):\s*(#[0-9a-fA-F]{6})/g)].map((m) => [m[1], m[2]]),
);

/** Follow a token through `var()` indirection until it lands on a hex. */
function resolve(token, depth = 0) {
  const t = token.trim();
  if (t.startsWith('#')) return t;
  if (HEXES[t]) return HEXES[t];
  if (depth > 5) return null;
  const alias = new RegExp(`${t}:\\s*var\\((--move-[a-z0-9-]+)\\)`).exec(semantic + primitives);
  return alias ? resolve(alias[1], depth + 1) : null;
}

function luminance(hex) {
  const h = hex.replace('#', '');
  const channels = [0, 2, 4]
    .map((i) => parseInt(h.slice(i, i + 2), 16) / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function contrast(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/** The fill each Badge colour actually paints, read from the component's own CSS. */
function badgeSolids() {
  const out = {};
  for (const m of badgeCss.matchAll(/\.root\[data-color='(\w+)'\] \{([\s\S]*?)\}/g)) {
    const solid = /--_solid:\s*var\((--move-[a-z0-9-]+)\)/.exec(m[2]);
    const hex = solid && resolve(solid[1]);
    if (hex) out[m[1]] = hex;
  }
  return out;
}

/** Every shade of every palette, for when the question is "is there ANY that works". */
function allShades() {
  const out = {};
  for (const [token, hex] of Object.entries(HEXES)) out[token.replace('--move-', '')] = hex;
  return out;
}

const args = process.argv.slice(2);
const wantShades = args.includes('--shades');
const target = args.find((a) => a !== '--shades') ?? '--move-primary';
const bg = resolve(target);

if (!bg) {
  console.error(`✗ could not resolve ${target} to a colour.`);
  console.error('  Pass a hex ("#4c6ef5") or a token that reaches one ("--move-primary").');
  process.exit(1);
}

const candidates = wantShades ? allShades() : badgeSolids();
const label = wantShades ? 'palette shade' : 'Badge solid fill';
const rows = Object.entries(candidates)
  .map(([name, hex]) => ({ name, hex, ratio: contrast(hex, bg) }))
  .sort((a, b) => b.ratio - a.ratio);

const pass = rows.filter((r) => r.ratio >= 3);

console.log(`\n${label} against ${target} ${bg}`);
console.log('WCAG 1.4.11 asks 3:1 for a boundary that carries meaning.\n');
for (const r of rows) {
  const mark = r.ratio >= 3 ? '✓' : '·';
  console.log(`  ${mark} ${r.name.padEnd(14)} ${r.hex}  ${r.ratio.toFixed(2).padStart(5)}:1`);
}

console.log(`\n${pass.length}/${rows.length} clear 3:1.`);
if (pass.length === 0) {
  console.log(
    'None. A filled thing on this surface cannot be made to read by choosing a\n' +
      'better colour — use a treatment that derives from the surface instead, the\n' +
      'way Badge variant="inherit" takes its colours from currentColor.',
  );
}
