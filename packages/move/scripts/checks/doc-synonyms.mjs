#!/usr/bin/env node
/**
 * docs-2 — every PUBLISHED document is searchable: it declares ≥1 synonym, so
 * people find it under the name they already use. Synonyms are document/discovery
 * metadata, so they live on the document (component meta.ts / recipe registry
 * entry), not the substance spec. The type already requires the field; this
 * gates that it's non-empty.
 *
 * Exit 0 = every document has synonyms, 1 = at least one is empty/missing.
 */
import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = join(HERE, '..', '..', '..', '..');
const COMPONENT_METAS = join(REPO, 'packages', 'docs', 'src', 'content', 'components');
const REGISTRY = join(REPO, 'packages', 'move', 'recipes', 'registry.ts');

const empty = [];
let docs = 0;

// Component documents (one meta.ts per component slug).
for (const slug of readdirSync(COMPONENT_METAS)) {
  const f = join(COMPONENT_METAS, slug, 'meta.ts');
  if (!existsSync(f) || !statSync(join(COMPONENT_METAS, slug)).isDirectory()) continue;
  docs++;
  const m = readFileSync(f, 'utf8').match(/synonyms:\s*\[([^\]]*)\]/);
  if (!m || !m[1].trim()) empty.push(`component '${slug}'`);
}

// Recipe documents (RecipeDoc entries on the registry).
const reg = readFileSync(REGISTRY, 'utf8');
for (const m of reg.matchAll(/slug:\s*'([^']+)',[\s\S]*?synonyms:\s*\[([^\]]*)\]/g)) {
  docs++;
  if (!m[2].trim()) empty.push(`recipe '${m[1]}'`);
}

if (empty.length) {
  console.error(`✗ doc-synonyms: ${empty.length} published document(s) have no synonyms (add ≥1 search alias):`);
  for (const e of empty) console.error(`  - ${e}`);
  process.exit(1);
}
console.log(`✓ doc-synonyms: ${docs} published documents each declare search synonyms.`);
