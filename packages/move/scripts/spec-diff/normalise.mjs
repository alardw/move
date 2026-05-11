// Normalises a Move spec object into a flat shape the diff can walk
// without caring about compound vs non-compound, top-level props vs
// nested-on-Root, or the Calendar-style `props: { Root: [...] }` shape.

/**
 * @typedef {{
 *   name: string;
 *   type: string;
 *   default?: string;
 *   description?: string;
 * }} NormalisedProp
 */

/**
 * @typedef {{ name: string; value: string }} NormalisedToken
 */

/**
 * @typedef {{
 *   since?: string;
 *   removeIn?: string;
 *   replacement?: string;
 *   reason?: string;
 * }} DeprecationInfo
 */

/**
 * @typedef {{
 *   component: string;
 *   props: Record<string, NormalisedProp[]>;
 *   tokens: NormalisedToken[];
 *   deprecated?: DeprecationInfo;
 * }} NormalisedSpec
 */

export const ROOT_SUBCOMPONENT_KEY = '__root__';

function asString(v) {
  return typeof v === 'string' ? v : undefined;
}

function normaliseProp(raw) {
  if (!raw || typeof raw !== 'object') return null;
  const name = asString(raw.name);
  if (!name) return null;
  const type = asString(raw.typeRef) ?? asString(raw.type) ?? '—';
  return {
    name,
    type,
    default: asString(raw.default),
    description: asString(raw.description),
  };
}

function normalisePropArray(raw) {
  if (!Array.isArray(raw)) return [];
  return raw.map(normaliseProp).filter((p) => p !== null);
}

function normaliseTokens(raw) {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((t) => {
      if (!t || typeof t !== 'object') return null;
      const name = asString(t.name);
      const value = asString(t.value);
      if (!name) return null;
      return { name, value: value ?? '' };
    })
    .filter((t) => t !== null);
}

function normaliseDeprecation(raw) {
  if (!raw || typeof raw !== 'object') return undefined;
  /** @type {DeprecationInfo} */
  const out = {};
  if (typeof raw.since === 'string') out.since = raw.since;
  if (typeof raw.removeIn === 'string') out.removeIn = raw.removeIn;
  if (typeof raw.replacement === 'string') out.replacement = raw.replacement;
  if (typeof raw.reason === 'string') out.reason = raw.reason;
  return Object.keys(out).length > 0 ? out : undefined;
}

/**
 * Normalise one spec object into the flat diff-friendly shape.
 *
 * @param {Record<string, unknown>} spec
 * @returns {NormalisedSpec}
 */
export function normalise(spec) {
  const component = asString(spec.name) ?? '<unknown>';
  /** @type {Record<string, NormalisedProp[]>} */
  const props = {};

  const topLevelArray = spec.props;
  if (Array.isArray(topLevelArray)) {
    props[ROOT_SUBCOMPONENT_KEY] = normalisePropArray(topLevelArray);
  } else if (topLevelArray && typeof topLevelArray === 'object') {
    // Calendar/CalendarView shape: `props: { Root: [...], Nav: [...] }`
    for (const [subName, propsList] of Object.entries(topLevelArray)) {
      if (Array.isArray(propsList) && propsList.every((x) => typeof x === 'object')) {
        props[subName] = normalisePropArray(propsList);
      }
    }
  }

  if (Array.isArray(spec.subComponents)) {
    for (const sc of spec.subComponents) {
      if (!sc || typeof sc !== 'object') continue;
      const subName = asString(sc.name);
      if (!subName) continue;
      props[subName] = normalisePropArray(sc.props);
    }
  }

  return {
    component,
    props,
    tokens: normaliseTokens(spec.tokens),
    deprecated: normaliseDeprecation(spec.deprecated),
  };
}

/**
 * @param {Record<string, Record<string, unknown>>} specs
 * @returns {Record<string, NormalisedSpec>}
 */
export function normaliseAll(specs) {
  /** @type {Record<string, NormalisedSpec>} */
  const out = {};
  for (const [name, spec] of Object.entries(specs)) {
    out[name] = normalise(spec);
  }
  return out;
}
