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
 *   - A dismiss flag `false` on a SELF-MANAGED popup → a known limitation or
 *     an unfixed bug, reported in detail so it isn't buried.
 *
 * A component that delegates dismiss to another owner
 * (`behavior.popup.dismiss: 'delegated'`, e.g. Tooltip → Radix, which owns
 * Escape + blur) is conformant, not flagged: its closeOn* flags are N/A, not a
 * gap. The report details only what's bad and summarizes what's good.
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
import { reportFamily } from './_familyShared.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const COMPONENTS_DIR = join(HERE, '..', '..', 'src', 'components');

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
  let delegated = false;
  if (!popup) {
    errors.push('missing `behavior.popup` block — required for popup-anchored components');
  } else if (asString(getProp(popup, 'dismiss')) === 'delegated') {
    // Dismiss delegated to another owner (e.g. Radix Tooltip) — the four Move
    // closeOn* flags are N/A here, so don't require or grade them.
    delegated = true;
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

  const exempt = delegated ? REQUIRED_POPUP_FLAGS : [];
  const exemptNote = delegated ? 'dismiss delegated to Radix' : null;
  return { name: component.name, member: true, errors, flags, exempt, exemptNote };
}

// ──────────────────────────────────────────────────────────────────────────────
// Run
// ──────────────────────────────────────────────────────────────────────────────

const components = listComponents();
const results = components.map(check);

reportFamily({ familyName: 'Popup', requiredFlags: REQUIRED_POPUP_FLAGS, results });
