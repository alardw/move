---
name: app-composite
description: "Generate an app-specific composite from a CompositionSpec — composed entirely from Move components, spec-driven. Seeds from a Move recipe when one fits, else from analysis. No custom CSS."
user-invocable: true
---

# Generate Composite — spec-driven app component

An app composite is the same model as a Move recipe **minus publishing**: a typed
`CompositionSpec` (the substance) plus a generated `.tsx`. You author the spec,
generation produces the code, and `move check` validates it (purity +
composition/labels parity). The spec is what makes a composite checkable — without
it, a composition is unverifiable by construction.

---

## How to Run

**Input:** a description of the composite (e.g. "UserCard with avatar, name, role";
"a sign-in panel"), OR an existing `{Name}.spec.ts` to (re)generate from.

**Output:** `{Name}.spec.ts` (a `CompositionSpec`) + `{Name}.tsx`, side by side.

---

## Two starting points (pick one)

The spec always comes first — but you arrive at it one of two ways:

### A. Seed from a Move recipe (preferred when one fits)
If a shipped Move recipe already covers the pattern (a sign-in flow, a filterable
table, an app sidebar, a detail/overview page…), **start from its `CompositionSpec`.**
It's a proven decomposition. Copy it into the app, then adapt:
- rename, trim the `composition` allow-list to what you actually use,
- adjust `behaviors` to the app's acceptance criteria,
- rewrite `labels` to the app's copy,
- repoint `integrationPoints` at the app's real data/handlers.
Check the recipe registry (`recipes/registry.ts`) for what exists. Adapting a
recipe is faster and inherits its tested structure.

### B. Analyze from scratch (when no recipe fits)
No matching recipe → **derive the spec by analysis.** Decompose the requirement:
- which Move components compose it (→ `composition`),
- what it must do (→ `behaviors`, each a testable criterion),
- where real data/handlers plug in (→ `integrationPoints`),
- every user-facing string (→ `labels`).
This is the same decompose-first discipline as `component-analyze`, but the output
is a `CompositionSpec`, not a research report.

---

## The CompositionSpec

`{Name}.spec.ts` — a typed object matching the `CompositionSpec` shape below (the
same substance type Move's own recipes use). `move check` validates the source
against it. Substance ONLY — no publishing/discovery fields (those are a recipe's
`RecipeDocument`, irrelevant to private app code):

```ts
// {Name}.spec.ts — the composition's substance.
export const spec = {
  schemaVersion: 1,
  name: 'UserCard',                 // PascalCase
  composition: ['Card', 'Avatar', 'Stack', 'Heading', 'Text', 'Badge'],
  behaviors: [                      // testable acceptance criteria → drive tests
    'renders name, role, and avatar',
    'shows a status badge when the user is online',
  ],
  integrationPoints: [              // where the app wires real data/handlers
    { id: 'user', description: 'the user record to render', kind: 'data' },
  ],
  labels: [                         // the i18n contract
    { key: 'online', default: 'Online', description: 'online status badge' },
  ],
};
```

---

## Process

1. **Pick a starting point** (A or B) and **author `{Name}.spec.ts`** — the substance.
2. **Generate `{Name}.tsx` from the spec:**
   - compose ONLY the components in `spec.composition` — no other UI, no raw HTML, no custom CSS;
   - default-export `function {Name}({ labels }: { labels?: Partial<Labels> })`; every user-facing string from a `labels` object merged with defaults (`const t = { ...defaultLabels, ...labels }`) — no hardcoded copy;
   - implement every `behaviors[]` entry;
   - mark every `integrationPoints[]` entry with an explicit `// Integration point:` stub (sample data prefixed `SAMPLE_`);
   - spacing via `gap`/`align`/`justify` props, responsive via `collapseBelow` — never inline styles or media queries.
3. **Validate:** `move check` — purity (only Move components, no raw HTML/CSS/manual responsive) + composition/labels parity (the source matches the spec).

---

## Rules

1. **Spec first, code second** — `{Name}.tsx` derives from `{Name}.spec.ts`; the spec is the source of truth.
2. **Prefer a recipe seed** — adapt an existing Move recipe before analyzing from scratch.
3. **Only `spec.composition` components** — no other UI, no raw HTML layout, no custom CSS. This list is the validate allow-list.
4. **Every label via the `labels` object** — no hardcoded user-facing strings.
5. **Every integration point marked** — explicit, greppable `// Integration point:` stubs; sample data `SAMPLE_`-prefixed.
6. **Spacing/responsive via props** — `gap`/`align`/`justify`, `collapseBelow`; never inline styles or media queries.
7. **`move check` enforces source ↔ spec parity** — the source composes exactly `spec.composition` and exposes exactly `spec.labels`. The shape mirrors `CompositionSpec`, the substance type Move's own recipes use.
