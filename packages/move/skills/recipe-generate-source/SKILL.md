---
name: recipe-generate-source
description: "Generate a recipe .tsx from a .recipe spec. Composes only Move components. Refuses without spec."
user-invocable: true
argument-hint: "[RecipeName]"
---

# Recipe Generate — Recipe Code Generator

Generate a recipe's `.tsx` from its `{Name}.spec.ts`. **REFUSES without a spec.**

A recipe is a single default-export React component composed ENTIRELY from Move
components — no custom CSS, no CSS module, no raw layout HTML, no inline styles
(unlike library components, recipes are NOT `withMoveComponent` factories). Since
AI consumes this source directly, every label, behavior, and integration point
the spec declares MUST appear in the output.

---

## How to Run

**Input:** A recipe name (e.g. "SignIn", "FilterableDataTable").

**Output:** `packages/move/recipes/{groupSlug}/{Name}.tsx` written to
disk (a default-export React component).

**REFUSES if:** `{Name}.spec.ts` does not exist beside the recipe. Tell the
user to run `/recipe-create-spec {Name}` first.

---

## Process

### Step 1 — Locate and read the spec

Find `packages/move/recipes/**/{Name}.spec.ts`. If not found, REFUSE.

Read the `CompositionSpec`. Pull the contracts the output must honor:
- `composition` — the ONLY Move components allowed in the output.
- `labels` — every user-facing string.
- `behaviors` — acceptance criteria that must be implemented.
- `integrationPoints` — every place a consumer wires real data/handlers.

### Step 2 — Load reference rules

| File | Purpose |
|------|---------|
| `references/recipes/rules.md` | Golden rules: only Move components, i18n pattern, FormField usage, Icon usage, boolean DOM attrs, re-animate on data change |
| `references/recipes/composite/` | Existing recipe patterns — match their structure and correct component API usage |
| `references/app/composition-rules.md` | Available layout components (Stack, Grid, Align, Card) and their props |

### Step 3 — Generate the recipe (`{Name}.tsx`)

1. Provenance comment on line 1:
   `// Generated from {Name}.spec.ts (schemaVersion: {N})`
2. Imports: React hooks as needed, then the Move components — **exactly** the
   names in `spec.composition`, imported from `'move'`. No other UI imports.
3. i18n block (always — recipes expose `labels`):
   ```tsx
   const defaultLabels = {
     // one entry per spec.labels[]: key: default
   };
   type Labels = typeof defaultLabels;
   ```
4. Default-export component:
   ```tsx
   export default function {Name}({ labels }: { labels?: Partial<Labels> }) {
     const t = { ...defaultLabels, ...labels };
     // local state for controlled inputs / interactions
     // ...
   }
   ```
5. Render the flow using only `spec.composition` components. Every user-facing
   string comes from `t.{key}` — never a hardcoded literal.

### Step 3a — Implement every behavior

Each `spec.behaviors[]` entry MUST be implemented in the output:
- "validates X" → real validation wired to `FormField.Description` with `error`.
- "shows empty state when no rows" → an `EmptyState` (or equivalent) branch.
- "submit shows loading" → a loading flag on the submit `Button`.
- "responsive: collapses to one column" → use the responsive component default or
  a Move layout prop, never a media query / custom CSS.
- "keyboard-navigable" → rely on the underlying Move components' built-in keyboard
  support; don't re-implement it.

A behavior declared in the spec but absent from the output is a generation
failure.

### Step 3b — Wire every integration point

Each `spec.integrationPoints[]` entry MUST appear as an explicit, clearly-marked
stub a consumer can replace — not buried logic. The entry's `kind` dictates the
form:

