---
name: recipe-generate-test
description: "Generate a test file for a Move recipe from its spec behaviors and source."
user-invocable: true
argument-hint: "[RecipeName]"
---

# Recipe Generate Test — Recipe Test Generator

Generate a test for a recipe. The spec's `behaviors` and `integrationPoints`
drive the test cases; the source supplies the queryable details.

Recipes are compositions of already-tested Move components, so tests assert the
**recipe's own** contract — that it renders, applies its labels, runs its
declared behaviors, and exposes its integration points — not the internals of the
Move components it uses.

---

## How to Run

**Input:** A recipe name (e.g. "SignIn").

**Output:** `packages/docs/src/content/recipes/{groupSlug}/{Name}.test.tsx`
written next to the recipe.

---

## Process

### Step 1 — Read files

1. `{Name}.spec.ts` — `behaviors`, `labels`, `integrationPoints` (the test plan).
2. `{Name}.tsx` — the implementation (queryable roles, text, structure).

### Step 2 — Derive test cases

| Source | Test category |
|--------|---------------|
| Always | **Rendering** — renders without crashing; renders inside a `MoveRoot` test wrapper |
| `spec.labels` | **i18n** — default copy is shown; a custom `labels` override replaces it |
| each `spec.behaviors[]` | **Behavior** — one (or more) test asserting that behavior's observable result |
| each `spec.integrationPoints[]` | **Integration** — the wiring point is reachable (the handler fires on the relevant interaction, or the data renders) |
| Always | **Accessibility** — key controls are reachable by role / accessible name |

### Step 3 — Generate the test

```tsx
// Generated from {Name}.spec.ts (schemaVersion: {N})
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { MoveRoot } from 'move';
import {Name} from './{Name}';

const renderRecipe = (props = {}) =>
  render(
    <MoveRoot>
      <{Name} {...props} />
    </MoveRoot>,
  );

describe('{Name}', () => {
  describe('rendering', () => {
    it('renders without crashing', () => { renderRecipe(); /* assert a key element */ });
  });

  describe('i18n', () => {
    it('shows default labels', () => { /* assert spec default copy */ });
    it('applies custom labels', () => { /* render with labels={{ ... }} and assert */ });
  });

  // one describe block per spec.behaviors[] entry
  // one test per spec.integrationPoints[] entry
  describe('accessibility', () => {
    it('exposes controls by role/name', () => { /* getByRole assertions */ });
  });
});
```

### Step 4 — Write and run

Write the file, then run it with the docs package's test runner
(`cd packages/docs && npx vitest run src/content/recipes/{groupSlug}/{Name}.test.tsx`).
If the docs package has no test runner configured, report that as a blocking
prerequisite (the recipe pipeline needs one) rather than silently skipping.

---

## Conventions

1. **Provenance comment on line 1** — `// Generated from {Name}.spec.ts (schemaVersion: {N})`.
2. **Wrap renders in `MoveRoot`** — recipes rely on Move providers (theme,
   tooltip, icons).
3. **Use `@testing-library/react` + `userEvent` + `vitest`.**
4. **Query by role/accessible name first**, fall back to text.
5. **Each `spec.behaviors[]` entry → at least one test** asserting its observable
   result. A behavior with no test is a coverage gap.
6. **Each `spec.integrationPoints[]` entry → one test** that the wiring point is
   reachable (handler fires, or mock data renders).
7. **Test the recipe's contract, not Move internals** — don't re-test Button or
   InputText behavior.
8. **i18n is mandatory** — assert both default copy and a `labels` override.
