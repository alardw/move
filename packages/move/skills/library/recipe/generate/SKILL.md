# Generate Recipe — Recipe File Generator

Generate recipe files for a Move component's demo app.

---

## How to Run

**Input:** A component name (e.g. "Button", "Select", "Dialog").

**Output:**
- `demo/src/recipes/component/{Name}/{recipeSlug}.tsx` — one file per recipe
- `demo/src/recipes/component/{Name}/index.ts` — barrel exporting all recipes
- `demo/src/recipes/index.ts` — updated top-level barrel

---

## Directory Structure

```
demo/src/recipes/
  types.ts                          # Recipe type definition
  index.ts                          # Top-level barrel
  component/
    {Name}/
      index.ts                      # Barrel: exports {name}Recipes[]
      basic.tsx                     # One recipe per file
      variants.tsx
      sizes.tsx
      ...
  composite/                        # Future: composite recipes
```

---

## Process

### Step 1 — Locate component + spec

Find component source:
`src/components/**/{Name}/{Name}.tsx`

Read `{Name}.spec.ts` when present and extract:
- `name`, `category`, `description`
- `props` (especially variant unions, sizes, controlled state)
- `compound` (boolean — compound component?)
- `subComponents`
- `childrenKind`, `propRoles`
- `demo.samples` (if present)

Also read `{Name}.meta.ts` for variant/size lists if available.

### Step 2 — Determine recipe set

Use these heuristics to decide which recipes to generate:

1. **Always:** one "Basic" recipe — minimal usage, fewest props
2. **If `spec.variants.variant` exists:** one "Variants" recipe showing all variant values
3. **If `spec.sizes` exists:** one "Sizes" recipe showing all size values
4. **If controlled state** (`value`/`onChange` or `checked`/`onCheckedChange`): one "Controlled" recipe with `useState`
5. **If compound component** (`spec.compound === true`): one "Composition" recipe showing full compound API
6. **If `spec.demo.samples` exists:** one recipe per sample
7. **Component-specific patterns:** disabled states, loading states, with-icon, etc. as appropriate

Aim for 3–6 recipes per component. Do not over-generate.

### Step 3 — Generate individual recipe files

Each recipe lives in its own file: `demo/src/recipes/component/{Name}/{slug}.tsx`

File structure:

```tsx
// Generated recipe: {Name} — {Title}
import { useState } from 'react';  // only if needed
import { Name } from 'move';
import type { Recipe } from '../../types';

function RecipeComponentName() {
  return <Name>...</Name>;
}

export const recipe: Recipe = {
  id: '{name}:{slug}',
  title: '{Title}',
  description: '...',
  type: 'component',
  component: '{Name}',
  tags: ['...'],
  render: RecipeComponentName,
  code: `import { Name } from 'move';

<Name>...</Name>`,
};
```

Rules for recipe render components:
- Must be proper React components (`function Name() {}`)
- Hooks are legal (useState, useEffect, etc.)
- Import from `'move'` (library root)
- Self-contained — no props parameter, no external demo state
- Show realistic usage, not minimal wiring

### Step 4 — Generate matching static `code` strings

Each recipe has a `code` string that is copy-paste ready:
- Import statement at top (`import { Button } from 'move';`)
- Only the JSX usage, not the full function wrapper
- No internal demo refs (`props.*`, `playground.*`)
- Concrete literal values, not variable references
- Must match what the render function produces

### Step 5 — Write component barrel

Create/update `demo/src/recipes/component/{Name}/index.ts`:

```ts
import { recipe as basic } from './basic';
import { recipe as variants } from './variants';
// ...

export const {name}Recipes = [basic, variants, ...];
```

### Step 6 — Update top-level barrel

Update `demo/src/recipes/index.ts`:
- Add import: `import { {name}Recipes } from './component/{Name}';`
- Add spread to recipes array: `...{name}Recipes,`
- Keep imports sorted alphabetically
- If the component already exists in the barrel, replace the existing import

---

## Naming Conventions

- Recipe file names: kebab-case slug (e.g. `basic.tsx`, `with-icon.tsx`, `controlled.tsx`)
- Recipe IDs: `{name}:{kebab-slug}` (e.g. `button:with-icon`)
- Export variable: always `recipe` (singular) per file
- Barrel export: `{name}Recipes` (e.g. `buttonRecipes`)
- Render function: PascalCase descriptive (e.g. `ButtonWithIcon`, `BasicButton`)

---

## Rules

1. Recipe components are real `React.FC` at module scope — hooks are legal.
2. All recipes set `type: 'component'` and `component: '{Name}'`.
3. `code` must be copy-paste ready — no internal demo refs, no `props.*` bindings.
4. Import from `'move'` (library root).
5. Self-check: scan render bodies to verify code string matches what render produces.
6. Provenance comment on line 1.
7. Set `relatedComponents` when the recipe imports other Move components.
8. Set `dependencies` when the recipe needs non-Move npm packages.
9. Keep recipes focused — each recipe demonstrates one concept.
10. Do not duplicate what the playground already covers (raw prop exploration).
11. Always read source/spec first; never guess API.
12. One recipe per file — never bundle multiple recipes in one file.
