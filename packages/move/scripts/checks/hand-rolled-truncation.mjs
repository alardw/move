#!/usr/bin/env node
/**
 * Truncation comes from the utility, not from three declarations in a slot.
 *
 * `text-overflow: ellipsis` in a component stylesheet is a component deciding
 * for itself how text gets cut, and it loses three things the `[data-truncate]`
 * utility supplies:
 *
 *   - `middle`, which keeps the end of the string. A filename truncated at the
 *     end loses its extension — `AVB 2024-01 (Voorwaarden verzekerin…` — which
 *     is the one part a reader scanning a list is looking for.
 *   - the tooltip that hands back the full string on hover, so what was cut is
 *     still reachable.
 *   - `overflow: clip visible` instead of `overflow: hidden`. Hidden clips BOTH
 *     axes, and the box it clips to is the line box, so a font whose descenders
 *     are taller than its line-height loses the tails of every p, g and y.
 *
 * FileUpload's filename had all three problems from six lines of CSS.
 *
 * Known offenders are recorded in the baseline beside this file. The check fails
 * on anything NEW, and reports a baselined entry that has been fixed so it can
 * be locked in — the same shape as animation-spec-drift.
 *
 * Escape hatch: `truncate-exempt: <reason>` in a comment on the line above,
 * for text that genuinely is not truncation (a marquee, a measured mirror).
 *
 * @enforces styles-24
 */

import { readdirSync, statSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const MOVE = join(HERE, '..', '..');
const SRC = join(MOVE, 'src');
const BASELINE = join(HERE, 'hand-rolled-truncation.baseline.json');
const WRITE = process.argv.includes('--write');

/** The utility itself is where this belongs. */
const OWNS_IT = join('src', 'styles', 'truncate.css');

const found = [];
(function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) {
      walk(p);
      continue;
    }
    if (!name.endsWith('.css')) continue;
    const rel = relative(MOVE, p);
    if (rel === OWNS_IT) continue;

    const lines = readFileSync(p, 'utf8').split('\n');
    lines.forEach((line, i) => {
      if (!/text-overflow:\s*ellipsis/.test(line)) return;
      const prev = lines[i - 1] ?? '';
      if (/truncate-exempt/.test(prev) || /truncate-exempt/.test(line)) return;
      found.push(`${rel}:${i + 1}`);
    });
  }
})(SRC);

const baseline = existsSync(BASELINE) ? JSON.parse(readFileSync(BASELINE, 'utf8')) : [];
const known = new Set(baseline);
const live = new Set(found);

const added = found.filter((f) => !known.has(f));
const fixed = baseline.filter((b) => !live.has(b));

if (WRITE) {
  writeFileSync(BASELINE, `${JSON.stringify([...live].sort(), null, 2)}\n`);
  console.log(`⚑ hand-rolled-truncation: baseline written with ${live.size} entr(ies).`);
  process.exit(0);
}

if (added.length) {
  console.error(`\n✗ hand-rolled-truncation: ${added.length} new hand-rolled truncation(s).\n`);
  for (const a of added) console.error(`  - ${a}`);
  console.error(
    `\n  Set \`data-truncate\` on the element instead (see src/styles/truncate.css), or\n` +
      `  resolveTruncate() when the component owns the string — a filename wants\n` +
      `  'middle', so the extension survives. Mark a genuine exception with\n` +
      `  \`truncate-exempt: <reason>\` on the line above.\n`,
  );
  process.exit(1);
}

const lede = `${live.size} hand-rolled · ${baseline.length} baseline · ${added.length} new · ${fixed.length} fixed`;
if (fixed.length) {
  console.log(`⚑ hand-rolled-truncation: ${lede}.`);
  console.log(`  Fixed since the baseline — run with --write to lock them in:`);
  for (const f of fixed) console.log(`    ${f}`);
} else {
  console.log(`✓ hand-rolled-truncation: ${lede} — nothing new.`);
}
