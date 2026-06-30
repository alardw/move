#!/usr/bin/env node
/**
 * recipe-document-drift — the RecipeDocument ↔ recipe DOCUMENT drift, over the
 * recipe registry (`packages/move/recipes/registry.ts`).
 *
 * A recipe's document is its registry entry: the publish/discovery metadata
 * (slug, synonyms) authored on the registry, plus the registration itself. This
 * check enforces the deterministic document contracts:
 *
 *   1. No two registry entries share a slug — a duplicate collides the route
 *      and the overview card.
 *   2. Every registry entry declares ≥1 synonym — so the recipe is findable
 *      under the name people already use.
 *   3. Every recipe spec name is registered — imported into registry.ts, or it
 *      ships unpublished and invisible.
 *
 * Exit 0 = all recipe documents in sync; 1 = drift found.
 */
import { readdirSync, statSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const RECIPES = join(HERE, '..', '..', 'recipes');
const REGISTRY = join(RECIPES, 'registry.ts');

// name of the object exported as `export const spec = { … name: '…' }`.
const objName = (txt, which) => {
  const i = txt.indexOf(`export const ${which}`);
  if (i < 0) return null;
  const m = txt.slice(i).match(/\bname:\s*'([^']+)'/);
  return m ? m[1] : null;
};
function recipeSpecs(dir, out = []) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) recipeSpecs(p, out);
    else if (e.endsWith('.spec.ts')) out.push(p);
  }
  return out;
}

const reg = readFileSync(REGISTRY, 'utf8');
const problems = [];

// 1. unique slugs.
const slugSeen = new Map();
for (const m of reg.matchAll(/^\s*slug:\s*'([^']+)'/gm)) {
  if (slugSeen.has(m[1])) problems.push(`duplicate recipe slug '${m[1]}' in registry.ts`);
  else slugSeen.set(m[1], true);
}

// 2. every entry declares ≥1 synonym.
let docs = 0;
for (const m of reg.matchAll(/slug:\s*'([^']+)',[\s\S]*?synonyms:\s*\[([^\]]*)\]/g)) {
  docs++;
  if (!m[2].trim()) problems.push(`recipe '${m[1]}': no synonyms (add ≥1 search alias)`);
}

// 3. every recipe spec is registered (imported into registry.ts).
for (const f of recipeSpecs(RECIPES)) {
  const name = objName(readFileSync(f, 'utf8'), 'spec');
  if (name && !new RegExp(`\\b${name}\\b`).test(reg)) problems.push(`recipe '${name}': not registered`);
}

if (problems.length) {
  console.error(`✗ recipe-document-drift: ${problems.length} recipe document(s) out of sync:`);
  for (const p of problems) console.error(`  - ${p}`);
  process.exit(1);
}
console.log(`✓ recipe-document-drift: ${docs} recipe documents in sync (unique slugs, synonyms, registered).`);
