#!/usr/bin/env node
/**
 * app-wcag-audit's "what Move handles" section ↔ the WCAG criteria.
 *
 * The skill tells a consumer's agent which criteria NOT to flag, because Move already
 * owns them. That list is the same fact as the `supports` rows on /accessibility — and
 * it was kept as a second, hand-written copy. It drifted, and drifted in the worst
 * direction: it told consumers to wire `aria-invalid` themselves (useFieldControl sets
 * it), to distrust FormField.Label (a real <label htmlFor>), to hand-name Checkbox (it
 * self-names via aria-labelledby), and that Checkbox drops `required` (it sets
 * aria-required). Every one was true once and was fixed — the page tracked the fixes,
 * the skill didn't. A stale skill is worse than a missing gate: it hands consumers
 * wrong instructions in Move's own voice, as their first contact with its a11y story.
 *
 * So the section is GENERATED from criteria.ts and this proves it's current. The skill
 * ships to consumers via `npx move skills` and is read standalone in their repo, with
 * no access to Move's docs — so it has to carry the detail rather than link to it,
 * which is exactly why the copy existed. Generating it keeps the detail AND kills the
 * drift.
 *
 *   npm run gen:skill-a11y   — rewrite the section from the criteria
 *   npm run check:skill-a11y-drift — prove it matches (this)
 *
 * Exit: 0 = in sync, 1 = stale (or the markers are gone).
 *
 * @enforces none  (meta-check — guards a generated artifact against its source)
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const MOVE_ROOT = join(HERE, '..', '..');
const CRITERIA = join(MOVE_ROOT, '..', 'docs', 'src', 'pages', 'accessibility', 'criteria.ts');
const SKILL = join(MOVE_ROOT, 'skills', 'app-wcag-audit', 'SKILL.md');

const START = '<!-- GENERATED:what-move-handles -->';
const END = '<!-- /GENERATED:what-move-handles -->';

// Read as text and match, like conformance-docs / rule-coverage / wcag-evidence — no
// import, no build step.
const src = readFileSync(CRITERIA, 'utf8');
const rows = [
  ...src.matchAll(
    /\{\s*sc:\s*'([^']+)',\s*name:\s*'([^']*)',\s*level:\s*'([^']+)',\s*support:\s*'([a-z]+)',[^}]*?note:\s*\{\s*included:\s*'((?:[^'\\]|\\.)*)'/g,
  ),
].map((m) => ({
  sc: m[1],
  name: m[2],
  level: m[3],
  support: m[4],
  included: m[5].replace(/\\'/g, "'"),
}));

const supports = rows.filter((r) => r.support === 'supports');

if (supports.length < 20) {
  console.error(`  ✗ skill-a11y-drift: parsed only ${supports.length} "supports" criteria — the`);
  console.error('    shape of criteria.ts changed. A generator that silently emits nothing would');
  console.error('    quietly empty the skill; fix the pattern.');
  process.exit(1);
}

const body = [
  '',
  `Trust these — Move owns them, and auditing them wastes effort and produces false`,
  `positives. Generated from Move's WCAG conformance data, so it cannot drift from what`,
  `the library actually does.`,
  '',
  ...supports.map((r) => `- **§${r.sc} ${r.name}** (${r.level}) — ${r.included}`),
  '',
].join('\n');

const skill = readFileSync(SKILL, 'utf8');
const i = skill.indexOf(START);
const j = skill.indexOf(END);
if (i === -1 || j === -1 || j < i) {
  console.error(`  ✗ skill-a11y-drift: markers missing from ${SKILL}.`);
  console.error(`    Expected ${START} … ${END}`);
  process.exit(1);
}

const next = skill.slice(0, i + START.length) + body + skill.slice(j);

if (process.argv.includes('--write')) {
  writeFileSync(SKILL, next);
  console.log(`✓ gen:skill-a11y: wrote ${supports.length} criteria into app-wcag-audit.`);
  process.exit(0);
}

if (next !== skill) {
  console.error('  ✗ skill-a11y-drift: app-wcag-audit’s "what Move handles" section is stale.');
  console.error('    The criteria moved and the skill didn’t — which is how it came to tell');
  console.error('    consumers to wire aria-invalid that FormField already sets.');
  console.error('    Run: npm run gen:skill-a11y');
  process.exit(1);
}

console.log(`✓ skill-a11y-drift: app-wcag-audit lists all ${supports.length} criteria Move owns.`);
process.exit(0);
