# Generate Demo — Demo File Generator

Generate a demo file for a Move component by reading its source/spec.

---

## How to Run

**Input:** A component name (e.g. "Button", "Select", "Dialog").

**Output:** `demo/src/demos/generated/{Name}Demo.tsx`.

---

## Process

### Step 1 — Locate component + spec

Find component source:
`src/components/**/{Name}/{Name}.tsx`

Prefer separate demo spec when present:
- `src/components/**/{Name}/{Name}.demo.spec.ts` (authoritative for demo controls/samples/fixtures)
- fallback: `{Name}.spec.ts` + source inference

Read `{Name}.spec.ts` when present and extract:
- `name`, `category`, `description`
- `props`
- `variants`
- `sizes`
- `componentDeps`
- `childrenKind`, `propRoles` (if present)
- `demo` contract (if present)

### Step 2 — Build controls + initial props

If `spec.demo` exists, it is authoritative:
- Use `demo.controls` directly.
- Use `demo.samples` and `demo.bindings` to build render recipes.
- Do not infer conflicting controls from prop heuristics.
- If `demo.referenceImages` exists, preserve them in generated module metadata/comments for visual QA context.

If `{Name}.demo.spec.ts` exists, it overrides `spec.demo` and should be used as the primary demo contract source.

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

### Step 3 — Build demo render pattern

Generate a stable demo render that mirrors expected usage:
- Primitive component: `<Name {...props}>{props.children}</Name>`
- Compound component: explicit composition (`.Root`, `.Trigger`, `.Content`, etc.)
- If `componentDeps` exist, import and use Move components in the demo composition.

Multi-sample support:
- Prefer `renderMode: 'grid'` for multiple samples so all sample outputs are visible at once.
- Only use a `sample` select (`renderMode: 'samples'`) when explicitly requested by user intent.
- In grid mode, keep shared controls global (for example `variant`, `size`) and scope per-sample controls by stable prefix (for example `withIcon.icon`, `withIcon.iconPosition`).
- Keep controls deterministic and sample-aware via `demo.bindings`.
- When reference images are tied to specific samples, keep sample IDs stable.

Consumer-first + playground split:
- Primary preview should render consumer samples first (usage recipes).
- If controls are broad/debug-oriented, render a separate "Props Playground" preview section below/after consumer samples.
- Prefer `playground.*` control IDs for playground-only knobs to avoid conflating usage examples with debug state.
- Do not use spec shape as the visual default; consumer samples should be understandable without knowing internal prop contracts.
- Prefer explicit demo `sections` when both consumer and playground views exist:
  - `consumer` section: curated usage samples + matching code snippet
  - `playground` section: editable prop sandbox + matching code snippet
- Code viewer must show code for the active section, not unrelated generated scaffolding.
- For side-by-side sample comparison, use per-sample controls (for example `consumer.textOnly.variant` and `consumer.withIcon.variant`) instead of one shared variant control.
- Consumer code snippets must be copy-paste ready for library users:
  - Do not reference internal demo state objects (for example `consumer.*`, `props.*`, `playground.*`).
  - Prefer concrete literals and simple standalone examples.
  - Keep snippets focused on usage intent, not control wiring.

Animation behavior in demos must mirror component defaults:
- Do not inject stronger or alternate animation defaults in demo code.
- Only pass `animate` overrides when explicitly requested by user or encoded in spec.
- Keep demo behavior faithful so visual QA reflects real defaults.

Default value rules for usable previews:
- Do not force controlled booleans like `open`/`checked` to `false` by default unless the demo is explicitly controlled on purpose.
- Prefer omitting those props from `initialProps` so component default behavior is visible.
- Text-bearing props (`children`, `label`, `title`) must get meaningful, non-empty preview defaults unless empty is itself the behavior being demonstrated.
- Do not emit `undefined` literal values in `initialProps`; use explicit values, `null`, or omit the key.

### Step 4 — Write demo module and update barrel

Write `demo/src/demos/generated/{Name}Demo.tsx` exporting:
- `demo` (DemoDefinition)
- default component optional

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
11. Demo UX is consumer-first: usage samples are primary, prop playground is secondary.
12. **Demo `render` functions must NEVER call React hooks** — `render` functions (both top-level `render` and inside `sections[].render`) are called as regular functions by the App (`activeSection.render(props)`), not as React components. Calling `useState`, `useEffect`, `useMemo`, `useRef`, `useCallback`, or any hook inside them violates the Rules of Hooks and crashes the app when switching between sections ("Rendered more hooks than during the previous render"). If a demo sample needs local state, extract it into a **named React component at module scope** and render that component from the render function. Pattern:
    ```tsx
    // Module scope — real React component, hooks are legal here
    function ControlledCalendarDemo() {
      const [value, setValue] = useState<Date | undefined>();
      return <Calendar.Root mode="single" value={value} onValueChange={setValue}>...</Calendar.Root>;
    }
    // In the DemoDefinition:
    sections: [{ id: 'consumer', render: () => <ControlledCalendarDemo /> }]
    ```
    Alternative: use uncontrolled mode (`defaultValue`) when the component supports it, avoiding hooks entirely.
13. **Self-check before writing** — before writing the demo file, scan all `render` function bodies for hook calls (`useState`, `useEffect`, `useMemo`, `useRef`, `useCallback`, `useReducer`, `useContext`, `useLayoutEffect`). If any are found, refactor using the wrapper component pattern from rule 12.
