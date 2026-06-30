#!/usr/bin/env node
/**
 * moveProps completeness guard (AST) — source-3.
 *
 * The factory spreads every prop onto the DOM EXCEPT those in
 * `stripKeys = {'sp'} ∪ moveProps ∪ keys(defaults)` (see engine/factory.tsx).
 * So a Move-specific prop the component consumes — `variant`, `size`,
 * `animations`, `fullWidth`, … — must be declared in `moveProps` or `defaults`,
 * or it leaks onto the real element as an invalid attribute (React warns, and the
 * styling/behavior prop does nothing useful on the DOM).
 *
 * For each `withMoveComponent({ name, moveProps, defaults })` factory we match its
 * spec sub-component (factory name = ComponentName + SubName, or the component
 * itself for the root) and assert every `moveSpecific: true` prop there is in
 * `moveProps ∪ defaults`. Non-factory parts (a plain-FC Root that forwards props
 * to a hook, not the DOM) have no factory to match and are skipped.
 *
 * Exit 0 = clean, 1 = a moveSpecific prop missing from its factory's moveProps/defaults.
 */
import { readdirSync, statSync, readFileSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const HERE = dirname(fileURLToPath(import.meta.url));
const MOVE_ROOT = join(HERE, '..', '..');
const COMPONENTS = join(MOVE_ROOT, 'src', 'components');
const AUTO_STRIPPED = new Set(['sp']); // engine/factory.tsx MOVE_INTERNAL_KEYS

const parse = (file) =>
  ts.createSourceFile(file, readFileSync(file, 'utf8'), ts.ScriptTarget.ES2022, true, ts.ScriptKind.TSX);
const walk = (node, fn) => {
  fn(node);
  ts.forEachChild(node, (c) => walk(c, fn));
};
const unquote = (s) => s.replace(/^['"]|['"]$/g, '');

function walkFiles(dir, pred, out = []) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walkFiles(p, pred, out);
    else if (pred(p)) out.push(p);
  }
  return out;
}

// ── Source: every withMoveComponent factory → its strip set ──────────────────
function factoriesIn(dir) {
  const map = new Map(); // factoryName -> Set(stripKeys)
  const tsx = walkFiles(dir, (p) => p.endsWith('.tsx') && !p.endsWith('.test.tsx'));
  for (const file of tsx) {
    const sf = parse(file);
    walk(sf, (n) => {
      if (!ts.isCallExpression(n) || !ts.isIdentifier(n.expression) || n.expression.text !== 'withMoveComponent') return;
      const arg = n.arguments[0];
      if (!arg || !ts.isObjectLiteralExpression(arg)) return;
      let name = null;
      const strip = new Set(AUTO_STRIPPED);
      for (const p of arg.properties) {
        if (!ts.isPropertyAssignment(p)) continue;
        const key = p.name.getText(sf);
        if (key === 'name' && ts.isStringLiteral(p.initializer)) name = p.initializer.text;
        else if (key === 'moveProps') {
          let init = p.initializer; // unwrap `[...] as const`
          if (ts.isAsExpression(init)) init = init.expression;
          if (ts.isArrayLiteralExpression(init))
            for (const el of init.elements) if (ts.isStringLiteral(el)) strip.add(el.text);
        } else if (key === 'defaults') {
          let init = p.initializer; // unwrap `{...} as const`
          if (ts.isAsExpression(init)) init = init.expression;
          if (ts.isObjectLiteralExpression(init))
            for (const d of init.properties) if (d.name) strip.add(unquote(d.name.getText(sf)));
        }
      }
      if (name) map.set(name, strip);
    });
  }
  return map;
}

// ── Spec: component name + (Root props, subComponents[{name, props}]) ─────────
function readProps(arrNode, sf) {
  const out = [];
  if (!arrNode || !ts.isArrayLiteralExpression(arrNode)) return out;
  for (const el of arrNode.elements) {
    if (!ts.isObjectLiteralExpression(el)) continue;
    let name = null, moveSpecific = false;
    for (const p of el.properties) {
      if (!ts.isPropertyAssignment(p)) continue;
      const k = p.name.getText(sf);
      if (k === 'name' && ts.isStringLiteral(p.initializer)) name = p.initializer.text;
      if (k === 'moveSpecific' && p.initializer.kind === ts.SyntaxKind.TrueKeyword) moveSpecific = true;
    }
    if (name) out.push({ name, moveSpecific });
  }
  return out;
}

function readSpec(file) {
  const sf = parse(file);
  let specObj = null;
  walk(sf, (n) => {
    if (specObj) return;
    if (ts.isVariableDeclaration(n) && n.name.getText(sf) === 'spec' && n.initializer) {
      let init = n.initializer;
      if (ts.isSatisfiesExpression(init) || ts.isAsExpression(init)) init = init.expression;
      if (ts.isObjectLiteralExpression(init)) specObj = init;
    }
  });
  if (!specObj) return null;
  let name = '', rootProps = [], subs = [];
  for (const p of specObj.properties) {
    if (!ts.isPropertyAssignment(p)) continue;
    const k = p.name.getText(sf);
    if (k === 'name' && ts.isStringLiteral(p.initializer)) name = p.initializer.text;
    else if (k === 'props') rootProps = readProps(p.initializer, sf);
    else if (k === 'subComponents' && ts.isArrayLiteralExpression(p.initializer)) {
      for (const el of p.initializer.elements) {
        if (!ts.isObjectLiteralExpression(el)) continue;
        let sn = null, sp = [];
        for (const q of el.properties) {
          if (!ts.isPropertyAssignment(q)) continue;
          const kk = q.name.getText(sf);
          if (kk === 'name' && ts.isStringLiteral(q.initializer)) sn = q.initializer.text;
          if (kk === 'props') sp = readProps(q.initializer, sf);
        }
        if (sn) subs.push({ name: sn, props: sp });
      }
    }
  }
  return { name, rootProps, subs, sf };
}

const violations = [];
let factoriesChecked = 0;

for (const specFile of walkFiles(COMPONENTS, (p) => p.endsWith('.spec.ts')).sort()) {
  const spec = readSpec(specFile);
  if (!spec) continue;
  const dir = dirname(specFile);
  const factories = factoriesIn(dir);
  const rel = relative(MOVE_ROOT, specFile);

  // Candidate (factoryName, props[]) pairs: root props → the component factory;
  // each subComponent → ComponentName+SubName.
  const targets = [
    { fname: spec.name, props: spec.rootProps },
    ...spec.subs.map((s) => ({
      fname: s.name === 'Root' ? spec.name : spec.name + s.name,
      props: s.props,
    })),
  ];

  for (const { fname, props } of targets) {
    const strip = factories.get(fname);
    if (!strip) continue; // no factory (plain FC / non-factory part) → rule doesn't apply
    factoriesChecked++;
    for (const p of props) {
      if (p.moveSpecific && !strip.has(p.name)) {
        violations.push(`${rel} [${fname}]: '${p.name}' is moveSpecific but not in moveProps/defaults — leaks to the DOM`);
      }
    }
  }
}

if (violations.length) {
  console.error(`✗ move-props: ${violations.length} moveSpecific prop(s) not stripped from the DOM.\n`);
  for (const v of violations) console.error(`  ${v}`);
  process.exit(1);
}
console.log(`✓ move-props: ${factoriesChecked} factories — every moveSpecific prop is in moveProps/defaults.`);
process.exit(0);
