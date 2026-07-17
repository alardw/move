#!/usr/bin/env node
/**
 * Controlled/uncontrolled coverage guardrail.
 *
 * A spec that declares `controlled` is promising two working modes: the consumer
 * either owns the value (`value` + `onValueChange`) or lets the component own it
 * (`defaultValue`, or nothing at all). Half that API can break without a single
 * test going red — Select passed `value` to Radix unconditionally, so an
 * uncontrolled Select handed Radix `undefined` on mount and a string after the
 * first selection, flipping it uncontrolled → controlled. Every test still
 * passed; the only symptom was a React warning nobody read.
 *
 * The behaviour lives in the tests (this is a `test`-kind rule); what's
 * mechanizable is that the tests actually exercise BOTH modes. So for each
 * component whose spec declares a triad, this asserts its test file names:
 *
 *   - the uncontrolled default prop  (defaultValue / defaultOpen / defaultChecked)
 *   - the controlled prop            (value / open / checked)
 *   - the change handler             (onValueChange / onOpenChange / onCheckedChange)
 *
 * The prop names come from the spec (`controlledProps`, else the `controlled`
 * pattern's conventional triad), never a hardcoded list — a component that renames
 * its triad is checked against its own names.
 *
 * This proves a mode is exercised, not that the assertion is good. Paired with the
 * fail-on-console gate in vitest.setup.ts, that's enough teeth for the Select
 * class of bug: a test that merely renders an uncontrolled component and clicks it
 * now fails on the warning by itself.
 *
 * Exit: 0 = every triad component covers both modes, 1 = at least one doesn't.
 *
 * @enforces behavior-3
 */

import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';
import { getProp, asString, loadSpec, listComponents } from './_familyShared.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const COMPONENTS_DIR = join(HERE, '..', '..', 'src', 'components');

/** Specs write `controlled: 'value' as const`, so the literal sits inside an
 *  AsExpression — the shared asString() sees the wrapper and returns null. */
function str(node) {
  let n = node;
  while (n && (ts.isAsExpression(n) || ts.isParenthesizedExpression(n))) n = n.expression;
  return asString(n);
}

/** The conventional triad each `controlled` pattern implies (spec-type.ts). */
const TRIADS = {
  open: { valueProp: 'open', defaultValueProp: 'defaultOpen', onChangeProp: 'onOpenChange' },
  value: { valueProp: 'value', defaultValueProp: 'defaultValue', onChangeProp: 'onValueChange' },
  checked: {
    valueProp: 'checked',
    defaultValueProp: 'defaultChecked',
    onChangeProp: 'onCheckedChange',
  },
};

/** The triad a spec actually declares: explicit `controlledProps` wins, else the
 *  pattern's convention. Returns null when the component isn't controlled at all. */
function triadOf(specObj) {
  const pattern = str(getProp(specObj, 'controlled'));
  if (!pattern || !TRIADS[pattern]) return null;
  const base = TRIADS[pattern];

  const declared = getProp(specObj, 'controlledProps');
  if (!declared) return base;

  // Flat single-prop form. The keyed multi-controlled map (Splitter et al.) nests a
  // triad per key; its own props still carry the same three roles, so read the first.
  const direct = str(getProp(declared, 'valueProp'));
  const obj = direct ? declared : (declared.properties?.[0]?.initializer ?? declared);

  return {
    valueProp: str(getProp(obj, 'valueProp')) ?? base.valueProp,
    defaultValueProp: str(getProp(obj, 'defaultValueProp')) ?? base.defaultValueProp,
    onChangeProp: str(getProp(obj, 'onChangeProp')) ?? base.onChangeProp,
  };
}

/** The names the test file passes as props to the component's state owner.
 *
 *  Read off the AST, not grepped: `<DatePicker.Root defaultOpen>` is a JSX boolean
 *  shorthand with no `=`, so a /prop\s*[=:]/ regex calls DatePicker untested when it
 *  isn't — while loosening that regex to a bare identifier match swaps it for the worse
 *  failure, `value`/`open` hitting prose in test titles and locals (`const value = …`)
 *  and reporting covered when it isn't.
 *
 *  Counts every JSX attribute EXCEPT those on the component's own sub-components, plus
 *  every object-literal key. Framed as an exclusion because the triad sits on whatever
 *  owns the state, and the tests reach it three ways: directly (`<Calendar.Root value>`),
 *  via a Provider (`<Sidebar.Provider collapsed>`), or through a local wrapper that
 *  spreads onto the root (`<BasicUpload value>` → `<FileUpload.Root {...props}>`) — an
 *  allowlist of root-ish tags misses the last one. What must NOT count is a sibling part:
 *  `<Autocomplete.Item value="apple">` is the item's value, not the root's. */
function rootPropNamesIn(testFile, componentName) {
  const names = new Set();
  const sf = ts.createSourceFile(
    testFile,
    readFileSync(testFile, 'utf8'),
    ts.ScriptTarget.ES2022,
    true,
    ts.ScriptKind.TSX,
  );

  const isSubComponent = (tag) => {
    const text = tag.getText();
    if (!text.startsWith(`${componentName}.`)) return false;
    const part = text.slice(componentName.length + 1);
    return part !== 'Root' && part !== 'Provider';
  };

  (function walk(node) {
    if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
      if (!isSubComponent(node.tagName)) {
        for (const attr of node.attributes.properties) {
          if (ts.isJsxAttribute(attr) && ts.isIdentifier(attr.name)) names.add(attr.name.text);
        }
      }
    }
    // Helper style: renderFoo({ defaultChecked: true }) — the keys are the root's props,
    // but there's no tag to attribute them to, so take them all.
    if (
      (ts.isPropertyAssignment(node) || ts.isShorthandPropertyAssignment(node)) &&
      ts.isIdentifier(node.name)
    ) {
      names.add(node.name.text);
    }
    ts.forEachChild(node, walk);
  })(sf);
  return names;
}

const offenders = [];
let covered = 0;

for (const { name, specFile } of listComponents(COMPONENTS_DIR)) {
  const specObj = loadSpec(specFile);
  if (!specObj) continue;
  const triad = triadOf(specObj);
  if (!triad) continue;

  const testFile = specFile.replace(/\.spec\.ts$/, '.test.tsx');
  if (!existsSync(testFile)) {
    // unit-1 (component-conformance) owns "a test file exists" — don't double-report.
    continue;
  }
  const props = rootPropNamesIn(testFile, name);

  const missing = [];
  if (triad.defaultValueProp && !props.has(triad.defaultValueProp)) {
    missing.push(`uncontrolled (${triad.defaultValueProp})`);
  }
  if (!props.has(triad.valueProp)) {
    missing.push(`controlled (${triad.valueProp})`);
  }
  if (triad.onChangeProp && !props.has(triad.onChangeProp)) {
    missing.push(`change handler (${triad.onChangeProp})`);
  }

  if (missing.length) offenders.push({ name, missing });
  else covered++;
}

if (offenders.length) {
  console.error('  ✗ Components declaring a controlled triad whose tests skip a mode:');
  for (const { name, missing } of offenders) {
    console.error(`      ${name}: no test names ${missing.join(', ')}`);
  }
  console.error(
    `\n  controlled-modes: ${offenders.length} component(s) leave a declared mode untested.`,
  );
  console.error('  Both modes are public API — test each, or drop `controlled` from the spec.');
  process.exit(1);
}

console.log(`✓ controlled-modes: ${covered} components with a declared triad test both modes.`);
process.exit(0);
