#!/usr/bin/env node
/**
 * Barrel completeness linter.
 *
 * The package exposes a single public entry (`package.json` "exports" maps
 * `"." -> dist/index.d.ts`) and does NOT map `./components/*`. So the only
 * type names a consumer can import from `'move'` are the ones the top-level
 * barrel (`src/index.ts`) explicitly re-exports. Re-export is not transitive:
 * a type a component's own `index.ts` exports but the barrel omits has no
 * public specifier — it never autocompletes and `import { type X } from 'move'`
 * fails, even though the type physically exists in `dist`.
 *
 * This check enforces that every TYPE a component barrel (`src/components/
 * <category>/<Name>/index.ts`) exports is also re-exported from `src/index.ts`.
 * It is the discoverability guardrail behind "keep every enum a findable,
 * importable literal union".
 *
 * Scope: type-only exports (the discoverability concern is enums/props).
 * Value exports (hooks, helpers) are intentionally not enforced here.
 *
 * Exit codes:
 *   0 — every component type export reaches the barrel
 *   1 — at least one type export is missing from the barrel
 */

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const here = dirname(fileURLToPath(import.meta.url));
const pkgRoot = join(here, '..', '..');
const componentsRoot = join(pkgRoot, 'src', 'components');
const barrelPath = join(pkgRoot, 'src', 'index.ts');

/** Names exported by `export type { ... } from '...'` declarations in a file. */
function exportedTypeNames(file) {
  const sf = ts.createSourceFile(file, readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true);
  const names = [];
  function walk(node) {
    if (
      ts.isExportDeclaration(node) &&
      node.exportClause &&
      ts.isNamedExports(node.exportClause) &&
      node.isTypeOnly
    ) {
      for (const el of node.exportClause.elements) names.push(el.name.text);
    }
    ts.forEachChild(node, walk);
  }
  walk(sf);
  return names;
}

/** All names the barrel re-exports (type or value), for membership testing. */
function barrelExportedNames() {
  const sf = ts.createSourceFile(barrelPath, readFileSync(barrelPath, 'utf8'), ts.ScriptTarget.Latest, true);
  const names = new Set();
  function walk(node) {
    if (ts.isExportDeclaration(node) && node.exportClause && ts.isNamedExports(node.exportClause)) {
      for (const el of node.exportClause.elements) names.add(el.name.text);
    }
    ts.forEachChild(node, walk);
  }
  walk(sf);
  return names;
}

const barrelNames = barrelExportedNames();
const problems = [];
let componentCount = 0;

for (const cat of readdirSync(componentsRoot).filter((c) => statSync(join(componentsRoot, c)).isDirectory())) {
  for (const name of readdirSync(join(componentsRoot, cat))) {
    const dir = join(componentsRoot, cat, name);
    if (!statSync(dir).isDirectory()) continue;
    const idx = join(dir, 'index.ts');
    if (!existsSync(idx)) continue;
    componentCount++;
    const missing = exportedTypeNames(idx).filter((t) => !barrelNames.has(t));
    if (missing.length) problems.push({ name, missing });
  }
}

if (problems.length) {
  console.error('\nBarrel completeness — type exports missing from src/index.ts:\n');
  for (const p of problems) console.error(`  ${p.name}: ${p.missing.join(', ')}`);
  console.error(
    `\n${problems.length} component(s) with unreachable type exports. ` +
      `Add the missing names to the component's re-export line in src/index.ts.\n`
  );
  process.exit(1);
}

console.log(`\n${componentCount}/${componentCount} components clean — every type export reaches the barrel\n`);
