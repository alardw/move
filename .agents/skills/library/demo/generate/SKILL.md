# Generate Demo — Demo File Generator (Playground Only)

Generate a playground demo file for a Move component by reading its source/spec.

> **Note:** Consumer usage samples are now handled by the recipe system (`/generate-recipe`).
> This skill generates **playground-only** demos with clean prop controls.

---

## How to Run

**Input:** A component name (e.g. "Button", "Select", "Dialog").

**Output:** `demo/src/demos/generated/{Name}Demo.tsx`.

---

## Process

### Step 1 — Locate component + spec

Find component source:
`src/components/**/{Name}/{Name}.tsx`

Read `{Name}.spec.ts` when present and extract:
- `name`, `category`, `description`
- `props`
- `variants`
- `sizes`
- `componentDeps`
- `childrenKind`, `propRoles` (if present)

### Step 2 — Build controls + initial props

Controls are purely for the playground — use clean prop names (no `consumer.*` or `playground.*` prefixes).

Infer controls from spec props:
- union literals -> select
- boolean -> checkbox
- number -> number
- string / children / label / title -> text
- skip handlers (`onX`) and function/object configs

Children/composition disambiguation:
- If `childrenKind === 'composition'`, do **not** generate a plain text control for `children`.
- Use explicit controls for the real text-bearing slot/prop (for example `fallbackText` for `Avatar.Fallback`).
- Use `propRoles` to decide what is demo-editable text (`displayText`) vs structural (`composition`).
- For compound components, prefer nested controls under `subComponents` rather than flattened controls.

Mark controls as `required` using smart inference:
- Props with an explicit `default` in the spec → **never required** (omit `required`)
- Boolean props without `default` → **not required** (booleans naturally default to falsy)
- `children` props → **not required** (nearly always optional in React)
- Event handlers (`onX`) → already skipped from controls
- All other props without `default` → **`required: true`**

Set initial props from spec defaults and required rendering values.

Control typing must stay explicit and finite:
- `kind` must be one of: `select | boolean | number | text`
- Never emit generic/unchecked kinds (e.g. `kind: string`)

Children/text default policy (deterministic):
- If component renders `children` as visible primary content and no explicit spec default exists, set `children` default to a non-empty label:
  - Prefer component name (e.g. `Badge`, `Button`, `Link`)
  - Otherwise use `{Name} preview`
- If `label`/`title` are display-driving text props and no explicit spec default exists, set non-empty preview text.
- Only keep empty text defaults when emptiness is explicitly the behavior being demonstrated.

### Step 3 — Build playground render

Generate a single `render` function for interactive prop exploration:
- Primitive component: `<Name {...props}>{props.children}</Name>`
- Compound component: explicit composition (`.Root`, `.Trigger`, `.Content`, etc.)
- If `componentDeps` exist, import and use Move components in the demo composition.

**Do NOT generate `sections`.** The recipe system handles curated usage examples.
**Do NOT use `consumer.*` or `playground.*` control prefixes.** Controls use clean prop names.

Animation behavior in demos must mirror component defaults:
- Do not inject stronger or alternate animation defaults in demo code.
- Only pass `animations` overrides when explicitly requested by user or encoded in spec.

Default value rules for usable previews:
- Do not force controlled booleans like `open`/`checked` to `false` by default unless the demo is explicitly controlled on purpose.
- Prefer omitting those props from `initialProps` so component default behavior is visible.
- Text-bearing props (`children`, `label`, `title`) must get meaningful, non-empty preview defaults.
- Do not emit `undefined` literal values in `initialProps`; use explicit values, `null`, or omit the key.

### Step 4 — Write demo module and update barrel

Write `demo/src/demos/generated/{Name}Demo.tsx` exporting:
- `demo` (DemoDefinition)

Use this shape:

```tsx
import { Name } from 'move';
import type { DemoDefinition } from '../types';

export const demo: DemoDefinition = {
  id: 'category:Name',
  name: 'Name',
  category: 'core',
  description: '...',
  controls: [...],
  initialProps: {...},
  render: (props) => <Name {...props} />,
};
```

After writing the demo file, update the barrel at `demo/src/demos/generated/index.ts`:
- Read the current barrel file
- Add an import for the new demo: `import { demo as {Name}Demo } from './{Name}Demo';`
- Add `{Name}Demo` to the `demos` array export
- If the demo already exists in the barrel, replace the existing import (do not duplicate)
- Keep imports sorted alphabetically

---

## Rules

1. Always read source/spec first; never guess API.
2. Demo must be renderable without Storybook.
3. Prefer explicit compound composition over generic fallback.
4. Keep imports from `'move'` (library root).
5. Generated file must be deterministic from source/spec.
6. Include provenance comment on line 1.
7. No demo-only animation overrides by default; demos should validate component defaults, not mask them.
8. Demo defaults must produce a visibly working preview on first render (not blank, not permanently closed unless intentional).
9. Do not rely on manual demo edits; defaults must come from this generation policy and be reproducible on regeneration.
10. Generated demo files are generation outputs; do not hand-edit them to fix behavior. Fix the spec/skill contract and regenerate.
11. **Do NOT generate `sections`** — consumer samples are handled by `/generate-recipe`.
12. **Demo `render` functions must NEVER call React hooks** — `render` functions are called as regular functions by the App (`active.render(props)`), not as React components. If a demo needs local state, extract it into a **named React component at module scope** and render that component from the render function.
13. **Self-check before writing** — before writing the demo file, scan all `render` function bodies for hook calls (`useState`, `useEffect`, `useMemo`, `useRef`, `useCallback`, `useReducer`, `useContext`, `useLayoutEffect`). If any are found, refactor using the wrapper component pattern from rule 12.
