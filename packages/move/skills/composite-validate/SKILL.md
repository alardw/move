---
name: composite-validate
description: "Validate a composite CompositeSpec as a legal, coherent resolution of its design pattern — every axis resolved, values legal, combination honors the heuristics, Item shape complete, all data via one adapter."
user-invocable: true
argument-hint: "[composite-name]"
---

# Composite — Validate

The spec-level oracle for a composite, symmetric with `design-pattern-validate` (validates the
pattern) and `component-validate` (validates a component). It checks the ONE thing nothing else
does: that a `CompositeSpec` is a **legal, coherent resolution of its `fromPattern`** — not just
that its code matches its spec (that's the deterministic `check:composite-spec-drift`).

---

## How to Run

**Input:** a composite name (its `{Name}.spec.ts`). Its `fromPattern` names the design pattern
it resolves; load that `DesignPatternSpec` from the registry.

**Output:** findings (stdout). BLOCKER findings fail the composite.

**REFUSES** if `fromPattern` doesn't resolve to a registered pattern.

---

## Checks

### 1 — Completeness (every axis resolved)
`decisions` covers **every** axis of `fromPattern` — no axis left undecided. A missing axis is a
BLOCKER (the composite is under-specified; generation would guess).

### 2 — Legality (values are real)
Each `decisions[axis]` value is an `option` of that axis (or the axis's open form). An invented
value (`variant: 'subtle'`) is a BLOCKER.

### 3 — Coherence (honors the heuristics)
The resolved combination passes every `checkable` heuristic of the pattern — e.g. not
`arrangement: masonry` with rich `label` (H28), not two persistent indicators in one corner.
A violated law is a BLOCKER; a `guidance` (non-checkable) law near the edge is a WARNING.

### 4 — Buildable (no silent gaps)
No resolved value maps to a `repr: null` binding unless the composite records it as an accepted
limitation. An unaddressed gap is a BLOCKER — the composite can't actually be built.

### 5 — Adapter covers the roles
A **root** composite names exactly one `adapter`; a **child** composite (one that appears in another's
`children`) names **none** — it receives its Item as a prop. Derive the itemShape (the union of `in`
roles across the pattern + its resolved children) and confirm the referenced adapter **maps every
role** (the field-level detail is `adapter-validate`'s; here it's presence + coverage). A root with no
adapter, an adapter missing a role, or a child that declares one → BLOCKER.

### 6 — Children resolve
Every skeleton slot that delegates AND is active under `decisions` has an entry in `children`, and each
named child composite exists and is itself valid (recurse). A dangling or missing child → BLOCKER.

### 7 — i18n
Every user-facing string the pattern surfaces (label-bearing bindings + resolved actions) has a
`labels` entry. Missing copy → BLOCKER. (Nothing derived — `composition`/`behaviors` aren't stored —
so this is checked against the pattern, not against inline code.)

---

## Rules
1. **Validate the resolution, not the code** — code↔spec parity is `check:composite-spec-drift`;
   this checks spec↔pattern (is it a legal instance?).
2. **Load `fromPattern`** — every check is relative to the pattern being resolved.
3. **Recurse** — a host is valid only if its child composites are valid.
4. **Gaps are BLOCKERS unless explicitly accepted** — never let an unbuildable value pass silently.
5. **Coherence over completeness** — a fully-resolved but incoherent combination still fails.
6. **Deterministic** — same spec + pattern → same findings.
