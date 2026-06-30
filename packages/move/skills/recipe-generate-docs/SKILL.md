---
name: recipe-generate-docs
description: "Register a recipe in the docs registry from its spec. Derives title/description/group/preview/synonyms."
user-invocable: true
argument-hint: "[RecipeName]"
---

# Recipe Generate Docs — Recipe Registration

Register a recipe in the docs app so it appears in the overview grid and gets a
detail page. **REFUSES without an existing spec and recipe source.**

The docs app is **content-driven**: recipes share ONE overview template
(`RecipesOverviewPage`) and ONE detail template (`RecipeDetailPage`). A recipe
"page" is just an entry in `packages/move/recipes/registry.ts`. The
entry's metadata is **derived from the spec** — never hand-authored.

---

## How to Run

**Input:** A recipe name (e.g. "SignIn").

**Output:** an entry added to (or updated in)
`packages/move/recipes/registry.ts`:
- `import` of the recipe component and its `?raw` source.
- an entry in the `RECIPES` array, with `slug`, `group`, `groupSlug`, `title`,
  `description`, `synonyms`, `Component`, `source`, `preview` — all derived from
  `{Name}.spec.ts`.

**REFUSES if:** `{Name}.spec.ts` or `{Name}.tsx` does not exist. Run
`/recipe-create-spec {Name}` then `/recipe-generate-source {Name}` first.

---

## Process

### Step 1 — Read inputs

1. `packages/move/recipes/{groupSlug}/{Name}.spec.ts` — the source of
   truth for all registry metadata.
2. `packages/move/recipes/registry.ts` — the `RecipeMeta` shape and
   existing entries (match their style and grouping).

### Step 2 — Ensure the registry supports `synonyms`

The recipe overview filters by `synonyms` (parity with the components overview).
Confirm `RecipeMeta` in `registry.ts` has a `synonyms: string[]` field and that
`RecipesOverviewPage` includes it in its search predicate. If missing, add it
(one-time): a `synonyms` field on `RecipeMeta`, and
`r.synonyms.some((s) => s.includes(q))` in the overview filter.

### Step 3 — Add imports

In `registry.ts`, in the recipe's group block, add (alphabetically within the
group):
```ts
import {Name} from './{groupSlug}/{Name}';
import {Name}Src from './{groupSlug}/{Name}.tsx?raw';
```

### Step 4 — Add the entry

Append to the group's section of the `RECIPES` array, deriving every field from
the spec:
```ts
{
  slug: spec.slug,
  group: spec.group,
  groupSlug: spec.groupSlug,
  title: spec.title,
  description: spec.description,
  synonyms: spec.synonyms,
  Component: {Name},
  source: {Name}Src,
  preview: spec.preview,   // { width, bare?, image? }
},
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
2. **Derive every field from the spec** — never hand-author title/description/
   group/preview/synonyms; they come from `{Name}.spec.ts`.
3. **Register exactly once** — one import pair + one array entry; no duplicate
   slug within a group.
4. **Keep grouping + order** — entries grouped by `group`, in display order.
5. **Synonyms power search** — ensure `RecipeMeta.synonyms` and the overview
   filter exist so recipes filter exactly like components.
6. **Typecheck the docs package** before declaring done.
