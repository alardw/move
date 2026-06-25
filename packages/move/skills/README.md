# Move UI — Skills

## Overview

All skills are flat — each is a direct child of this directory with a `SKILL.md` file. Skills are auto-discovered by Claude Code and available as `/slash-commands`.

```
skills/
  references/              # Shared reference files
    component/             # Spec types, tokens, engine API, contracts
    app/                   # Bootstrap, layout, page, feature patterns
    recipes/               # Component and composite recipe examples

  # Library skills — building Move itself
  analyze/                 # Research how other libraries implement a component
  create-spec/             # Create or extract a .spec.ts component contract
  improve/                 # Amend an existing spec with a change request
  generate-source/         # Generate .tsx, .module.css, index.ts from spec
  generate-test/           # Generate test file from spec and source
  generate-meta/           # Generate ComponentMeta from source
  generate-demo/           # Generate playground demo file
  generate-recipe/         # Generate recipe files for demo app
  generate-all/            # Run full generation pipeline
  validate/                # Validate component conformance

  # App skills — building with Move
  app-setup/               # Bootstrap MoveRoot + app shell
  app-page/                # Generate a page/route component
  app-composite/           # Generate an app-specific composed component
  app-feature/             # Generate a cross-page feature
```

## Library Skills

For maintaining the Move component library. Each component follows a lifecycle:

```
/component-analyze → /component-create-spec → /component-generate-source → /component-generate-test → /component-generate-meta → /component-validate
```

> Demo and recipe generation are temporarily out of the pipeline (their old
> `demo/` target moved to `packages/docs`); docs-app replacements are tracked
> in the repo `TODO.md`.

Or use `/component-generate-all` to run the full pipeline.

### Key concepts

**Spec** (`.spec.ts`) — Typed contract. All decisions in one place. Required for generation.

**Reference files** (`references/`) — Shared across skills. Types, tokens, patterns, contracts. Read by skills, never edited by skills.

**Component classes** determine default animation, keyboard, a11y, and form behavior:

| Class | Animation | Keyboard | Form | Example |
|-------|-----------|----------|------|---------|
| `presentational` | none | none | none | Badge, Text, Divider |
| `interactive` | event (hover/press) | toggle | none | Button, Link |
| `input_toggle` | state (checked/unchecked) | toggle | hidden-input | Checkbox, Switch |
| `input_popup` | lifecycle + stagger | linear | varies | Select, DatePicker |
| `input_plain` | none | varies | native | InputText, Textarea |
| `disclosure` | state (open/close) + dimension | roving | none | Accordion, Tabs |
| `overlay_layer` | lifecycle (multi-target) | none | none | Dialog, Sidebar |
| `overlay_popup` | lifecycle + stagger | linear | none | Dropdown, Popover |
| `display` | varies | varies | none | Card, Table |

## App Skills

For building applications with Move. All app skills enforce one rule:

> **No custom CSS. No raw HTML for layout. Only Move components.**

### Hierarchy

```
/app-setup       → MoveRoot + app shell (sidebar, top-nav, minimal)
    ↓
/app-feature     → orchestrates pages + composites for a functional area
    ↓
/app-page        → individual route component
    ↓
/app-composite   → reusable app-specific component from core
```

### Shell types

| Shell | Use case | Components |
|-------|----------|------------|
| `sidebar` | Dashboard, admin, SaaS | Sidebar + Stack + router outlet |
| `top-nav` | Marketing, docs, blog | Align + Divider + router outlet |
| `minimal` | Auth pages, focused tools | Just MoveRoot + router outlet |

## File layout

### Component (library)
```
src/components/{category}/{Name}/
├── {Name}.spec.ts
├── {Name}.tsx
├── {Name}.module.css
├── {Name}.test.tsx
├── {Name}.meta.ts
├── use{Name}.ts (if needed)
└── index.ts
```

### App (typical)
```
src/
├── main.tsx              ← MoveRoot + shell (from /app-setup)
├── composites/           ← shared UI (from /app-composite)
│   ├── UserCard.tsx
│   └── MetricsPanel.tsx
├── pages/                ← routes (from /app-page)
│   ├── Dashboard.tsx
│   └── Settings.tsx
└── features/             ← cross-page (from /app-feature)
    └── auth/
        ├── LoginPage.tsx
        └── SignupPage.tsx
```
