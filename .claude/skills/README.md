# Move UI — Skill Pipeline

## Overview

Skills generate and validate Move components. The **spec** is the central artifact — it captures all decisions and drives generation.

```
_reference/          Shared data files (types, tokens, patterns, contracts)
spec/                Create or extract a component spec
improve/             Incrementally amend an existing spec via natural language
generate-source/     Generate component source (.tsx, .module.css, index.ts) from spec
generate-meta/       Generate ComponentMeta from source
generate-demo/       Generate demo file from source/spec
generate-story/      Deprecated alias -> generate-demo
generate-test/       Generate test file from spec + source
validate/            Check conformance, write report, update registry
analyze/             Research libraries, write analysis report
```

## Pipelines

### New component (from scratch)

```
/analyze {Name}      → research, write .analysis.md (optional)
        ↓
/spec {Name}         → ask user for decisions, write .spec.ts
        ↓
/generate-source {Name}     → generate .tsx, .module.css, index.ts, hook (requires spec)
        ↓  ↓  ↓
/generate-test       → test file from spec + source
/generate-meta       → .meta.ts from source
/generate-demo       → demo/src/demos/generated/{Name}Demo.tsx
        ↓
/validate {Name}     → check all rules, write .report.md
```

### Existing component (extract and regenerate)

```
/spec {Name}         → auto-detects source, extracts decisions, user confirms
        ↓
/generate-source {Name}     → generates fresh source from spec
        ↓
diff original/ vs generated/
```

### Improve existing component

```
/improve {Name}: {change}  → amend spec (only reviews NEW defaults)
        ↓
/generate-all {Name}       → regenerate all files from updated spec
```

### Validation only (no spec needed)

```
/validate {Name}     → checks existing source against all rules
/validate all        → checks every component
/validate theme X    → checks theme file
/validate registry   → shows status of all components
```

## Key concepts

**Spec** (`.spec.ts`) — The typed contract. All decisions in one place. Required for `/generate-source`. Includes `labels` for i18n — all user-visible strings are declared with English defaults and exposed via a `labels` prop.

**Reference files** (`_reference/`) — Shared data. Types, tokens, animation patterns, conventions. Read by skills, never edited by skills.

**Reports** (`.analysis.md`, `.report.md`) — Informational artifacts. Persist with the component. Not gating — the spec is the authority.

**Registry** (`specs.registry.ts`) — Tracks all components and their spec/generation status. Updated by `/validate`.

**Demo app** — Component playground for manual visual QA. Generated via `/generate-demo`.

## Mode detection in /spec

`/spec` auto-detects based on whether source exists:

- **Source found** → extract mode: reads `.tsx` + `.module.css`, derives spec, asks user to confirm
- **No source** → create mode: asks user for decisions, fills class defaults

Search order: `original-components/**/{Name}/` then `src/components/**/{Name}/`

## Component classes

The `componentClass` determines default animation, keyboard, a11y, and form behavior:

| Class | Animation | Keyboard | Form | Example |
|-------|-----------|----------|------|---------|
| `presentational` | none | none | none | Badge, Text, Divider |
| `interactive` | hover/press | toggle | none | Button, Link |
| `input_toggle` | indicator | toggle | hidden-input | Checkbox, Switch |
| `input_popup` | popup | linear | varies | Select, DatePicker |
| `input_plain` | none | varies | native | InputText, Textarea |
| `disclosure` | expand | roving | none | Accordion, Tabs |
| `overlay_layer` | layer | none | none | Dialog, Sidebar |
| `overlay_popup` | popup | linear | none | Dropdown, Popover |
| `display` | varies | varies | none | Card, Table |

## File layout per component

```
src/components/{category}/{Name}/
├── {Name}.spec.ts          ← contract (from /spec)
├── {Name}.analysis.md      ← research (from /analyze)
├── {Name}.report.md        ← validation (from /validate)
├── {Name}.tsx              ← source (from /generate-source)
├── {Name}.module.css       ← styles (from /generate-source)
├── {Name}.meta.ts          ← metadata (from /generate-meta)
├── demo/src/demos/generated/{Name}Demo.tsx  ← demo file (from /generate-demo)
├── {Name}.test.tsx          ← tests (from /generate-test)
├── use{Name}.ts            ← hook (from /generate-source, if needed)
└── index.ts                ← exports (from /generate-source)
```
