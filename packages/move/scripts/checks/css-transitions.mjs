#!/usr/bin/env node
/**
 * CSS transitions are for STATE, never for motion.
 *
 * Move has one animation system: `useAnimations`. A CSS transition is a second
 * one — a fixed duration on a bezier — and the two cannot compose. Springs have
 * no duration at all, so a transition and a spring on the same element read as
 * two clocks; on the same property they overwrite each other outright.
 *
 * The line is drawn by PROPERTY, because that is what decides whether the two
 * systems can collide:
 *
 *   ALLOWED   colour and its relatives — color, background-color, border-color,
 *             fill, stroke, box-shadow, outline-color. State feedback: a hover
 *             tint, a focus ring. Nothing in `useAnimations` writes these, so
 *             there is nothing to collide with. This is what the great majority
 *             of Move components already do.
 *
 *   FLAGGED   transform, opacity, and every geometry property (width, height,
 *             top, r, …). These are MOTION, and motion belongs in
 *             `useAnimations` where it can be sequenced, staggered, sprung, and
 *             switched off by `animations={false}`. A component animating them
 *             in CSS is invisible to that system.
 *
 * Two escapes, both deliberate and both narrow:
 *   - Inside `@media (prefers-reduced-motion: reduce)`. `staggerAnimate` bails
 *     there, so a flat non-animated fallback is exactly right.
 *   - A `transition-exempt: <reason>` comment on the line or the one above.
 *
 * @enforces styles-12
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const COMPONENTS = join(ROOT, 'src/components');

const COLOUR_PROPS = [
  'color',
  'background-color',
  'background',
  'border-color',
  'border',
  'fill',
  'stroke',
  'box-shadow',
  'outline-color',
  'outline',
];
const EXEMPT = 'transition-exempt';

function cssFiles(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) cssFiles(full, out);
    else if (entry.endsWith('.module.css')) out.push(full);
  }
  return out;
}

/** Property names a `transition:` shorthand actually animates. */
function propsOf(value) {
  return value
    .split(',')
    .map((part) => part.trim().split(/\s+/)[0])
    .filter((p) => p && p !== 'none' && !/^\d/.test(p) && !p.startsWith('var('));
}

const violations = [];

/**
 * Blank out comments, keeping line numbers intact.
 *
 * Without this the scanner reads its own documentation: prose explaining why a
 * transition is wrong contains the word `transition:` and gets reported.
 */
function stripComments(source) {
  return source.replace(/\/\*[\s\S]*?\*\//g, (block) => block.replace(/[^\n]/g, ' '));
}

for (const file of cssFiles(COMPONENTS)) {
  const raw = readFileSync(file, 'utf8');
  const lines = stripComments(raw).split('\n');
  const rawLines = raw.split('\n');
  let reducedMotionDepth = null;
  let depth = 0;

  lines.forEach((line, i) => {
    if (/@media[^{]*prefers-reduced-motion[^{]*\{/.test(line)) reducedMotionDepth = depth;
    depth += (line.match(/\{/g) ?? []).length;
    depth -= (line.match(/\}/g) ?? []).length;
    if (reducedMotionDepth !== null && depth <= reducedMotionDepth) reducedMotionDepth = null;

    const match = line.match(/(?:^|[;\s])transition(?:-property)?:\s*([^;]+)/);
    if (!match) return;
    if (reducedMotionDepth !== null) return;
    // The marker lives in a comment, so look at the ORIGINAL text — and walk
    // back through the whole preceding comment block, since a reason worth
    // writing rarely fits on one line. Stripped lines are blank where comments
    // were, so any non-blank line above is code and ends the search.
    if (rawLines[i].includes(EXEMPT)) return;
    let exempted = false;
    for (let j = i - 1; j >= 0; j -= 1) {
      if (lines[j].trim() !== '') break;
      if (rawLines[j].includes(EXEMPT)) {
        exempted = true;
        break;
      }
    }
    if (exempted) return;

    for (const prop of propsOf(match[1])) {
      if (COLOUR_PROPS.includes(prop) || prop === 'all') continue;
      violations.push(
        `${relative(ROOT, file)}:${i + 1}  transitions '${prop}' — motion belongs in useAnimations, ` +
          `where it can be sequenced, sprung and disabled. Transition colour only, or add ` +
          `\`/* ${EXEMPT}: reason */\`.`,
      );
    }
  });
}

if (violations.length) {
  console.error(`✗ css-transitions: ${violations.length} motion transition(s) outside useAnimations.`);
  for (const v of violations) console.error(`  ${v}`);
  process.exit(1);
}
console.log('✓ css-transitions: every CSS transition animates colour, not motion.');
