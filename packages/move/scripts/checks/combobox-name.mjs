#!/usr/bin/env node
/**
 * Composed-Select accessible-name guard (AST) — WCAG 4.1.2 (Name, Role, Value).
 *
 * Radix Select's trigger is `role="combobox"`, which the ARIA spec puts in the
 * "name from author" category — name-from-content is PROHIBITED, so the visible
 * text rendered INSIDE the trigger does not become its accessible name. A
 * `<Select.Trigger>` therefore needs an explicit `aria-label` (or
 * `aria-labelledby`); without one, axe reports `button-name` and screen-reader
 * users hear an unnamed control.
 *
 * The bug this guards: CalendarNav's month/year `<Select.Trigger>` rendered the
 * month name inside but set no aria-label — sighted users saw "January", screen
 * readers announced nothing. It only surfaced in the docs axe sweep, one CI
 * layer removed from the component. This check moves that guarantee into the
 * library's own `check:all`.
 *
 * Scope: `<Select.Trigger>` elements COMPOSED inside another component's source
 * (CalendarNav, ColorPicker, …). These are concrete internal usages — Select
 * doesn't name itself and there is no consumer to supply the name, so the name
 * must be present at the composition site.
 *
 * Deliberately NOT covered: a component that DEFINES a public combobox
 * (Autocomplete's `<input role="combobox">`) and spreads the consumer's
 * `{...attrs}` — there the name legitimately comes from the consumer / a
 * FormField, exactly like a plain <input>. Those are named at usage and are
 * verified by the render-level docs a11y sweep, not here.
 *
 * Escape hatch: put `combobox-name-ignore` in a comment on the opening line.
 *
 * Exit 0 = clean, 1 = at least one unnamed composed Select.Trigger.
 */
import { readdirSync, statSync, readFileSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const HERE = dirname(fileURLToPath(import.meta.url));
const MOVE_ROOT = join(HERE, '..', '..');
const COMPONENTS = join(MOVE_ROOT, 'src', 'components');
const IGNORE = 'combobox-name-ignore';

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

const violations = [];
const files = componentFiles();

for (const file of files) {
  const sf = parse(file);
  const rel = relative(MOVE_ROOT, file);
  const lines = readFileSync(file, 'utf8').split('\n');

  walk(sf, (node) => {
    const opening = ts.isJsxElement(node)
      ? node.openingElement
      : ts.isJsxSelfClosingElement(node)
        ? node
        : null;
    if (!opening) return;
    if (opening.tagName.getText(sf) !== 'Select.Trigger') return;

    if (hasAttr(opening, 'aria-label', sf) || hasAttr(opening, 'aria-labelledby', sf)) return;

    const { line } = sf.getLineAndCharacterOfPosition(opening.getStart(sf));
    if ((lines[line] ?? '').includes(IGNORE) || (lines[line - 1] ?? '').includes(IGNORE)) return;

    violations.push(
      `${rel}:${line + 1}  <Select.Trigger> has no accessible name. role="combobox" forbids name-from-content, so the visible text inside is ignored — add aria-label or aria-labelledby.`,
    );
  });
}

if (!violations.length) {
  console.log(`✓ combobox-name: ${files.length} component files — every composed <Select.Trigger> has an accessible name.`);
  process.exit(0);
}
console.error(`✗ combobox-name: ${violations.length} unnamed <Select.Trigger>(s).\n`);
for (const v of violations) console.error(`  ${v}`);
process.exit(1);
