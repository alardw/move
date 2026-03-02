# Spec — Component Specification Generator

Create a typed `.spec.ts` file that captures all human decisions for a component. The spec is the approved contract between decisions and mechanical generation.

---

## How to Run

**Input:** A component name (e.g. "Badge", "Checkbox").

**Output:** `src/components/{category}/{Name}/{Name}.spec.ts` written to disk.

---

## Mode detection

The skill auto-detects the mode based on whether source exists:

### Extract mode (source exists)

Search for existing source in this order:
1. `original-components/**/{Name}/{Name}.tsx`
2. `src/components/**/{Name}/{Name}.tsx`

If found → **extract mode**:
- Read `{Name}.tsx`, `{Name}.module.css`, `index.ts`, `use{Name}.ts` (if exists)
- Mechanically extract: slots, props, defaults, moveProps, variants, sizes, controlled pattern, animation usage, tokens, Radix primitive, compound structure
- Mechanically extract behavior contracts: controlled prop triads, dismiss semantics, and required passthrough/composition constraints
- Infer componentClass from the extraction (animation hook used, ARIA attributes, form pattern)
- Look up category from the file path, or from the registry
- Present the extracted spec to the user for confirmation before writing
- The user may correct or override any extracted value

### Create mode (no source)

If no source found → **create mode**:
- Ask the user for: componentClass, category, description
- Fill class defaults from `_reference/` files (animation, a11y, keyboard, focus, form)
- Ask the user for component-specific decisions: slots, props, variants, sizes, tokens
- REFUSE if critical decisions are missing (componentClass, category, slots, props)

---

## Process

### Step 1 — Load reference data

Read these files for class defaults and available options:

| File | Purpose |
|------|---------|
| `_reference/spec-type.ts` | `ComponentSpec` type definition |
| `_reference/categories.ts` | Valid categories and placement rules |
| `_reference/animation-map.ts` | Class → animation wiring |
| `_reference/keyboard-map.ts` | Keyboard pattern → keys/behavior |
| `_reference/a11y-contract.ts` | Class → ARIA requirements |
| `_reference/form-patterns.ts` | Form integration patterns |
| `_reference/default-conventions.ts` | Token/size/variant defaults |
| `_reference/engine-api.ts` | Available engine/animation imports |
| `_reference/radix-primitives.ts` | Available Radix primitives |
| `_reference/tokens-semantic.ts` | Available semantic tokens |

### Step 2 — Gather decisions

**Extract mode:** Read the source and derive each field:

| Field | How to extract |
|-------|---------------|
| name | Component export name |
| componentClass | Infer from animation hook, ARIA, form pattern |
| category | From file path |
| slots | From `slots: [...]` in `withMoveComponent` |
| props | From props interface |
| defaults | From `defaults: {...}` in `withMoveComponent` |
| moveProps | From `moveProps: [...]` in `withMoveComponent` |
| variants | String literal union props with data-attribute selectors in CSS |
| sizes | Size union prop values |
| controlled | Presence of open/value/checked triads |
| controlledProps | Exact controlled/default/onChange prop keys |
| dismissBehavior | Whether close action hides, unmounts, or is external-only |
| tokens | `--move-{component}-*` declarations in `.module.css` |
| animations | Which animation hooks are imported, how they're wired, and exact default config |
| compound | Object.assign / object literal / subComponents export pattern |
| radixPrimitive | Radix imports |
| hasHook | Whether `use{Name}.ts` exists |
| anatomy | Render tree from `render()` |
| renderContracts | Required passthrough/composition links (e.g. animate forwarded into sub-slot) |
| labels | Hardcoded user-visible strings (aria-label values, button text, placeholder text) |
| componentDeps | Other Move components used in source or expected in stories (e.g. Button, Icon) |
| childrenKind / propRoles | Whether children/props are text content vs structural composition |
| demo | Optional explicit demo contract (controls, samples, bindings, reference images). Prefer separate `{Name}.demo.spec.ts` for active demo iteration. |

**Create mode:** From user input + class defaults from `_reference/`.

### Step 2b — Automatic default assignment

Defaults are assigned automatically using rule-based conventions. No interactive review gate.

For every defaultable prop (booleans, enums/unions, string/number props with runtime impact, behavior props like `closable`, `disabled`, `multiple`, `asChild`), assign a concrete default value using this precedence:

