#!/usr/bin/env node
/**
 * Who wins when the caller and the component set the same prop.
 *
 * Every component spreads the caller's props onto its element. JSX compiles
 * that to an object literal, so an attribute written AFTER the spread replaces
 * whatever the caller passed — and when the component's value is conditional
 * and resolves to `undefined`, it does not merely override the caller's, it
 * DELETES it. `aria-label={cond ? id : undefined}` after `{...attrs}` leaves the
 * element with no accessible name at all. Both directions are silent.
 *
 * Spread POSITION is the only lever the code has, and it expresses exactly one
 * policy: the component always wins. But there are three kinds of prop here and
 * they want three different answers:
 *
 *   STRUCTURAL  role, type, aria-expanded, aria-sort, aria-checked, data-*.
 *               These ARE the component. A caller overriding `aria-expanded`
 *               on a disclosure trigger breaks the contract the library
 *               guarantees, and it still LOOKS fine. Component wins — set them
 *               after the spread, which is what this check permits.
 *
 *   NAMING      aria-label, aria-labelledby, aria-describedby, aria-valuetext,
 *               title, alt. A component can only supply a DEFAULT: it knows the
 *               control is a close button, not whether this one closes a dialog
 *               or a filter panel. Caller wins — set them BEFORE the spread, or
 *               read the caller's value back explicitly.
 *
 *   BEHAVIOUR   onClick, onKeyDown and the other DOM handlers. Neither wins:
 *               BOTH must run. Replacing a caller's handler swallows it with no
 *               error; ignoring the component's breaks the component. Compose —
 *               destructure the caller's handler and call it alongside.
 *
 * Only naming and behaviour are flagged. Reading the caller's value back is the
 * other legal shape for both (`props['aria-label'] ?? labels.close`, or calling
 * a destructured `onClick`), so the check parses rather than greps: Carousel's
 * `props['aria-label'] || 'Next slide'` is correct and a regex cannot tell it
 * apart from a bare literal.
 *
 * @enforces behavior-4
 * @instead move a naming attribute ahead of the `{...attrs}` spread so the
 *   caller's value survives, or read theirs back (`props['aria-label'] ?? …`);
 *   for a handler, destructure the caller's and call it alongside the
 *   component's own rather than replacing it.
 */

import { readdirSync, statSync, readFileSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

// Naming is enforced. BEHAVIOUR is measured but not yet enforced: 55 sites
// replace a caller's handler today, and composing them changes runtime
// behaviour in ~20 components, so that tranche lands on its own rather than
// riding along with a rule about names. `--handlers` reproduces the work list.
const HANDLERS = process.argv.includes('--handlers');

const HERE = dirname(fileURLToPath(import.meta.url));
const MOVE = join(HERE, '..', '..');
const COMPONENTS = join(MOVE, 'src', 'components');

/** Props the caller owns: the component may default them, never replace them. */
const NAMING = /^(aria-label|aria-labelledby|aria-describedby|aria-valuetext|title|alt)$/;
/** DOM events a caller can plausibly pass. Both handlers must run. */
const DOM_EVENT =
  /^on(Click|DoubleClick|MouseDown|MouseUp|MouseEnter|MouseLeave|MouseMove|MouseOver|MouseOut|KeyDown|KeyUp|KeyPress|Focus|Blur|Input|Change|Submit|Paste|Copy|Cut|Wheel|Scroll|Pointer\w+|Touch\w+|Drag\w*|Drop|Context\w+)$/;
/** Identifiers that carry the CALLER's props. Slot props (`sp()`) are ours. */
const CONSUMER = /^(attrs|restAttrs|rest|controlProps|.*Attrs)$/;
const IGNORE = 'precedence-exempt';

function walk(dir, out = []) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.tsx$/.test(p) && !/\.(test|spec|browser)\./.test(p)) out.push(p);
  }
  return out;
}

const errors = [];

for (const file of walk(COMPONENTS)) {
  const src = readFileSync(file, 'utf8');
  const lines = src.split('\n');
  const sf = ts.createSourceFile(file, src, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);

  const visit = (node) => {
    if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
      const props = node.attributes.properties;
      const spreadIndex = props.findIndex(
        (p) =>
          ts.isJsxSpreadAttribute(p) &&
          ts.isIdentifier(p.expression) &&
          CONSUMER.test(p.expression.text),
      );
      if (spreadIndex >= 0) {
        const spreadName = props[spreadIndex].expression.text;
        for (const p of props.slice(spreadIndex + 1)) {
          if (!ts.isJsxAttribute(p)) continue;
          const name = p.name.getText(sf);
          const kind = NAMING.test(name) ? 'name' : DOM_EVENT.test(name) ? 'handler' : null;
          if (!kind) continue;
          if (kind === 'handler' && !HANDLERS) continue;

          const expr = p.initializer ? p.initializer.getText(sf) : '';
          // Reading the caller's value back is the other legal shape. Accept the
          // spread object, an indexed lookup, or a destructured local of the
          // same name — all three are how the caller's value gets composed in.
          const camel = name.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
          if (
            expr.includes(spreadName) ||
            expr.includes(`'${name}'`) ||
            expr.includes(`"${name}"`) ||
            new RegExp(`\\b${camel}\\b`).test(expr)
          )
            continue;

          const line = sf.getLineAndCharacterOfPosition(p.getStart(sf)).line;
          if ((lines[line] ?? '').includes(IGNORE) || (lines[line - 1] ?? '').includes(IGNORE))
            continue;

          errors.push({
            file: relative(MOVE, file),
            line: line + 1,
            name,
            kind,
            spreadName,
          });
        }
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);
}

if (errors.length) {
  console.error(`\n✗ prop-precedence: ${errors.length} prop(s) replace what the caller passed.\n`);
  for (const e of errors) {
    const why =
      e.kind === 'name'
        ? `set it BEFORE {...${e.spreadName}} so the caller's name wins, or read theirs back`
        : `destructure the caller's ${e.name} and call it alongside, so both run`;
    console.error(`  ${e.file}:${e.line}  ${e.name} — ${why}`);
  }
  console.error(
    `\n  Structural props (role, type, aria-expanded, data-*) are exempt: those ARE the` +
      `\n  component. Escape a deliberate case with a ${IGNORE} comment and a reason.\n`,
  );
  process.exit(1);
}

console.log(
  HANDLERS
    ? `✓ prop-precedence: no component replaces a caller's name or swallows their handler.`
    : `✓ prop-precedence: no component replaces a caller's accessible name.`,
);
