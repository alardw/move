#!/usr/bin/env node
/**
 * No slot props between Move's own components.
 *
 * `sp={{ slot: { … } }}` is the CONSUMER's escape hatch: it reaches past a
 * component's public surface to style a slot the component didn't expose. When
 * Move's own components use it on each other, three things follow, all bad:
 *
 *   1. It competes with the consumer for the same channel. Two classes land on
 *      one element at equal specificity, and which wins comes down to bundler
 *      source order — so the consumer's override becomes a coin flip.
 *   2. It hides a missing token. Reaching for a slot's className means the
 *      thing being restyled has no name in the component's vocabulary. The fix
 *      is to give it one, which every other consumer then gets too.
 *   3. It bypasses the composition the layout already implies. PlayerSettingsMenu
 *      reached into Popover's `contentInner` to paint a dark menu; expressed as
 *      Popover's own `--move-popover-content-*` tokens, the same look sets on the
 *      shell and inherits to where the surface is painted — a plain className,
 *      no slot, no cascade fight, and nothing left for `!important` to settle.
 *
 * So: an internal composition restyles through TOKENS, and takes a className on
 * the element it actually renders. If neither reaches, that is the signal to add
 * a token to the composed component, not to reach past it.
 *
 * Escape hatch: append `/* slot-props-exempt: <reason> *` + `/` on the SAME line
 * for a case that genuinely has no token vocabulary and cannot get one.
 *
 * Exit: 0 = clean (or every hit exempt), 1 = at least one internal slot prop.
 *
 * @enforces styles-11
 * @instead expose what the inner component needs as its own prop or component token, so the
 *   surface is public rather than reached past.
 */
import { readdirSync, statSync, readFileSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const MOVE_ROOT = join(HERE, '..', '..');
const COMPONENTS = join(MOVE_ROOT, 'src', 'components');
const REPORT = process.argv.includes('--report');

function walk(dir, out = []) {
  for (const e of readdirSync(dir)) {
    const f = join(dir, e);
    if (statSync(f).isDirectory()) walk(f, out);
    else if (e.endsWith('.tsx') && !e.includes('.test.')) out.push(f);
  }
  return out;
}

/**
 * An slot-prop object AUTHORED for another component — `sp={{ … }}`.
 *
 * Two things that look similar are deliberately allowed:
 *   - `sp={sp}` / `sp={props.sp}` — FORWARDING the consumer's own slot props
 *     across a thin wrapper (Calendar.Nav does this for the shared CalendarNav).
 *     That preserves the escape hatch rather than competing with it, and is the
 *     opposite of the pattern this check exists to stop.
 *   - `sp('root')` inside a component's own setup() — the slot READER, a
 *     different thing entirely.
 */
const AUTHORS_SLOT_PROPS = /(^|\s)sp=\{\{/;

const violations = [];
for (const file of walk(COMPONENTS)) {
  readFileSync(file, 'utf8')
    .split('\n')
    .forEach((line, i) => {
      if (!AUTHORS_SLOT_PROPS.test(line)) return;
      if (/slot-props-exempt\s*:/.test(line)) return; // documented, deliberate
      violations.push({ file: relative(MOVE_ROOT, file), line: i + 1, decl: line.trim().slice(0, 80) });
    });
}

if (violations.length === 0) {
  console.log("✓ internal-slot-props: no component reaches into another's slots.");
  process.exit(0);
}

console.error(`✗ internal-slot-props: ${violations.length} authored internal slot-prop object(s).`);
for (const v of violations) console.error(`  ${v.file}:${v.line}  ${v.decl}`);
console.error(
  "\n  Slot props are the CONSUMER's escape hatch. Between Move's own components\n" +
    '  they compete with the consumer for the same channel, and which class wins\n' +
    '  falls to bundler source order.\n' +
    '  Restyle through the composed component’s tokens instead, and take a plain\n' +
    '  className on the element you render. If no token reaches, add one — that is\n' +
    '  the missing vocabulary this check is pointing at.',
);
process.exit(REPORT ? 0 : 1);
