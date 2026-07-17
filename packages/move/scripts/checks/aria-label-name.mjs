#!/usr/bin/env node
/**
 * Label-in-Name guard (AST) — WCAG 2.5.3.
 *
 * A control that sets `aria-label` AND renders the consumer's children as its
 * visible content gives screen-reader / voice-control users a different name
 * than sighted users see. The aria-label overrides the visible text, so they
 * diverge (the bug: <button aria-label={labels.retry}>{props.children}</button>
 * showed "Try again" but announced "Retry").
 *
 * Rule: an element must not set `aria-label` while rendering a BARE children
 * expression ({props.children} / {children}) as content. The icon-button pattern
 * `{props.children ?? <Icon/>}` is fine — the `??` fallback means the default
 * content is an icon (no visible text), so the aria-label legitimately names it.
 * Likewise `aria-label` on a self-closing / childless element is fine.
 *
 * Escape hatch: put `aria-label-name-ignore` in a comment on the line.
 *
 * Exit 0 = clean, 1 = at least one Label-in-Name risk.
 *
 * @enforces a11y-4
 */
import { readdirSync, statSync, readFileSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const HERE = dirname(fileURLToPath(import.meta.url));
const MOVE_ROOT = join(HERE, '..', '..');
const COMPONENTS = join(MOVE_ROOT, 'src', 'components');
const IGNORE = 'aria-label-name-ignore';

const parse = (file) =>
  ts.createSourceFile(file, readFileSync(file, 'utf8'), ts.ScriptTarget.ES2022, true, ts.ScriptKind.TSX);
const walk = (node, fn) => {
  fn(node);
  ts.forEachChild(node, (c) => walk(c, fn));
};

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
  return out.sort();
}

const attrName = (a, sf) => (ts.isJsxAttribute(a) ? a.name.getText(sf) : '');
const hasAttr = (opening, name, sf) =>
  opening.attributes.properties.some((a) => attrName(a, sf) === name);

// A JSX child that is a BARE `props.children` / `children` expression — i.e. the
// consumer's content rendered directly, with no `??` / ternary fallback (those
// are BinaryExpression / ConditionalExpression and so don't match here).
const isBareChildren = (expr) =>
  (ts.isPropertyAccessExpression(expr) && expr.name.text === 'children') ||
  (ts.isIdentifier(expr) && expr.text === 'children');

const violations = [];
const files = componentFiles();

for (const file of files) {
  const sf = parse(file);
  const rel = relative(MOVE_ROOT, file);
  const lines = readFileSync(file, 'utf8').split('\n');

  walk(sf, (node) => {
    if (!ts.isJsxElement(node)) return;
    const opening = node.openingElement;
    const tag = opening.tagName.getText(sf);

    // Scope to PLAIN interactive text controls — native <button>/<a> with no
    // explicit role. Regions/landmarks (<nav>, <div role="toolbar">) legitimately
    // use aria-label to NAME a region, and a role makes the element a widget whose
    // accessible name isn't its visible text — none of those are Label-in-Name.
    if (tag !== 'button' && tag !== 'a') return;
    if (hasAttr(opening, 'role', sf)) return;
    if (!hasAttr(opening, 'aria-label', sf)) return;

    const rendersBareChildren = node.children.some(
      (c) => ts.isJsxExpression(c) && c.expression && isBareChildren(c.expression),
    );
    if (!rendersBareChildren) return;

    const { line } = sf.getLineAndCharacterOfPosition(opening.getStart(sf));
    if ((lines[line] ?? '').includes(IGNORE) || (lines[line - 1] ?? '').includes(IGNORE)) return;

    violations.push(
      `${rel}:${line + 1}  <${tag}> sets aria-label AND renders {children} — visible text and accessible name diverge (Label-in-Name). Drop the aria-label (children are the name), or give children an icon fallback ({children ?? <Icon/>}).`,
    );
  });
}

if (!violations.length) {
  console.log(`✓ aria-label-name: ${files.length} component files — no aria-label overrides visible children.`);
  process.exit(0);
}
console.error(`✗ aria-label-name: ${violations.length} Label-in-Name risk(s).\n`);
for (const v of violations) console.error(`  ${v}`);
process.exit(1);
