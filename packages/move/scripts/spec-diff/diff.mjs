// Deterministic diff between two normalised spec maps.
//
// Outputs:
//   - breaking[]: removed components, removed/changed props, removed
//     tokens, etc.
//   - additive[]: new components, props, tokens, fresh deprecations.
//
// Renames are NOT inferred. A removed prop and an added prop with the
// same shape stay separate entries — the audit step (or a human / AI
// release reviewer) decides if they're really the same change.

import { ROOT_SUBCOMPONENT_KEY } from './normalise.mjs';

/**
 * @typedef {import('./normalise.mjs').NormalisedSpec} NormalisedSpec
 * @typedef {import('./normalise.mjs').NormalisedProp} NormalisedProp
 * @typedef {import('./normalise.mjs').NormalisedToken} NormalisedToken
 */

/**
 * @typedef {(
 *   | { kind: 'componentRemoved'; component: string; replacement?: string; reason?: string }
 *   | { kind: 'propRemoved'; component: string; subComponent?: string; prop: string; hadDefault?: string }
 *   | { kind: 'propRenamed'; component: string; subComponent?: string; from: string; to: string }
 *   | { kind: 'propTypeChanged'; component: string; subComponent?: string; prop: string; oldType: string; newType: string }
 *   | { kind: 'propDefaultChanged'; component: string; subComponent?: string; prop: string; oldDefault?: string; newDefault?: string }
 *   | { kind: 'tokenRemoved'; component: string; token: string }
 *   | { kind: 'tokenValueChanged'; component: string; token: string; oldValue: string; newValue: string }
 * )} BreakingChange
 */

/**
 * @typedef {(
 *   | { kind: 'componentAdded'; component: string }
 *   | { kind: 'propAdded'; component: string; subComponent?: string; prop: string; type: string; default?: string }
 *   | { kind: 'tokenAdded'; component: string; token: string; value: string }
 *   | { kind: 'componentDeprecated'; component: string; since?: string; removeIn?: string; replacement?: string; reason?: string }
 * )} AdditiveChange
 */

/**
 * @typedef {{
 *   breaking: BreakingChange[];
 *   additive: AdditiveChange[];
 *   summary: { componentsCompared: number; breakingCount: number; additiveCount: number };
 * }} SpecDiff
 */

function indexBy(items, key) {
  const m = new Map();
  for (const item of items) m.set(key(item), item);
  return m;
}

function withSubKey(subComponent) {
  return subComponent === ROOT_SUBCOMPONENT_KEY ? {} : { subComponent };
}

function diffProps(component, subComponent, oldProps, newProps, breaking, additive) {
  const oldByName = indexBy(oldProps, (p) => p.name);
  const newByName = indexBy(newProps, (p) => p.name);

  for (const oldP of oldProps) {
    const newP = newByName.get(oldP.name);
    if (!newP) {
      breaking.push({
        kind: 'propRemoved',
        component,
        ...withSubKey(subComponent),
        prop: oldP.name,
        ...(oldP.default !== undefined ? { hadDefault: oldP.default } : {}),
      });
      continue;
    }
    if (oldP.type !== newP.type) {
      breaking.push({
        kind: 'propTypeChanged',
        component,
        ...withSubKey(subComponent),
        prop: oldP.name,
        oldType: oldP.type,
        newType: newP.type,
      });
    }
    if (oldP.default !== newP.default) {
      breaking.push({
        kind: 'propDefaultChanged',
        component,
        ...withSubKey(subComponent),
        prop: oldP.name,
        ...(oldP.default !== undefined ? { oldDefault: oldP.default } : {}),
        ...(newP.default !== undefined ? { newDefault: newP.default } : {}),
      });
    }
  }

  for (const newP of newProps) {
    if (oldByName.has(newP.name)) continue;
    additive.push({
      kind: 'propAdded',
      component,
      ...withSubKey(subComponent),
      prop: newP.name,
      type: newP.type,
      ...(newP.default !== undefined ? { default: newP.default } : {}),
    });
  }
}

function diffTokens(component, oldTokens, newTokens, breaking, additive) {
  const oldByName = indexBy(oldTokens, (t) => t.name);
  const newByName = indexBy(newTokens, (t) => t.name);

  for (const oldT of oldTokens) {
    const newT = newByName.get(oldT.name);
    if (!newT) {
      breaking.push({ kind: 'tokenRemoved', component, token: oldT.name });
      continue;
    }
    if (oldT.value !== newT.value && oldT.value !== '' && newT.value !== '') {
      breaking.push({
        kind: 'tokenValueChanged',
        component,
        token: oldT.name,
        oldValue: oldT.value,
        newValue: newT.value,
      });
    }
  }

  for (const newT of newTokens) {
    if (oldByName.has(newT.name)) continue;
    additive.push({ kind: 'tokenAdded', component, token: newT.name, value: newT.value });
  }
}

/**
 * @param {Record<string, NormalisedSpec>} oldSpecs
 * @param {Record<string, NormalisedSpec>} newSpecs
 * @returns {SpecDiff}
 */
export function diffSpecs(oldSpecs, newSpecs) {
  /** @type {BreakingChange[]} */ const breaking = [];
  /** @type {AdditiveChange[]} */ const additive = [];

  const componentNames = new Set([...Object.keys(oldSpecs), ...Object.keys(newSpecs)]);

  for (const name of componentNames) {
    const oldSpec = oldSpecs[name];
    const newSpec = newSpecs[name];

    if (oldSpec && !newSpec) {
      breaking.push({
        kind: 'componentRemoved',
        component: name,
        ...(oldSpec.deprecated?.replacement ? { replacement: oldSpec.deprecated.replacement } : {}),
        ...(oldSpec.deprecated?.reason ? { reason: oldSpec.deprecated.reason } : {}),
      });
      continue;
    }
    if (!oldSpec && newSpec) {
      additive.push({ kind: 'componentAdded', component: name });
      if (newSpec.deprecated) {
        additive.push({ kind: 'componentDeprecated', component: name, ...newSpec.deprecated });
      }
      continue;
    }
    if (!oldSpec || !newSpec) continue;

    if (newSpec.deprecated && !oldSpec.deprecated) {
      additive.push({ kind: 'componentDeprecated', component: name, ...newSpec.deprecated });
    }

    const subKeys = new Set([
      ...Object.keys(oldSpec.props),
      ...Object.keys(newSpec.props),
    ]);
    for (const subKey of subKeys) {
      const oldP = oldSpec.props[subKey] ?? [];
      const newP = newSpec.props[subKey] ?? [];
      diffProps(name, subKey, oldP, newP, breaking, additive);
    }

    diffTokens(name, oldSpec.tokens, newSpec.tokens, breaking, additive);
  }

  return {
    breaking,
    additive,
    summary: {
      componentsCompared: componentNames.size,
      breakingCount: breaking.length,
      additiveCount: additive.length,
    },
  };
}
