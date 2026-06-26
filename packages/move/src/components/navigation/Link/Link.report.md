<!-- Validated: 2026-03-01 | sourceHash: PLACEHOLDER | specHash: PLACEHOLDER -->
# Link -- Validation Report

| Rule | Status | Notes |
|------|--------|-------|
| A1   | PASS   | `'use client'` at line 1 |
| A2   | PASS   | `LinkProps extends Record<string, unknown>` |
| A3   | PASS   | Move-specific props in `moveProps` (size, external) and `defaults` (variant, underline, asChild) |
| A4   | PASS   | Defaults in `defaults` object, not inline |
| A5   | PASS   | `slots: ['root']` matches `sp('root')` and `cx('root')` usage |
| A6   | PASS   | `cx('root', ...)` used for className |
| A7   | PASS   | `sp('root')` called and destructured correctly |
| A8   | PASS   | `{...attrs}` and `{...spRest}` spread on root |
| A9   | PASS   | `ref={ref}` on root element |
| A10  | PASS   | `data-variant`, `data-underline`, `data-size` (conditional) used |
| A11  | PASS   | Import from `'../../../engine'` |
| A12  | PASS   | All Move-specific props stripped from attrs |
| A13  | N/A    | No animations in spec |
| A14  | PASS   | Render contracts: external-attrs and size-conditional both implemented |
| A15  | PASS   | All spec props present in component (variant, underline, size, external, asChild, children) |
| A16  | PASS   | Defaults match spec: variant='default', underline='hover', asChild=false |
| A17  | PASS   | Spec has `defaultReview.status: 'approved'` |
| A18  | PASS   | No undefined defaults |
| A19  | PASS   | All defaultable props have explicit decisions |
| B1   | PASS   | `.root` class exists matching slot |
| B2   | PASS   | All values use design token variables |
| B3   | PASS   | Component tokens on `.root`, not `:root` |
| B4   | PASS   | Data-attribute selectors for variant, underline, size |
| B5   | PASS   | Variables named `--move-link-*` |
| B6   | PASS   | No CSS keyframes/animation; transition only for hover color (allowed) |
| B7   | PASS   | All `var(--move-*)` references resolve to real tokens |
| C1   | PASS   | `index.ts` exports Link + LinkProps + LinkVariant + LinkUnderline + LinkSize |
| C2   | PASS   | Link added to `src/index.ts` |
| C3   | N/A    | No headless hook |
| D1   | PASS   | Demo file exists at `demo/src/demos/generated/LinkDemo.tsx` |
| D2   | PASS   | Exports `demo` with name, category, render |
| D3   | PASS   | Controls align with component props |
| D4   | N/A    | No animations |
| D5   | N/A    | No controlled booleans |
| D6   | PASS   | children defaults to 'Link' |
| D7   | PASS   | No undefined literals in initialProps |
| D8   | PASS   | Text defaults follow generation policy |
| D9   | N/A    | No spec.demo contract |
| D10  | N/A    | No reference images |
| D11  | N/A    | Not compound |
| D12  | PASS   | Generated file matches generation patterns |
| D13  | N/A    | No multiple samples |
| E1   | N/A    | No user-visible strings requiring labels |
| E2   | N/A    | No built-in icons |
| E3   | N/A    | No icons |
| E4   | N/A    | No icon slots |
| F1   | PASS   | Component in `core` category folder |
| F2   | PASS   | `src/index.ts` path matches actual location |
| G1   | PASS   | Test file exists (`Link.test.tsx`) |
| G2   | PASS   | All 26 tests pass |

Spec drift: none
Issues: 0
