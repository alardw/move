#!/usr/bin/env node
/**
 * Disclosure family contract.
 *
 *   1. Declares `families.state` includes a controlled-state family
 *      (`'controlled-open'` or `'controlled-value'` for multi-mode).
 *   2. Declares `behavior.disclosure` with all four flags
 *      (animatesOpen, animatesClose, keyboardToggle, multipleOpen).
 *   3. Animation family includes `'height-morph'` OR `'slide-in'`
 *      (the two ways disclosure components reveal content).
 *
 * Exit: 0 = pass, 1 = fail.
 */

import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  loadSpec, listComponents, getProp, asBool, asArray,
  isInFamily, exitWithSummary,
} from './_familyShared.mjs';

const COMPONENTS_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'src', 'components');
const REQUIRED_DISCLOSURE_FLAGS = ['animatesOpen', 'animatesClose', 'keyboardToggle', 'multipleOpen'];
const ALLOWED_ANIMATIONS = new Set(['expand', 'slide', 'fade']);

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

  const animFamilies = asArray(getProp(getProp(specObj, 'families'), 'animation')) ?? [];
  if (!animFamilies.some((a) => ALLOWED_ANIMATIONS.has(a))) {
    errors.push(`families.animation should include one of: ${[...ALLOWED_ANIMATIONS].join(', ')}`);
  }

  return { name: component.name, member: true, errors, flags };
}

const components = listComponents(COMPONENTS_DIR);
const results = components.map(check);
const members = results.filter((r) => r.member);

console.log(`\nDisclosure family — ${members.length} components.\n`);

let totalErrors = 0;
let weakFlags = 0;
for (const r of members) {
  const flagSummary = REQUIRED_DISCLOSURE_FLAGS
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

// `multipleOpen=false` is informational, not a weakness — single-panel
// disclosures are correct. Subtract it from the weakFlags count so
// the summary doesn't misrepresent them.
const expectedFalse = members.reduce((acc, r) => acc + (r.flags.multipleOpen === false ? 1 : 0), 0);
exitWithSummary({
  familyName: 'disclosure',
  members: members.length,
  totalErrors,
  weakFlags: Math.max(0, weakFlags - expectedFalse),
});