1. **Extracted default** — if the source has an explicit default in `defaults: {...}`, use it
2. **Rule-based convention** — apply Step 3d baseline policy:
   - Booleans: `false`
   - Size props: `'md'` (or `'base'` for typography)
   - Variant props: first variant in the union (e.g. `'primary'`, `'info'`)
   - Form text/input fields: variant `'outlined'`
3. **`null`** — for intentional "no value" (e.g. `icon` where absence is meaningful)

Exclude from defaults: callbacks/handlers (`onX`), `className`, `style`, `children`, `React.ReactNode` content props.

Default value representation policy:
- Never write `undefined` as a default value.
- Use explicit concrete values (`'md'`, `true`, `false`, `0`, etc.).
- Use `null` for intentional "no value".

Write a `defaultReview` audit block into the spec:
- `status: 'approved'`
- `decisionSource: 'rule-based'`
- `overrides: {}` (user can override later)

### Step 3 — Apply class defaults

Use `_reference/animation-map.ts` to fill animation defaults based on `componentClass`.

Animation defaults are **spec-first**:
1. If extract mode finds explicit animation config in source (e.g. `spring({...})`, custom enter/exit object), write it to `animations[].defaultConfig`.
2. Else choose a named `animations[].defaultProfile`.
3. Keep `defaultPreset` only for backward compatibility.
4. Class defaults are fallback only when no explicit/defaultProfile is present.

Use `_reference/a11y-contract.ts` to fill accessibility defaults.

Use `_reference/default-conventions.ts` to fill token value defaults.

In extract mode, the extracted values take precedence over class defaults.

### Step 3d — Generic default guidance (baseline policy)

Use these conventions unless extraction/user decisions override them:
- Preserve original runtime behavior when migrating.
- Controlled props (`open`, `checked`, `value`) default to uncontrolled mode by default (do not force controlled false values).
- Text-bearing preview values should be visible in demos (avoid blank defaults).
- Prefer `size: 'md'` as baseline default for size-bearing components.
- Typography components default to `size: 'base'`.
- Do not force closed/inactive defaults (`open: false`) unless intentionally part of behavior.
- For animation, preserve explicit extracted config first, then profile, then preset/class fallback.
- Form text/input-like fields default to `variant: 'outlined'` (e.g. InputText/Textarea/NumberInput/Autocomplete/Select/Password/ColorInput) unless extraction/user override differs.
- If a component has a `size` prop and extracted default is missing/undefined, treat it as missing and apply the standard size fallback (`md`), except typography (`base`).

### Step 3b — Animation extraction requirements

In extract mode, do not reduce custom animation to generic presets:
- Capture the hook used (`useLifecycleAnimate`, `useInteractionAnimate`, etc.).
- Capture the config type.
- Capture the actual default behavior:
`defaultConfig` when explicit (preferred), otherwise `defaultProfile`.

Example (Avatar-style source):
- If source animates mount with spring scale `[0, 1]`, preserve that as explicit `defaultConfig`; do not normalize to `presence`.

### Step 3c — Behavioral extraction requirements

In extract mode, preserve component behavior that templates can accidentally erase:
- **Controlled triads:** capture exact keys into `controlledProps` (e.g. `open/defaultOpen/onOpenChange`).
- **Dismiss semantics:** if close sets internal hidden state, capture `dismissBehavior: 'hide'`; if close unmounts after exit animation, capture `dismissBehavior: 'unmountAfterExit'`.
- **Render passthrough contracts:** capture critical composition links in `renderContracts` (e.g. "simple API forwards `animate` to `Tooltip.Content`").

Do not reduce these to generic class defaults.

### Step 3e — Demo semantics extraction

For components where demo inference is ambiguous (especially compound/composable APIs):
- Set `childrenKind`:
  - `text` when `children` is direct display content
  - `composition` when `children` is primarily structural (sub-components/slots)
- Set `propRoles` for ambiguous props (`displayText`, `composition`, `data`, `behavior`).
- Add explicit `demo` contract when needed:
  - `controls`: playground controls shown in demo UI (debug/edit surface)
  - `samples`: consumer-first usage recipes (what a real user would copy/paste)
  - `bindings`: control-to-template mappings
  - `renderMode`: prefer `'grid'` when multiple samples should be visible simultaneously; use `'samples'` only when a selector is intentional
  - `referenceImages` (optional): visual targets (URLs/paths + notes) for QA alignment

