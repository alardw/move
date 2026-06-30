#!/usr/bin/env node
/**
 * Recipe spec ↔ source sync linter (the recipe sibling of spec-drift.mjs).
 *
 * Recipes are spec-driven: each `packages/move/recipes/<group>/<Name>.spec.ts`
 * (`satisfies RecipeSpec`) is the source of truth for its `<Name>.tsx`. This
 * check enforces that the two don't drift on the deterministic contracts:
 *
 *   1. Every recipe `.tsx` has a sibling `.spec.ts` (and vice versa).
 *   2. composition parity — `spec.composition` exactly matches the value
 *      imports from 'move' in the source (every imported Move component is
 *      declared, and every declared component is actually imported).
 *   3. labels parity — `spec.labels[].key` exactly matches the `defaultLabels`
 *      object keys in the source.
 *
 * (Behaviour coverage / integration-point wiring stay with the manual
 * `recipe-validate` skill — they aren't deterministically checkable here.)
 *
 * Exit 0 = all recipes in sync; 1 = drift found.
 */
import { readdirSync, statSync, existsSync, readFileSync } from 'node:fs';
import { join, dirname, basename, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = join(HERE, '..', '..', '..', '..');
const RECIPES = join(HERE, '..', '..', 'recipes');

const parse = (file) =>
  ts.createSourceFile(file, readFileSync(file, 'utf8'), ts.ScriptTarget.ES2022, true, ts.ScriptKind.TSX);
const walk = (node, fn) => { fn(node); ts.forEachChild(node, (c) => walk(c, fn)); };

/** Collect all `<Name>.spec.ts` under the recipes tree (excluding spec-type.ts). */
function recipeSpecs(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) recipeSpecs(p, out);
    else if (entry.endsWith('.spec.ts')) out.push(p);
  }
  return out;
}

/** Find a property's value node by name on the top-level `spec` object literal. */
function specObject(sf) {
  let obj = null;
  walk(sf, (n) => {
    if (ts.isVariableDeclaration(n) && n.name.getText() === 'spec' && n.initializer) {
      const init = ts.isSatisfiesExpression(n.initializer) ? n.initializer.expression : n.initializer;
      if (ts.isObjectLiteralExpression(init)) obj = init;
    }
  });
  return obj;
}
const prop = (obj, name) =>
  obj?.properties.find((p) => ts.isPropertyAssignment(p) && p.name.getText() === name)?.initializer ?? null;

const stringArray = (node) =>
  node && ts.isArrayLiteralExpression(node)
    ? node.elements.filter(ts.isStringLiteral).map((e) => e.text)
    : [];

/** spec.labels[].key */
function specLabelKeys(obj) {
  const arr = prop(obj, 'labels');
  if (!arr || !ts.isArrayLiteralExpression(arr)) return [];
  return arr.elements
    .filter(ts.isObjectLiteralExpression)
    .map((o) => o.properties.find((p) => ts.isPropertyAssignment(p) && p.name.getText() === 'key'))
    .filter(Boolean)
    .map((p) => (ts.isStringLiteral(p.initializer) ? p.initializer.text : null))
    .filter(Boolean);
}

/** Source: value (non-type) named imports from 'move'. */
function moveImports(sf) {
  const names = [];
  walk(sf, (n) => {
    if (ts.isImportDeclaration(n) && ts.isStringLiteral(n.moduleSpecifier) && n.moduleSpecifier.text === 'move') {
      const clause = n.importClause;
      if (!clause || clause.isTypeOnly) return;
      const nb = clause.namedBindings;
      if (nb && ts.isNamedImports(nb)) {
        for (const el of nb.elements) if (!el.isTypeOnly) names.push(el.name.text);
      }
    }
  });
  return names;
}

/** Source: keys of the top-level `defaultLabels` object literal. */
function defaultLabelKeys(sf) {
  let keys = [];
  walk(sf, (n) => {
    if (ts.isVariableDeclaration(n) && n.name.getText() === 'defaultLabels' && n.initializer && ts.isObjectLiteralExpression(n.initializer)) {
      keys = n.initializer.properties
        .filter((p) => ts.isPropertyAssignment(p) || ts.isShorthandPropertyAssignment(p) || ts.isMethodDeclaration(p))
        .map((p) => p.name?.getText())
        .filter(Boolean);
    }
  });
  return keys;
}

const setEq = (a, b) => {
  const A = new Set(a), B = new Set(b);
  const onlyA = [...A].filter((x) => !B.has(x));
  const onlyB = [...B].filter((x) => !A.has(x));
  return { ok: onlyA.length === 0 && onlyB.length === 0, onlyA, onlyB };
};

let errors = 0;
const out = [];
const slugs = new Map(); // registry-1: detect duplicate recipe slugs
for (const specFile of recipeSpecs(RECIPES).sort()) {
  const srcFile = specFile.replace(/\.spec\.ts$/, '.tsx');
  const name = basename(specFile, '.spec.ts');
  if (!existsSync(srcFile)) {
    errors++; out.push(`✗ ${name}: spec has no sibling source (${relative(REPO, srcFile)})`);
    continue;
  }
  const specObj = specObject(parse(specFile));
  if (!specObj) { errors++; out.push(`✗ ${name}: could not parse 'spec' object`); continue; }
  const src = parse(srcFile);

  // composition parity
  const comp = setEq(stringArray(prop(specObj, 'composition')), moveImports(src));
  if (!comp.ok) {
    errors++;
    out.push(`✗ ${name}: composition drift` +
      (comp.onlyA.length ? `\n    in spec, not imported: ${comp.onlyA.join(', ')}` : '') +
      (comp.onlyB.length ? `\n    imported from 'move', not in spec: ${comp.onlyB.join(', ')}` : ''));
  }
  // labels parity
  const lab = setEq(specLabelKeys(specObj), defaultLabelKeys(src));
  if (!lab.ok) {
    errors++;
    out.push(`✗ ${name}: labels drift` +
      (lab.onlyA.length ? `\n    in spec, not in defaultLabels: ${lab.onlyA.join(', ')}` : '') +
      (lab.onlyB.length ? `\n    in defaultLabels, not in spec: ${lab.onlyB.join(', ')}` : ''));
  }
  // registry-1: no two recipes share a slug.
  const slugNode = prop(specObj, 'slug');
  const slug = slugNode && ts.isStringLiteral(slugNode) ? slugNode.text : null;
  if (slug) {
    if (slugs.has(slug)) { errors++; out.push(`✗ duplicate slug '${slug}' (${name} + ${slugs.get(slug)})`); }
    else slugs.set(slug, name);
  }
}

// every recipe source should also have a spec
function recipeSources(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) recipeSources(p, out);
    else if (entry.endsWith('.tsx') && !entry.endsWith('.test.tsx')) out.push(p);
  }
  return out;
}
for (const src of recipeSources(RECIPES)) {
  if (!existsSync(src.replace(/\.tsx$/, '.spec.ts'))) {
    errors++; out.push(`✗ ${basename(src, '.tsx')}: source has no sibling .spec.ts (${relative(REPO, src)})`);
  }
}

if (errors > 0) {
  console.error('✗ recipe-spec-drift: recipe spec ↔ source out of sync.\n');
  console.error(out.join('\n'));
  console.error(`\n${errors} drift error(s).`);
  process.exit(1);
}
console.log('✓ recipe-spec-drift: all recipes in sync (composition, labels, review, unique slugs).');
