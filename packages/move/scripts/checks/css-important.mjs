#!/usr/bin/env node
/**
 * No `!important` in component CSS.
 *
 * `!important` doesn't just win against the rule it was aimed at — it wins
 * against the CONSUMER. A theme token, an `sp` slot-prop style, or an app's own
 * class cannot override a declaration marked important without escalating to
 * `!important` in turn. For a library whose override model is tokens + slot
 * props + theming, that is the library beating the people using it, to settle an
 * argument it was having with itself.
 *
 * Every occurrence here had the same cause: a component that COMPOSES another
 * (ToggleGroup.Item, the media-player controls) needs to outrank the composed
 * component's own rules, the two stylesheets meet at equal specificity, and CSS
 * Modules gives no control over source order between them. `!important` is the
 * blunt way out of that; cascade layers are the precise one.
 *
 * The mechanism: a composed primitive declares its styles inside
 * `@layer move.base { … }`. Unlayered rules beat every layered rule regardless
 * of specificity, so the composing component simply wins — and the consumer,
 * also unlayered, still beats both. That is the ordering `!important` inverts.
 *
 * Escape hatch: append `/* important-exempt: <reason> *` + `/` on the SAME line.
 * The genuine cases are declarations fighting something layers cannot reach —
 * inline styles set by a third-party primitive (Radix positioning), or UA
 * styles on a replaced element like <video>. Those are real; the comment makes
 * each one a documented decision rather than a habit.
 *
 * Exit: 0 = clean (or every hit exempt), 1 = at least one un-exempt use.
 *
 * @enforces styles-10
 */
import { readdirSync, statSync, readFileSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const MOVE_ROOT = join(HERE, '..', '..');
const SRC = join(MOVE_ROOT, 'src');
const REPORT = process.argv.includes('--report');

function walk(dir, out = []) {
  for (const e of readdirSync(dir)) {
    const f = join(dir, e);
    if (statSync(f).isDirectory()) walk(f, out);
    else if (e.endsWith('.css')) out.push(f);
  }
  return out;
}

/** Blank out comments, newlines preserved, so line numbers still line up and a
 *  MULTI-line comment mentioning the word isn't read as a use of it. */
function stripComments(src) {
  return src.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '));
}

const violations = [];
for (const file of walk(SRC)) {
  const raw = readFileSync(file, 'utf8');
  const lines = raw.split('\n');
  const codeLines = stripComments(raw).split('\n');
  codeLines.forEach((code, i) => {
    const line = lines[i];
    if (!/!\s*important/.test(code)) return;
    if (/important-exempt\s*:/.test(line)) return; // documented, deliberate
    violations.push({
      file: relative(MOVE_ROOT, file),
      line: i + 1,
      decl: line.trim().slice(0, 80),
    });
  });
}

if (violations.length === 0) {
  console.log('✓ css-important: no !important in component CSS.');
  process.exit(0);
}

const byFile = new Map();
for (const v of violations) byFile.set(v.file, (byFile.get(v.file) ?? 0) + 1);

console.error(
  `✗ css-important: ${violations.length} use(s) of !important across ${byFile.size} file(s).`,
);
for (const v of violations) {
  console.error(`  ${v.file}:${v.line}  ${v.decl}`);
}
console.error(
  '\n  !important outranks the consumer: no token, sp slot-prop style or app class\n' +
    '  can override it without escalating in turn.\n' +
    '  To outrank a component you COMPOSE, put that component’s styles in\n' +
    '  `@layer move.base { … }` — unlayered rules beat layered ones at any\n' +
    '  specificity, and the consumer stays unlayered and on top.\n' +
    '  If the declaration is fighting an inline style or a UA style on a replaced\n' +
    '  element (layers cannot reach either), append `/* important-exempt: reason */`.',
);
process.exit(REPORT ? 0 : 1);
