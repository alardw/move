# Generation Issues Log

Tracks real component and generation pipeline issues found during the full `/generate-all` run across ~65 components. These should inform skill improvements to `/generate-source`, `/generate-test`, `/generate-demo`, and `/validate`.

---

## Category A: Import Path Errors (`/generate-source`)

### A1. Engine sub-path imports break at runtime

**Affected:** Nearly all components on first generation pass
**Severity:** BLOCKER (compile failure)

**Problem:** Generated source files used sub-path imports that don't exist in the new architecture:
- `import type { SlotPropsMap } from '../../../engine/types'` → should be `'../../../engine'`
- `import { useControlledState } from '../../../engine/useControlledState'` → should be `'../../../engine'`
- `import { useMergedRef } from '../../../engine/useMergedRef'` → should be `'../../../engine'`

**Root cause:** The `/generate-source` skill's import templates reference internal engine sub-paths from the original-components architecture. The new engine re-exports everything from the barrel `engine/index.ts`.

**Skill fix needed:** Update `_reference/engine-api.ts` and `/generate-source` templates to always import from `'../../../engine'`, never sub-paths.

---

### A2. Animation sub-path imports break at runtime

**Affected:** All components with animation hooks
**Severity:** BLOCKER (compile failure)

**Problem:** Generated source used:
- `import { ... } from '../../../animation/types'`
- `import { ... } from '../../../animation/hooks'`
- `import { ... } from '../../../animation/easings'`
- `import { ... } from '../../../animation/utils'`

All should be `'../../../animation'`.

**Skill fix needed:** Update `_reference/animation-map.ts` import patterns. Single barrel import for animation.

---

### A3. Animation type/hook renames not applied

**Affected:** All components migrated from original-components
**Severity:** BLOCKER (compile failure)

**Problem:** Original components used type/hook names that were renamed in the new architecture:

| Original | New |
|----------|-----|
| `ContentAnimate` | `ExpandAnimate` |
| `ElementAnimate` | `InteractionAnimate` |
| `LayerAnimate` | `LifecycleAnimate` |
| `PopupAnimate` | `LifecycleAnimate` |
| `usePopupAnimation` | `useLifecycleAnimate` |
| `useLayerAnimation` | `useLifecycleAnimate` |
| `useInteractiveAnimate` (sometimes) | `useInteractionAnimate` |

**Skill fix needed:** Add a rename mapping table to `_reference/animation-map.ts` so `/generate-source` always uses new names when reading from original-components.

---

### A4. Icon/infrastructure import path wrong

**Affected:** Components using built-in icons (Alert, Stepper, Breadcrumb, Collapsible, etc.)
**Severity:** BLOCKER (compile failure)

**Problem:** Generated source imported from the old location:
- `import { useResolvedIcon } from '../../core/Icon/useResolvedIcon'`

Should be:
- `import { useResolvedIcon } from '../../../infrastructure/Icon'`

**Skill fix needed:** Update `/generate-source` to read `_reference/infrastructure.ts` for correct import paths when `componentDeps` includes Icon.

---

## Category B: Component Structure Errors (`/generate-source`)

### B1. Compound component missing `Root` self-reference in Object.assign

**Affected:** Accordion (discovered), potentially others
**Severity:** BLOCKER (runtime crash: `Element type is invalid: expected a string but got: undefined`)

**Problem:** Compound components exported as:
```tsx
export const Accordion = Object.assign(AccordionRoot, {
  Item, Header, Trigger, Content
});
```
Missing `Root: AccordionRoot`. When consumers use `<Accordion.Root>`, it's `undefined`.

**Fix applied:** Added `Root: AccordionRoot` to all compound component Object.assign exports.

**Skill fix needed:** The `/generate-source` compound template MUST always include `Root: RootComponent` in the Object.assign. Add this as a mandatory check.

---

### B2. Non-factory sub-components missing `...rest` prop spread

**Affected:** DatePicker.Content, potentially other manually-wrapped Radix sub-components
**Severity:** HIGH (HTML attributes like `data-testid`, `aria-*` silently dropped)

**Problem:** Sub-components written as manual `forwardRef` wrappers (not using `withMoveComponent`) destructure specific props but don't spread `...rest`. The factory-based components handle this automatically via `attrs`, but non-factory components must do it explicitly.

**Fix applied:** Added `...rest` destructuring and spread on DatePicker.Content.

**Skill fix needed:** `/generate-source` should have a rule: "Every non-factory sub-component that wraps a Radix primitive MUST spread `...rest` for HTML attribute passthrough."

---

### B3. Timeline vertical line alignment gap

**Affected:** Timeline
**Severity:** MEDIUM (visual regression: visible gap between timeline items)

**Problem:** The vertical line connecting timeline items has a visible gap at the top of each item. The `.line` element is a flex sibling placed **after** the `.bullet` in a column flex container (`.separator`). The `.bullet` has `margin-top: 5px`, creating a 5px offset. Since `.line` has `flex: 1` it only fills the space **below** the bullet, leaving a gap between the previous item's line and the current bullet.

