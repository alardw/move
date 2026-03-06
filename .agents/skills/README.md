# Move UI — Skills

## Overview

Skills are organized into two domains: **library** (building Move itself) and **app** (building apps with Move).

```
skills/
  library/                 # Building Move
    component/             # Core component lifecycle
      references/          # Spec types, tokens, engine API, contracts
      analyze/             # Research libraries/primitives
      spec/                # Define component contract
      improve/             # Amend existing spec
      generate-source/     # Code from spec
      generate-test/       # Tests from spec
      generate-meta/       # Metadata from source
      generate-all/        # Batch generate all files
      validate/            # Conformance check
    demo/                  # Component showcase
      generate/            # Generate demo/playground
    recipe/                # Public discoverable patterns
      generate/            # Generate recipe example

  app/                     # Building with Move
    setup/                 # Application bootstrap
      references/          # bootstrap.md, layout-composition.md
      generate/            # MoveRoot + app shell
    composite/             # App-specific components from core
      references/          # Composition rules
      generate/            # Generate composite component
    page/                  # Individual routes/views
      references/          # Page patterns
      generate/            # Generate page component
    feature/               # Cross-page functionality
      references/          # Feature patterns
      generate/            # Orchestrate pages + composites + routing
```

## Library Skills

For maintaining the Move component library. Each component follows a lifecycle:

```
analyze → spec → generate-source → generate-test → generate-meta → validate
                                                  → demo/generate
```

### Key concepts

**Spec** (`.spec.ts`) — Typed contract. All decisions in one place. Required for generation.

**Reference files** (`references/`) — Scoped to each tier. Types, tokens, patterns, contracts. Read by skills, never edited by skills.

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
app/setup/generate       → MoveRoot + app shell (sidebar, top-nav, minimal)
    ↓
app/feature/generate     → orchestrates pages + composites for a functional area
    ↓
app/page/generate        → individual route component
    ↓
app/composite/generate   → reusable app-specific component from core
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
├── main.tsx              ← MoveRoot + shell (from app/setup/generate)
├── composites/           ← shared UI (from app/composite/generate)
│   ├── UserCard.tsx
│   └── MetricsPanel.tsx
├── pages/                ← routes (from app/page/generate)
│   ├── Dashboard.tsx
│   └── Settings.tsx
└── features/             ← cross-page (from app/feature/generate)
    └── auth/
        ├── LoginPage.tsx
        └── SignupPage.tsx
```
