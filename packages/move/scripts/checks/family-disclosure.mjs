#!/usr/bin/env node
/**
 * Disclosure family contract.
 *
 *   1. Declares `families.state` includes a controlled-state family
 *      (`'controlled-open'` or `'controlled-value'` for multi-mode).
 *   2. Declares `behavior.disclosure` with all four flags
 *      (animatesOpen, animatesClose, keyboardToggle, multipleOpen).
 *
 * (Animation is a separate axis — `animationPatterns` — not checked here:
 *  a disclosure-behavior component may animate as `sidePanel` (Sidebar).)
 *
 * Exit: 0 = pass, 1 = fail.
 *
 * @enforces none
 */

import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  loadSpec, listComponents, getProp, asBool, asArray,
  isInFamily, reportFamily,
} from './_familyShared.mjs';

const COMPONENTS_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'src', 'components');
const REQUIRED_DISCLOSURE_FLAGS = ['animatesOpen', 'animatesClose', 'keyboardToggle', 'multipleOpen'];

function check(component) {
  const errors = [];
  const flags = {};
  const specObj = loadSpec(component.specFile);
  if (!specObj) return { name: component.name, member: false, errors, flags };
  if (!isInFamily(specObj, 'behavior', 'disclosure')) {
    return { name: component.name, member: false, errors, flags };
  }

  const stateFamilies = asArray(getProp(getProp(specObj, 'families'), 'state')) ?? [];
  if (!stateFamilies.includes('controlled-open') && !stateFamilies.includes('controlled-value')) {
    errors.push('families.state should include "controlled-open" or "controlled-value"');
  }

  const disclosure = getProp(getProp(specObj, 'behavior'), 'disclosure');
  if (!disclosure) {
    errors.push('missing `behavior.disclosure` block');
  } else {
    for (const flag of REQUIRED_DISCLOSURE_FLAGS) {
      const v = asBool(getProp(disclosure, flag));
      if (v === null) errors.push(`behavior.disclosure.${flag} not declared`);
      else flags[flag] = v;
    }
  }

  // A single-panel disclosure (multipleOpen: false) is correct, not a gap —
  // "multiple open" only applies to multi-panel accordions.
  const exempt = flags.multipleOpen === false ? ['multipleOpen'] : [];
  const exemptNote = exempt.length ? 'single-panel (multipleOpen N/A)' : null;

  return { name: component.name, member: true, errors, flags, exempt, exemptNote };
}

const components = listComponents(COMPONENTS_DIR);
const results = components.map(check);

reportFamily({ familyName: 'Disclosure', requiredFlags: REQUIRED_DISCLOSURE_FLAGS, results });
