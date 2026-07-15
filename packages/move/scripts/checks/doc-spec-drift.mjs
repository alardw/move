#!/usr/bin/env node
// doc-spec-drift — guards the hand-written contract docs against the real spec types.
//
// The contract pages (ComponentContract, CompositionContract) document each spec field in
// prose FieldRow tables. Those tables can silently rot when the spec type changes — exactly
// what happened with `synonyms`, `defaultReview`, and `schemaVersion: 7`. This check diffs
// every documented field name against the actual property names in the spec-type source, and
// verifies the documented `schemaVersion` literal matches the pinned constant.
//
// It does NOT need to validate the example spec block — that's now imported from a real
// `*.spec.ts` via `?raw`, so the compiler already guarantees it can't drift.

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const HERE = dirname(fileURLToPath(import.meta.url));
const MOVE = resolve(HERE, '../..'); // packages/move
const DOCS = resolve(MOVE, '../docs');

/** Union of every property name declared across all interfaces/types in a spec-type file. */
function specFieldNames(file) {
  const src = readFileSync(file, 'utf8');
  const names = new Set();
  // `  fieldName?: Type` / `  fieldName: Type` — interface/type property declarations.
  for (const m of src.matchAll(/^\s{2,}([a-zA-Z_]\w*)\??:\s/gm)) names.add(m[1]);
  return names;
}

/** Documented FieldRow names in a contract page: `{ name: 'x', type: ... }` (excludes
 *  CHECK_SCRIPTS `{ name, what }` and the GLOSSARY record). */
function documentedFieldNames(file) {
  const src = readFileSync(file, 'utf8');
  const names = [];
  for (const m of src.matchAll(/\{\s*name:\s*'([^']+)'\s*,\s*type:/g)) names.push(m[1]);
  return names;
}

function schemaVersionLiteral(file) {
  const src = readFileSync(file, 'utf8');
  const m = src.match(/name:\s*'schemaVersion'\s*,\s*type:\s*'(\d+)'/);
  return m ? Number(m[1]) : null;
}

function constValue(file, name) {
  const src = readFileSync(file, 'utf8');
  const m = src.match(new RegExp(`export const ${name}\\s*=\\s*(\\d+)`));
  return m ? Number(m[1]) : null;
}

const problems = [];

const CASES = [
  {
    label: 'ComponentContract',
    page: resolve(DOCS, 'src/pages/contracts/ComponentContractPage.tsx'),
    specType: resolve(MOVE, 'src/spec-type.ts'),
    versionConst: 'SPEC_SCHEMA_VERSION',
  },
  // CompositeContract is intentionally NOT enforced yet: that page is a placeholder while the
  // CompositeSpec shape settles. When it locks, the real spec type is `src/composite-spec.ts`
  // (CompositeSpec) — but note its `decisions` field is an open record validated against the
  // pattern by `composite-validate`, not by field-name diffing, so this check may not be the
  // right guard for it. Revisit when the composite spec is finalized.
];

for (const c of CASES) {
  const real = specFieldNames(c.specType);
  const documented = documentedFieldNames(c.page);
  const ghosts = [...new Set(documented)].filter((n) => !real.has(n));
  if (ghosts.length) {
    problems.push(
      `${c.label}: documents field(s) not in ${c.specType.replace(MOVE + '/', '')}: ${ghosts.join(', ')}`,
    );
  }
  const docV = schemaVersionLiteral(c.page);
  const realV = constValue(c.specType, c.versionConst);
  if (docV != null && realV != null && docV !== realV) {
    problems.push(`${c.label}: documents schemaVersion ${docV} but ${c.versionConst} is ${realV}`);
  }
}

if (problems.length) {
  console.error('✗ doc-spec-drift: contract docs are out of sync with the spec types:\n');
  for (const p of problems) console.error(`  • ${p}`);
  console.error('\n  Fix the field tables (or the schemaVersion literal) in the contract page(s).');
  process.exit(1);
}

console.log('✓ doc-spec-drift: contract docs match the spec types (fields + schemaVersion).');
