---
name: generate-source
description: "Generate component .tsx, .module.css, index.ts from a .spec.ts. Refuses without spec."
user-invocable: true
argument-hint: "[ComponentName]"
---

# Generate — Component Code Generator

Generate component source files from a `.spec.ts` specification. **REFUSES without a spec file.**

---

## How to Run

**Input:** A component name (e.g. "Badge", "Checkbox").

**Output:** Generated files written to disk:
- `{Name}.tsx` — component implementation
- `{Name}.module.css` — CSS module styles
- `index.ts` — barrel exports
- `use{Name}.ts` — headless hook (if spec declares `hasHook: true`)
- `src/index.ts` — updated with component exports

**REFUSES if:** `{Name}.spec.ts` does not exist in the component directory.

---

## Process

### Step 1 — Locate and read spec

Find `src/components/{category}/{Name}/{Name}.spec.ts`. If not found, REFUSE and tell the user to run `/spec {Name}` first.

Read the spec file and extract the `ComponentSpec` object.

Before generating templates, identify behavior-critical contracts from spec:
- `controlledProps`
- `dismissBehavior`
- `renderContracts`

These contracts override generic class-template defaults when they conflict.

### Step 2 — Load reference contracts

Read these files for generation rules:

| File | Purpose |
|------|---------|
| `references/component/factory-contract.md` | `withMoveComponent` signature, setup pattern, render pattern |
| `references/component/css-contract.md` | Token placement, data-attribute selectors, animation prohibition |
| `references/component/engine-api.ts` | Available imports (engine, animation, infrastructure) |
| `references/component/animation-map.ts` | Animation patterns and presets |
| `references/component/infrastructure.ts` | Infrastructure imports (useResolvedIcon, etc.) — read if spec uses built-in icons |

### Step 3 — Generate component file (`{Name}.tsx`)

Follow the factory contract exactly:

1. `'use client'` directive at line 1 (must be first — bundlers require it before any other statement)
2. Provenance comment on line 2: `// Generated from {Name}.spec.ts (schemaVersion: {N}, specHash: {XXXX})`
3. Imports from `../../../engine` (factory, hooks, types)
4. Imports from `../../../animation` (functions, presets, types) if spec has animations
5. Radix import if spec declares `radixPrimitive`
6. CSS module import
7. Type exports (variant, size, props)
8. Props interface `extends Record<string, unknown>`
9. Labels type and prop (if spec has `labels`): generate `{Name}Labels` type with all keys, `DEFAULT_LABELS` const with defaults, add `labels?: Partial<{Name}Labels>` prop, merge with defaults in setup
10. `withMoveComponent` call with:
    - `name` from spec
    - `styles` from CSS module
    - `slots` from spec
    - `defaults` from props with defaults
    - `moveProps` from props marked `moveSpecific: true` (excluding those in defaults)
    - `subComponents` if compound
11. `setup()` function with:
    - Animation wiring (see Step 3b)
    - Headless hook call (if `hasHook`)
    - Event handler merging (animation handlers + user handlers)
    - Behavior contract preservation (controlled triads, dismiss flow, passthrough contracts)
    - `render()` following the exact sp/cx/attrs pattern from factory-contract.md

### Step 3a — Preserve extracted behavior contracts

Do not let template simplification remove behavior captured by spec:

1. **Controlled triads**
- If `spec.controlledProps` exists, generated source MUST expose and wire these keys exactly.
- Never drop `default*` keys from a controlled API unless spec explicitly removes them.

2. **Dismiss semantics**
- If `spec.dismissBehavior === 'hide'`, generated source MUST maintain internal visibility state on dismiss.
- If `spec.dismissBehavior === 'unmountAfterExit'`, generated source MUST keep exit animation + unmount sequence.
- If `spec.dismissBehavior === 'none'`, close actions may be external callback only.

3. **Render contracts**
- Every `spec.renderContracts[]` rule is mandatory.
- Example: if contract says "simple API forwards animations to content", `TooltipSimple` must pass `animations` into `Tooltip.Content`.

Generation is invalid if any behavior contract is missing in output.

### Step 3b — Animation wiring

When the spec declares `animations`, use the unified `useAnimations` hook.

#### Step 1: Import from animation barrel

Always import from `'../../../animation'` — never sub-paths.

```tsx
// Core orchestrator (always needed for animated components)
import { useAnimations, resolveAnimationsConfig } from '../../../animation';
// Presets (pick what's needed for defaults)
import { scaleUp, scaleDown, popIn, popOut, fadeIn, fadeOut } from '../../../animation';
// Springs (if needed in inline configs)
import { snappy, poppy } from '../../../animation';
// Types
import type { Animation, AnimationTrigger, AnimationState } from '../../../animation';
// Note: moveAnimate, animateDimension, staggerAnimate are used internally by useAnimations.
// Do NOT import them directly — only Carousel uses moveAnimate directly (imperative scroll API).
```

