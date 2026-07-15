---
name: design-pattern-validate
description: "Validate a DesignPatternSpec — integrity (skeleton tree, axis ownership, resolving refs) + coverage (every axis value has a binding) + the value-naming convention. The check:design-pattern-conformance oracle."
user-invocable: true
argument-hint: "[PatternName]"
---

# Design Pattern — Validate

The pattern-spec oracle. It checks the ONE thing nothing else does: that a
`DesignPatternSpec` is well-formed and complete. Distinct from `component-validate`
(components), `move check` (composites), and the pattern's own heuristic-oracles (which
check a *resolved config*, not the spec).

---

## How to Run

**Input:** a pattern name (or all patterns).
**Output:** findings to stdout; non-zero exit on any BLOCKER. `tsc` (the `satisfies` gate)
must already pass — this validates the *structure*, which types can't.

---

## Checks

### Integrity (the spec is well-formed)
- **Skeleton is a single-rooted tree** — exactly one slot with `parent: null`; every other
  `parent` resolves to a slot; no cycles.
- **Every axis is owned by exactly one slot** — each `axis` appears in exactly one slot's
  `drivenBy`; every `drivenBy` entry names a real axis.
- **Every binding resolves** — `slot` ∈ skeleton, `axis` ∈ axes, `value` ∈ `axis.options ∪ {'*'}`.
- **Every heuristic's `axes` resolve** to real axes.
- **Every `designPattern` / `pattern` binding** references a pattern that exists in the registry
  (WARN if it references a `planned` pattern — a documented dependency, not an error).
- **Presets** (if present) reference only valid axis values.

### Coverage (the spec is complete — the key one)
- **Every enumerable axis value has ≥1 binding.** Output per value:
  **bound** · **declared-gap** (`repr: null` + note) · **MISSING → BLOCKER**.
  This is the SLOT × axis-value matrix turned into a gate.

### Convention
- **`none` is the only reserved value**; no axis has a `default` / `standard` / `normal`
  marker value (those lie to the use cases that pick differently).

---

## Implementation
Ships as `patterns/design-patterns.validate.test.ts`, wired into `check:all` and shipped to
consumers via `move check`. It imports the pattern registry (`packages/move/patterns/registry.ts`),
and for each `available` pattern runs the checks above over its `DesignPatternSpec`.
Fix mode is not applicable — report the gaps; the author closes them in the spec.

---

## Rules
1. **Coverage MISSING is a BLOCKER** — an unrepresented axis value means the pattern can't be
   built for that choice. A declared gap (`repr: null` + note) is allowed and reported, not failed.
2. **Integrity failures are BLOCKERS** — a broken skeleton / dangling ref makes generation unsafe.
3. **`planned` nested pattern references WARN, don't fail** — they document the dependency graph.
4. **Report, don't rewrite** — validate never edits the spec.
