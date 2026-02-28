# Create Meta Agent

Generate a canonical `ComponentMeta` file for a Move component.

This skill analyzes an existing component implementation and produces a deterministic `*.meta.ts` file that satisfies the `ComponentMeta` contract defined in:

    src/meta-schema.ts

Meta describes public structure only.
It must remain deterministic and schema-versioned.

---

## How to Run

**Input:**
- A component name (e.g. `Dialog`)
OR
- A direct file path (e.g. `src/components/overlay/Dialog/Dialog.tsx`)

**Output:**
- A complete `*.meta.ts` file
- No markdown
- No explanations
- Pure TypeScript only
- Deterministic property ordering
- Must import:
    - `META_SCHEMA_VERSION`
    - `ComponentMeta`
  from `"@/meta-schema"`

If analysis fails, output a structured failure report instead.

---

# Stage 0 — Schema Enforcement

Before generating meta:

1. Confirm `META_SCHEMA_VERSION` exists in `@/meta-schema`.
2. Confirm `ComponentMeta` type exists.
3. Do NOT hardcode schema version number.
4. Always emit:

    schemaVersion: META_SCHEMA_VERSION

If schema file cannot be resolved → FAIL.

---

# Stage 1 — Structural Extraction

Analyze the implementation and extract:

---

## 1. Determine Component Kind

Classify as:

- `"primitive"`
- `"compound"`
- `"composite"`

A component is `"compound"` if ANY of the following are true:

1. The exported component is an object literal of subcomponents.
2. `withMoveComponent` configuration includes a `subComponents` property.
3. Subcomponents are attached via `Object.assign(Component, { ... })`.

If none of the above apply:
- `"primitive"`.

If ambiguous → FAIL.

---

## 2. Extract Anatomy

If `"primitive"`:
- anatomy = ["Root"]

If `"compound"`:

Case A — Export object literal:

    export const Dialog = { Root, Trigger, Content }

→ anatomy = keys in declaration order.

Case B — withMoveComponent has subComponents:

    subComponents: { Group: CheckboxGroup }

→ anatomy = ["Root", ...subComponentKeys]

Case C — Object.assign:

    Object.assign(Component, { SubA, SubB })

→ anatomy = ["Root", ...assignedKeys]

Order must match declaration order.
Never invent names.

---

## 3. Extract Slots

Slots must be derived ONLY from:

- `withMoveComponent<...>()`
- Explicit `slots: [...]`

Rules:

- Use exact slot keys.
- Maintain declared order.
- Do NOT assume `"root"` exists unless explicitly declared.
- If no slot system → empty array.

---

## 4. Detect Controlled Pattern

Inspect Root props only.

Match strictly:

| Pattern   | Required Props                                  |
|-----------|-------------------------------------------------|
| "open"    | open, defaultOpen, onOpenChange                 |
| "value"   | value, defaultValue, onValueChange              |
| "checked" | checked, defaultChecked, onCheckedChange        |

Rules:

- All required props must exist.
- If partially implemented → FAIL.
- If none exist → `pattern: null`.
- `controlled` must always be emitted.

---

## 5. Extract Variants

From Root props only:

- Include string literal union props.
- Keys must match public prop names.
- Values must match literal union types.
- Ignore booleans.
- Ignore numeric unions.
- Ignore HTML attributes.

If none → `{}`

Do NOT extract variants from subcomponents.

---

## 6. Extract Constraints (Deterministic)

### requiresParent

Set:

    requiresParent: "{ComponentName}.Root"

IF ALL conditions are true:

1. React context is created in the component file.
2. A custom hook accesses that context.
3. The hook throws if context is missing.
4. One or more subcomponents call that hook.

If true → include requiresParent.

If false → omit.

---

### supportsAnimation

Set true ONLY if:

- Root props include public `animate` prop.

Ignore internal animation usage.
Ignore animation on subcomponents.

---

### requiresChild

Include only if implementation explicitly enforces required child structure.

Otherwise omit.

---

## 7. Intent (Optional, Strict)

Intent must:

- Use only values defined in `ComponentIntent` in `meta-schema.ts`
- Never be inferred automatically
- Only be included if explicitly provided by user

Valid values:

- "trigger"
- "input"
- "selection"
- "disclosure"
- "layout"
- "display"
- "feedback"

If not explicitly provided → omit field.

---

# Stage 2 — Validation

Before generating output:

1. Anatomy matches export/subComponent structure exactly.
2. Slot names match typed slot union.
3. Controlled pattern fully implemented.
4. Variant keys exist in Root prop type.
5. `schemaVersion` references `META_SCHEMA_VERSION`.
6. No hardcoded schema numbers.
7. Property ordering matches required format.

If any rule fails → output failure report.

---

# Failure Output Format

```markdown
## Meta Generation Failed

Component: {ComponentName}

Reason:
- {specific violation}

Required clarification:
- {what is needed}
```

No partial meta allowed.

---

# Stage 3 — Output Format (Strict)

Output exactly:

```ts
import { META_SCHEMA_VERSION } from "@/meta-schema";
import type { ComponentMeta } from "@/meta-schema";

export const {componentNameLower}Meta = {
  schemaVersion: META_SCHEMA_VERSION,

  name: "{ComponentName}",

  kind: "{primitive|compound|composite}",

  anatomy: [...],

  slots: [...],

  controlled: {
    pattern: { "open" | "value" | "checked" | null }
  },

  variants: {...},

  constraints: {...},   // omit if not present

  intent: [...]         // omit if not present
} satisfies ComponentMeta;
```

Rules:

- No comments.
- No markdown.
- No explanations.
- No extra fields.
- No hardcoded schema numbers.
- Deterministic property ordering:
  1. schemaVersion
  2. name
  3. kind
  4. anatomy
  5. slots
  6. controlled
  7. variants
  8. constraints (optional)
  9. intent (optional)

Meta must satisfy `ComponentMeta` from `@/meta-schema`.