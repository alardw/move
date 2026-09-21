#!/usr/bin/env node
/**
 * A component composed onto another's element leaves it its data-state.
 *
 * `asChild` merges two components onto one DOM node. Classes concatenate and
 * handlers compose, so sharing those is harmless — but `data-state` holds one
 * value, and Radix standardises on that key across every primitive. Whoever
 * writes last wins and the other's state is simply gone.
 *
 * Wrapping a ToggleGroup item in a Tooltip put `closed` on the button. That
 * matches neither 'on' nor 'off', so all eight of ToggleGroup's state rules
 * fell through and the selected segment drew as if nothing were chosen. No
 * error, no warning, and `aria-checked` stayed correct the whole time — which
 * is why it took a DOM dump to find.
 *
 * There is a host and a guest on a merged node. The host renders the element
 * and its CSS is written against it, so it keeps the plain key. The guest is
 * arriving somewhere it does not own, and writes `data-move-{owner}-state`.
 *
 * Judged per JSX element rather than per file, because a component can be both:
 * Collapsible's trigger is a guest under `asChild` and a host without it, while
 * its root and content write a plain `data-state` that is correctly their own.
 *
 * @enforces behavior-5
 */

import { readdirSync, statSync, existsSync, readFileSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..', '..');
const COMPONENTS = join(ROOT, 'src', 'components');

/**
 * Radix writes `data-state` on its triggers itself, so it never appears in our
 * source — which is why the tag has to be resolved back to its import. A Move
 * trigger (`<Tooltip.Trigger>` inside Chart) is a CALL SITE of a component that
 * already scopes its own state, and demanding a ScopedSlot there would be
 * asking the caller to fix something the component has handled.
 */
const TRIGGER = /^(Sub)?Trigger$/;

/** Namespaces imported from radix-ui, e.g. `import { Tooltip as RadixTooltip }`. */
function radixNamespaces(sf) {
  const out = new Set();
  for (const st of sf.statements) {
    if (!ts.isImportDeclaration(st)) continue;
    if (!/^['"]radix-ui['"]$/.test(st.moduleSpecifier.getText())) continue;
    const named = st.importClause?.namedBindings;
    if (named && ts.isNamedImports(named))
      for (const e of named.elements) out.add(e.name.getText());
    if (named && ts.isNamespaceImport(named)) out.add(named.name.getText());
  }
  return out;
}

/** `<RadixTooltip.Trigger>` — a primitive we are wrapping, not one we are calling. */
const isRadixTrigger = (tag, ns) => {
  const parts = tag.split('.');
  return parts.length === 2 && ns.has(parts[0]) && TRIGGER.test(parts[1]);
};

const attrNames = (el) =>
  el.attributes.properties.filter(ts.isJsxAttribute).map((a) => a.name.getText());

/** Does this element hand its props to a child instead of rendering its own node? */
const delegates = (el, slotTags) =>
  attrNames(el).includes('asChild') || slotTags.has(el.tagName.getText());

function childrenOf(node) {
  // A self-closing element has no children, so it can only be a violation.
  return ts.isJsxElement(node) ? node.children : [];
}

const errors = [];
let checked = 0;
let guests = 0;

for (const cat of readdirSync(COMPONENTS)) {
  const catDir = join(COMPONENTS, cat);
  if (!statSync(catDir).isDirectory()) continue;

  for (const name of readdirSync(catDir)) {
    const file = join(catDir, name, `${name}.tsx`);
    if (!existsSync(file)) continue;
    checked++;

    const src = readFileSync(file, 'utf8');
    const sf = ts.createSourceFile(file, src, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    const ns = radixNamespaces(sf);

    // `const Comp = asChild ? Slot.Root : 'button'` — Comp IS the slot when composed,
    // so an element rendered as <Comp> is a guest even without an asChild attribute.
    const slotTags = new Set(['Slot.Root']);
    const findSlotAliases = (node) => {
      if (
        ts.isVariableDeclaration(node) &&
        node.initializer &&
        ts.isConditionalExpression(node.initializer) &&
        /Slot\.Root/.test(node.initializer.getText())
      ) {
        slotTags.add(node.name.getText());
      }
      ts.forEachChild(node, findSlotAliases);
    };
    findSlotAliases(sf);

    const visit = (node) => {
      const open = ts.isJsxElement(node)
        ? node.openingElement
        : ts.isJsxSelfClosingElement(node)
          ? node
          : null;

      if (open) {
        const tag = open.tagName.getText();
        const names = attrNames(open);
        if (delegates(open, slotTags)) {
          guests++;
          const scopes = childrenOf(node).some((c) => /<ScopedSlot\b/.test(c.getText()));
          const writesPlain = names.includes('data-state');
          const line = sf.getLineAndCharacterOfPosition(open.getStart(sf)).line + 1;
          const where = `${relative(ROOT, file)}:${line}`;

          if (writesPlain) {
            errors.push(
              `${where} — <${tag}> composes onto another component's element and writes a plain ` +
                `data-state. Whichever writes last wins, so the element's own state is lost and ` +
                `the CSS keyed on it stops matching. Write data-move-{owner}-state on this path.`,
            );
          } else if (isRadixTrigger(tag, ns) && !scopes) {
            errors.push(
              `${where} — <${tag}> hands Radix's props to a child, and Radix writes data-state on ` +
                `its triggers. Wrap the children in <ScopedSlot owner="…"> so the element it ` +
                `lands on keeps its own state.`,
            );
          }
        }
      }
      ts.forEachChild(node, visit);
    };
    visit(sf);
  }
}

if (errors.length) {
  console.error(`\n✗ guest-state: ${errors.length} composed element(s) take their host's state.\n`);
  for (const e of errors) console.error(`  - ${e}`);
  console.error(
    `\n  A guest keeps its state under its own name; the host keeps data-state.\n` +
      `  ScopedSlot (src/engine) does the rename and passes everything else through.\n`,
  );
  process.exit(1);
}

console.log(
  `✓ guest-state: ${guests} composed element(s) across ${checked} components — each leaves ` +
    `the element it lands on its own data-state.`,
);
