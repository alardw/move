#!/usr/bin/env node
/**
 * Every shared internal is used by something.
 *
 * `_shared/` holds the parts several components are built from — the calendar
 * views behind Calendar, DatePicker and CalendarView; the transport controls
 * behind both media players. They are not exported from the barrel, so nothing
 * outside the library can reach them, and nothing inside has to.
 *
 * That makes them invisible twice over. They have no spec, so no spec-driven
 * check sees them; and they have no consumer outside the repo, so nothing
 * complains when the last one stops importing them. `YearPicker` and
 * `MonthPicker` sat there with zero references — two components and two
 * stylesheets that every reader had to consider and no build ever used.
 *
 * Dead code in a shared directory is worse than dead code in a component, because
 * `_shared/` is where someone looks for the piece they should reuse.
 *
 * @enforces exports-6
 * @instead delete it, or import it where it belongs. If it is deliberately kept
 *   for work in progress, say so in the file with a `shared-orphan-exempt`
 *   comment and what it is waiting for.
 *
 * Exit: 0 = clean, 1 = at least one shared internal nothing imports.
 */
import { readdirSync, statSync, readFileSync } from 'node:fs';
import { join, dirname, relative, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const MOVE_ROOT = join(HERE, '..', '..');
const COMPONENTS = join(MOVE_ROOT, 'src', 'components');

function walk(dir, out = []) {
  for (const e of readdirSync(dir)) {
    const full = join(dir, e);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (e.endsWith('.tsx') || e.endsWith('.ts')) out.push(full);
  }
  return out;
}

const all = walk(COMPONENTS);
const shared = all.filter((f) => f.includes(`${'/'}_shared${'/'}`) && f.endsWith('.tsx'));
const problems = [];

for (const file of shared) {
  const name = basename(file, '.tsx');
  const src = readFileSync(file, 'utf8');
  if (/shared-orphan-exempt/.test(src)) continue;
  // A context or a pure type module is imported by name like anything else, so
  // no special case is needed — only the file itself is excluded.
  const used = all.some(
    (other) => other !== file && new RegExp(`\\b${name}\\b`).test(readFileSync(other, 'utf8')),
  );
  if (!used) problems.push({ rel: relative(MOVE_ROOT, file), name });
}

if (problems.length === 0) {
  console.log(`✓ shared-orphans: all ${shared.length} shared internal(s) are used.`);
  process.exit(0);
}

console.log(`✗ shared-orphans: ${problems.length} shared internal(s) nothing imports.`);
for (const p of problems) {
  console.log(`\n  [exports-6] ${p.rel} — ${p.name} is imported by nothing`);
  console.log('    _shared/ is where someone looks for the piece they should reuse, so an');
  console.log('    unused file there costs every reader who considers it.');
}
process.exit(1);
