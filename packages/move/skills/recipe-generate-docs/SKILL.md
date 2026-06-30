---
name: recipe-generate-docs
description: "Register a recipe in the docs registry: hand-author its RecipeDocument (slug/group/title/description/synonyms/preview) on the registry entry, alongside the spec/component/source."
user-invocable: true
argument-hint: "[RecipeName]"
---

# Recipe Generate Docs — Recipe Registration

Register a recipe in the docs app so it appears in the overview grid and gets a
detail page. **REFUSES without an existing spec and recipe source.**

The docs app is **content-driven**: recipes share ONE overview template
(`RecipesOverviewPage`) and ONE detail template (`RecipeDetailPage`). A recipe
"page" is just an entry in `packages/move/recipes/registry.ts`. That entry
carries the spec SUBSTANCE (`spec`), the live component + `?raw` source, and the
`RecipeDocument` publishing fields (slug/group/groupSlug/title/description/
synonyms/preview) — which are **hand-authored on the registry entry**, since
publishing is a registry concern, not spec data.

---

## How to Run

**Input:** A recipe name (e.g. "SignIn").

**Output:** an entry added to (or updated in)
`packages/move/recipes/registry.ts`:
- `import` of the recipe component, its `?raw` source, and its `spec`.
- a `toMeta(...)` entry in the `RECIPES` array. The spec/component/source come
  from the imports; the `RecipeDocument` fields (`slug`, `group`, `groupSlug`,
  `title`, `description`, `synonyms`, `preview`) are hand-authored as the 4th
  argument — they are NOT in the spec.

**REFUSES if:** `{Name}.spec.ts` or `{Name}.tsx` does not exist. Run
`/recipe-create-spec {Name}` then `/recipe-generate-source {Name}` first.

---

## Process

### Step 1 — Read inputs

1. `packages/move/recipes/{groupSlug}/{Name}.spec.ts` — the `CompositionSpec`
   substance (drives the detail page's spec-derived sections).
2. `packages/move/recipes/registry.ts` — the `RecipeMeta` shape (it
   `extends RecipeDocument` and adds `Component`, `source`, `spec`), the
   `toMeta(spec, Component, source, doc)` helper, and existing entries (match
   their style and grouping).

### Step 2 — Confirm the `RecipeDocument` fields

The publishing/discovery metadata is the `RecipeDocument` (`spec-type.ts`):
`slug`, `group`, `groupSlug`, `title`, `description`, `synonyms`, `preview`. These
are authored on the registry entry — `RecipeMeta extends RecipeDocument`, so they
type-check there. The overview filters by `synonyms` (parity with the components
overview), so always supply a real `synonyms` array.

### Step 3 — Add imports

In `registry.ts`, in the recipe's group block, add (alphabetically within the
group):
```ts
import {Name} from './{groupSlug}/{Name}';
import {Name}Src from './{groupSlug}/{Name}.tsx?raw';
import { spec as {name}Spec } from './{groupSlug}/{Name}.spec';
```

### Step 4 — Add the entry

Append to the group's section of the `RECIPES` array. Call `toMeta(spec,
Component, source, doc)` and hand-author the `RecipeDocument` (4th arg) — these
fields are NOT in the spec:
```ts
toMeta({name}Spec, {Name}, {Name}Src, {
  slug: '{slug}',
  group: '{Group}',
  groupSlug: '{groupSlug}',
  title: '{Title}',
  description: '{Description}',
  synonyms: [/* search aliases */],
  preview: { width: 'full' },   // { width, bare?, image? }
}),
```

Keep entries grouped by `group` and in the existing display order. `RECIPE_GROUPS`
derives automatically from the array — no manual edit needed for a new group
(but place the new group's block where it should appear in order).

### Step 5 — Verify

- `cd packages/docs && npx tsc --noEmit -p tsconfig.json` → 0 errors.
- The recipe appears once in `RECIPES`; no duplicate slug within its group.

No `App.tsx`, routing, or template edits — `/recipes`, the overview card, the
`/recipes/{group}/{slug}` detail route, and the code view all come for free from
the registry entry.

---

## Rules

1. **REFUSE without spec + source** — both must exist first.
2. **Hand-author the `RecipeDocument`** — slug/group/groupSlug/title/description/
   synonyms/preview are authored on the registry entry (the `toMeta` doc arg),
   NOT derived from the spec — they aren't in it.
3. **Register exactly once** — one import trio (component + `?raw` + spec) + one
   `toMeta` entry; no duplicate slug within a group.
4. **Keep grouping + order** — entries grouped by `group`, in display order.
5. **Synonyms power search** — always supply a real `synonyms` array on the
   `RecipeDocument` so recipes filter exactly like components.
6. **Typecheck the docs package** before declaring done.
