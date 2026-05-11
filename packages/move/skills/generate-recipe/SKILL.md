---
name: generate-recipe
description: "Generate recipe files (component or composite) for the Move demo app."
user-invocable: true
argument-hint: "[ComponentName|CompositeName]"
---

# Generate Recipe — Recipe File Generator

Generate recipe files for the Move demo app. Supports two recipe types:

- **Component recipes** — showcase a single Move component's API and variants
- **Composite recipes** — combine multiple Move components into a reusable pattern (e.g. Login form, Settings panel)

---

## How to Run

**Input:** A component name (e.g. "Button") OR a composite pattern name (e.g. "Login", "SettingsPanel").

Determine the recipe type:
- If it maps to a single Move component → `component`
- If it combines multiple components into a UI pattern → `composite`

**Output (component):**
- `demo/src/recipes/component/{Name}/{recipeSlug}.tsx` — one file per recipe
- `demo/src/recipes/component/{Name}/index.ts` — barrel exporting all recipes
- `demo/src/recipes/index.ts` — updated top-level barrel

**Output (composite):**
- `demo/src/recipes/composite/{Name}/{recipeSlug}.tsx` — one file per recipe
- `demo/src/recipes/composite/{Name}/index.ts` — barrel exporting all recipes
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
      ...
  composite/
    {group}/                        # Domain grouping (e.g. authentication, settings, navigation)
      {Name}/
        index.ts                    # Barrel: exports {name}Recipes[]
        basic.tsx                   # Default composition
        with-i18n.tsx               # i18n variant
        ...
```

---

## Process — Component Recipes

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
  render: RecipeComponentName,
  code: `import { Name } from 'move';

<Name>...</Name>`,
};
```

---

## Process — Composite Recipes

### Step 1 — Identify components

Determine which Move components are needed for the pattern. Read their source files to understand their APIs:
`src/components/**/{Name}/{Name}.tsx`

### Step 2 — Determine recipe set

Composite recipes typically include:

1. **Always:** one "Basic" recipe — the default composition with hardcoded labels
2. **If i18n is relevant:** one "i18n" recipe — all user-facing strings passed as props via a labels/translations object
3. **Variants:** additional recipes for meaningful variations (e.g. "With Social Login", "Minimal")

Aim for 2–4 recipes per composite. Keep them focused and realistic.

### Step 3 — Generate recipe files

Each recipe lives in: `demo/src/recipes/composite/{group}/{Name}/{slug}.tsx`

File structure:

```tsx
// Generated recipe: {Name} — {Title}
import { useState } from 'react';
import { Stack, Button, InputText, ... } from 'move';
import type { Recipe } from '../../types';

function RecipeComponentName() {
  // Self-contained — manage own state
  return (
    <Stack gap="md">
      ...
    </Stack>
  );
}

export const recipe: Recipe = {
  id: '{name}:{slug}',
  title: '{Title}',
  description: '...',
  type: 'composite',
  component: '{Name}',
  relatedComponents: ['Stack', 'Button', 'InputText', ...],
  render: RecipeComponentName,
  code: `import { Stack, Button, InputText, ... } from 'move';

// ... copy-paste ready code`,
};
```

### i18n pattern

For i18n-ready composites, extract all user-facing strings into a `labels` object:

```tsx
const defaultLabels = {
  title: 'Log in',
  emailLabel: 'Email',
  emailPlaceholder: 'you@example.com',
  passwordLabel: 'Password',
  submitLabel: 'Sign in',
  // ...
};

type Labels = typeof defaultLabels;

function LoginForm({ labels = defaultLabels }: { labels?: Partial<Labels> }) {
  const t = { ...defaultLabels, ...labels };
  // use t.title, t.emailLabel, etc.
}
```

The recipe render wrapper calls it without props (uses defaults), but the `code` string shows the labels interface so consumers know what's translatable.

---

## Shared Steps

### Generate barrel

Create/update the barrel. For component recipes: `demo/src/recipes/component/{Name}/index.ts`. For composite recipes: `demo/src/recipes/composite/{group}/{Name}/index.ts`.

```ts
import { recipe as basic } from './basic';
import { recipe as withI18n } from './with-i18n';
// ...

export const {name}Recipes = [basic, withI18n, ...];
```

### Update top-level barrel

Update `demo/src/recipes/index.ts`:
- Add import: `import { {name}Recipes } from './component/{Name}';` or `import { {name}Recipes } from './composite/{group}/{Name}';`
- Add spread to recipes array: `...{name}Recipes,`
- Keep imports sorted alphabetically
- If the entry already exists, replace it

---

## Naming Conventions

- Recipe file names: kebab-case slug (e.g. `basic.tsx`, `with-i18n.tsx`, `with-social.tsx`)
- Recipe IDs: `{name}:{kebab-slug}` (e.g. `button:basic`, `login:with-i18n`). For composites: `{group}/{name}:{slug}` (e.g. `authentication/login:basic`)
- Export variable: always `recipe` (singular) per file
- Barrel export: `{name}Recipes` (e.g. `loginRecipes`)
- Render function: PascalCase descriptive (e.g. `BasicLogin`, `LoginWithI18n`)

---

## Rules

**Read `../../references/recipes/rules.md` first** for the golden rules that apply to all generated code.

Browse existing recipes in `../../references/recipes/` before generating — reuse patterns, don't reinvent.

1. Recipe components are real `React.FC` at module scope — hooks are legal.
2. Set `type: 'component'` or `type: 'composite'` accordingly.
3. `code` must be copy-paste ready — no internal demo refs, no `props.*` bindings.
4. Import from `'move'` (library root).
5. Self-check: scan render bodies to verify code string matches what render produces.
6. Provenance comment on line 1.
7. Set `relatedComponents` when the recipe imports multiple Move components.
8. Set `dependencies` when the recipe needs non-Move npm packages.
9. Keep recipes focused — each recipe demonstrates one concept.
10. Do not duplicate what the playground already covers (raw prop exploration).
11. Always read component source first; never guess API.
12. One recipe per file — never bundle multiple recipes in one file.
13. Composite recipes must be self-contained — manage their own state, no external dependencies.
14. i18n composites use a `defaultLabels` pattern — all strings extractable, sensible English defaults.
15. **Always use stable `key` props** when mapping over arrays of Move components. Move components are animated — without keys, React may remount or shift elements, causing animations to replay unexpectedly.
16. `Dialog.Header` auto-renders a close button by default. Do not add `<Dialog.Close />` inside a header unless you set `closable={false}` on the header. Use `<Dialog.Close asChild>` when wrapping a custom close button (e.g. in footers).
17. **Use `animateKey` for dynamic lists** — when a List or Timeline's children change (filter, sort, search), pass `animateKey` derived from the filter/sort state to replay the stagger entrance animation: `<List animateKey={searchQuery}>`. Without it, changed items appear with no transition.
