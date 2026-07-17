#!/usr/bin/env node
/**
 * Rule ↔ check bijection — the file → rule half of coverage.
 *
 * The coverage spec declares, per rule, the check that enforces it (rule → file).
 * This gate adds the reverse, co-located in the code: each check script declares
 * the coverage rules it enforces via an `@enforces` header annotation
 * (file → rule), and this proves the two agree EXACTLY for every annotated check:
 *
 *   - no check claims a rule the spec doesn't attribute to it, and
 *   - no rule the spec attributes to a check goes undeclared by that check.
 *
 * So a multi-purpose check (factory-conformance enforces source-4..9) can't
 * silently enforce something with no rule, or drop a rule it's meant to own.
 *
 * `@enforces none` asserts the check maps to no rule (a structural/meta check);
 * the gate verifies the spec indeed attributes it nothing. A check with no
 * `@enforces` line at all is not yet annotated — reported as TODO, not a failure,
 * so the annotation can roll out incrementally. Tighten to a hard failure once
 * every check carries the line.
 *
 * Exit: 0 = every annotated check is in bijection, 1 = at least one mismatch.
 *
 * @enforces none  (meta-check — guards the check↔rule mapping itself)
 */
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const MOVE_ROOT = join(HERE, '..', '..');
const SPEC = join(MOVE_ROOT, '..', 'docs', 'src', 'pages', 'ai', 'conformance-spec.ts');

// Each check:* is resolved to its actual script file straight from its
// package.json command — so it doesn't matter which folder the file lives in
// (scripts/checks/ or checks/) or whether it runs via node or vitest. The
// @enforces annotation lives in that real file.
const pkg = JSON.parse(readFileSync(join(MOVE_ROOT, 'package.json'), 'utf8'));
const CHECKS = Object.keys(pkg.scripts)
  .filter((k) => k.startsWith('check:') && k !== 'check:all')
  .map((k) => k.slice('check:'.length))
  .filter((n) => n !== 'rule-coverage');
const fileForCheck = (name) => {
  const m = (pkg.scripts['check:' + name] || '').match(/(\S+\.(?:mjs|ts|tsx))/);
  return m ? join(MOVE_ROOT, m[1]) : null;
};

// rule → checks, parsed per rule line (both enforcement forms: the explicit
// `{ …, check: 'x' }` object and the `C|DP|all('check', 'x')` shorthand). A rule
// with per-entity checks (component + composition) attributes to each.
const specSrc = readFileSync(SPEC, 'utf8');
const checkToRules = new Map(); // check -> Set(ruleId)
for (const line of specSrc.split('\n')) {
  const idM = line.match(/\bid:\s*'([^']+)'/);
  if (!idM) continue;
  const rid = idM[1];
  const checks = new Set();
  for (const m of line.matchAll(/\bcheck:\s*'([^']+)'/g)) checks.add(m[1]);
  for (const m of line.matchAll(/\b(?:C|DP|all)\(\s*'check'\s*,\s*'([^']+)'\)/g)) checks.add(m[1]);
  for (const c of checks) {
    if (!checkToRules.has(c)) checkToRules.set(c, new Set());
    checkToRules.get(c).add(rid);
  }
}

const errors = [];
const todo = [];
const unresolved = [];
let verified = 0;

for (const name of CHECKS) {
  const file = fileForCheck(name);
  if (!file || !existsSync(file)) {
    unresolved.push(name);
    continue;
  }
  const src = readFileSync(file, 'utf8');

  const m = src.match(/@enforces\s+(.+)/);
  if (!m) {
    todo.push(name);
    continue;
  }

  const body = m[1];
  const declared = new Set(body.match(/[a-zA-Z][a-zA-Z0-9]*-[0-9]+/g) ?? []);
  const specSet = checkToRules.get(name) ?? new Set();

  // `@enforces none` — the check owns no coverage rule (structural/meta).
  if (/\bnone\b/.test(body) && declared.size === 0) {
    if (specSet.size) {
      errors.push(`${name}: declares "@enforces none" but the spec maps rule(s) to it: ${[...specSet].sort().join(', ')}`);
    } else {
      verified++;
    }
    continue;
  }

  const declaredNotInSpec = [...declared].filter((r) => !specSet.has(r)).sort();
  const specNotDeclared = [...specSet].filter((r) => !declared.has(r)).sort();
  if (declaredNotInSpec.length) {
    errors.push(`${name}: @enforces lists [${declaredNotInSpec.join(', ')}] that the spec does not map to this check`);
  }
  if (specNotDeclared.length) {
    errors.push(`${name}: the spec maps [${specNotDeclared.join(', ')}] to this check, but @enforces omits ${specNotDeclared.length > 1 ? 'them' : 'it'}`);
  }
  if (!declaredNotInSpec.length && !specNotDeclared.length) verified++;
}

for (const n of todo.sort())
  errors.push(`${n}: its script file has no @enforces annotation — add "@enforces <rule-ids>" (or "@enforces none" for a structural/meta check)`);
for (const n of unresolved.sort())
  errors.push(`${n}: could not resolve a single script file from its package.json command to look for @enforces`);

if (errors.length) {
  console.error(`✗ rule-coverage: ${errors.length} file→rule issue(s).\n`);
  for (const e of errors) console.error(`  ${e}`);
  process.exit(1);
}
console.log(`✓ rule-coverage: ${verified} check(s) in file↔rule bijection with the coverage spec.`);
process.exit(0);
