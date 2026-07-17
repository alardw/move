#!/usr/bin/env node
/**
 * Popup family contract.
 *
 * Walks every component spec, picks out the ones that declare
 * `families.behavior` includes `'popup-anchored'`, and asserts each
 * conforms to the same contract:
 *
 *   1. Declares `families.state` includes `'controlled-open'`.
 *   2. Declares `behavior.popup` with all four close-trigger flags
 *      (closeOnEscape, closeOnOutsideClick, closeOnScroll, closeOnResize)
 *      explicitly as true or false.
 *   3. Has `Trigger` and `Content` sub-components in the spec.
 *
 * What this catches today:
 *   - A popup component missing the family declaration → drift.
 *   - A flag that's `false` → either a known limitation (Tooltip's
 *     pinned positioning) or an unfixed bug (Autocomplete on scroll).
 *     Either way, the gap is visible in the report instead of buried.
 *
 * Future:
 *   - Runtime Playwright pass that opens each popup, fires each event,
 *     and asserts the declared flag matches behavior. That's where
 *     "you said closeOnScroll: true but it doesn't" gets caught
 *     automatically.
 *
 * Exit: 0 = pass, 1 = fail.
 *
 * @enforces none
 */

import { readdirSync, statSync, existsSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const HERE = dirname(fileURLToPath(import.meta.url));
const COMPONENTS_DIR = join(HERE, '..', '..', 'src', 'components');

const VERBOSE = process.argv.includes('--verbose');

const REQUIRED_POPUP_FLAGS = [
  'closeOnEscape',
  'closeOnOutsideClick',
  'closeOnScroll',
  'closeOnResize',
];

// ──────────────────────────────────────────────────────────────────────────────
// Spec parsing
// ──────────────────────────────────────────────────────────────────────────────

function parse(file) {
  const text = readFileSync(file, 'utf8');
  return ts.createSourceFile(file, text, ts.ScriptTarget.ES2022, true, ts.ScriptKind.TS);
}

function getProp(obj, name) {
  if (!obj || !ts.isObjectLiteralExpression(obj)) return null;
  for (const p of obj.properties) {
    if (
      ts.isPropertyAssignment(p) &&
      ((ts.isIdentifier(p.name) && p.name.text === name) ||
        (ts.isStringLiteral(p.name) && p.name.text === name))
    ) {
      return p.initializer;
    }
  }
  return null;
}

function asString(node) {
  if (!node) return null;
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return node.text;
  return null;
}

function asBool(node) {
  if (!node) return null;
  if (node.kind === ts.SyntaxKind.TrueKeyword) return true;
  if (node.kind === ts.SyntaxKind.FalseKeyword) return false;
  return null;
}

function asArray(node) {
  if (!node || !ts.isArrayLiteralExpression(node)) return null;
  return node.elements.map(asString).filter((x) => x != null);
}

function loadSpec(file) {
  const sf = parse(file);
  let specObj = null;
  function walk(node) {
    if (specObj) return;
    if (ts.isVariableStatement(node)) {
      for (const decl of node.declarationList.declarations) {
        if (ts.isIdentifier(decl.name) && decl.name.text === 'spec' && decl.initializer) {
          let init = decl.initializer;
          while (ts.isAsExpression(init) || ts.isParenthesizedExpression(init) || ts.isSatisfiesExpression(init)) init = init.expression;
          if (ts.isObjectLiteralExpression(init)) specObj = init;
        }
      }
    }
    ts.forEachChild(node, walk);
  }
  walk(sf);
  return specObj;
}

// ──────────────────────────────────────────────────────────────────────────────
// Walk the components tree
// ──────────────────────────────────────────────────────────────────────────────

function listComponents() {
  const out = [];
  for (const cat of readdirSync(COMPONENTS_DIR)) {
    const catDir = join(COMPONENTS_DIR, cat);
    if (!statSync(catDir).isDirectory()) continue;
    for (const compName of readdirSync(catDir)) {
      if (compName.startsWith('_')) continue;
      const compDir = join(catDir, compName);
      if (!statSync(compDir).isDirectory()) continue;
      const specFile = join(compDir, `${compName}.spec.ts`);
      if (existsSync(specFile)) out.push({ name: compName, specFile });
    }
  }
  return out;
}

// ──────────────────────────────────────────────────────────────────────────────
// Per-component check
// ──────────────────────────────────────────────────────────────────────────────

function check(component) {
  const errors = [];
  const flags = {};
  const specObj = loadSpec(component.specFile);
  if (!specObj) {
    return { name: component.name, member: false, errors: ['no `spec` export'], flags };
  }

  const families = getProp(specObj, 'families');
  const behaviorFamilies = asArray(getProp(families, 'behavior')) ?? [];
  const isPopup = behaviorFamilies.includes('popup-anchored');
  if (!isPopup) {
    return { name: component.name, member: false, errors: [], flags };
  }

  // 1. controlled-open in state family
  const stateFamilies = asArray(getProp(families, 'state')) ?? [];
  if (!stateFamilies.includes('controlled-open')) {
    errors.push('families.state should include "controlled-open" for popup-anchored components');
  }

  // 2. behavior.popup with all four flags
  const behavior = getProp(specObj, 'behavior');
  const popup = getProp(behavior, 'popup');
  if (!popup) {
    errors.push('missing `behavior.popup` block — required for popup-anchored components');
  } else {
    for (const flag of REQUIRED_POPUP_FLAGS) {
      const v = asBool(getProp(popup, flag));
      if (v === null) {
        errors.push(`behavior.popup.${flag} not declared (must be true or false)`);
      } else {
        flags[flag] = v;
      }
    }
  }

  // 3. Trigger + Content sub-components — only for compound popups.
  //    Monolithic popups (compound: false) own their popover state
  //    internally and don't expose those sub-components.
  const compound = asBool(getProp(specObj, 'compound'));
  if (compound) {
    const subsNode = getProp(specObj, 'subComponents');
    const subNames = [];
    if (subsNode && ts.isArrayLiteralExpression(subsNode)) {
      for (const el of subsNode.elements) {
        const subName = asString(getProp(el, 'name'));
        if (subName) subNames.push(subName);
      }
    }
    if (!subNames.includes('Trigger')) errors.push('missing `Trigger` sub-component');
    if (!subNames.includes('Content')) errors.push('missing `Content` sub-component');
  }

  return { name: component.name, member: true, errors, flags };
}

// ──────────────────────────────────────────────────────────────────────────────
// Run
// ──────────────────────────────────────────────────────────────────────────────

const components = listComponents();
const results = components.map(check);
const popupComponents = results.filter((r) => r.member);

let totalErrors = 0;
let weakFlags = 0;

console.log(`\nPopup family — ${popupComponents.length} components declaring popup-anchored.\n`);

for (const r of popupComponents) {
  const flagSummary = REQUIRED_POPUP_FLAGS
    .map((f) => {
      const v = r.flags[f];
      if (v === undefined) return `${f}=?`;
      if (v) return `${f}=✓`;
      weakFlags++;
      return `${f}=✗`;
    })
    .join('  ');

  if (r.errors.length === 0) {
    console.log(`  ${r.name.padEnd(14)} ${flagSummary}`);
  } else {
    console.log(`\n  ${r.name}`);
    console.log(`    ${flagSummary}`);
    for (const e of r.errors) console.log(`    ✗ ${e}`);
    totalErrors += r.errors.length;
  }
}

if (VERBOSE) {
  const nonMember = results.filter((r) => !r.member && r.errors.length === 0);
  console.log(`\n  (${nonMember.length} components are not popup-anchored — skipped)`);
}

console.log('');
if (totalErrors > 0) {
  console.log(`✗ ${totalErrors} error(s) across ${popupComponents.length} popup components.`);
} else {
  console.log(`✓ ${popupComponents.length} popup components declare a complete contract.`);
}
if (weakFlags > 0) {
  console.log(`· ${weakFlags} flag(s) declared as false — known limitations or unfixed bugs.`);
}

process.exit(totalErrors > 0 ? 1 : 0);
