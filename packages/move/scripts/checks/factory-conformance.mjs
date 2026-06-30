#!/usr/bin/env node
/**
 * Factory-shape conformance (AST) — the structural rules a grep can't safely
 * check, reasoning over the TypeScript tree like recipe-spec-drift / spec-drift.
 *
 * For every `withMoveComponent({...})` call (so compound components with several
 * factories in one file each validate independently):
 *
 *   source-7 — `sp()` is called for every declared slot.
 *   source-5 — the `slots` array and the slots actually used by `sp()`/`cx()`
 *              agree (no slot declared-but-unused, none used-but-undeclared).
 *
 * Files that contain no `withMoveComponent` call (e.g. Calendar's bespoke build,
 * non-factory sub-files) are simply skipped — the rule doesn't apply.
 *
 * Exit 0 = clean, 1 = at least one mismatch.
 */
import { readdirSync, statSync, existsSync, readFileSync } from 'node:fs';
import { join, dirname, basename, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const HERE = dirname(fileURLToPath(import.meta.url));
const MOVE_ROOT = join(HERE, '..', '..');
const COMPONENTS = join(MOVE_ROOT, 'src', 'components');

const parse = (file) =>
  ts.createSourceFile(file, readFileSync(file, 'utf8'), ts.ScriptTarget.ES2022, true, ts.ScriptKind.TSX);
const walk = (node, fn) => { fn(node); ts.forEachChild(node, (c) => walk(c, fn)); };

/** Every component source `.tsx` (main file + sub-files), excluding tests. */
function componentFiles() {
  const out = [];
  const rec = (dir) => {
    for (const e of readdirSync(dir)) {
      const p = join(dir, e);
      if (statSync(p).isDirectory()) rec(p);
      else if (p.endsWith('.tsx') && !p.endsWith('.test.tsx')) out.push(p);
    }
  };
  rec(COMPONENTS);
  return out;
}

/** All `withMoveComponent(...)` call nodes in a source file. */
function factoryCalls(sf) {
  const calls = [];
  walk(sf, (n) => {
    if (ts.isCallExpression(n) && ts.isIdentifier(n.expression) && n.expression.text === 'withMoveComponent') {
      calls.push(n);
    }
  });
  return calls;
}

/** The config object literal passed to a factory call (first arg). */
const configOf = (call) =>
  call.arguments[0] && ts.isObjectLiteralExpression(call.arguments[0]) ? call.arguments[0] : null;

/** Read a property's initializer off an object literal. */
const prop = (obj, name) =>
  obj?.properties.find((p) => ts.isPropertyAssignment(p) && p.name.getText() === name)?.initializer ?? null;

/** String elements of `slots: [...] as const`. */
function slotsOf(config) {
  let node = prop(config, 'slots');
  if (node && ts.isAsExpression(node)) node = node.expression;
  if (!node || !ts.isArrayLiteralExpression(node)) return [];
  return node.elements.filter(ts.isStringLiteral).map((e) => e.text);
}

/** First string argument of every `sp(...)` / `cx(...)` / `slot(...)` call inside
 *  `node`. `slot('x')` applies BOTH cx and sp internally, so it counts as each. */
function slotCalls(node) {
  const sp = new Set();
  const cx = new Set();
  walk(node, (n) => {
    if (!ts.isCallExpression(n) || !ts.isIdentifier(n.expression)) return;
    const fn = n.expression.text;
    const arg0 = n.arguments[0];
    if (!arg0 || !ts.isStringLiteral(arg0)) return;
    if (fn === 'sp' || fn === 'slot') sp.add(arg0.text);
    if (fn === 'cx' || fn === 'slot') cx.add(arg0.text);
  });
  return { sp, cx };
}

const violations = []; // source-5 + source-7 — both hard gates
let factories = 0;

for (const file of componentFiles()) {
  const sf = parse(file);
  for (const call of factoryCalls(sf)) {
    const config = configOf(call);
    if (!config) continue;
    const slots = slotsOf(config);
    if (slots.length === 0) continue; // nothing to relate
    factories++;

    const { sp, cx } = slotCalls(call); // scoped to THIS factory's subtree
    const used = new Set([...sp, ...cx]);
    const rel = relative(MOVE_ROOT, file);

    // source-5 (gate): slots array ↔ used slots parity.
    const declaredUnused = slots.filter((s) => !used.has(s));
    const usedUndeclared = [...used].filter((s) => !slots.includes(s));
    if (declaredUnused.length) violations.push(`[source-5] ${rel}: slot(s) declared but never used: ${declaredUnused.join(', ')}`);
    if (usedUndeclared.length) violations.push(`[source-5] ${rel}: sp()/cx() use undeclared slot(s): ${usedUndeclared.join(', ')}`);

    // source-7 (gate): every declared slot is themeable via slot()/sp().
    const noSp = slots.filter((s) => !sp.has(s));
    if (noSp.length) violations.push(`[source-7] ${rel}: slot(s) not slotProps-themeable — render with slot() or sp(): ${noSp.join(', ')}`);
  }
}

if (!violations.length) {
  console.log(`✓ factory-conformance: ${factories} factories — every slot declared, used, and slotProps-themeable (source-5, source-7).`);
  process.exit(0);
}
console.error(`✗ factory-conformance: ${violations.length} issue(s).\n`);
for (const v of violations) console.error(`  ${v}`);
process.exit(1);
