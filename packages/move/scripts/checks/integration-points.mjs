#!/usr/bin/env node
/**
 * Integration-points drift guard (AST) — keeps a component's declared adapter
 * seams honest, the way spec-drift keeps props honest.
 *
 * For every `integrationPoints` entry in a component spec:
 *   contract — the named type must be exported from the public barrel
 *              (src/index.ts), so a consumer can actually import it.
 *   fixture  — if set, must be an export of packages/docs/src/fixtures/*
 *              (the docs-only fake that drives the live sample).
 *   sample   — if set, must be a sample id in the component's docs content
 *              (packages/docs/src/content/components/<slug>/index.ts).
 *
 * Exit 0 = every reference resolves, 1 = at least one dangling reference.
 */
import { readdirSync, statSync, existsSync, readFileSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const HERE = dirname(fileURLToPath(import.meta.url));
const MOVE_ROOT = join(HERE, '..', '..'); // packages/move
const REPO = join(MOVE_ROOT, '..', '..'); // repo root
const COMPONENTS = join(MOVE_ROOT, 'src', 'components');
const BARREL = join(MOVE_ROOT, 'src', 'index.ts');
const DOCS_FIXTURES = join(REPO, 'packages', 'docs', 'src', 'fixtures');
const DOCS_CONTENT = join(REPO, 'packages', 'docs', 'src', 'content', 'components');

const parse = (file) =>
  ts.createSourceFile(file, readFileSync(file, 'utf8'), ts.ScriptTarget.ES2022, true, ts.ScriptKind.TS);
const walk = (node, fn) => {
  fn(node);
  ts.forEachChild(node, (c) => walk(c, fn));
};
const kebab = (name) => name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

// ── Public barrel: the set of names a consumer can import ────────────────────
// The barrel is nothing but export statements, so any exported identifier name
// appearing in it is importable. A contract's base type (generics stripped) must
// be one of them.
const barrelSrc = readFileSync(BARREL, 'utf8');
const barrelExports = new Set([...barrelSrc.matchAll(/\b([A-Z][A-Za-z0-9_]*)\b/g)].map((m) => m[1]));
const baseType = (c) => c.replace(/<.*$/s, '').trim();

// ── Docs fixtures: exported fake-provider names ──────────────────────────────
const fixtureExports = new Set();
if (existsSync(DOCS_FIXTURES)) {
  for (const f of readdirSync(DOCS_FIXTURES)) {
    if (!f.endsWith('.ts')) continue;
    const src = readFileSync(join(DOCS_FIXTURES, f), 'utf8');
    for (const m of src.matchAll(/export\s+(?:async\s+)?(?:function|const|class|interface|type|let)\s+(\w+)/g))
      fixtureExports.add(m[1]);
    for (const m of src.matchAll(/export\s*\{([^}]+)\}/g))
      for (const name of m[1].split(',')) fixtureExports.add(name.trim().split(/\s+as\s+/)[0].trim());
  }
}

// ── A component's docs sample ids ────────────────────────────────────────────
function sampleIds(componentName) {
  const idx = join(DOCS_CONTENT, kebab(componentName), 'index.ts');
  if (!existsSync(idx)) return null; // no docs content → can't resolve
  return new Set([...readFileSync(idx, 'utf8').matchAll(/\bid:\s*'([^']+)'/g)].map((m) => m[1]));
}

// ── Read a string property off an object-literal node (handles `x as const`) ──
function strProp(obj, name, sf) {
  for (const p of obj.properties) {
    if (!ts.isPropertyAssignment(p) || p.name.getText(sf) !== name) continue;
    let init = p.initializer;
    if (ts.isAsExpression(init)) init = init.expression;
    if (ts.isStringLiteral(init)) return init.text;
  }
  return undefined;
}

function componentSpecs() {
  const out = [];
  const rec = (dir) => {
    for (const e of readdirSync(dir)) {
      const p = join(dir, e);
      if (statSync(p).isDirectory()) rec(p);
      else if (p.endsWith('.spec.ts')) out.push(p);
    }
  };
  rec(COMPONENTS);
  return out.sort();
}

const errors = [];
let pointCount = 0;

for (const file of componentSpecs()) {
  const sf = parse(file);
  const rel = relative(MOVE_ROOT, file);
  let componentName = '';

  walk(sf, (node) => {
    // capture `name: 'Autocomplete'` at the spec's top level
    if (ts.isPropertyAssignment(node) && node.name.getText(sf) === 'name' && ts.isStringLiteral(node.initializer) && !componentName) {
      componentName = node.initializer.text;
    }
    if (!ts.isPropertyAssignment(node) || node.name.getText(sf) !== 'integrationPoints') return;
    if (!ts.isArrayLiteralExpression(node.initializer)) return;

    for (const el of node.initializer.elements) {
      if (!ts.isObjectLiteralExpression(el)) continue;
      pointCount++;
      const id = strProp(el, 'id', sf) ?? '?';
      const contract = strProp(el, 'contract', sf);
      const fixture = strProp(el, 'fixture', sf);
      const sample = strProp(el, 'sample', sf);

      if (contract) {
        const base = baseType(contract);
        if (!barrelExports.has(base)) {
          errors.push(`${rel} [${id}]: contract '${contract}' — '${base}' is not exported from src/index.ts (the public barrel)`);
        }
      }
      if (fixture && !fixtureExports.has(fixture)) {
        errors.push(`${rel} [${id}]: fixture '${fixture}' — no such export in packages/docs/src/fixtures`);
      }
      if (sample) {
        const ids = sampleIds(componentName);
        if (ids === null) {
          errors.push(`${rel} [${id}]: sample '${sample}' — no docs content for ${componentName} to resolve it`);
        } else if (!ids.has(sample)) {
          errors.push(`${rel} [${id}]: sample '${sample}' — not a sample id in the ${componentName} docs content`);
        }
      }
    }
  });
}

if (errors.length) {
  console.error(`✗ integration-points: ${errors.length} dangling reference(s)\n`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}
console.log(`✓ integration-points: ${pointCount} declared point(s) — contracts exported, fixtures + samples resolve.`);
process.exit(0);
