#!/usr/bin/env node
/**
 * Skill path-reference guard — every repo file a skill tells an agent to read
 * must exist.
 *
 * Skills are the primary interface an agent has to this repo, and a skill is
 * prose: nothing type-checks it, nothing imports it, and deleting the file it
 * names breaks it silently. `check:script-refs` guards hooks/workflows → npm
 * scripts; this guards skill prose → repo paths, which is the larger surface.
 *
 * The failure this exists for: `app-compose` told every agent to seed from a
 * recipe and to read `recipes/registry.ts` for what exists. The recipe pipeline
 * was deleted, so the rule became unfollowable — and every composition silently
 * fell back to analysing from scratch. Nobody noticed, because a dangling path
 * in a markdown file has nothing to fail.
 *
 * A path is checked when it is written in backticks, carries a code/doc
 * extension, and contains a separator. It passes if it resolves under ANY root
 * below — skills address the repo from several vantage points and pinning each
 * one would be more brittle than the check is worth.
 *
 * Paths in a CONSUMER's project (`src/App.tsx` — a file app-setup creates, not
 * one that lives here) are declared in CONSUMER_PATHS rather than silently
 * skipped, so an exemption is something a reader can see and question.
 *
 * @enforces none  (meta-check — guards the agent interface, not an entity rule)
 */

import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const MOVE = join(HERE, '..', '..');
const REPO = join(MOVE, '..', '..');

// Vantage points a skill may address the repo from.
const ROOTS = [
  REPO,
  MOVE,
  join(MOVE, 'src'),
  join(MOVE, 'src', 'components'),
  join(MOVE, 'skills'),
  join(REPO, 'packages', 'docs'),
  join(REPO, 'packages', 'docs', 'src'),
];

// Files that live in a consumer's project, not this repo. A skill naming one is
// describing what it will CREATE, so there is nothing here to resolve.
const CONSUMER_PATHS = new Set([
  '/src/App.tsx',
  'src/App.tsx',
  'src/pages/HomePage.tsx',
  'src/pages/AboutPage.tsx',
]);

function walk(dir, out = []) {
  for (const e of readdirSync(dir)) {
    const full = join(dir, e);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (full.endsWith('.md')) out.push(full);
  }
  return out;
}

const docs = walk(join(MOVE, 'skills'));
const errors = [];
let checked = 0;

for (const file of docs) {
  const text = readFileSync(file, 'utf8');
  const seen = new Set();
  for (const m of text.matchAll(/`([A-Za-z0-9_@./-]+\.(?:ts|tsx|mjs|json|css|md))`/g)) {
    const p = m.group ?? m[1];
    if (!p.includes('/') || seen.has(p) || CONSUMER_PATHS.has(p)) continue;
    seen.add(p);
    checked++;
    const rel = p.replace(/^\//, '');
    if (ROOTS.some((r) => existsSync(join(r, rel)))) continue;
    errors.push(`${relative(REPO, file)}: \`${p}\` does not exist`);
  }
}

if (errors.length) {
  console.error(`\n✗ skill-refs: ${errors.length} dangling path reference(s).\n`);
  for (const e of errors) console.error(`  - ${e}`);
  console.error(
    `\n  A skill naming a file that is not there sends every agent to a dead end,\n` +
      `  and prose has nothing to fail. Fix the path, or amend the skill to match\n` +
      `  what the repo actually is.\n`,
  );
  process.exit(1);
}

console.log(`✓ skill-refs: ${checked} path reference(s) across ${docs.length} skill doc(s) all resolve.`);
