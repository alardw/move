#!/usr/bin/env node
/**
 * component-document-drift — the ComponentDocument ↔ component DOCUMENT drift.
 *
 * A component's document is its `packages/docs/src/content/components/<slug>/`
 * folder: a `meta.ts` (the ComponentDocument — prose + discovery metadata) plus
 * a `samples/` directory of live examples. This check enforces, for every
 * component `packages/move/src/components/**\/<Name>.spec.ts`:
 *
 *   1. It has a docs folder (matched component→folder by the meta object's
 *      `name` field), so nothing ships undocumented.
 *   2. That folder's `meta.ts` declares ≥1 synonym — so the component is
 *      findable under the name people already use.
 *   3. That folder's `samples/` has ≥1 `.tsx` — a doc page with live samples.
 *
 * Exit 0 = every component document in sync; 1 = a component is missing one.
 */
import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = join(HERE, '..', '..', '..', '..');
const COMP_SRC = join(REPO, 'packages', 'move', 'src', 'components');
const COMP_DOCS = join(REPO, 'packages', 'docs', 'src', 'content', 'components');

// name of the object exported as `export const <which> = { … name: '…' }`.
// Sliced after the export so a nested `name:` (in related/highlights) can't win.
const objName = (txt, which) => {
  const i = txt.indexOf(`export const ${which}`);
  if (i < 0) return null;
  const m = txt.slice(i).match(/\bname:\s*['"]([^'"]+)['"]/);
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

// Component doc pages, indexed by their meta `name` → { synonyms, samples }.
const docByName = new Map();
for (const slug of readdirSync(COMP_DOCS)) {
  const dir = join(COMP_DOCS, slug);
  if (!statSync(dir).isDirectory() || !existsSync(join(dir, 'meta.ts'))) continue;
  const txt = readFileSync(join(dir, 'meta.ts'), 'utf8');
  const name = objName(txt, 'meta');
  if (!name) continue;
  const i = txt.indexOf('export const meta');
  const syn = txt.slice(i).match(/synonyms:\s*\[([^\]]*)\]/);
  const hasSynonyms = !!(syn && syn[1].trim());
  const samples = join(dir, 'samples');
  const hasSamples = existsSync(samples) && readdirSync(samples).some((f) => f.endsWith('.tsx'));
  docByName.set(name, { hasSynonyms, hasSamples });
}

let comps = 0;
for (const f of specFiles(COMP_SRC)) {
  comps++;
  const name = objName(readFileSync(f, 'utf8'), 'spec');
  const doc = docByName.get(name);
  if (!doc) { problems.push(`component '${name}': no doc page`); continue; }
  if (!doc.hasSynonyms) problems.push(`component '${name}': doc page declares no synonyms`);
  if (!doc.hasSamples) problems.push(`component '${name}': doc page has no live samples`);
}

if (problems.length) {
  console.error(`✗ component-document-drift: ${problems.length} component document(s) out of sync:`);
  for (const p of problems) console.error(`  - ${p}`);
  process.exit(1);
}
console.log(`✓ component-document-drift: ${comps} component documents in sync (synonyms, doc page + samples).`);
