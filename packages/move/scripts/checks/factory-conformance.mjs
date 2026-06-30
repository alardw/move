#!/usr/bin/env node
/**
 * Factory-shape conformance (AST) — the structural rules a grep can't safely
 * check, reasoning over the TypeScript tree like composition-spec-drift / spec-drift.
 *
 * For every `withMoveComponent({...})` call (so compound components with several
 * factories in one file each validate independently):
 *
 *   source-4 — no inline default in a `const { x = … } = props` destructure
 *              (defaults belong in the factory's `defaults` object).
 *   source-5 — the `slots` array and the slots actually used by `sp()`/`cx()`
 *              agree (no slot declared-but-unused, none used-but-undeclared).
 *   source-6 — a slot's className goes through cx()/slot(), never raw styles.<slot>.
 *   source-7 — every declared slot is slotProps-themeable (slot() or sp()).
 *   source-9 — the render forwards a ref to the real node.
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

    const slotSet = new Set(slots);
    let hasRef = false;
    walk(call, (n) => {
      // source-4 (gate): defaults belong in the factory's `defaults` object, not
      // inline in a `const { x = … } = props` destructure (which bypasses it).
      if (
        ts.isVariableDeclaration(n) && n.initializer &&
        ts.isIdentifier(n.initializer) && n.initializer.text === 'props' &&
        n.name && ts.isObjectBindingPattern(n.name)
      ) {
        for (const el of n.name.elements) {
          if (el.initializer) violations.push(`[source-4] ${rel}: inline default on props.${el.name.getText()} — move it to the factory's defaults object`);
        }
      }
      // source-6 (gate): a slot's className must go through cx()/slot(), never a
      // raw styles.<slot> (which drops the consumer's className for that part).
      if (ts.isJsxAttribute(n) && n.name.getText() === 'className' && n.initializer && ts.isJsxExpression(n.initializer)) {
        const e = n.initializer.expression;
        if (e && ts.isPropertyAccessExpression(e) && ts.isIdentifier(e.expression) && e.expression.text === 'styles' && slotSet.has(e.name.text)) {
          violations.push(`[source-6] ${rel}: className={styles.${e.name.text}} on a slot — use cx('${e.name.text}') or slot('${e.name.text}')`);
        }
      }
      // source-9 (gate): ref reaches the real node — either a `ref=` JSX attribute
      // or a forwarded `ref` in a spread props object (e.g. `{ ...attrs, ref }`).
      if (ts.isJsxAttribute(n) && n.name.getText() === 'ref') hasRef = true;
      if ((ts.isShorthandPropertyAssignment(n) || ts.isPropertyAssignment(n)) && n.name && n.name.getText() === 'ref') hasRef = true;
    });
    if (!hasRef) violations.push(`[source-9] ${rel}: render forwards no ref — focus, measurement, and portals need the real node`);
  }
}

if (!violations.length) {
  console.log(`✓ factory-conformance: ${factories} factories — slots declared/used/themeable, defaults + slot classes + ref in place (source-4/5/6/7/9).`);
  process.exit(0);
}
console.error(`✗ factory-conformance: ${violations.length} issue(s).\n`);
for (const v of violations) console.error(`  ${v}`);
process.exit(1);
