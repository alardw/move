#!/usr/bin/env node
/**
 * composite-spec-drift (consumer-facing; shipped, config-driven).
 *
 * A spec-driven composition — a Move recipe, or an app composite the
 * `app-compose` skill generated — has a `<Name>.spec.ts` (`satisfies
 * CompositionSpec`) beside its `<Name>.tsx`. This enforces the SUBSTANCE
 * contracts (the document-side ones live in recipe-/component-document-drift):
 *
 *   1. composition parity — `spec.composition` ↔ the value imports from 'move';
 *   2. labels parity — `spec.labels[].key` ↔ the `defaultLabels` keys;
 *   3. i18n seam (i18n-1) — no user-facing string bypasses the labels object; the
 *      deterministic proxy (matching component E1) is a hardcoded `aria-label`
 *      literal, which should always come from the labels object;
 *   4. a sibling `.test.tsx` exists — without one the logic is unverified.
 *
 * Move runs it on its recipes (the proving ground); you run it on your composites
 * (`move check`). Scans `config.recipes` + `config.composites`.
 *
 * @enforces i18n-1 specParity-5 specParity-6 unit-1
 */
import { readdirSync, statSync, existsSync, readFileSync } from 'node:fs';
import { join, basename, relative } from 'node:path';
import ts from 'typescript';
import { loadConfig } from './_config.mjs';

const parse = (file) =>
  ts.createSourceFile(file, readFileSync(file, 'utf8'), ts.ScriptTarget.ES2022, true, ts.ScriptKind.TSX);
const walk = (node, fn) => { fn(node); ts.forEachChild(node, (c) => walk(c, fn)); };

function specsIn(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) specsIn(p, out);
    else if (entry.endsWith('.spec.ts')) out.push(p);
  }
  return out;
}

function specObject(sf) {
  let obj = null;
  walk(sf, (n) => {
    if (ts.isVariableDeclaration(n) && n.name.getText() === 'spec' && n.initializer) {
      // Unwrap `satisfies X` and `as const` (in any order) down to the object literal.
      let init = n.initializer;
      while (ts.isSatisfiesExpression(init) || ts.isAsExpression(init)) init = init.expression;
      if (ts.isObjectLiteralExpression(init)) obj = init;
    }
  });
  return obj;
}
const prop = (obj, name) =>
  obj?.properties.find((p) => ts.isPropertyAssignment(p) && p.name.getText() === name)?.initializer ?? null;
const stringArray = (node) =>
  node && ts.isArrayLiteralExpression(node) ? node.elements.filter(ts.isStringLiteral).map((e) => e.text) : [];
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
function moveImports(sf) {
  const names = [];
  walk(sf, (n) => {
    if (ts.isImportDeclaration(n) && ts.isStringLiteral(n.moduleSpecifier) && n.moduleSpecifier.text === 'move') {
      const clause = n.importClause;
      if (!clause || clause.isTypeOnly) return;
      const nb = clause.namedBindings;
      if (nb && ts.isNamedImports(nb)) for (const el of nb.elements) if (!el.isTypeOnly) names.push(el.name.text);
    }
  });
  return names;
}
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
  return { ok: a.length === b.length && [...A].every((x) => B.has(x)), onlyA: [...A].filter((x) => !B.has(x)), onlyB: [...B].filter((x) => !A.has(x)) };
};

export function run(config) {
  const roots = [...config.recipes, ...config.composites];
  const specs = [...new Set(roots.flatMap((r) => specsIn(r)))].sort();
  const messages = [];
  for (const specFile of specs) {
    const srcFile = specFile.replace(/\.spec\.ts$/, '.tsx');
    const name = basename(specFile, '.spec.ts');
    if (!existsSync(srcFile)) { messages.push(`${name}: spec has no sibling .tsx`); continue; }
    const specObj = specObject(parse(specFile));
    if (!specObj) { messages.push(`${name}: could not parse 'spec' object`); continue; }
    // Design-pattern composites (`satisfies CompositeSpec`, keyed by `fromPattern`) are SLIM —
    // composition/labels/itemShape are DERIVED, not stored — so the CompositionSpec parity rules
    // below don't apply. They're validated as legal resolutions of their pattern by the
    // `composite-validate` skill instead. Skip them here.
    if (prop(specObj, 'fromPattern')) continue;
    const src = parse(srcFile);

    const comp = setEq(stringArray(prop(specObj, 'composition')), moveImports(src));
    if (!comp.ok) {
      messages.push(`${relative(config.cwd, specFile)}: composition drift` +
        (comp.onlyA.length ? ` — in spec, not imported: ${comp.onlyA.join(', ')}` : '') +
        (comp.onlyB.length ? ` — imported, not in spec: ${comp.onlyB.join(', ')}` : ''));
    }
    const lab = setEq(specLabelKeys(specObj), defaultLabelKeys(src));
    if (!lab.ok) {
      messages.push(`${relative(config.cwd, specFile)}: labels drift` +
        (lab.onlyA.length ? ` — in spec, not in defaultLabels: ${lab.onlyA.join(', ')}` : '') +
        (lab.onlyB.length ? ` — in defaultLabels, not in spec: ${lab.onlyB.join(', ')}` : ''));
    }
    // i18n seam (i18n-1): a hardcoded aria-label literal bypasses the labels
    // object a consumer translates through — it should come from labels, never
    // inline. Same deterministic proxy the component check (E1) uses.
    walk(src, (n) => {
      if (ts.isJsxAttribute(n) && n.name.getText() === 'aria-label' && n.initializer) {
        const init = ts.isJsxExpression(n.initializer) ? n.initializer.expression : n.initializer;
        if (init && ts.isStringLiteral(init)) {
          const { line } = src.getLineAndCharacterOfPosition(n.getStart(src));
          messages.push(`${relative(config.cwd, srcFile)}:${line + 1}: hardcoded aria-label "${init.text}" — source it from the labels object`);
        }
      }
    });
    if (!existsSync(specFile.replace(/\.spec\.ts$/, '.test.tsx'))) {
      messages.push(`${relative(config.cwd, specFile)}: no test file (${name}.test.tsx)`);
    }
  }
  return {
    name: 'composite-spec-drift',
    ok: messages.length === 0,
    summary: messages.length === 0
      ? `${specs.length} compositions in sync (composition, labels, i18n, tests)`
      : `${messages.length} drift issue(s) — composition/labels/i18n/test out of sync with the spec`,
    messages,
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const res = run(loadConfig());
  if (!res.ok) {
    console.error(`✗ composite-spec-drift: ${res.summary}\n`);
    console.error(res.messages.map((m) => `  ${m}`).join('\n'));
    process.exit(1);
  }
  console.log(`✓ composite-spec-drift: ${res.summary}.`);
}
