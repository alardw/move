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
 *   source-8 — the consumer's HTML attrs (id, aria-…, data-…) and the root slot's
 *              leftover styles reach the real element (else they vanish).
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

/** Peel `as T` / parens / `!` off an expression. */
const unwrap = (e) => {
  while (e && (ts.isAsExpression(e) || ts.isParenthesizedExpression(e) || ts.isNonNullExpression(e))) e = e.expression;
  return e;
};

/** Is this a `sp(...)` / `slot(...)` call? (the slot-props sources.) */
const isSpCall = (e) =>
  e && ts.isCallExpression(e) && ts.isIdentifier(e.expression) && (e.expression.text === 'sp' || e.expression.text === 'slot');

/** The `const <Name> = withMoveComponent(` this call is assigned to (for messages). */
function factoryName(call) {
  let n = call.parent;
  while (n) {
    if (ts.isVariableDeclaration(n) && n.name) return n.name.getText();
    n = n.parent;
  }
  return '?';
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

    // source-8 (gate): the consumer's HTML attrs (id/aria-*/data-*) and the root
    // slot's leftover styles must reach the real element. attrs may be forwarded
    // three ways — spread `{...attrs}`, a rest-alias (`{ onClick, ...restAttrs } =
    // attrs; {...restAttrs}`), or handed to a DOM-owning child (`attrs={attrs}`).
    // A factory that delegates via `attrs={}` also delegates its slot styling to
    // that child; otherwise the root slot's rest (`{...spRest}`) must be spread.
    // Runs on EVERY factory, slotted or not — a slotless root still owns attrs.
    const rel8 = relative(MOVE_ROOT, file);
    const fname = factoryName(call);
    const attrsAliases = new Set(['attrs']);
    const spAliases = new Set();
    walk(call, (n) => {
      if (!ts.isVariableDeclaration(n) || !n.initializer) return;
      const init = unwrap(n.initializer);
      if (ts.isObjectBindingPattern(n.name)) {
        const fromAttrs = ts.isIdentifier(init) && init.text === 'attrs';
        const fromSp = isSpCall(init);
        if (fromAttrs || fromSp)
          for (const el of n.name.elements)
            if (el.dotDotDotToken) (fromAttrs ? attrsAliases : spAliases).add(el.name.getText());
      } else if (ts.isIdentifier(n.name) && ts.isIdentifier(init) && init.text === 'attrs') {
        attrsAliases.add(n.name.getText());
      }
    });
    const isAttrsAlias = (e) => e && ts.isIdentifier(e) && attrsAliases.has(e.text);
    const isSpRest = (e) => (ts.isIdentifier(e) && (spAliases.has(e.text) || /[Ss]pRest$/.test(e.text))) || isSpCall(e);
    let spreadsAttrs = false, delegatesAttrs = false, spreadsSpRest = false;
    walk(call, (n) => {
      if (ts.isJsxSpreadAttribute(n) || ts.isSpreadAssignment(n)) {
        const e = unwrap(n.expression);
        if (isAttrsAlias(e)) spreadsAttrs = true;
        if (isSpRest(e)) spreadsSpRest = true;
      }
      if (ts.isJsxAttribute(n) && n.name.getText() === 'attrs' && n.initializer && ts.isJsxExpression(n.initializer) && isAttrsAlias(unwrap(n.initializer.expression)))
        delegatesAttrs = true;
    });
    if (!spreadsAttrs && !delegatesAttrs)
      violations.push(`[source-8] ${rel8}: ${fname} forwards no attrs — the consumer's id/aria-*/data-* vanish; spread {...attrs} on the root`);
    else if (!spreadsSpRest && !delegatesAttrs)
      violations.push(`[source-8] ${rel8}: ${fname} spreads no slot rest — the root slot's styles vanish; spread {...spRest} on the root`);

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
  console.log(`✓ factory-conformance: ${factories} factories — slots declared/used/themeable, defaults + slot classes + attrs/spRest + ref in place (source-4/5/6/7/8/9).`);
  process.exit(0);
}
console.error(`✗ factory-conformance: ${violations.length} issue(s).\n`);
for (const v of violations) console.error(`  ${v}`);
process.exit(1);