- `kind: 'data'` → a module constant named with a **`SAMPLE_` prefix**
  (`SAMPLE_NAV_ITEMS`, `SAMPLE_USERS`, `SAMPLE_MESSAGES`), preceded by a
  `// Integration point: {description}` comment. When the point declares a
  `shape`, derive the table/list **columns, search predicate, sort keys, and
  filter facets from those fields** (honour each field's `searchable` /
  `sortable` / `filterable` flag and `type` — e.g. a `number`/`date` column
  sorts numerically, not lexically). The `SAMPLE_*` const's records must match
  the declared `shape`. The recipe still renders
  realistic data (the docs demo needs it), but the `SAMPLE_` prefix makes it
  unmistakable that it's placeholder content to replace — never ship
  `menuItems`/`rows`/`data` for placeholder sets.
- `kind: 'handler'` (`onSubmit`, `onDelete`) → a named function with the comment
  and a no-op / mock body.
- `kind: 'navigation'` (`forgotPassword`) → a placeholder target (`href="#"` /
  a stub handler) with the comment.
- `kind: 'asset'` (`qrCode`) → a placeholder asset reference with the comment.

The point: every fill-in is greppable (the `// Integration point:` comments) AND,
for sample data, self-evidently placeholder (the `SAMPLE_` prefix). This is how a
recipe stays "explain the principle, AI fills the real values" without anyone
mistaking the demo menu items for intended content.

### Step 3c — Keep opinions thin, isolated, and swappable

A rigorous recipe (validation, loading, error, empty states) necessarily makes
choices. Keep them honest so a consumer can see and replace each one in a single
edit:

- **Move-native, no library lock-in** — validation is native checks (required,
  format), NEVER zod / react-hook-form / yup. Errors render through
  `FormField.Description` (with `error`). Loading is local `useState` + the
  Button's loading affordance. The opinion must always be "the obvious Move way."
- **Behind a marked boundary** — every opinionated block lives in a single named
  function (`validate()`, `onSubmit()`) or behind a `// Integration point:`
  marker, so removing or replacing it is deleting one labeled region, not
  untangling JSX.
- **No rationale in code or docs** — name what the block does, never argue why
  (house rule: docs/prose describe what something is, not the design rationale).
- **One recipe, no tiers** — never fork basic/complete variants; structure the
  single recipe so stripping rigor is a clean deletion.

### Step 4 — Apply the golden rules (from `references/recipes/rules.md`)

- Only Move components — no `<div>`/`<span>`/`<button>`, no inline `style`, no CSS
  module.
- Respect component defaults — don't pass a prop equal to its default.
- Wrap every form input in `FormField.Root` + `FormField.Label` + `FormField.Field`. Exception: a standalone toolbar/search input (not part of a form) may omit FormField but MUST carry an `aria-label`.
- Use `FormField.Description` (with `error`) for hints and errors.
- Use `<Icon name>` for any visual indicator — never a unicode glyph.
- `invalid={value || undefined}` for boolean DOM attrs.
- `asChild` when wrapping a Move Button in a Dialog/Drawer trigger.
- Pass `animateKey` to stagger components (List, Timeline) when their data changes
  (filter/sort/search).

---

## Rules

1. **REFUSE without spec** — never generate without `{Name}.spec.ts`.
2. **Only `spec.composition` components** — the output may import no UI beyond
   that list (the validate allow-list). No raw HTML, no inline styles, no CSS.
3. **Every `spec.labels[]` key wired** — all user-facing copy through `t.{key}`;
   no hardcoded strings.
4. **Every `spec.behaviors[]` implemented** — a missing behavior is a failure.
5. **Every `spec.integrationPoints[]` marked** — explicit `// Integration point:`
   stubs, greppable, replaceable.
6. **Follow `references/recipes/rules.md` exactly** — FormField, Icon, boolean
   attrs, re-animate-on-data-change.
7. **Default export** — recipes are default-export components taking only
   `{ labels?: Partial<Labels> }`.
8. **Provenance header** — `// Generated from {Name}.spec.ts (schemaVersion: N)`.
9. **Deterministic output** — same spec produces the same recipe.
