---
name: app-compose
description: "Compose an app screen from a CompositionSpec — a composite, a page, or a whole feature, all built entirely from Move components, spec-driven. Seeds from a Move recipe when one fits, else from analysis. No custom CSS."
user-invocable: true
---

# Compose — spec-driven app composition

A page, a composite, and a feature are the same thing at three scales: a
composition of Move components. One skill builds all three; the spec's `scope`
says which:

| `scope`      | is | example |
|--------------|----|---------|
| `composite`  | a reusable piece inside pages | `UserCard`, a sign-in panel |
| `page`       | a composite that owns a route | a dashboard, a settings screen |
| `feature`    | several pages + composites + routing | auth (sign-in, sign-up, reset) |

A composition is the same model as a Move recipe **minus publishing**: a typed
`CompositionSpec` (the substance) plus generated `.tsx`. You author the spec,
generation produces the code, and `move check` validates it (purity +
composition/labels parity). The spec is what makes a composition checkable —
without it, a composition is unverifiable by construction.

---

## How to Run

**Input:** a description (e.g. "UserCard with avatar, name, role"; "a settings
page"; "auth feature with sign-in, sign-up, reset"), OR an existing
`{Name}.spec.ts` to (re)generate from.

**Output:** `{Name}.spec.ts` (a `CompositionSpec`) + the `.tsx` — one file for a
composite or page, several plus routing for a feature.

---

## Two starting points (pick one)

The spec always comes first — you arrive at it one of two ways:

### A. Seed from a Move recipe (preferred when one fits)
If a shipped recipe covers the pattern (a sign-in flow, a filterable table, an
app sidebar, a detail/overview page…), **start from its `CompositionSpec`.** It's
a proven decomposition. Copy it in, then adapt: rename, trim `composition` to what
you use, adjust `behaviors` to the app's acceptance criteria, rewrite `labels` to
the app's copy, repoint `integrationPoints` at real data/handlers. Check
`recipes/registry.ts` for what exists.

### B. Analyze from scratch (when no recipe fits)
Decompose the requirement into the spec: which Move components compose it (→
`composition`), what it must do (→ `behaviors`, each testable), where real
data/handlers plug in (→ `integrationPoints`), every user-facing string (→
`labels`). Same decompose-first discipline as `component-analyze`; the output is a
`CompositionSpec`.

---

## The CompositionSpec

`{Name}.spec.ts` — a typed object matching `CompositionSpec` (the same substance
type Move's own recipes use). Substance only — no publishing/discovery fields.

```ts
// {Name}.spec.ts — the composition's substance.
export const spec = {
  schemaVersion: 1,
  name: 'SettingsPage',             // PascalCase
  scope: 'page',                    // 'composite' | 'page' | 'feature'
  composition: ['Stack', 'Heading', 'Card', 'FormField', 'InputText', 'Button'],
  behaviors: [                      // testable acceptance criteria → drive tests
    'renders the profile form with current values',
    'disables Save until a field changes',
  ],
  integrationPoints: [              // where the app wires real data/handlers
    { id: 'profile', description: 'the profile record to edit', kind: 'data' },
  ],
  labels: [                         // the i18n contract
    { key: 'save', default: 'Save changes', description: 'submit button' },
  ],
} satisfies CompositionSpec;
```

---

## Process

1. **Pick a starting point** (A or B) and **author `{Name}.spec.ts`**, setting `scope`.
2. **Generate the `.tsx` from the spec** — always:
   - compose ONLY the components in `spec.composition` — no other UI, no raw HTML, no custom CSS;
   - default-export `function {Name}({ labels }: { labels?: Partial<Labels> })`; every user-facing string from a `labels` object merged with defaults (`const t = { ...defaultLabels, ...labels }`) — no hardcoded copy;
   - implement every `behaviors[]` entry;
   - mark every `integrationPoints[]` entry with an explicit `// Integration point:` stub (sample data prefixed `SAMPLE_`);
   - spacing via `gap`/`align`/`justify`, responsive via `collapseBelow` — never inline styles or media queries.
3. **Then apply the scope's shape** (below).
4. **Validate:** `move check` — purity (only Move components) + composition/labels parity (source ↔ spec).

### By scope

- **`composite`** — one `.tsx`, a reusable piece. Nothing extra.
- **`page`** — one `.tsx` that owns a route: a page header (Breadcrumb + `Heading` level 1 + actions via `Align`), content sections under `Heading` level 2, composites for repeated patterns. Page-level state (filters, selection) lives here.
- **`feature`** — several compositions plus routing. Each page and shared composite is its own `CompositionSpec` (`scope: 'page'` / `'composite'`); generate each, then wire routing for the framework in use (Next.js App Router directory, React Router entries, or TanStack route files) and the navigation between them (`Link`, `Breadcrumb`). Shared cross-page state lives in one context.

---

## Rules

1. **Spec first, code second** — the `.tsx` derives from `{Name}.spec.ts`; the spec is the source of truth.
2. **Prefer a recipe seed** — adapt an existing Move recipe before analyzing from scratch.
3. **Only `spec.composition` components** — no other UI, no raw HTML layout, no custom CSS. This list is the validate allow-list.
4. **Every label via the `labels` object** — no hardcoded user-facing strings.
5. **Every integration point marked** — explicit, greppable `// Integration point:` stubs; sample data `SAMPLE_`-prefixed.
6. **Spacing/responsive via props** — `gap`/`align`/`justify`, `collapseBelow`; never inline styles or media queries.
7. **`scope` decides the shape** — a composite is one piece, a page owns a route with heading hierarchy, a feature is several specs plus routing.
8. **`move check` enforces source ↔ spec parity** — the source composes exactly `spec.composition` and exposes exactly `spec.labels`.
