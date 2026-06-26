# Heading -- Validation Report
Generated from Heading.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)

## Checklist

| Rule | Status | Notes |
|------|--------|-------|
| A1: `'use client'` at line 1 | PASS | |
| A2: Props extends `Record<string, unknown>` | PASS | |
| A3: Move-specific props in `moveProps`/`defaults` | PASS | level, weight, color, tracking in defaults; size, align, truncate in moveProps |
| A4: Default values in `defaults` object | PASS | |
| A5: `slots` array matches `sp()`/`cx()` calls | PASS | Single slot: root |
| A6: `cx()` for every className on slotted elements | PASS | |
| A7: `sp()` called for every slot | PASS | |
| A8: `{...attrs}` and `{...spRest}` on root | PASS | |
| A9: `ref` forwarded to root | PASS | |
| A10: `data-*` attributes used | PASS | data-size, data-weight, data-color, data-tracking, data-align, data-truncate |
| A11: Import paths use `engine/` | PASS | |
| A12: No Move-internal props leak to HTML | PASS | |
| A14: Spec behavior contracts preserved | PASS | level-to-element, level-to-size-mapping, data-align-conditional, data-truncate-boolean |
| A15: Spec prop parity | PASS | All spec props present |
| A16: Default parity with spec | PASS | level=2, weight=bold, color=base, tracking=tight |
| B1: Matching slot class | PASS | .root |
| B2: Design token variables | PASS | All values use var(--move-*) |
| B3: Component tokens on `.root` | PASS | |
| B4: Data-attribute selectors | PASS | |
| B5: CSS variable naming | PASS | --move-heading-* |
| B6: No CSS animations | PASS | |
| B7: All token references valid | PASS | --move-spacing-2xl replaced with --move-spacing-xl |
| C1: Barrel exports | PASS | |
| C2: Component in `src/index.ts` | PASS | |
| D1: Demo file exists | PASS | |
| D2: Demo exports | PASS | |
| D3: Controls align with props | PASS | |
| G1: Test file exists | PASS | |
| G2: Tests pass | PASS | 40/40 |

Spec drift: none
Issues: 0

## Delta Report (vs original)

### Token changes
- `--move-spacing-2xl` does NOT exist in semantic token set. Original CSS used it for margin-top on `3xl` and `4xl` sizes.
- Replaced `--move-spacing-2xl` with `--move-spacing-xl` (nearest valid token) in 3 locations:
  - `.root[data-size='3xl']` margin-top
  - `.root:not([data-size])` margin-top (same rule as 3xl)
  - `.root[data-size='4xl']` margin-top

### CSS changes
- All token references now resolve to valid semantic tokens per tokens-semantic.ts
- No other CSS changes from original

### Props
- No props added or removed. Identical interface.

### Structural changes
- `moveProps` now lists only `['size', 'align', 'truncate']` -- `level`, `weight`, `color`, and `tracking` are in `defaults` and thus auto-stripped by the factory.
- Defaults use type assertions (e.g., `2 as HeadingLevel`) for TypeScript safety.

### Behavior
- Visual output near-identical. Minor difference in margin-top for 3xl/4xl headings due to --move-spacing-2xl -> --move-spacing-xl (the original token did not exist, so this is a correction rather than a regression).
- All render contracts preserved: level-to-element mapping, level-to-size derivation, conditional data-align, boolean data-truncate.