#### Step 2: Define defaults and wire

Every animated component follows the same pattern:

1. Define `DEFAULT_ANIMATIONS: AnimationTrigger[]` with trigger-sequence pairs
2. Define `STATES: AnimationState[]` if using state triggers
3. Call `resolveAnimationsConfig(DEFAULT_ANIMATIONS, props.animations)` to merge user overrides
4. Call `useAnimations(config, refs, states?)` to get handlers and runExit
5. Spread `handlers.SlotName` event props onto JSX elements

```tsx
// Props
animations?: AnimationTrigger[] | false;

// Defaults
const DEFAULT_ANIMATIONS: AnimationTrigger[] = [
  { trigger: 'Root.hover', sequence: [{ preset: 'scaleUp' }] },
  { trigger: 'Root.press', sequence: [{ preset: 'scaleDown' }] },
];

// In setup():
const animConfig = resolveAnimationsConfig(DEFAULT_ANIMATIONS, props.animations);
const refs = { Root: rootRef };
const { handlers } = useAnimations(animConfig, refs);

// In render():
onMouseEnter={(e) => { handlers.Root?.onMouseEnter?.(); userOnMouseEnter?.(e); }}
onMouseLeave={(e) => { handlers.Root?.onMouseLeave?.(); userOnMouseLeave?.(e); }}
onMouseDown={(e) => { handlers.Root?.onMouseDown?.(); userOnMouseDown?.(e); }}
onMouseUp={(e) => { handlers.Root?.onMouseUp?.(); userOnMouseUp?.(e); }}
```

#### Pattern: State triggers (toggle, expand)

For components that respond to `data-state` changes:

```tsx
const STATES: AnimationState[] = [
  { name: 'checked', slot: 'Root', source: 'data-state', value: 'checked' },
  { name: 'unchecked', slot: 'Root', source: 'data-state', value: 'unchecked' },
];

const DEFAULT_ANIMATIONS: AnimationTrigger[] = [
  { trigger: 'checked', sequence: [{ target: 'indicator', animation: { opacity: { to: 1 }, scale: { to: 1, ease: poppy } } }] },
  { trigger: 'unchecked', sequence: [{ target: 'indicator', animation: { opacity: { to: 0 }, scale: { to: 0.5 } } }] },
];

const { handlers } = useAnimations(animConfig, refs, STATES);
```

#### Pattern: Lifecycle triggers (enter/exit)

```tsx
const DEFAULT_ANIMATIONS: AnimationTrigger[] = [
  { trigger: 'Root.enter', sequence: [{ animation: { opacity: { from: 0, to: 1 }, y: { from: -8, to: 0 } } }] },
  { trigger: 'Root.exit', sequence: [{ animation: { opacity: { to: 0 }, y: { to: -8 } } }] },
];

const { runExit } = useAnimations(animConfig, refs);
// Exit: runExit().then(() => onCloseComplete?.());
```

#### Pattern: Deps triggers (value-reactive animations)

For animations that fire when a value changes (not on mount or state attribute):

```tsx
// Sidebar: animate width on collapse change
const widthConfig: AnimationTrigger[] = useMemo(() => [{
  trigger: 'width-change', deps: [collapsed],
  sequence: [{ target: 'Root', animation: { width: { to: '$targetWidth', ease: sidebarEase } } }],
  vars: (el: HTMLElement) => {
    const styles = getComputedStyle(el);
    el.style.width = collapsed ? styles.getPropertyValue('--expanded') : styles.getPropertyValue('--collapsed');
    return { targetWidth: collapsed ? collapsedWidth : expandedWidth };
  },
  onComplete: () => { el.style.width = ''; },
}], [collapsed]);
useAnimations(widthConfig, refs);

// Conditional sequence — skip when condition is false
{ trigger: 'icon-open', deps: [isOpening],
  sequence: isOpening ? [{ target: 'Icon', animation: { rotate: { to: 180 } } }] : false }
```

#### Pattern: Pause/resume (countdown, progress)

```tsx
const { pauseAll, resumeAll } = useAnimations(progressConfig, progressRefs);
// Wire to DOM events: mouseenter → pauseAll(), mouseleave → resumeAll()
```

#### Pattern: Loop/alternate (pulse, skeleton)

```tsx
{ trigger: 'Pulse.enter', sequence: [{
  target: 'Pulse',
  animation: { opacity: { from: 1, to: 0.4, duration: 750, ease: 'inOutQuad' }, loop: true, alternate: true },
}] }
```

#### Pattern: onComplete callbacks

