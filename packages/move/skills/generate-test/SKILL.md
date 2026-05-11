---
name: generate-test
description: "Generate test file for a Move component from spec and source."
user-invocable: true
argument-hint: "[ComponentName]"
---

# Generate Test — Component Test Generator

Generate a test file for a Move component. Uses the spec's `testing` section for test expectations and the source for implementation details.

---

## How to Run

**Input:** A component name (e.g. "Badge", "Checkbox").

**Output:** `{Name}.test.tsx` written next to the component.

---

## Process

### Step 1 — Locate and read files

Read in this order:
1. `src/components/{category}/{Name}/{Name}.spec.ts` — testing expectations (optional but preferred)
2. `src/components/{category}/{Name}/{Name}.tsx` — component implementation
3. `src/components/{category}/{Name}/use{Name}.ts` — headless hook (if exists)
4. `references/component/radix-testing-patterns.ts` — if component wraps a Radix primitive (check for `@radix-ui` imports in source)

### Step 2 — Determine test categories

Based on the component's `componentClass` (from spec or inferred from source):

| Class | Test categories |
|-------|----------------|
| `presentational` | Renders, variants, sizes, className/style passthrough, sp merging |
| `interactive` | + click handler, disabled state, keyboard (Space/Enter), animations prop |
| `input_toggle` | + controlled/uncontrolled state, toggle behavior, form submission, aria-checked |
| `input_popup` | + open/close, keyboard navigation, aria-expanded, selection |
| `input_plain` | + value input, controlled/uncontrolled, label association, form submission |
| `disclosure` | + expand/collapse, keyboard navigation, aria-expanded, multiple items |
| `overlay_layer` | + open/close, focus trap, escape to close, aria-modal, backdrop |
| `overlay_popup` | + trigger/content, open/close, keyboard, aria-expanded, outside click |
| `display` | + content rendering, data display, responsive behavior |

### Step 3 — Generate test file

Write `src/components/{category}/{Name}/{Name}.test.tsx`:

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { {Name} } from './{Name}';

describe('{Name}', () => {
  // === Rendering ===
  describe('rendering', () => {
    it('renders without crashing', () => { ... });
    it('forwards ref to root element', () => { ... });
    it('passes className to root', () => { ... });
    it('passes style to root', () => { ... });
    it('spreads HTML attributes', () => { ... });
  });

  // === Variants (if applicable) ===
  describe('variants', () => {
    it('renders default variant', () => { ... });
    it('sets data-variant attribute', () => { ... });
  });

  // === Sizes (if applicable) ===
  describe('sizes', () => {
    it('renders default size', () => { ... });
    it('sets data-size attribute', () => { ... });
  });

  // === Controlled state (if applicable) ===
  describe('controlled state', () => {
    it('works as uncontrolled with default value', () => { ... });
    it('works as controlled', () => { ... });
    it('calls onChange callback', () => { ... });
  });

  // === Keyboard (if applicable) ===
  describe('keyboard', () => {
    // Based on spec.testing.keyboard or class defaults
  });

  // === Form integration (if applicable) ===
  describe('form', () => {
    it('submits value via hidden input', () => { ... });
    it('includes name attribute', () => { ... });
  });

  // === Accessibility ===
  describe('accessibility', () => {
    // Based on spec.testing.aria or class defaults
    it('has correct ARIA role', () => { ... });
    it('has correct ARIA attributes', () => { ... });
  });

  // === Slot props ===
  describe('slot props', () => {
    it('merges sp className', () => { ... });
    it('merges sp style', () => { ... });
  });

  // === Custom behaviors from spec ===
  // spec.testing.behaviors entries become individual test cases
});
```

### Step 4 — Write the file

Write to `src/components/{category}/{Name}/{Name}.test.tsx`

---

## Test conventions

1. **Provenance comment on line 1** — `// Generated from {Name}.spec.ts (schemaVersion: {N}, specHash: {XXXX})`. If no spec, use `// Generated from {Name}.tsx (sourceHash: {XXXX})`.
2. **Use `@testing-library/react`** for rendering and queries
2. **Use `userEvent`** for user interactions (prefer over `fireEvent`)
3. **Use `vitest`** — `describe`, `it`, `expect`, `vi`
4. **Query by role first** — `screen.getByRole('button')`, fallback to `getByTestId`
5. **Test behavior, not implementation** — assert what the user sees, not internal state
6. **Each spec.testing.behaviors entry** becomes at least one test case
7. **spec.testing.keyboard entries** become keyboard interaction tests
8. **spec.testing.aria entries** become accessibility assertion tests
9. **spec.testing.form entries** become form integration tests
10. **spec.testing.animation entries** become animations prop tests (pass `animations={false}` to disable in tests)
11. **Layout props use data-attributes** — test gap/align/justify/direction/wrap via `toHaveAttribute('data-gap', 'md')`, NOT via `element.style.gap`. These props are resolved in CSS via data-attribute selectors.

## Radix component testing

When generating tests for components that wrap Radix UI primitives, read `references/component/radix-testing-patterns.ts` for known jsdom quirks and required patterns:

1. **Duplicate role elements** — Radix Tooltip renders multiple `role="tooltip"` elements in jsdom. Use `screen.getAllByRole()` and select the last element instead of `screen.getByRole()`.
2. **Nested interactive elements** — Always use `asChild` on Radix Trigger sub-components in compound API tests. Without it, nested `<button>` elements cause jsdom warnings and prevent content from rendering.
3. **Positioning attributes** — Never assert specific `data-side` or `data-align` values. Only assert the attribute exists, or just verify the prop is accepted without error.
4. **Provider wrapping** — Tooltip tests must wrap in `<Tooltip.Provider delayDuration={0}>` for reliable rendering.
5. **act() for imperative APIs** — Wrap imperative state-triggering calls (e.g. `Toast.show()`) in `act()`.
6. **Prefer Simple API** — when both Simple and Compound APIs exist, focus test coverage on Simple API (more reliable in jsdom). Test compound API for structure only.

## Without a spec

If no spec exists, infer the component class from the source code and generate tests based on class defaults. The test file will still be useful but may be less comprehensive.
