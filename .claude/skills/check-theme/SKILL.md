# Theme Validation Agent

You are auditing Move theme files for conformance with the design token architecture. Read the theme source files and the primitive color definitions, then report pass/fail against every rule below.

---

## How to Run

**Input:** A theme name (e.g. "light", "dark") or "all" to check every theme file under `src/styles/themes/`.

**Process:**
1. Read the primitive color definitions in `src/styles/tokens/primitives/colors.css`
2. Read the semantic token defaults in `src/styles/tokens/semantic.css`
3. Read the theme type definitions in `src/styles/themes/types.ts`
4. Read each theme file: `src/styles/themes/{name}.ts`
5. Check each rule below and report the result
6. Summarize findings

---

## Validation Rules

### A. Token Values — Primitive References

| #  | Rule | How to check |
|----|------|-------------|
| A1 | No hardcoded hex colors | Every color token value must use `var(--move-{scale}-{shade})` or `var(--move-white)` / `var(--move-black)`. No raw `#xxx` or `#xxxxxx` values. |
| A2 | All referenced primitives exist | Every `var(--move-*)` reference in a token value must correspond to a variable defined in `src/styles/tokens/primitives/colors.css`. |
| A3 | Non-color values are allowed as literals | `rgba()` values (overlay), HSL strings (shadow-color), `transparent`, and computed shadow strings from `createShadowPalette` are exempt from A1. |

### B. Token Completeness

| #  | Rule | How to check |
|----|------|-------------|
| B1 | Theme implements all required tokens | Every key in the `ThemeTokens` interface in `types.ts` must be present in the theme's `tokens` object. |
| B2 | No extra tokens | The theme's `tokens` object must not contain keys that are not in the `ThemeTokens` interface. |
| B3 | Animation config is complete | The theme must have `animation.spring` (mass, stiffness, damping), `animation.duration` (fast, normal, slow), and `animation.reducedMotion`. |

### C. Semantic Token Defaults (`semantic.css`)

| #  | Rule | How to check |
|----|------|-------------|
| C1 | CSS defaults reference primitives | Every color value in `semantic.css` uses `var(--move-{scale}-{shade})`, not hardcoded hex. |
| C2 | Every `ThemeTokens` key has a CSS default | Each semantic token key from `types.ts` should have a corresponding `--move-*` declaration in `semantic.css` (except shadows which are generated). |

### D. Token Architecture — No Semantic-to-Semantic References

| #  | Rule | How to check |
|----|------|-------------|
| D1 | Theme values do not reference semantic tokens | Token values must not use `var(--move-bg-*)`, `var(--move-fg-*)`, `var(--move-border-*)`, `var(--move-primary*)`, `var(--move-secondary*)`, `var(--move-success*)`, `var(--move-warning*)`, `var(--move-error*)`, `var(--move-info*)`, `var(--move-focus-*)`, `var(--move-scrollbar-*)`, or any other semantic token. Only primitive color vars and literal non-color values are allowed. |
| D2 | CSS defaults do not reference other semantic tokens | In `semantic.css`, no semantic token should be defined in terms of another semantic token. Each must reference only primitive vars. (Exception: the `--move-shadow-*` semantic aliases like `--move-shadow-subtle: var(--move-shadow-sm)` are allowed since those form a separate semantic layer.) |

### E. Naming Conventions

| #  | Rule | How to check |
|----|------|-------------|
| E1 | Theme has a `name` property | The theme object has a non-empty `name` string. |
| E2 | Token keys match `--move-{category}-{property}` pattern | All token keys follow the established naming convention (e.g. `--move-bg-base`, `--move-primary-hover`). |

---

## Output Format

For each theme, output a table:

```
## {ThemeName} Theme — src/styles/themes/{name}.ts

| Rule | Status | Notes |
|------|--------|-------|
| A1   | PASS   |       |
| A2   | PASS   |       |
| A3   | PASS   |       |
| B1   | FAIL   | Missing token: --move-scrollbar-thumb |
| ...  | ...    | ...   |

Issues: {count}
```

For semantic.css, output a separate table:

```
## Semantic Defaults — src/styles/tokens/semantic.css

| Rule | Status | Notes |
|------|--------|-------|
| C1   | PASS   |       |
| C2   | FAIL   | Missing default for --move-scrollbar-track |
| D2   | PASS   |       |

Issues: {count}
```

At the end, output a summary:

```
## Summary

| Source        | Pass | Fail | Issues |
|---------------|------|------|--------|
| light.ts      | 10   | 1    | A1: #ffffff found for --move-overlay |
| dark.ts       | 10   | 1    | A1: #ffffff found for --move-overlay |
| semantic.css  | 3    | 0    |        |
```

---

## Important Notes

- Only flag actual violations, not style preferences
- `rgba()` overlay values, HSL shadow-color strings, and `transparent` are exempt from the "no hardcoded values" rule (A3)
- Shadow values from `createShadowPalette()` are computed at import time and are exempt from A1
- The key distinction is: **primitives** (`--move-gray-600`) are allowed as references, **semantic tokens** (`--move-fg-muted`) are not allowed as references in theme values
- If a theme value uses a hex color that closely matches (but doesn't exactly match) a primitive, flag it as a potential mapping opportunity
