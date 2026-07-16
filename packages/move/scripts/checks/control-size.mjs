#!/usr/bin/env node
/**
 * Control-size scale integrity.
 *
 * Interactive controls must size from the shared `--move-control-height-*` scale
 * (sm 32 / md 38 / lg 44px) so the whole system scales together. A hardcoded
 * dimension in the control band silently forks its own scale — exactly the
 * Carousel deviation (prev/next at 30/42px instead of the tokens), which
 * `css-tokens` can't catch because it only validates that `var(--move-*)`
 * REFERENCES resolve, never that a raw value should have been a token.
 *
 * Flags: a literal `width` / `height` in the 24–48px band (1.5–3rem) inside a
 * component `*.module.css`. That band is where control heights live; decorative
 * sizes (a 4px dot) and layout caps (a 16rem max-width) fall outside it and are
 * ignored, keeping the signal high. `min-height` is deliberately NOT flagged —
 * it's a legitimate "at least" floor (a field row, a slot) that varies, not a
 * fixed control size.
 *
 * Escape hatch: append `/* size-exempt: <reason> *` + `/` on the SAME line for a
 * deliberately bespoke element (a pill toggle track, a dense editor field). The
 * comment forces the divergence to be a conscious, documented decision.
 *
 * Exit: 0 = clean (or every hit exempt), 1 = at least one un-exempt deviation.
 */
import { readdirSync, statSync, readFileSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const MOVE_ROOT = join(HERE, '..', '..');
const COMPONENTS = join(MOVE_ROOT, 'src', 'components');
const REPORT = process.argv.includes('--report');

const LO = 24;
const HI = 48;
const PROP = /^\s*(width|height)\s*:\s*([0-9.]+)(px|rem)\s*;/;

function walk(dir, out = []) {
  for (const e of readdirSync(dir)) {
    const f = join(dir, e);
    if (statSync(f).isDirectory()) walk(f, out);
    else if (e.endsWith('.module.css')) out.push(f);
  }
  return out;
}

const violations = [];
for (const file of walk(COMPONENTS)) {
  const lines = readFileSync(file, 'utf8').split('\n');
  lines.forEach((line, i) => {
    const m = PROP.exec(line);
    if (!m) return;
    const px = m[3] === 'rem' ? parseFloat(m[2]) * 16 : parseFloat(m[2]);
    if (px < LO || px > HI) return; // outside the control band — not our concern
    if (/size-exempt\s*:/.test(line)) return; // consciously bespoke
    violations.push({
      file: relative(MOVE_ROOT, file),
      line: i + 1,
      decl: `${m[1]}: ${m[2]}${m[3]}`,
    });
  });
}

if (violations.length === 0) {
  console.log('✓ control-size: no hardcoded control dimensions outside the shared scale.');
  process.exit(0);
}

console.error(
  `✗ control-size: ${violations.length} hardcoded control dimension(s) in the ${LO}–${HI}px band.`,
);
for (const v of violations) {
  console.error(`  ${v.file}:${v.line}  ${v.decl}`);
}
console.error(
  '\n  Use var(--move-control-height-sm|md|lg), or if the element is deliberately\n' +
    '  bespoke (a toggle track, a dense editor field) append `/* size-exempt: reason */`.',
);
process.exit(REPORT ? 0 : 1);
