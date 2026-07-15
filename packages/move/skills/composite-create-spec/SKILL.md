---
name: composite-create-spec
description: "Resolve a DesignPatternSpec into a SLIM CompositeSpec — fromPattern + adapter + all decisions + labels. Composition, behaviours, and code are DERIVED (resolve/generate), never stored. Recursive: one CompositeSpec per node in the delegation tree."
user-invocable: true
argument-hint: "[pattern-slug] [instance-name] [adapter-name]"
---

# Composite — Create Spec

Instantiate a **design pattern** as a **composite** — a resolved point in its config space. The
composite spec is deliberately **slim**: it holds only the *source* — `fromPattern`, the `adapter`
that feeds it, **every decision** (all axes, explicit), and the domain `labels`. Everything else —
the composition, the behaviours, the `.tsx`, the tests — is **DERIVED** from this spec × the pattern
× the adapter by `resolve()`/`generate()`, and is never stored here. That's what makes it
deterministic and un-fakeable: there's nothing downstream to hand-edit or copy.

**Recursive.** A pattern delegates slots to child patterns (`item → media-tile`). Resolving the host
emits one `CompositeSpec` per node — `ApodFeed` (ItemGallery) referencing `ApodCard` (MediaTile).

**Runs after the adapter exists** — the adapter (via its api) supplies the data shape the
`data-rule` axes resolve from. No data is elicited or read from the repo here.

---

## How to Run

**Input:** a `pattern` slug + an `instance` name + an `adapter` name (already built by
`adapter-analyze`) + the `useCase` (+ optional blend).

**Output:** one slim `{Name}.spec.ts` per delegation node, under `check.composites`
(default `src/composites/{instance}/`) — resolved relative to `move.config.json`.

**REFUSES** (the generation gate) unless **every** axis is decided **and** the adapter covers every
role of the pattern's itemShape — report exactly what's missing.

### Consumer input — propose, don't interrogate
The data mapping is **not** asked here — it lives in the adapter. The only `consumer`-tier inputs are
short: the **useCase** (if not obvious), **domain action semantics** ("save" = add-to-collection),
**brand / labels**, and the **instance name**. Everything else is proposed and confirmed, not asked.

---

## Process — resolve(pattern, useCase, adapter) → slim CompositeSpec (+ recurse)

### Step 1 — Resolve every axis to a value
Walk `pattern.axes`; each axis's `decidedBy` says where its value comes from:

| decidedBy | resolve from |
|---|---|
| `use-case-preset` | `pattern.presets[useCase]` + blend + any explicit consumer override |
| `data-rule` | the **adapter's data** — the roles it provides + their source types (a `media` role that's an image → `lead: image`; a `date`-typed `sortKey` → `order: time`) |
| `consumer` | the instance config (useCase, domain actions, brand) |
| `ai-heuristic` | the `heuristics` + oracle (placement/contrast), not a free choice |

The result is a **complete, explicit** decision map — no deltas, no "inherit the preset."

### Step 2 — Coherence
Check the decision map against the `checkable` heuristics (e.g. `arrangement: masonry` + rich
`label` → H28). An incoherent combination is an error to reconcile, not output.

### Step 3 — Recurse into delegated children
For each skeleton slot with `designPattern` that is *active* under the decisions:
1. compute the **pinned child config** (the host's propagation for that slot — `preset.<slot>`);
2. `resolve(childPattern, pinnedConfig, /* no adapter — the child gets one Item as a prop */)`;
3. it emits the child `{ChildName}.spec.ts` and returns its name → record it in `children`
   (`{ item: 'ApodCard' }`). Only the **root** composite carries the `adapter`.

### Step 4 — Labels
Collect the instance's user-facing strings (from the resolved actions + any label-bearing bindings)
into `labels`. No hardcoded copy in the eventual code — all i18n.

### Step 5 — Emit the SLIM CompositeSpec
```ts
export const spec = {
  name: 'ApodFeed',
  fromPattern: 'item-gallery',
  adapter: 'apod-gallery',        // root only; a child that receives an Item prop omits this
  decisions: {                    // EVERY axis, explicit — the whole audit trail
    arrangement: 'uniform-grid', section: 'none', order: 'time', sort: 'none',
    filter: 'none', density: 'moderate', pagination: 'infinite', feature: 'none', selection: 'none',
  },
  children: { item: 'ApodCard' }, // delegated slot → child composite (present only when it delegates)
  labels: [ /* domain copy */ ],
} as const satisfies CompositeSpec; // from 'move'
```
**Do NOT store** `composition`, `behaviors`, `itemShape`, or `integrationPoints` — those are derived
by `resolve()`/`generate()` from `decisions` × the pattern's bindings × the adapter. `composite-validate`
checks this spec is a legal resolution; `generate` produces the code.

---

## Rules
1. **Slim spec** — only `fromPattern` + `adapter` + `decisions` + `children` + `labels`. Everything
   else is derived; storing it is drift waiting to happen (and how copying sneaks in).
2. **All decisions explicit** — every axis resolved to a value; no overrides, no deltas.
3. **Reference the adapter, don't embed a mapping** — the field→role mapping is the adapter's; the
   composite just names it. Swapping sources never touches the composite.
4. **Recursive** — one CompositeSpec per delegation node; the host lists children by name; only the
   root has an `adapter`.
5. **Gate** — refuse unless every axis is decided AND the adapter covers every itemShape role.
6. **Coherent** — the resolved combination passes the pattern's checkable heuristics.
7. **All copy through `labels`** — no hardcoded user-facing strings.
8. **Config-relative, deterministic** — write under `check.composites` (relative to `move.config.json`);
   same (pattern × useCase × adapter) → the same spec tree.
9. **Must `satisfies CompositeSpec`** — import the type from `move`.
