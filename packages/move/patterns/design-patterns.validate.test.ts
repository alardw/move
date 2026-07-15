// check:design-pattern-conformance — the DesignPatternSpec oracle. Symmetric with the component
// (component-conformance) and composite (composite-spec-drift) validators: it checks
// the ONE level nothing else does — that each pattern spec is well-formed (integrity)
// and complete (coverage). Runs over every `available` pattern in the registry.
import { describe, it, expect } from 'vitest';
import { PATTERNS } from './registry';
import * as Move from '../src';
import type { DesignPatternSpec } from './spec-type';

const DEFAULT_MARKERS = ['default', 'standard', 'normal'];

// The real, canonical component inventory — every runtime export of the library.
// A repr may only name components that actually resolve here (compound names like
// `Card.Root` resolve on their base `Card`). This makes "does this component exist?"
// MECHANICAL — no eyeballing, no phantom `<Chip>`/`<Slider>`/`<IconButton>`. If a
// binding needs something Move lacks, it must be a declared gap (`repr: null`), not a
// made-up tag. (Synonyms — 'chip'→Badge, 'slider'→InputRange — are the discovery aid
// for FINDING the canonical name; the repr must then use that canonical name.)
const REAL_COMPONENTS = new Set(Object.keys(Move));

// Every registered pattern slug — a slot's `designPattern` must resolve to one of these
// (available or planned), so a delegation can't dangle. Mechanical, like component lookup.
const KNOWN_SLUGS = new Set(PATTERNS.map((p) => p.slug));

/** designPattern lookup — every delegating slot names a real registered pattern slug. */
function unresolvedDesignPatterns(spec: DesignPatternSpec): string[] {
  const bad: string[] = [];
  for (const s of spec.skeleton) {
    if (s.designPattern && !KNOWN_SLUGS.has(s.designPattern)) bad.push(`${s.slot} → ${s.designPattern}`);
  }
  return bad;
}

/** Component lookup — every `<Component>` a repr names must be a real Move export. */
function unresolvedComponents(spec: DesignPatternSpec): string[] {
  const bad: string[] = [];
  for (const b of spec.bindings) {
    if (b.repr == null) continue; // declared gap — nothing to build, nothing to resolve
    for (const m of b.repr.matchAll(/<([A-Z][A-Za-z]*)/g)) {
      const name = m[1]; // base of a compound like Card.Root / Tabs.Tab / Image.Overlay
      if (!REAL_COMPONENTS.has(name)) bad.push(`${b.axis}=${b.value}: <${name}>`);
    }
  }
  for (const f of spec.feedback ?? []) {
    if (f.repr == null) continue;
    for (const m of f.repr.matchAll(/<([A-Z][A-Za-z]*)/g)) {
      const name = m[1];
      if (!REAL_COMPONENTS.has(name)) bad.push(`feedback ${f.status}: <${name}>`);
    }
  }
  return bad;
}

