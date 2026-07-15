---
name: composite-generate-source
description: "Generate a composite's .tsx from its slim CompositeSpec × the DesignPatternSpec × the AdapterSpec — resolving decisions through the pattern's bindings into a Move-only render tree, wiring the adapter's AsyncResource to the Feedback lane, and composing child composites. Deterministic; nothing is invented or copied."
user-invocable: true
argument-hint: "[composite-name]"
---

# Composite — Generate Source

The deterministic **generate** step: turn a **slim** `CompositeSpec` into the actual `.tsx`. Every
piece is *derived*, not authored — the composition comes from the pattern's **bindings**, the
structure from its **skeleton**, the data from the **adapter**, the loading/error/empty states from
the pattern's **Feedback** lane, and the props from its **state**. Because it's a pure function of
`(composite × pattern × adapter)`, the same inputs always produce the same code — there is nothing
to hand-edit and nothing to copy. Symmetric with `component-generate-source`.

---

## How to Run

**Input:** a composite name (its slim `{Name}.spec.ts`), which names `fromPattern` + `adapter` (root)
+ `decisions` + `children`.

**Output:** `{Name}.tsx` under `check.composites` (relative to `move.config.json`), plus the child
composites' sources (recursively).

**REFUSES** (the generation gate) unless `composite-validate` passes — every axis decided, the adapter
covers every itemShape role, no decided value hits a `repr: null` gap, the combination is coherent.

---

## Process — resolve(composite, pattern, adapter) → .tsx

### Step 1 — Load the three (+ children)
The slim `CompositeSpec` (decisions + refs), its `fromPattern` (`DesignPatternSpec` — bindings,
skeleton, feedback, state), and its `adapter` (`AdapterSpec` — the `items(query)` port). Load the
child composites named in `children`.

### Step 2 — Resolve the structure from the skeleton × decisions
Walk the pattern's `skeleton`. A slot renders unless it's `optional` and all its `drivenBy` axes
resolve to `none`. For each active slot:
- for each axis it's `drivenBy`, look up the `Binding` for the **decided** value → its Move `repr`
  (`arrangement: uniform-grid` → `<Grid minChildWidth>`, `surface: card` → `<Card.Root>`);
- a **delegated** slot (`designPattern`) renders the **child composite** from `children`
  (`item → <ApodCard item={…} />`).
Assemble these into the nested render tree. A `repr: null` for a decided value is a gate failure (Step 0).

### Step 3 — Wire data + Feedback (the async spine)
The **root** composite calls the adapter's `items(query): AsyncResource<Item[]>` and renders by the
pattern's **`feedback`** lane, verbatim:
- `pending` → the feedback `pending` repr (a Skeleton of the arrangement);
- `error` → the `error` repr (Alert + retry);
- `empty` → the `empty` repr (EmptyState);
- `ready` → the resolved arrangement (Step 2), mapping each `Item` into the delegated child.
A **child** composite takes one `Item` as a prop — no adapter, no resource.

### Step 4 — Wire state
From the pattern's `state`: `controllable` entries become **props** (`value` + `onChange`); `local`
entries become `useState` inside. (e.g. `selection` → a prop; `page` → local.)

### Step 5 — Assemble the `.tsx`
One component: props (controllable state + handlers), the adapter call, the Feedback branch, the
render tree — built **only** from Move components + the child composites. **All user-facing copy comes
from `labels`** (a `labels` prop with defaults). No raw HTML for layout, no inline `style`, no custom
CSS — purity, exactly what `check:purity` / `composite-spec-drift` enforce.

### Step 6 — Recurse
Generate each child composite's source the same way (they bottom out on Move components).

---

## Rules
1. **Derive, never invent** — every node from a `Binding`, every state from the pattern, every datum
   from the adapter. No made-up components, props, or `variant`s.
2. **Move components + child composites only** — no raw HTML layout, no inline style, no custom CSS.
3. **All copy through `labels`** — i18n; no hardcoded strings.
4. **Gate first** — refuse unless `composite-validate` passes (all decisions · adapter covers roles ·
   no gaps · coherent). Don't emit partial code.
5. **Root wires the adapter; children take an `Item` prop** — the async spine lives once, at the top.
6. **Feedback is the pattern's, verbatim** — `pending/error/empty/ready` come from the pattern's
   `feedback` lane, not improvised.
7. **Deterministic** — same `(composite × pattern × adapter)` → the same `.tsx`.
8. **No hand-edits** — the source is generated; changes go through the specs (`composite-update-spec`),
   then regenerate. `composite-spec-drift` catches divergence.
9. **Config-relative** — write under `check.composites` (relative to `move.config.json`).
