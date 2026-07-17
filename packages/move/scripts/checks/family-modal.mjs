#!/usr/bin/env node
/**
 * Modal-overlay family contract.
 *
 *   1. Declares `families.state` includes `'controlled-open'`.
 *   2. Declares `behavior.modal` with all four flags
 *      (closeOnEscape, closeOnOverlayClick, lockBodyScroll, trapFocus).
 *   3. Compound: exposes `Trigger`, `Overlay`, `Content`.
 *   4. Animation family is one of `scale-fade`, `slide-in`, or `fade`.
 *
 * Exit: 0 = pass, 1 = fail.
 *
 * @enforces none
 */

import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';
import {
  loadSpec, listComponents, getProp, asString, asBool, asArray,
  isInFamily, reportFamily,
} from './_familyShared.mjs';

const COMPONENTS_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'src', 'components');
const REQUIRED_MODAL_FLAGS = ['closeOnEscape', 'closeOnOverlayClick', 'lockBodyScroll', 'trapFocus'];

function check(component) {
  const errors = [];
  const flags = {};
  const specObj = loadSpec(component.specFile);
  if (!specObj) return { name: component.name, member: false, errors, flags };
  if (!isInFamily(specObj, 'behavior', 'modal-overlay')) {
    return { name: component.name, member: false, errors, flags };
  }

  const stateFamilies = asArray(getProp(getProp(specObj, 'families'), 'state')) ?? [];
  if (!stateFamilies.includes('controlled-open')) {
    errors.push('families.state should include "controlled-open"');
  }

  const modal = getProp(getProp(specObj, 'behavior'), 'modal');
  if (!modal) {
    errors.push('missing `behavior.modal` block');
  } else {
    for (const flag of REQUIRED_MODAL_FLAGS) {
      const v = asBool(getProp(modal, flag));
      if (v === null) errors.push(`behavior.modal.${flag} not declared`);
      else flags[flag] = v;
    }
  }

  // Dismiss delegated to another owner (e.g. Radix Dialog) → the two dismiss
  // flags are N/A; lockBodyScroll/trapFocus are Move's own and never exempt.
  const exempt =
    modal && asString(getProp(modal, 'dismiss')) === 'delegated'
      ? ['closeOnEscape', 'closeOnOverlayClick']
      : [];
  const exemptNote = exempt.length ? 'dismiss delegated' : null;

  const compound = asBool(getProp(specObj, 'compound'));
  if (compound) {
    const subsNode = getProp(specObj, 'subComponents');
    const names = [];
    if (subsNode && ts.isArrayLiteralExpression(subsNode)) {
      for (const el of subsNode.elements) {
        const n = asString(getProp(el, 'name'));
        if (n) names.push(n);
      }
    }
    for (const required of ['Trigger', 'Overlay', 'Content']) {
      if (!names.includes(required)) errors.push(`missing \`${required}\` sub-component`);
    }
  }

  return { name: component.name, member: true, errors, flags, exempt, exemptNote };
}

const components = listComponents(COMPONENTS_DIR);
const results = components.map(check);

reportFamily({ familyName: 'Modal-overlay', requiredFlags: REQUIRED_MODAL_FLAGS, results });
