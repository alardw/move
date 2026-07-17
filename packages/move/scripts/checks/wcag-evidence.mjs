#!/usr/bin/env node
/**
 * WCAG claim ↔ check evidence — the third bijection.
 *
 * Move states its accessibility position in two places that must agree:
 *
 *   /accessibility  — the CLAIM. 69 WCAG 2.2 criteria, each scored Supports /
 *                     Enables / Yours / N-A against the real library.
 *   check:*         — the EVIDENCE. The only things that actually run and fail.
 *
 * Nothing connected them, so a claim could not go red. That is not hypothetical:
 * `audit.ts` documents four call sites for `auditTheme`, one of which is
 * "the library `check:theme-contrast`" — a script that has never existed. A comment
 * can name a phantom gate forever; an `evidence` entry cannot.
 *
 * This proves every `evidence` name on a criterion is a real check, reusing the two
 * bijections already in place: `check:conformance-docs` keeps CHECKS[].name in sync
 * with the real check:* scripts, so resolving against that catalog resolves against
 * the scripts.
 *
 * It does NOT fail on `evidence: []`. Eleven criteria are the consumer's and five are
 * N/A — there is nothing for Move to check in "Captions (Live)". And a `supports` row
 * with no gate is an honest statement (verified by hand, nothing guards it), not a
 * lie. Failing it would only pressure people into citing a check that doesn't really
 * back the criterion, which is worse than the truth. So the unbacked count is
 * REPORTED, as a worklist — the same way /ai/coverage reports its gaps.
 *
 * Exit: 0 = every evidence name resolves, 1 = at least one names a check that isn't real.
 *
 * @enforces none  (meta-check — guards the claim↔evidence mapping itself)
 */

import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const DOCS = join(HERE, '..', '..', '..', 'docs', 'src', 'pages');
const CRITERIA = join(DOCS, 'accessibility', 'criteria.ts');
const CHECKS = join(DOCS, 'ai', 'checks.ts');

// Read as text and match, like rule-coverage and conformance-docs do — no import, no
// build step, so the gate runs from a bare node with nothing compiled.
const checksSrc = readFileSync(CHECKS, 'utf8');
const realChecks = new Set([...checksSrc.matchAll(/^\s*name:\s*'([^']+)'/gm)].map((m) => m[1]));

// Not every gate is a `check:*` script. The docs a11y sweep renders every component
// sample through axe, and axe rules carry WCAG tags — which makes it the single
// broadest piece of evidence Move has, covering criteria no bespoke check touches. It
// runs as a vitest ratchet in the docs package, so it is named here and resolved
// against the script that actually runs it. Its baseline holds known violations, so it
// proves "no NEW violation", not "zero" — which is what evidence means: the thing that
// goes red on a regression.
const DOCS_PKG = join(HERE, '..', '..', '..', 'docs', 'package.json');
const EXTRA_GATES = { 'a11y-sweep': 'test:a11y' };
const docsScripts = JSON.parse(readFileSync(DOCS_PKG, 'utf8')).scripts ?? {};
for (const [gate, script] of Object.entries(EXTRA_GATES)) {
  if (!docsScripts[script]) {
    console.error(
      `  ✗ wcag-evidence: gate '${gate}' maps to docs script '${script}', which is gone.`,
    );
    process.exit(1);
  }
  realChecks.add(gate);
}

const criteriaSrc = readFileSync(CRITERIA, 'utf8');
const rows = [
  ...criteriaSrc.matchAll(
    /\{\s*sc:\s*'([^']+)',[^}]*?support:\s*'([a-z]+)',\s*evidence:\s*\[([^\]]*)\]/g,
  ),
].map((m) => ({
  sc: m[1],
  support: m[2],
  evidence: [...m[3].matchAll(/'([^']+)'/g)].map((e) => e[1]),
}));

if (!rows.length) {
  console.error('  ✗ wcag-evidence: parsed 0 criteria from criteria.ts — the shape changed.');
  console.error('    A gate that silently matches nothing is worse than no gate; fix the pattern.');
  process.exit(1);
}

// Every cited check must be real.
const dangling = [];
for (const r of rows) {
  for (const e of r.evidence) {
    if (!realChecks.has(e)) dangling.push(`${r.sc} cites '${e}'`);
  }
}

if (dangling.length) {
  console.error('  ✗ WCAG criteria citing a check that does not exist:');
  for (const d of dangling) console.error(`      ${d}`);
  console.error(`\n  wcag-evidence: ${dangling.length} dangling reference(s).`);
  console.error('  Build the check, or drop the claim to what a real one backs.');
  process.exit(1);
}

// The worklist: claims Move makes about itself with nothing to catch a regression.
// `enables` is excluded — it says the consumer wires it, so the gate would be theirs.
const claims = rows.filter((r) => r.support === 'supports');
const backed = claims.filter((r) => r.evidence.length > 0);
const unbacked = claims.length - backed.length;

console.log(
  `✓ wcag-evidence: ${rows.length} criteria — every cited check is real. ` +
    `${backed.length}/${claims.length} "supports" claims have a gate, ${unbacked} verified by hand.`,
);
process.exit(0);
