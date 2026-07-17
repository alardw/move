// Conformance-spec ↔ checks sync.
// @enforces none  (meta-check — guards the docs/catalog, not an entity rule)
//
// The coverage spec (packages/docs/src/pages/ai/conformance-spec.ts) is the source
// of truth for what we validate. This keeps it honest against the real checks:
//   1. every `check` a rule references must be a real `check:*` script, and
//   2. every enforced `check:*` must be reflected in the spec — as a rule's
//      `check`, or in the structural allow-list (family/cross-component contracts
//      that don't map to a single coverage rule).
// Add a check → reference it from a rule (or allow-list it), or the build fails.

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(readFileSync(join(here, '../../package.json'), 'utf8'));
const specSrc = readFileSync(join(here, '../../../docs/src/pages/ai/conformance-spec.ts'), 'utf8');

const real = new Set(
  Object.keys(pkg.scripts)
    .filter((k) => k.startsWith('check:') && k !== 'check:all')
    .map((k) => k.slice('check:'.length)),
);

// Not every gate is a check:* script. The docs a11y sweep runs every component sample
// through axe as a vitest ratchet — and its own header names the rule it implements
// ("Mechanical a11y sweep (a11y-1)"). Because this file only ever resolved check:*
// scripts, a11y-1 could not cite the thing that already enforces it, and sat as a "gap"
// while running in CI on every push. The gap count was measuring what's WIRED, not what
// exists. Resolved against the docs script that actually runs it, so a gate can't be
// claimed here without something running. Mirrors EXTRA_GATES in check:wcag-evidence.
const NON_CHECK_GATES = { 'a11y-sweep': 'test:a11y' };
const docsPkg = JSON.parse(readFileSync(join(here, '../../../docs/package.json'), 'utf8'));
for (const [gate, script] of Object.entries(NON_CHECK_GATES)) {
  if (!docsPkg.scripts?.[script]) {
    console.error(`✗ conformance-spec: gate "${gate}" maps to docs script "${script}", now gone.`);
    process.exit(1);
  }
  real.add(gate);
}

// Checks a rule references — both forms used in the spec:
//   explicit:  { status: 'check', check: 'spec-drift' }
//   shorthand: C('check', 'spec-drift') / DP('check', 'design-pattern-conformance') / all('check', 'spec-drift')
const referenced = new Set();
for (const m of specSrc.matchAll(/\bcheck:\s*'([^']+)'/g)) referenced.add(m[1]);
// `renders3` is an alias for `all` in the spec — matched here too, or a rule using the
// semantic name reads as unreferenced and the gate reports a real gate as orphaned.
for (const m of specSrc.matchAll(/\b(?:C|DP|all|renders3)\(\s*'check'\s*,\s*'([^']+)'\)/g))
  referenced.add(m[1]);

// Enforced checks that guard a structural/family contract, not one coverage rule.
const STRUCTURAL = new Set([
  'family-popup',
  'family-modal',
  'family-disclosure',
  'cross-component-drift',
  'animation-choreography',
  'conformance-docs',
  'conformance-spec',
  'script-refs',
  'doc-spec-drift',
  'rule-coverage',
  // Guards the WCAG claim↔evidence mapping on /accessibility, which is a different
  // vocabulary from the coverage rules — criteria, not rules. Same family as
  // rule-coverage: a meta-check over a mapping, so it answers to no single rule.
  'wcag-evidence',
  // Guards a generated artifact (the skill's criteria list) against its source — same
  // family: a meta-check over a mapping, answering to no single rule.
  'skill-a11y-drift',
]);

const errors = [];
for (const c of referenced) {
  if (!real.has(c)) errors.push(`spec references check "${c}" but there is no check:${c} script`);
}

// Ambient tooling must be honest: every claimed tool anchors to a real script so
// the docs can't advertise a tool the repo doesn't actually run.
const allScripts = new Set(Object.keys(pkg.scripts));
for (const m of specSrc.matchAll(/\bscript:\s*'([^']+)'/g)) {
  if (!allScripts.has(m[1])) {
    errors.push(
      `ambient tooling references script "${m[1]}" but there is no "${m[1]}" package script`,
    );
  }
}
for (const c of real) {
  if (!referenced.has(c) && !STRUCTURAL.has(c)) {
    errors.push(
      `check:${c} is enforced but no coverage rule references it (add a rule, or add it to the structural allow-list)`,
    );
  }
}

if (errors.length) {
  console.error('✗ conformance-spec: the coverage spec is out of sync with the checks');
  for (const e of errors) console.error(`  - ${e}`);
  console.error(
    '  → reconcile packages/docs/src/pages/ai/conformance-spec.ts with the check:* scripts',
  );
  process.exit(1);
}

const structuralCount = [...real].filter((c) => STRUCTURAL.has(c)).length;
console.log(
  `✓ conformance-spec: ${referenced.size} rule-mapped checks + ${structuralCount} structural, all in sync`,
);