/** Integrity — the spec is well-formed. Returns a list of violations (empty = ok). */
function integrity(spec: DesignPatternSpec): string[] {
  const errors: string[] = [];
  const axes = new Set(spec.axes.map((a) => a.axis));
  const slots = new Set(spec.skeleton.map((s) => s.slot));

  // skeleton is a single-rooted tree
  const roots = spec.skeleton.filter((s) => s.parent === null);
  if (roots.length !== 1) errors.push(`skeleton must have exactly one root (has ${roots.length})`);
  for (const s of spec.skeleton) {
    if (s.parent !== null && !slots.has(s.parent))
      errors.push(`slot "${s.slot}" parent "${s.parent}" does not exist`);
  }
  // no cycles
  for (const s of spec.skeleton) {
    const seen = new Set<string>();
    let cur: (typeof spec.skeleton)[number] | undefined = s;
    while (cur && cur.parent) {
      if (seen.has(cur.slot)) {
        errors.push(`cycle in skeleton at "${s.slot}"`);
        break;
      }
      seen.add(cur.slot);
      cur = spec.skeleton.find((x) => x.slot === cur!.parent);
    }
  }
  // every axis owned by exactly one slot; every drivenBy names a real axis
  const owners = new Map<string, number>();
  for (const s of spec.skeleton)
    for (const a of s.drivenBy) {
      if (!axes.has(a)) errors.push(`slot "${s.slot}" drivenBy "${a}" is not an axis`);
      owners.set(a, (owners.get(a) ?? 0) + 1);
    }
  for (const a of spec.axes) {
    const c = owners.get(a.axis) ?? 0;
    if (c !== 1) errors.push(`axis "${a.axis}" is owned by ${c} slots (must be exactly 1)`);
  }
  // bindings resolve
  for (const b of spec.bindings) {
    if (!slots.has(b.slot)) errors.push(`binding slot "${b.slot}" does not exist`);
    if (!axes.has(b.axis)) errors.push(`binding axis "${b.axis}" does not exist`);
    const axis = spec.axes.find((a) => a.axis === b.axis);
    if (axis?.options && b.value !== '*' && !axis.options.includes(b.value))
      errors.push(`binding "${b.axis}=${b.value}" is not an option of that axis`);
  }
  // heuristics reference real axes
  for (const h of spec.heuristics)
    for (const a of h.axes)
      if (!axes.has(a)) errors.push(`heuristic "${h.id}" references non-axis "${a}"`);
  // data & state attach to real slots; a data field's `drives` names real axes
  for (const d of spec.data ?? []) {
    if (!slots.has(d.slot)) errors.push(`data field "${d.field}" slot "${d.slot}" does not exist`);
    for (const ax of d.drives ?? [])
      if (!axes.has(ax)) errors.push(`data field "${d.field}" drives non-axis "${ax}"`);
  }
  for (const s of spec.state ?? [])
    if (!slots.has(s.slot)) errors.push(`state "${s.name}" slot "${s.slot}" does not exist`);
  for (const f of spec.feedback ?? [])
    if (!slots.has(f.slot)) errors.push(`feedback "${f.status}" slot "${f.slot}" does not exist`);
  // value-naming convention — no default/standard/normal markers
  for (const a of spec.axes)
    for (const o of a.options ?? [])
      if (DEFAULT_MARKERS.includes(o))
        errors.push(`axis "${a.axis}" value "${o}" is a default-marker (name values descriptively)`);
  return errors;
}

/** Coverage — every enumerable axis value has a binding (a slot representation). */
function coverage(spec: DesignPatternSpec): string[] {
  const missing: string[] = [];
  for (const a of spec.axes) {
    if (!a.options) continue;
    if (spec.bindings.some((b) => b.axis === a.axis && b.value === '*')) continue; // wildcard covers all
    for (const o of a.options) {
      if (!spec.bindings.some((b) => b.axis === a.axis && b.value === o)) missing.push(`${a.axis}=${o}`);
    }
  }
  return missing;
}

describe('check:design-pattern-conformance (integrity + coverage)', () => {
  const available = PATTERNS.filter((p) => p.status === 'available' && p.spec);
  it('has at least one available pattern to validate', () => {
    expect(available.length).toBeGreaterThan(0);
  });
  for (const p of available) {
    it(`${p.slug} — integrity (well-formed spec)`, () => {
      const errs = integrity(p.spec as DesignPatternSpec);
      expect(errs, errs.join('\n')).toEqual([]);
    });
    it(`${p.slug} — coverage (every axis value has a binding)`, () => {
      const gaps = coverage(p.spec as DesignPatternSpec);
      expect(gaps, `MISSING bindings: ${gaps.join(', ')}`).toEqual([]);
    });
    it(`${p.slug} — component lookup (every repr names a real Move component)`, () => {
      const bad = unresolvedComponents(p.spec as DesignPatternSpec);
      expect(bad, `UNRESOLVED components (use the canonical name or declare a gap): ${bad.join(', ')}`).toEqual([]);
    });
    it(`${p.slug} — designPattern lookup (every delegation resolves to a registered pattern)`, () => {
      const bad = unresolvedDesignPatterns(p.spec as DesignPatternSpec);
      expect(bad, `UNRESOLVED designPattern delegations (use a registered slug): ${bad.join(', ')}`).toEqual([]);
    });
  }
});
