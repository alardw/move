---
name: recipe-validate
description: "Validate a recipe against its spec and the recipe golden rules. Reports to stdout. Supports fix mode."
user-invocable: true
argument-hint: "[RecipeName|all] [fix]"
---

# Recipe Validate — Recipe Conformance Validator

Validate that a recipe conforms to its spec and the recipe golden rules. Because
recipes are AI-consumed source, validation is a hard gate: a recipe that drifts
from its spec or breaks purity must not ship.

---

## How to Run

**Input:** One of:
- A recipe name (e.g. "SignIn") — validate that recipe.
- `"all"` — validate every recipe in the registry.
- Append `"fix"` to auto-fix failures (e.g. "SignIn fix").

**Output:**
- Stdout summary (no `.report.md` file is written).

---

## Process

### Step 1 — Read files

1. `packages/move/recipes/{groupSlug}/{Name}.spec.ts` — the contract.
2. `{Name}.tsx` — the recipe source.
3. `{Name}.test.tsx` — the test (if present).
4. `packages/move/recipes/registry.ts` — the registry entry.
5. `references/recipes/rules.md` — the golden rules.

### Step 2 — Run validation rules

#### A. Purity (the recipe contract)

| # | Rule | How to check |
|---|------|--------------|
| A1 | Only Move components | Every imported UI identifier is in `spec.composition` and imported from `'move'`. **FAIL** on any other UI import |
| A2 | No raw layout HTML | No `<div>`, `<span>`, `<button>`, `<form>`, `<ul>`, etc. — layout/structure via Move components only |
| A3 | No custom CSS / inline styles | No CSS-module import, no `style={...}` for layout. Light illustrative `style` is discouraged; flag it |
| A4 | i18n via labels | A `defaultLabels` object + `labels?: Partial<Labels>` prop + `const t = { ...defaultLabels, ...labels }`. **FAIL** on any hardcoded user-facing string |
| A5 | FormField wrapping | Every form input wrapped in `FormField.Root` + `Label` + `Field`. **Exception:** a standalone toolbar/search input (not part of a form) may omit FormField if it carries an `aria-label`. |
| A6 | Icons via `<Icon>` | Visual indicators use `<Icon name>`, never unicode glyphs |
| A7 | Default export | Recipe is a default-export component taking only `{ labels?: Partial<Labels> }` |

#### B. Spec parity

| # | Rule |
|---|------|
| B1 | `composition` parity — every component the source imports is in `spec.composition`, and every `spec.composition` entry is actually used |
| B2 | `labels` parity — `defaultLabels` keys match `spec.labels[].key` exactly (no missing, no extra) |
| B3 | `behaviors` coverage — every `spec.behaviors[]` entry is implemented in the source AND has a test in `{Name}.test.tsx` |
| B4 | `integrationPoints` present — every `spec.integrationPoints[]` entry appears as an explicit `// Integration point:` stub |

#### C. Registry

| # | Rule |
|---|------|
| C1 | Registered exactly once in `registry.ts`, no duplicate slug within its group |
| C2 | Registry entry carries a complete, hand-authored `RecipeDocument` — `slug`, `group`, `groupSlug`, `title`, `description`, `synonyms`, `preview` all present on the `toMeta` doc arg (these fields are NOT in the spec, so don't check them against it) |

#### D. Tests & typecheck

| # | Rule |
|---|------|
| D1 | `{Name}.test.tsx` exists |
| D2 | Tests pass (`cd packages/docs && npx vitest run …/{Name}.test.tsx`) |
| D3 | Docs package typechecks (`npx tsc --noEmit -p packages/docs/tsconfig.json`) |

### Step 3 — Severity and gating

- **BLOCKER:** A1, A2, A4, B1, B2, B3, B4, C1, C2, D2, D3.
- **HIGH:** A3, A5, A6, A7, D1.
- **MEDIUM:** everything else.

Any BLOCKER → overall `FAIL`; the pipeline must stop.

### Step 4 — Report results

Print the validation summary to **stdout** — no `.report.md` file is written. Format:
```markdown
# {Name} — Recipe Validation Report

| Rule | Status | Notes |
|------|--------|-------|
| A1   | PASS   |       |
| ...  | ...    | ...   |

Spec drift: {none | detected}
Issues: {count}
```

### Step 5 — Fix mode

When input includes "fix": fix failures in order A → B → C → D, then re-run
validation to confirm. Never fix by weakening the contract (e.g. don't satisfy
A1 by adding a component to `spec.composition` that the recipe shouldn't use —
fix the source).

---

## Rules

1. **Purity is non-negotiable** — only Move components, no raw HTML, no custom
   CSS, i18n via labels.
2. **Spec is the authority** — composition / labels / behaviors / integration
   points must match the spec exactly.
3. **Behaviors need tests** — an implemented behavior with no test fails B3.
4. **BLOCKER stops the pipeline.**
5. **Fix the source, not the contract** — never relax the spec to pass.
6. **Only flag real violations**, not style preferences.
