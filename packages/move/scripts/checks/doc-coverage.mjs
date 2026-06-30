#!/usr/bin/env node
/**
 * docs-1 — every PUBLISHED artifact has a doc page with live samples, so nothing
 * ships undocumented. A component's doc page is its `content/components/<slug>/`
 * folder (a ComponentDocument + ≥1 sample); a recipe's is its registry entry
 * (a live Component, rendered on the detail page).
 *
 * Exit 0 = everything documented, 1 = a component/recipe is missing its page.
 */
import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = join(HERE, '..', '..', '..', '..');
const COMP_SRC = join(REPO, 'packages', 'move', 'src', 'components');
const COMP_DOCS = join(REPO, 'packages', 'docs', 'src', 'content', 'components');
const RECIPES = join(REPO, 'packages', 'move', 'recipes');
const REGISTRY = join(RECIPES, 'registry.ts');

// name of the object exported as `export const <which> = { … name: '…' }`.
const objName = (txt, which) => {
  const i = txt.indexOf(`export const ${which}`);
  if (i < 0) return null;
  const m = txt.slice(i).match(/\bname:\s*'([^']+)'/);
  return m ? m[1] : null;
};
function specFiles(dir, out = []) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) specFiles(p, out);
    else if (e.endsWith('.spec.ts')) out.push(p);
  }
  return out;
}

const problems = [];

// Component doc pages: name → has ≥1 sample.
const docByName = new Map();
for (const slug of readdirSync(COMP_DOCS)) {
  const dir = join(COMP_DOCS, slug);
  if (!statSync(dir).isDirectory() || !existsSync(join(dir, 'meta.ts'))) continue;
  const name = objName(readFileSync(join(dir, 'meta.ts'), 'utf8'), 'meta');
  const samples = join(dir, 'samples');
  const hasSamples = existsSync(samples) && readdirSync(samples).some((f) => f.endsWith('.tsx'));
  if (name) docByName.set(name, hasSamples);
}

let comps = 0;
for (const f of specFiles(COMP_SRC)) {
  comps++;
  const name = objName(readFileSync(f, 'utf8'), 'spec');
  if (!docByName.has(name)) problems.push(`component '${name}': no doc page`);
  else if (!docByName.get(name)) problems.push(`component '${name}': doc page has no live samples`);
}

// Recipe doc pages: every recipe spec is imported into the registry.
const reg = readFileSync(REGISTRY, 'utf8');
let recipes = 0;
for (const f of specFiles(RECIPES)) {
  recipes++;
  const name = objName(readFileSync(f, 'utf8'), 'spec');
  if (name && !new RegExp(`\\b${name}\\b`).test(reg)) problems.push(`recipe '${name}': not registered`);
}

if (problems.length) {
  console.error(`✗ doc-coverage: ${problems.length} published artifact(s) missing a doc page:`);
  for (const p of problems) console.error(`  - ${p}`);
  process.exit(1);
}
console.log(`✓ doc-coverage: ${comps} components + ${recipes} recipes each have a doc page with live samples.`);
