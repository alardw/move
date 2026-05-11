---
name: improve
description: "Amend an existing component spec with a change request. Only reviews new defaults."
user-invocable: true
argument-hint: "[ComponentName]: [change description]"
---

# Improve — Incremental Spec Amendment

Amend an existing component spec based on a natural language change request. Only reviews NEW defaults — existing approved defaults are preserved.

---

## How to Run

**Input:** A component name and a change description.
Format: `/improve {Name}: {description of change}`

Examples:
- `/improve Alert: add closable prop with dismiss animation`
- `/improve Badge: add outline variant`
- `/improve Tooltip: change default placement from top to bottom`
- `/improve Dialog: add fullscreen size option`

**Output:** Updated `{Name}.spec.ts` with new specHash.

**REFUSES if:** `{Name}.spec.ts` does not exist. Run `/spec {Name}` first.

---

## Process

### Step 1 — Locate and read existing spec

Find `src/components/**/{Name}/{Name}.spec.ts`. If not found, REFUSE.

Read the spec and parse the `ComponentSpec` object. Store as `oldSpec`.

### Step 2 — Load reference data

Read the same reference files as `/spec`:

| File | Purpose |
|------|---------|
| `references/component/spec-type.ts` | `ComponentSpec` type |
| `references/component/categories.ts` | Valid categories |
| `references/component/animation-map.ts` | Class → animation wiring |
| `references/component/a11y-contract.ts` | Class → ARIA requirements |
| `references/component/default-conventions.ts` | Token/variant defaults |
| `references/component/engine-api.ts` | Available imports |
| `references/component/tokens-semantic.ts` | Available semantic tokens |

Also read the current generated source if it exists:
- `{Name}.tsx` — to understand current implementation
- `{Name}.module.css` — to understand current tokens/selectors

### Step 3 — Parse the change request

Interpret the user's natural language description and determine which spec fields need to change. Categories of changes:

| Change type | Affected spec fields |
|-------------|---------------------|
| Add prop | `props`, possibly `moveProps` in subComponent, `defaults` |
| Remove prop | `props`, `moveProps`, `defaults`, `tokens` |
| Add variant value | `variants`, `tokens` |
| Add size value | `sizes`, `tokens` |
| Change default | `defaults` in relevant subComponent/root |
| Add slot | `slots`, `anatomy`, possibly `subComponents` |
| Add sub-component | `subComponents`, `anatomy` |
| Change animation | `animations`, `states` |
| Add controlled pattern | `controlled`, `controlledProps`, `props` |
| Add label | `labels` |
| Change behavior | `keyboard`, `focus`, `dismissBehavior`, etc. |
| Add token | `tokens` |

### Step 4 — Apply changes to spec

Create `newSpec` by deep-cloning `oldSpec` and applying the parsed changes:

- **Add fields**: insert new entries into the appropriate arrays/objects
- **Modify fields**: update values in place
- **Remove fields**: filter out entries
- **Token values**: validate against `references/component/tokens-semantic.ts` (same rule as `/spec`)
- **Preserve everything else**: do not touch unchanged fields

### Step 5 — Show diff

Present a clear summary of what changed between `oldSpec` and `newSpec`:

```
## Spec changes for {Name}

### Added
- props: `closable` (boolean, default: true) — "Show close button"
- tokens: `--move-alert-close-size` = var(--move-size-5)

### Changed
- animations: added { trigger: 'Root.press', sequence: [{ preset: 'scaleDown' }] }

### Removed
- (nothing)
```

Only show actual changes, not the entire spec.

### Step 6 — Review NEW defaults only

Identify props/fields that are new (not present in `oldSpec`) and have defaultable values:
- New boolean props
- New enum/union props
- New size/variant values that need token defaults

For each NEW defaultable prop, run the same default review format as `/spec`:
- `prop`: name
- `proposed`: value
- `why`: one sentence
- `confidence`: high/medium/low

**Critical**: Do NOT re-review existing defaults. They were already approved in the original spec's `defaultReview`. Only new props get reviewed.

If there are no new defaults to review, skip this step entirely.

Support quick commands:
- `accept all` — accept all proposed new defaults
- `override <prop>=<value>` — override specific new default

### Step 7 — Update defaultReview

Update the `defaultReview` block:
- Keep `status: 'approved'`
- Set `decisionSource: 'user-confirmed'` (or `'accept-all'` if user accepted all new defaults)
- Merge new overrides into existing `overrides` map (preserve old overrides)

### Step 8 — Compute new specHash and write

Recompute specHash from the updated spec object. Write the updated spec file with the new hash in the header comment.

---

## Rules

1. **Spec must exist** — REFUSE if no spec file found
2. **Preserve approved defaults** — never re-review or modify existing approved defaults unless the user's change request explicitly targets them
3. **Only review NEW defaults** — new props/fields that need default values
4. **Token validation** — all new token values must reference `var(--move-*)` from `references/component/tokens-semantic.ts`
5. **Spec must still satisfy ComponentSpec** — the output must type-check against the interface
6. **Show diff before writing** — user must see and approve what changed
7. **No specHash collision** — always recompute hash from final spec content
8. **Deterministic** — same change request on same spec produces same output
9. **Do not regenerate** — this skill only updates the spec. User runs `/generate-all` separately
10. **Change scope** — only modify what the change request asks for. Do not "clean up" or refactor unrelated parts of the spec
11. **Default value policy** — same as `/spec`: no `undefined` defaults, use explicit values or `null`
12. **Compound components** — changes can target specific sub-components (e.g. "add size prop to Container")