```tsx
// Trigger-level: fires after all steps complete
{ trigger: 'item-exit', deps: [exitReady], sequence: [...], onComplete: () => removeItem() }

// Step-level: fires after individual step
{ target: 'Content', fn: 'animateDimension', animation: config, onComplete: () => clearOverflow() }
```

#### Pattern: Complex sub-components (popup, overlay)

For compound components where sub-components need direct animation control, the root defines default triggers and passes config via context. Sub-components filter by trigger prefix.

#### Pattern: Sliding indicator

Uses `animatePosition` with state triggers and dynamic Active ref:
```tsx
const { indicatorRef } = useSlidingIndicator({
  containerRef: internalRef,
  activeSelector: '[data-state="on"]',
});
```

### Step 3c — Surface wiring

If `spec.surface` is defined, add `data-surface={spec.surface.level}` to the element rendered by the slot named `spec.surface.slot`. This sets the shadow context for children. Example:
```tsx
<div {...sp('content')} data-surface="subtle">
```

### Step 4 — Generate CSS module (`{Name}.module.css`)

Follow css-contract.md exactly:

1. Component tokens on `.root` (from spec `tokens`)
2. Base styles on `.root`
3. Variant styles via `[data-variant='...']` (from spec `variants`)
4. Size styles via `[data-size='...']` (from spec `sizes`)
5. State styles via `[data-state='...']` (if applicable)
6. **All anatomy data-attributes** — generate CSS selectors for every `dataAttributes` entry in `spec.anatomy` (recursively through children). This includes `data-variant`/`data-size`/`data-state` (handled above) AND additional attributes like `data-placement`, `data-tail`, etc.
   - **Enum attributes** (corresponding to union-type props like `placement: 'start' | 'end'`): generate `[data-attr='value']` selectors for each value, with `:not()` fallback for the default.
   - **Boolean attributes** (corresponding to boolean props like `tail`): generate `[data-attr]` presence selectors for the truthy state. Style the visual effect of the boolean (e.g. zeroing a border-radius, showing/hiding a pseudo-element).
   - **Compound selectors**: when two data-attributes interact visually (e.g. `[data-tail][data-placement='start']` vs `[data-tail][data-placement='end']`), generate compound selectors.
   - **Reference original**: if `original-components/{category}/{Name}/{Name}.module.css` exists, match its visual behavior for all data-attribute selectors. This is the source of truth for what each attribute should look like.
7. Focus/disabled patterns
8. Sub-slot styles (from spec `slots`)
9. **Token validation (mandatory)** — before emitting any `var(--move-*)` reference in CSS, verify the token exists:
   - Read `references/component/tokens-semantic.ts` for semantic tokens (`--move-spacing-*`, `--move-rounded-*`, etc.)
   - Read `references/component/tokens-primitive.ts` for primitive tokens (`--move-space-*`, `--move-radius-*`, etc.)
   - **Never invent tokens** — if a token is not in the reference files, it does not exist. Use the nearest real token in the scale.
   - Example: `--move-space-7` does not exist → use `--move-space-6` or `--move-space-8`. `--move-space-1-5` does not exist → use `--move-space-1` or `--move-space-2`.

**Provenance header:**
```css
/* Generated from {Name}.spec.ts (schemaVersion: {N}, specHash: {XXXX}) */
```

### Step 5 — Generate index.ts

```ts
// Generated from {Name}.spec.ts (schemaVersion: {N}, specHash: {XXXX})
export { {Name} } from './{Name}';
export type { {Name}Props, /* variant/size types */ } from './{Name}';
```

If hook exists:
```ts
export { use{Name} } from './use{Name}';
export type { Use{Name}Options, Use{Name}Return } from './use{Name}';
```

### Step 6 — Generate headless hook (if applicable)

If `spec.hasHook === true`, generate `use{Name}.ts`:

1. Import `useControlledState` from engine
2. Options interface with controlled state props
3. Return interface with state + actions
4. Hook implementation using `useControlledState`

### Step 7 — Update src/index.ts

Add exports for the component, types, and hook (if any) to `src/index.ts`.

---

## Class-specific templates

The `componentClass` from the spec determines the generation template:

| Class | Key template features |
|-------|----------------------|
| `presentational` | No animation, no hooks, single slot, simple render |
| `interactive` | Event triggers (`Root.hover`/`Root.press`), event handler merging, optional `asChild` |
| `input_toggle` | State triggers (`checked`/`unchecked` via MutationObserver), headless hook, hidden input for form |
| `input_popup` | Lifecycle triggers + `animateDimension` + `staggerAnimate`, Radix primitive wrapping |
| `input_plain` | Native input element, label association, form integration |
| `disclosure` | State triggers (`open`/`close`) + `animateDimension`, compound with trigger/content |
| `overlay_layer` | Lifecycle triggers + `Presence`, Radix Dialog, focus trap, `role="dialog"` |
| `overlay_popup` | Lifecycle triggers + `Presence`, Radix Popover/Dropdown |
| `display` | Varies — use spec's specific animation/structure decisions |

