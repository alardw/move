---
name: design-pattern-create-spec
description: "Author a typed DesignPatternSpec (axes · skeleton · bindings · heuristics) for a Move design pattern. Extracts from an analysis report or creates from decisions."
user-invocable: true
argument-hint: "[PatternName]"
---

# Design Pattern — Create Spec

Write a typed `{slug}.ts` that captures a design pattern as data: its decision **axes**,
the **skeleton** of slots, the per-value **bindings** to Move nodes, and the axis-level
**heuristics**. The spec IS the pattern — there is no `.tsx` to generate (concrete code
comes later from `composite-create`). The file must `satisfies DesignPatternSpec`, so
`tsc` enforces conformance.

---

## How to Run

**Input:** a pattern name (e.g. "Filter", "MediaTile"), plus decisions — from a
`design-pattern-analyze` report if one exists, otherwise gathered from the user.

**Output:** `packages/move/patterns/{slug}.ts` exporting a `const {camelName}` that
`satisfies DesignPatternSpec` (from `./spec-type`), then registered by
`design-pattern-generate-docs`.

**REFUSES** if the axes, skeleton, or bindings are unspecified — those are the substance.

---

## Process

### Step 1 — Load the schema
Read `packages/move/patterns/spec-type.ts` — the canonical `DesignPatternSpec` and its
parts (`AxisSpec`, `SlotSpec`, `Binding`, `Heuristic`, `DecidedBy`). The spec must satisfy it.

### Step 2 — Gather decisions

| Field | What it captures |
|-------|------------------|
| `name` / `intent` | The pattern and a one-sentence, human description (not a spec dump). |
| `synonyms` / `appliesWhen` | Discovery (4 dimensions): **phrase** (intent + synonyms), **data** (`appliesWhen` — data-shape / situation phrases the pattern fits, e.g. "a collection of items", "each item has a lead image"). The other two dimensions — **capability** (axis `options`) and **composition** (`designPattern` refs) — derive automatically, no authoring. |
| `axes: AxisSpec[]` | Each decision dimension: `axis`, `level`, `decidedBy` (data-rule / use-case-preset / consumer / ai-heuristic), `options`, `gloss`. |
| `skeleton: SlotSpec[]` | The slot tree: `slot`, `parent` (null = root container), `drivenBy` (the axes that vary it), `role`, `optional?`, `designPattern?` (delegate to a child pattern by slug). |
| `bindings: Binding[]` | Per axis VALUE: `slot`, `axis`, `value` (or `'*'`), `as` (node / prop / behavior / pattern), `repr` (the concrete Move composite, or `null` for a declared gap), `note?`. |
| `heuristics: Heuristic[]` | Axis-level laws: `id`, `law`, `kind`, `axes` (the axes it constrains), `checkable` (→ oracle). |
| `presets?` / `useCases?` / `actions?` | Optional pattern-defined extensions (e.g. a gallery's useCase→defaults map, its action conventions). |

Where an analysis report exists, derive the axes/skeleton/bindings from it; otherwise ask.

### Step 3 — Apply the conventions

- **Value naming** (from `AxisSpec` doc): `none` is the ONE reserved value — absent / not
  applicable. Every other value is named DESCRIPTIVELY (never `default`/`standard`/`normal`
  markers). "The default" is the preset's output, not a value.
- **Every axis is owned by exactly one slot** (appears in one `drivenBy`).
- **Coverage**: every enumerable axis value should have a `binding` (a slot representation)
  — or a declared gap (`repr: null` + a note). Omitted-slot cases use `repr: '— (slot omitted)'`.
- **Sub-patterns**: a slot delegates (`designPattern` + a `pattern` binding) only when the
  child has its own axes AND cross-host reuse. Else inline bindings. Components are the floor.

### Step 4 — Write the file
Write `packages/move/patterns/{slug}.ts`:

```ts
import type { DesignPatternSpec, AxisSpec, SlotSpec, Binding, Heuristic } from './spec-type';

export const AXES: AxisSpec[] = [ /* … */ ];
export const SKELETON: SlotSpec[] = [ /* … */ ];
export const BINDINGS: Binding[] = [ /* … */ ];
export const HEURISTICS: Heuristic[] = [ /* … */ ];

export const {camelName} = {
  name: '{Name}', intent: '…', synonyms: ['…'],
  axes: AXES, skeleton: SKELETON, bindings: BINDINGS, heuristics: HEURISTICS,
} as const satisfies DesignPatternSpec;
```

### Step 5 — Validate
Run `tsc` (the `satisfies` gate), then hand off to `design-pattern-validate` for the
integrity + coverage oracle. Do not register or render here — that's `design-pattern-generate-docs`.

---

## Rules
1. **Auto-detect** — if `patterns/{slug}.ts` exists, present it for confirmation before overwriting.
2. **Must `satisfies DesignPatternSpec`** — import the type from `./spec-type`, keep `as const`.
3. **No hand-written composites** — this authors the SPEC only; concrete `.tsx` is `composite-create`.
4. **`none` is reserved; values are descriptive; defaults live in presets** (the value-naming convention).
5. **Every axis owned by one slot; every axis value covered by a binding or a declared gap.**
6. **Sub-patterns earn their place** — own axes + cross-host reuse; otherwise inline bindings.
7. **Deterministic** — same decisions produce the same spec.
