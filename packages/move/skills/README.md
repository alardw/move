# Move UI — Skills

## Overview

All skills are flat — each is a direct child of this directory with a `SKILL.md` file. Skills are auto-discovered by Claude Code and available as `/slash-commands`.

```
skills/
  references/              # Shared reference files
    component/             # Spec types, tokens, engine API, contracts
    app/                   # Bootstrap, layout, page, feature patterns
    recipes/               # Component and composite recipe examples

  # Component skills — author a component from a typed spec
  # (extend Move itself, or build your own spec-driven components in an app)
  component-analyze/          # Research how other libraries implement a component
  component-create-spec/      # Create or extract a .spec.ts component contract
  component-improve/          # Amend an existing spec with a change request
  component-generate-source/  # Generate .tsx, .module.css, index.ts from spec
  component-generate-test/    # Generate test file from spec and source
  component-generate-meta/    # Generate ComponentMeta from source
  component-generate-all/     # Run the generation pipeline
  component-validate/         # Validate component conformance

  # Hook skill — scaffold a cross-cutting React hook
  hook-create/             # Typed hook + colocated test + barrel export + registry entry

  # App skills — building with Move
  app-setup/               # Bootstrap MoveRoot + app shell
  app-theme/               # Brand a theme: generate from a seed, import a token set, set radius + fonts
  app-wcag-audit/          # Audit YOUR app for the WCAG 2.2 items Move doesn't supply
  app-compose/             # Compose from a spec at any scale: composite, page, or feature
```

## Component Skills

Author a component from a typed spec — to extend Move itself, or to build your
own spec-driven components in an app. Each component follows a lifecycle:

```
/component-analyze → /component-create-spec → /component-generate-source → /component-generate-test → /component-generate-meta → /component-validate
```

> Demo and recipe generation are temporarily out of the pipeline (their old
> `demo/` target moved to `packages/docs`); docs-app replacements are tracked
> in the repo `notes/TODO.md`.

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
/app-compose     → a CompositionSpec at any scale (scope: feature | page | composite),
                   built entirely from Move components
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
├── composites/           ← shared UI (from /app-compose, scope: composite)
│   ├── UserCard.tsx
│   └── MetricsPanel.tsx
├── pages/                ← routes (from /app-compose, scope: page)
│   ├── Dashboard.tsx
│   └── Settings.tsx
└── features/             ← cross-page (from /app-compose, scope: feature)
    └── auth/
        ├── LoginPage.tsx
        └── SignupPage.tsx
```