---

## Using componentDeps and infrastructure

When a spec declares `componentDeps`, read `references/component/infrastructure.ts` for available APIs and import patterns. Use the infrastructure utilities where the component's behavior requires them (e.g. rendering icons, accessing theme context). The reference file documents what each module exports, how to import it, and when to use it.

---

## Rules

1. **REFUSE without spec** — never generate without `{Name}.spec.ts`
2. **Follow factory-contract.md exactly** — sp/cx/attrs pattern, render order
3. **Follow css-contract.md exactly** — tokens on .root, data-attributes, no CSS animations
4. **Provenance headers on all files** — `Generated from {Name}.spec.ts (schemaVersion: N, specHash: XXXX)`
5. **All token values reference semantic tokens** — as specified in the spec
6. **Props interface extends Record<string, unknown>** — for every factory-based component
7. **No hardcoded values in CSS** — always `var(--move-*)` for colors/spacing/radius
8. **Use infrastructure when needed** — if the spec has `componentDeps`, read `references/component/infrastructure.ts` and use the appropriate imports in the generated source
9. **Always merge className and style** — every slot's `cx()` call MUST include `props.className` (for root) or the equivalent prop, and every slot's style MUST spread `props.style`. This is not optional — without it, user className/style passthrough is broken. Pattern: `className={cx('slot', props.className, spClass)}` and `style={{ ...props.style, ...spStyle }}`
10. **Layout props use data-attributes, not inline styles** — props like gap, align, justify, direction, wrap MUST be rendered as `data-*` attributes (e.g. `data-gap={gap}`, `data-align={align}`) with corresponding CSS selectors in the module. Never use JS maps (GAP_MAP, ALIGN_MAP, etc.) to set inline styles for layout properties. This keeps all visual output in CSS and avoids React rendering quirks. See css-contract.md "Layout prop selectors" section.
11. **SVG-based Radix sub-components** — Radix Arrow components render SVG elements. Use `SVGSVGElement` as the TRef generic: `withMoveComponent<'arrow', ArrowProps, SVGSVGElement>`. The factory supports `TRef extends Element`, not just HTMLElement.
12. **Animation wiring is mandatory** — if the spec has `animations`, the generated component MUST wire using `useAnimations` + `resolveAnimationsConfig`. A spec with `animations` but no animation code in the output is a generation failure. Follow Step 3b patterns exactly.
13. **Use `resolveAnimationsConfig(DEFAULT_ANIMATIONS, props.animations)` for all default merging** — the `useAnimations` hook handles cancellation refs internally.
14. **Behavior parity over template convenience** — never remove controlled props, dismiss flow, or explicit passthrough contracts to fit a simpler class template.
15. **Compound components MUST include `Root` self-reference** — when exporting a compound component via `Object.assign`, always include `Root: RootComponent` in the assignment. Without this, `<Component.Root>` resolves to `undefined` and crashes at runtime. Pattern: `export const Name = Object.assign(NameRoot, { Root: NameRoot, Item, Trigger, Content })`.
16. **Non-factory sub-components MUST spread `...rest`** — any sub-component written as a manual `forwardRef` wrapper (not using `withMoveComponent`) MUST destructure `...rest` from props and spread it onto the underlying element. Factory-based components handle this automatically via `attrs`, but manual wrappers silently drop `data-testid`, `aria-*`, and other HTML attributes without `...rest`. Pattern: `({ children, className, ...rest }, ref) => <Primitive {...rest} ref={ref} className={className}>{children}</Primitive>`.
17. **Portaled content MUST set `font-family`** — any CSS class applied to content rendered inside a Radix Portal (`Dialog.Portal`, `Popover.Portal`, `Tooltip.Portal`, etc.) MUST include `font-family: var(--move-font-body)`. Portaled content renders at `document.body`, outside the `[data-move-theme]` scope, so inherited font-family from the theme wrapper does not reach it.
18. **Barrel-only imports** — ALWAYS import from `'../../../engine'` and `'../../../animation'`, NEVER from sub-paths like `'../../../engine/types'`, `'../../../animation/hooks'`, `'../../../animation/easings'`, etc. Both modules re-export everything from their barrel `index.ts`. Read `references/component/engine-api.ts` IMPORT_PATTERNS for canonical import lines.
19. **`prefersReducedMotion()` is handled inside `moveAnimate`/`useAnimations`** — no need to check manually in generated components. Never import `moveAnimate` directly — use `useAnimations` for all animation wiring.
