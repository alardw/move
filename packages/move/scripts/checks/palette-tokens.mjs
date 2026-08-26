#!/usr/bin/env node
/**
 * Palette-token guard — component CSS reaches for a ROLE, never a named palette.
 *
 * `--move-indigo-text` and `--move-fg-muted` look alike in a stylesheet and are
 * opposites in a theme. A role token follows the seed; a palette token pins one
 * hue forever. Nine components had pinned theirs, so an amber-themed app
 * rendered blue "today" markers, blue required asterisks and blue eyebrows —
 * and every existing gate passed, because `css-hardcoded` only looks for raw
 * hex. A palette token is the same bug wearing a token.
 *
 * A palette reference IS legal when the selector names that same colour:
 *
 *     .root[data-color='red'] { --_solid: var(--move-red-800); }   ← definitional
 *     .root                   { --x: var(--move-indigo-text); }    ← pinned
 *
 * The first is how a categorical `color` prop is built and cannot be written any
 * other way. The second is A7.
 *
 * Applies to `src/components/**` only. The token layer itself (semantic.css,
 * accents.css, palette-semantic.css) exists precisely to map palettes onto
 * roles, so it is not in scope.
 *
 * Escape hatch: `/* palette-exempt: reason *\/` on the line above, for surfaces
 * that are deliberately not theme-following — media chrome painted over video,
 * where the scrim is a fixed neutral regardless of theme.
 *
 * @enforces styles-8
 * @instead use the ROLE token for what the colour MEANS — `--move-accent-text`, `--move-error`,
 *   `--move-fg-muted` — so the value follows the theme seed. A palette token is legal
 *   inside a rule scoped to that colour (`[data-color='red']`), and media chrome that
 *   is deliberately not theme-following can be marked `/* palette-exempt: reason *\/`.
 */

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const MOVE = join(HERE, '..', '..');
const COMPONENTS = join(MOVE, 'src', 'components');

const PALETTES = [
  'gray', 'red', 'pink', 'grape', 'violet', 'indigo', 'blue',
  'cyan', 'teal', 'green', 'lime', 'yellow', 'orange',
];
const PAL = PALETTES.join('|');

function walk(dir, out = []) {
  for (const e of readdirSync(dir)) {
    const full = join(dir, e);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (full.endsWith('.module.css')) out.push(full);
  }
  return out;
}

const files = walk(COMPONENTS);
const errors = [];
let scanned = 0;

for (const file of files) {
  const text = readFileSync(file, 'utf8');
  const lines = text.split('\n');

  for (const block of text.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    // The selector is the last line before `{` — earlier lines are the previous
    // rule's trailing comment or blank space.
    const selector = block[1].trim().split('\n').pop().trim();
    for (const ref of block[2].matchAll(new RegExp(`var\\(\\s*(--move-(${PAL})-[a-z0-9-]+)`, 'g'))) {
      scanned++;
      const [, token, palette] = ref;
      // Definitional: the rule is scoped to the colour it names.
      if (selector.includes(palette)) continue;

      // block.index is the start of the SELECTOR; the body begins after `{`.
      const bodyStart = block.index + block[1].length + 1;
      const lineNo = text.slice(0, bodyStart + ref.index).split('\n').length;
      const prev = (lines[lineNo - 2] ?? '') + (lines[lineNo - 1] ?? '');
      if (/palette-exempt:/.test(prev)) continue;

      errors.push(
        `${relative(MOVE, file)}:${lineNo}  \`${selector}\` uses ${token}`,
      );
    }
  }
}

if (errors.length) {
  console.error(`\n✗ palette-tokens: ${errors.length} pinned palette reference(s) in component CSS.\n`);
  for (const e of errors) console.error(`  - ${e}`);
  console.error(
    `\n  Use the ROLE token for what the colour MEANS — --move-accent-text for accent\n` +
      `  text, --move-error for danger, --move-fg-muted for de-emphasis — so the value\n` +
      `  follows the theme seed. A palette token pins one hue and ignores the theme.\n` +
      `  If the surface is deliberately not theme-following (media chrome over video),\n` +
      `  mark it: /* palette-exempt: reason */\n`,
  );
  process.exit(1);
}

console.log(
  `✓ palette-tokens: ${scanned} palette reference(s) across ${files.length} component stylesheet(s) — ` +
    `all scoped to the colour they name.`,
);