Consumer-first demo policy:
- Treat `samples` as the primary demo intent (real usage, not prop exhaustiveness).
- Keep the full-prop playground separate via controls/bindings (usually with `playground.*` control IDs).
- Do not force every prop into consumer samples; include only props that matter for realistic usage comprehension.
- When both views are needed, define demo `sections` (`consumer`, `playground`) so preview and shown code stay aligned.

If `demo` is present, `/generate-demo` must use it over heuristics.

### Step 4 — Validate token values

Every `TokenDeclaration.value` must reference real tokens. Before emitting any token reference:

1. **Read `_reference/tokens-semantic.ts`** — verify every `var(--move-*)` semantic token exists in the exported constants.
2. **Read `_reference/tokens-primitive.ts`** — if referencing a primitive token (e.g. `--move-space-*`, `--move-radius-*`), verify it exists in the exported constants (`SPACING`, `RADII`, `TYPOGRAPHY`, etc.).
3. **Never invent token names** — if a token like `--move-space-7` or `--move-space-1-5` is not listed in the reference, it does not exist. Use the nearest value that does exist.
4. **Snap to nearest** — if no exact match, pick the closest token in the scale (e.g. `--move-space-6` or `--move-space-8` instead of a non-existent `--move-space-7`).

### Step 5 — Compute spec hash

```ts
import { createHash } from 'crypto';
const specHash = createHash('md5').update(JSON.stringify(spec)).digest('hex').slice(0, 8);
```

### Step 6 — Write the spec file

Write to `src/components/{category}/{Name}/{Name}.spec.ts`:

```ts
// {Name}.spec.ts — Component specification
// specHash: {hash}

export const spec = {
  schemaVersion: 6 as const,
  name: '{Name}',
  componentClass: '{class}' as const,
  // ... all fields
  defaultReview: {
    status: 'approved' as const,
    decisionSource: 'accept-all' as const,
    overrides: {},
  },
};
```

Note: Specs use inline `as const` assertions instead of importing from `_reference/spec-type.ts`. The spec-type file is a reference for skills, not a runtime dependency.

---

## Rules

1. **Auto-detect mode** — check for existing source before asking the user anything
2. **Extract mode: present for confirmation** — show the extracted spec and let the user correct before writing
2a. **Automatic defaults** — apply rule-based defaults without interactive review; user can override later
2b. **No implicit undefined defaults** — never write `undefined` as a default; use explicit value, `null`, or omit the key
3. **Create mode: never guess critical decisions** — ask the user if componentClass, category, slots, props, controlledProps, or dismissBehavior are unclear
4. **All token values must reference semantic tokens** — `var(--move-*)` from `_reference/tokens-semantic.ts`
5. **Snap to nearest token** — if a value has no exact semantic token, use the nearest primitive in the scale (e.g. `0.375rem` → `var(--move-space-1)`). Do not introduce hardcoded values when a close token exists.
6. **Use class defaults** — fill animation, a11y, and token defaults from reference files based on componentClass
6a. **Spec-first animation defaults** — preserve extracted component-specific animation config; class defaults are fallback only
7. **Spec must satisfy ComponentSpec** — the output must type-check against the interface
7a. **Behavior contracts are required when applicable** — if a component is controlled, include `controlledProps`; if dismissible, include `dismissBehavior`; if composition passthrough is behavior-critical, include `renderContracts`
8. **specHash in header comment** — compute and include for provenance tracking
9. **Deterministic output** — same inputs produce same output
10. **Size baseline** — when a component has a size prop and no stronger extracted/user default, choose `'md'`
10a. **Undefined extracted size is not a default** — if extraction yields `size: undefined` (or no size key), apply baseline size fallback rules
11. **Typography size baseline** — for typography components, choose `'base'` as default size unless extracted/user override differs
12. **Form field variant baseline** — for form text/input-like fields, choose `'outlined'` as default variant unless extracted/user override differs
13. **Default review audit required** — every spec must include `defaultReview` block with `decisionSource: 'rule-based'`
14. **`undefined` is not a default value** — defaults must be explicit concrete values, `null`, or omitted key
15. **Complete default coverage required** — every defaultable prop must get a default via rule-based assignment
16. **Composable children must be marked** — set `childrenKind: 'composition'` for structural children to avoid text-control misgeneration
17. **Prefer explicit demo contracts for compound components** — define `demo.controls/samples/bindings` when a single inferred preview is insufficient
18. **Use reference images when available** — include `demo.referenceImages` for components where visual fidelity matters
19. **Prefer separate demo spec file** — keep fast-changing demo controls/samples/fixtures in `{Name}.demo.spec.ts` when possible
