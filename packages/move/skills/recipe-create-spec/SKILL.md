---
name: recipe-create-spec
description: "Create or extract a typed .spec.ts for a Move recipe (a pattern composed entirely from Move components). Auto-detects extract vs create mode."
user-invocable: true
argument-hint: "[RecipeName]"
---

# Recipe Spec — Recipe Specification Generator

Create a typed `.spec.ts` that captures every human decision for a recipe. The
spec is the approved contract between decisions and mechanical generation — the
same spec-driven model components use, but lighter.

A **recipe** is a ready-made pattern (a whole flow or layout) composed
ENTIRELY from Move components: no custom CSS, no raw layout HTML, no inline
styles. It exposes no public API beyond an i18n `labels` object. Because AI
consumes recipe source directly, the spec must be rigorous and complete.

---

## How to Run

**Input:** A recipe name (e.g. "SignIn", "FilterableDataTable") and, in create
mode, its group/category and a brief.

**Output:** `packages/move/recipes/{groupSlug}/{Name}.spec.ts`
written to disk, ending in `satisfies CompositionSpec`.

The spec is co-located with the recipe source (`{Name}.tsx`), mirroring how
component specs sit beside `{Name}.tsx`.

---

## Mode detection

Auto-detect based on whether recipe source exists.

### Extract mode (source exists)

Look for `packages/move/recipes/**/{Name}.tsx`. If found → **extract
mode**:
- Read `{Name}.tsx` and its `registry.ts` entry.
- Mechanically extract the spec SUBSTANCE: `name`; `composition` (every Move
  component imported from `'move'`); `labels` (from the recipe's `defaultLabels`
  object — key, default value, and an inferred description);
  `integrationPoints` (handlers/data the recipe stubs or mocks —
  `onSubmit`, mock arrays, `// TODO` wiring); `behaviors` (validation, loading,
  empty, error, responsive, a11y handling visible in the source).
- The publishing fields (`slug`, `group`, `groupSlug`, `title`, `description`,
  `synonyms`, `preview`) are NOT part of the spec — they form the
  `RecipeDocument` and live on the recipe's registry entry in `registry.ts`
  (authored by `/recipe-generate-docs`). Leave them there; don't add them to the
  spec.
- Present the extracted spec for confirmation before writing. The user may
  correct any value.

### Create mode (no source)

If no source found → **create mode**:
- Ask for: a brief of the flow, plus its `group`/category and `title` (these feed
  the registry `RecipeDocument`, not the spec).
- Derive `name` (PascalCase).
- Propose `composition`, `labels`, `behaviors`, and `integrationPoints` (the spec
  substance) from the brief, then confirm with the user.
- REFUSE if critical decisions are missing (composition, at least one behavior).

---

## Process

### Step 1 — Load reference data

| File | Purpose |
|------|---------|
| `packages/move/recipes/spec-type.ts` (canonical) | `CompositionSpec` (spec substance, what specs `satisfies`) + `RecipeDocument` (registry publishing fields) |
| `references/recipes/rules.md` | Golden rules: only Move components, no custom CSS, i18n via `labels`, FormField usage, etc. |
| `references/recipes/composite/` | Existing recipe patterns to learn API usage and structure from |
| `references/app/composition-rules.md` | Available layout components and their props |
| `packages/move/recipes/registry.ts` | Existing groups and the `RecipePreview` shape |

### Step 2 — Gather decisions

The spec holds SUBSTANCE only:

| Field | How to determine |
|-------|------------------|
| `name` | PascalCase recipe name |
| `composition` | Every Move component the recipe uses. In extract mode, take exactly the named imports from `'move'`. This is the validate allow-list |
| `labels` | The i18n contract: `{ key, default, description }` for every user-facing string |
| `behaviors` | Acceptance criteria the source MUST implement — e.g. "validates email format", "shows empty state when no rows", "submit shows loading", "keyboard-navigable", "responsive: collapses to one column on mobile". Each becomes a test |
| `integrationPoints` | Every place a consumer wires real data/handlers — `{ id, description, kind }`. `kind`: `data` (sample data to replace → `SAMPLE_*` consts), `handler`, `navigation`, `asset`. For `kind: 'data'` over a collection (a table/list), also declare `shape` — the record fields with `type` and `searchable`/`sortable`/`filterable` flags — so columns/search/sort/filters are explicit, not reverse-engineered from JSX |

The publishing/discovery fields — `slug`, `group`, `groupSlug`, `title`,
`description`, `synonyms`, `preview` — are NOT in the spec. They form the
`RecipeDocument` and are hand-authored on the recipe's registry entry in
`registry.ts` by `/recipe-generate-docs`. While gathering, capture `group` /
`title` (reuse an existing group from `registry.ts` when one fits) and infer
`synonyms` (what users might type to find the flow) so they're ready for the
registry doc — but keep them OUT of the spec file.

### Step 3 — Apply conventions (baseline policy)

- **i18n:** every user-facing string is a `labels` entry. No hardcoded copy.
- **Composition only:** `composition` lists Move components only — never raw
  HTML elements or third-party UI.
- **Behaviors are testable:** phrase each behavior as something a test can
  assert (a rendered state, an interaction result), not a vague goal.
- **Integration points are explicit:** anything a real app must replace (API
  calls, data sources, navigation targets) is named, not buried in the source.

### Step 4 — Write the spec file

Write to `packages/move/recipes/{groupSlug}/{Name}.spec.ts`:

```ts
// {Name}.spec.ts — Recipe specification

import type { CompositionSpec } from '../spec-type';

export const spec = {
  schemaVersion: 1,
  name: '{Name}',
  composition: [/* Move components used */],
  behaviors: [/* testable acceptance criteria */],
  integrationPoints: [/* { id, description, kind } */],
  labels: [/* { key, default, description } */],
} satisfies CompositionSpec;
```

Note: the spec MUST end with `satisfies CompositionSpec` and import the type from
the canonical `packages/move/recipes/spec-type.ts` (one level up). The publishing
fields (`slug`, `group`, `groupSlug`, `title`, `description`, `synonyms`,
`preview`) are the `RecipeDocument` and belong on the registry entry, NOT in this
spec. If a recipe needs a substance field the schema lacks, update `spec-type.ts`,
not just the spec.

---

## Rules

1. **Auto-detect mode** — check for `{Name}.tsx` before asking anything.
2. **Extract mode: present for confirmation** — show the extracted spec; let the
   user correct before writing.
3. **Create mode: never guess critical decisions** — ask for group, title,
   composition, and behaviors if unclear.
4. **`composition` is Move components only** — no raw HTML, no inline styles, no
   third-party UI. This list is the validate allow-list.
5. **Every user-facing string is a `labels` entry** — no hardcoded copy.
6. **Behaviors must be testable** — each one drives a generated test.
7. **Integration points must be explicit** — name every place real data or
   handlers plug in.
8. **Spec must satisfy CompositionSpec** — output must type-check against the
   interface; publishing fields (slug/group/title/description/synonyms/preview)
   stay on the registry `RecipeDocument`, not in the spec.
9. **Deterministic output** — same inputs produce the same spec.
10. **Co-locate the spec** — `{Name}.spec.ts` beside `{Name}.tsx`, mirroring
    components.
