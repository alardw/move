#!/usr/bin/env node
/**
 * Escape-hatch guard — a check that FORBIDS something must say what to do
 * instead.
 *
 * The sharpest line in the consumer findings register is a rule with no exit:
 *
 *   "Frame — the sizing/spacing escape hatch. Load-bearing: purity forbids
 *    inline styles, so with no Frame there is NO legal way to set a width."
 *
 * Three separate teams each built their own Frame, and each invention then
 * failed the very review that made it necessary — the cost paid twice. The rule
 * was not wrong; it was incomplete, and nothing in this repo could tell that a
 * restriction had shipped without a sanctioned alternative.
 *
 * A gate that says "you may not" is a wall. A gate that says "do X instead" is a
 * design. This asserts every restriction check declares its `@instead` — a
 * one-line statement of the legal path — so writing the rule forces answering
 * "and what should they do?" at the moment it is cheapest to answer.
 *
 * Only RESTRICTION checks are in scope. A parity check (spec-drift,
 * conformance-docs) forbids nothing: its fix is "make the two agree", which is
 * already the whole message. Listing them would be noise, and a gate that cries
 * wolf gets ignored — which is the failure this one exists to prevent.
 *
 * @enforces none  (meta-check — guards how rules are written, not an entity)
 * @instead n/a — this check forbids nothing; it requires a declaration.
 */

import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const MOVE = join(HERE, '..', '..');

/**
 * Checks that forbid a construct outright. Each must publish the legal path.
 * Add a check here when it starts refusing something, not when someone notices.
 */
const RESTRICTION_CHECKS = [
  'scripts/checks/purity.mjs',
  'checks/purity.mjs',
  'scripts/checks/css-hardcoded.mjs',
  'scripts/checks/css-important.mjs',
  'scripts/checks/css-transitions.mjs',
  'scripts/checks/control-size.mjs',
  'scripts/checks/palette-tokens.mjs',
  'scripts/checks/icon-usage.mjs',
  'scripts/checks/strict-props.mjs',
  'scripts/checks/aria-label-name.mjs',
  'scripts/checks/internal-slot-props.mjs',
  'scripts/checks/dist-packaging.mjs',
];

const errors = [];
let declared = 0;

for (const rel of RESTRICTION_CHECKS) {
  const file = join(MOVE, rel);
  if (!existsSync(file)) continue;
  const text = readFileSync(file, 'utf8');
  const m = /@instead\s+(.+)/.exec(text);
  if (!m || m[1].trim().length < 12) {
    errors.push(
      `${rel} forbids a construct but declares no \`@instead\`. Add one line to its ` +
        `header saying what an author should do in place of what it refuses.`,
    );
    continue;
  }
  declared++;
}

if (errors.length) {
  console.error(`\n✗ escape-hatch: ${errors.length} restriction(s) with no sanctioned alternative.\n`);
  for (const e of errors) console.error(`  - ${e}`);
  console.error(
    `\n  Add to the check's header comment:\n\n` +
      `      * @instead <the legal way to do the thing this refuses>\n\n` +
      `  If there is no legal way, that is the finding — the rule is incomplete and\n` +
      `  the primitive it assumes does not exist yet. Say so in the @instead rather\n` +
      `  than shipping a wall.\n`,
  );
  process.exit(1);
}

console.log(
  `✓ escape-hatch: ${declared} restriction check(s) each declare the sanctioned alternative.`,
);
