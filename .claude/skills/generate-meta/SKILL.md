# Generate Meta — Component Metadata Generator

Generate a canonical `ComponentMeta` file for a Move component.

---

## How to Run

**Input:** A component name (e.g. "Dialog") or a direct file path.

**Output:** `{Name}.meta.ts` written next to the component. Pure TypeScript, no markdown.

---

## Process

### Step 1 — Load schema

Read `src/meta-schema.ts` to get:
- `META_SCHEMA_VERSION`
- `ComponentMeta` type
- `ComponentKind`, `ControlledPattern`, `ComponentIntent`

### Step 2 — Read component source

Read `src/components/{category}/{Name}/{Name}.tsx` and extract:

| Field | Where to find it |
|-------|-----------------|
| Kind | `compound` if object literal/Object.assign/subComponents; `primitive` otherwise |
| Anatomy | Sub-component keys in declaration order; `["Root"]` for primitives |
| Slots | From `slots: [...]` in `withMoveComponent` |
| Controlled | From Root props: open/value/checked triads |
| Variants | String literal union props on Root |
| Constraints | Context usage, animation prop, required children |
| Intent | Only if explicitly provided by user |

Also read the spec file if it exists for additional context.

### Step 3 — Validate extraction

Before generating:
1. Anatomy matches export/subComponent structure exactly
2. Slot names match typed slot union
3. Controlled pattern fully implemented (all 3 props present)
4. Variant keys exist in Root prop type
5. `schemaVersion` references `META_SCHEMA_VERSION`

If any rule fails → output failure report, no partial meta.

### Step 4 — Write meta file

Write `src/components/{category}/{Name}/{Name}.meta.ts`:

```ts
import { META_SCHEMA_VERSION } from "@/meta-schema";
import type { ComponentMeta } from "@/meta-schema";

export const {nameLower}Meta = {
  schemaVersion: META_SCHEMA_VERSION,
  name: "{Name}",
  kind: "{primitive|compound}",
  anatomy: [...],
  slots: [...],
  controlled: {
    pattern: {pattern},
  },
  variants: {...},
  constraints: {...},   // omit if empty
  intent: [...]         // omit if not provided
} satisfies ComponentMeta;
```

---

## Rules

1. **Provenance comment on line 1** — `// Generated from {Name}.spec.ts (schemaVersion: {N}, specHash: {XXXX})`. If no spec, use `// Generated from {Name}.tsx (sourceHash: {XXXX})`.
2. **Always read component source first** — never guess structure
3. **Meta describes public structure only** — no internal details
4. **Deterministic property ordering** — schemaVersion, name, kind, anatomy, slots, controlled, variants, constraints, intent
5. **No hardcoded schema numbers** — always `META_SCHEMA_VERSION`
6. **No comments, no markdown** — pure TypeScript output (provenance comment is the sole exception)
6. **No partial meta** — if extraction fails, output failure report
7. **Import from `@/meta-schema`** — canonical import path