The `.bullet` has `position: relative; z-index: 1`, suggesting the original design intent was for the line to run behind the bullet, but this isn't actually implemented — the line is still in normal flex flow.

**Root cause:** This issue exists in the **original component** (`original-components/data/Timeline/Timeline.module.css`) — the generated CSS is byte-for-byte identical. The `/generate-source` skill faithfully reproduced the original bug.

**Proposed fix for `/generate-source`:** When generating CSS for timeline-pattern components (vertical separator with bullet + connecting line), the `.line` element should use `position: absolute; top: 0; bottom: 0;` running the full height of the `.separator` container, with the `.bullet` rendered on top via `z-index`. This eliminates the flex-sibling gap. The `.separator` needs `position: relative` to anchor the absolute line.

```css
/* Fix pattern */
.separator {
  position: relative; /* anchor for absolute line */
  display: flex;
  flex-direction: column;
  align-items: center;
}
.line {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: var(--move-timeline-line-width);
}
.bullet {
  position: relative;
  z-index: 1; /* renders on top of line */
}
```

**Note:** Since the original had this same bug, this is an improvement over the original, not a regression. Consider adding a "known original-component bugs" reference that `/generate-source` can consult to fix known issues during generation rather than faithfully reproducing them.

---

### B4. Portaled content missing font-family (was B3)

**Affected:** Dialog, Dropdown, Popover, Toast, DatePicker — any component using Radix Portal
**Severity:** MEDIUM (visual regression: text renders in browser default font)

**Problem:** Portaled content renders outside the `[data-move-theme]` scope, so it doesn't inherit `font-family` from the theme CSS. Text appears in the browser default serif/sans-serif.

**Fix applied:** Added `font-family: var(--move-font-body);` to portaled content CSS classes.

**Skill fix needed:** `/generate-source` CSS template should automatically add `font-family: var(--move-font-body)` to any slot that renders inside a Radix Portal (Content slots in overlay components).

---

## Category C: Test Generation Errors (`/generate-test`)

### C1. Radix Tooltip renders duplicate role="tooltip" elements in jsdom

**Affected:** Tooltip tests
**Severity:** MEDIUM (test failures)

**Problem:** Radix Tooltip renders multiple elements with `role="tooltip"` in jsdom. `screen.getByRole('tooltip')` and `screen.getByText(...)` fail with "found multiple elements".

**Skill fix needed:** `/generate-test` for Radix Tooltip components should use `screen.getAllByRole('tooltip')` and select the last element, or query with `[data-state="open"]`.

---

### C2. Nested interactive elements in compound API tests

**Affected:** Tooltip, Popover, Dropdown — any Radix component where Trigger renders as `<button>`
**Severity:** MEDIUM (DOM warnings prevent rendering in jsdom)

**Problem:** Tests generate `<Tooltip.Trigger><button>T</button></Tooltip.Trigger>` creating nested `<button>` elements. Radix Trigger renders as `<button>` by default. In jsdom this causes "In HTML, `<button>` cannot be a descendant of `<button>`" warning and content may not render.

**Skill fix needed:** `/generate-test` compound API tests should always use `asChild` on Trigger sub-components: `<Tooltip.Trigger asChild><button>...</button></Tooltip.Trigger>`.

---

### C3. Tooltip compound Content tests timeout in jsdom

**Affected:** Tooltip Content sub-component tests (data-side, data-state, data-align, className/style)
**Severity:** HIGH (5 tests permanently failing)
**Status:** UNRESOLVED — needs investigation

**Problem:** Tooltip compound Content tests using `<Tooltip.Root open>` with the compound API timeout in jsdom. The tooltip content element never appears in the DOM. However, the Simple API (`<Tooltip label="..." open>`) works fine with the same Provider setup, and one compound test ("is rendered in a portal") passes.

**Root cause hypothesis:** Possibly related to anime.js `useLayoutEffect` in TooltipContent setting `opacity: 0` and the animation never completing in jsdom (no RAF). The Simple API may work because Radix internally handles rendering differently.

**Investigation needed:** Debug whether the DOM element is created but not queryable, or whether Radix prevents rendering entirely. May need to mock anime.js in tests, or restructure the TooltipContent animation to not block initial render.

---

### C4. Radix positioning attributes unreliable in jsdom

**Affected:** Tooltip, Popover, DatePicker — any component using Radix positioning
**Severity:** LOW (tests can be adjusted)

**Problem:** `data-side` and `data-align` attributes depend on Radix's positioning engine which requires a real layout engine. In jsdom, these may not be set or may have default values regardless of the `side`/`align` props passed.

**Skill fix needed:** `/generate-test` should avoid asserting specific `data-side` values in jsdom. Instead, just verify the prop is accepted without error.

---

### C5. Toast act() warnings

**Affected:** Toast tests
**Severity:** LOW (warnings only, tests still pass)

**Problem:** Toast state updates trigger React act() warnings: "An update to ToastViewport inside a test was not wrapped in act(...)".

**Skill fix needed:** `/generate-test` for imperative API components (Toast) should wrap state-triggering calls in `act()`.

---

## Category D: Demo Generation Issues (`/generate-demo`)

