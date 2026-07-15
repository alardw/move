---
name: hook-create
description: "Scaffold a general-purpose React hook the Move way — a typed, JSDoc'd hook file, a colocated test (with a controllable mock for any browser observer it uses), and its barrel export. In the Move repo it also adds a Hooks-registry entry so the completeness check passes. For cross-cutting hooks; component-headless hooks live with their component."
user-invocable: true
argument-hint: "[useHookName] [one-line description]"
---

# Hook — Create

Scaffold one **general-purpose** (cross-cutting) hook: a small typed function with a clear
signature, a JSDoc contract, and a colocated test — plus the wiring that makes it discoverable and,
in the Move repo, documented. Hooks have almost no contract surface (no slots/variants/tokens/a11y),
so there is no spec and no multi-step lifecycle — this is a single scaffold-and-wire step.

**Use this for cross-cutting hooks** (viewport, state, refs, animation, theming — things that cross
component lines). A hook that only backs one component (`useAccordion`, `useCalendar`) is
**component-headless**: it lives beside that component and is documented on its page, not here.

---

## How to Run

**Input:** a hook name (`use` + PascalCase) and a one-line description of what it does. Optionally the
options and return shape.

**Output:**
- `{hooksDir}/{useName}.ts` — the hook (`hooksDir` defaults to `src/hooks`; in a consumer app use the
  project's hooks folder).
- `{hooksDir}/{useName}.test.tsx` — a colocated test.
- Barrel exports: add to `{hooksDir}/index.ts`, and re-export the value + its types from the package
  root barrel (`src/index.ts`) when the project has one.
- **Move repo only:** a `HookDoc` entry in `packages/docs/src/content/hooks.ts` (satisfies
  `hooks-registry.test.ts`).

**REFUSES** if the name isn't `use[A-Z]…`, or if the described behaviour belongs to a single component
(point the author at that component's folder instead).

---

## Process

### Step 1 — Write the hook
- Named React imports (`import { useEffect, useRef, useState } from 'react'`) — never `import React`.
- Export an `Options` interface and a `Return` interface/type; give the hook a generic over the element
  type when it returns a `ref` (`useHook<T extends Element = HTMLDivElement>`).
- **JSDoc is the contract:** one-paragraph summary of what it does and when to reach for it; note any
  browser-API dependency and its fallback.
- **SSR / jsdom safety:** if the hook touches a browser-only API (`IntersectionObserver`,
  `ResizeObserver`, `matchMedia`, `window`), guard with `typeof X === 'undefined'` and pick a safe
  default so nothing gated on it is permanently broken server-side.
- Prefer an idempotent `once`-style option for observers, and always clean up in the effect's return.

### Step 2 — Write the colocated test
- `@testing-library/react` (`render`, `act`, `screen`) + `vitest`.
- If the hook uses a browser observer, install a **controllable mock** in `beforeEach` that captures
  each instance's callback so the test can drive events on demand (jsdom's observers never fire), and
  restore the real global in `afterEach`. Use `globalThis`, not `global` (typed under the DOM lib).
- Attach the hook's `ref` to a real node via a tiny probe component — a bare `renderHook` never
  attaches the ref, so the observer never observes anything.
- Cover: the default behaviour, each option, cleanup/disconnect, and the SSR/unavailable fallback.

### Step 3 — Wire the barrels
- Add `export { useName }` + `export type { … }` to `{hooksDir}/index.ts`.
- Re-export both from the package root barrel (`src/index.ts`) so consumers import from the package
  name. (The `barrel-completeness` check only governs component TYPE exports; add hook exports by hand.)

### Step 4 — Document it (Move repo)
- Add a `HookDoc` to `HOOKS_REGISTRY` in `packages/docs/src/content/hooks.ts`: `name`, one-line
  `signature`, one-sentence `summary`, a `category` from `HookCategory`. If the hook ships with a paired
  wrapper component, set `companion`/`companionSummary`/`example`.
- Run `packages/docs` `hooks-registry.test.ts` — it FAILS if a cross-cutting hook is exported from the
  barrel but missing from the registry, or if an entry no longer resolves.

---

## Rules
1. **Cross-cutting only** — component-headless hooks belong with their component, not here.
2. **`use[A-Z]` name** or refuse.
3. **JSDoc contract + typed Options/Return** — every hook is self-documenting.
4. **SSR/jsdom-safe** — guard browser APIs and clean up effects.
5. **Colocated test with a real ref + controllable observer mock** — never a no-op.
6. **Wire every barrel** — local + root; a hook that isn't re-exported has no public specifier.
7. **Register it** (Move repo) — an undocumented cross-cutting hook fails `hooks-registry.test.ts`.