### D1. React hooks called inside demo `render` function (Rules of Hooks violation)

**Affected:** CalendarDemo (confirmed), potentially any demo with stateful consumer samples
**Severity:** BLOCKER (component crashes on render, entire demo app can break on section switch)

**Problem:** The CalendarDemo's consumer section `render` function calls `useState` at line 28:

```tsx
sections: [
  {
    id: 'consumer',
    label: 'Usage',
    render: () => {
      const [value, setValue] = useState<Date | undefined>(undefined);  // VIOLATION
      return ( ... );
    },
  },
]
```

The demo App calls section renders as **regular functions** (`activeSection.render(propsState)` at `App.tsx:405`), not as React components. React hooks can only be called inside React function components or custom hooks. When this render function is called as a plain function inside App's render cycle, React sees the hooks as belonging to `App`, not to a separate component. Switching between sections changes the number of hooks App "calls", triggering:

```
Error: Rendered more hooks than during the previous render
```

**Error trace:**
```
at Object.render (CalendarDemo.tsx:28:35)
at App (App.tsx:405:46)
```

**Skill fix needed for `/generate-demo`:**

1. **Hard rule:** Demo `render` functions (both top-level and inside `sections[].render`) must **NEVER** call React hooks (`useState`, `useEffect`, `useMemo`, `useRef`, `useCallback`, etc.). They receive props and return JSX only.

2. **When a demo needs local state** (e.g. controlled Calendar with `value`/`onValueChange`), use one of these patterns instead:

   **Pattern A — Wrapper component (preferred):** Extract the stateful demo into a named React component defined at module scope, then reference it from the render function:
   ```tsx
   // Module scope — this is a real React component, hooks are legal here
   function CalendarConsumerDemo() {
     const [value, setValue] = useState<Date | undefined>(undefined);
     return (
       <Calendar.Root mode="single" value={value} onValueChange={setValue}>
         <Calendar.Nav />
         <Calendar.Grid />
       </Calendar.Root>
     );
   }

   // In the DemoDefinition:
   sections: [{
     id: 'consumer',
     render: () => <CalendarConsumerDemo />,  // No hooks in render — just JSX
   }]
   ```

   **Pattern B — Uncontrolled demo:** If the component supports uncontrolled mode (e.g. `defaultValue`), use that instead of `value`+`onChange`:
   ```tsx
   render: () => (
     <Calendar.Root mode="single">
       <Calendar.Nav />
       <Calendar.Grid />
     </Calendar.Root>
   )
   ```

3. **Detection heuristic for `/generate-demo`:** Before writing, scan the generated `render` function body for any of: `useState`, `useEffect`, `useMemo`, `useRef`, `useCallback`, `useReducer`, `useContext`, `useLayoutEffect`. If found, refactor using Pattern A.

4. **Add to `/generate-demo` SKILL.md rules:** "Rule 12: Demo render functions must NEVER call React hooks. If a demo sample needs local state, extract it into a named React component at module scope and render that component from the render function."

---

## Category E: Pipeline/Orchestration Issues

### E1. Concurrent barrel file writes from parallel agents

**Affected:** `src/index.ts`, `demo/src/demos/generated/index.ts`
**Severity:** MEDIUM (requires manual reconciliation)

**Problem:** When running `/generate-all` for multiple components in parallel via agents, multiple agents modify the same barrel files (`src/index.ts`, demo `index.ts`). The last agent to write wins, potentially losing exports added by other agents.

**Fix applied:** Manual reconciliation of barrel files after all agents completed.

**Skill fix needed:** Either (a) barrel updates should be deferred to a final consolidation step, or (b) agents should use atomic append patterns instead of full file rewrites.

---

### E2. Media component dependencies on shared utilities

**Affected:** VideoPlayer, AudioPlayer (depend on `_shared/parseVTT.ts`, `_shared/PlayerSettingsMenu.tsx`)
**Severity:** MEDIUM (generation order matters)

**Problem:** Some media components share utilities in `src/components/media/_shared/`. These must be generated before the components that depend on them. The generation pipeline doesn't have explicit dependency ordering for shared utilities.

**Skill fix needed:** `/generate-source` should detect `_shared/` imports in original-components and generate shared utilities first.

---

## Summary

| Category | Count | Blockers |
|----------|-------|----------|
| A. Import paths | 4 | 4 (all compile failures) |
| B. Component structure | 4 | 1 (Root self-ref) |
| C. Test generation | 5 | 0 (test-only) |
| D. Demo generation | 1 | 1 (hooks in render) |
| E. Pipeline | 2 | 0 |
| **Total** | **16** | **6** |

The most impactful fixes for skill improvement are:
1. **A1-A4:** Fix all import path templates — eliminates 4 BLOCKER issues
2. **B1:** Add `Root` self-reference rule to compound template — eliminates 1 BLOCKER
3. **D1:** Add "no hooks in render" rule to `/generate-demo` — eliminates 1 BLOCKER (app crash)
4. **C2-C3:** Add Radix testing patterns reference — fixes multiple test failures
5. **B3:** Timeline line alignment fix — improves visual output over original
