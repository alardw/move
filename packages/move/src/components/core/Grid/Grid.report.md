<!-- Validated: 2026-03-01 | specHash: PLACEHOLDER -->
# Grid -- Validation Report

| Rule | Status | Notes |
|------|--------|-------|
| A1   | PASS   | `'use client'` at line 1 |
| A2   | PASS   | `GridProps extends Record<string, unknown>`, `GridCellProps extends Record<string, unknown>` |
| A3   | PASS   | Move-specific props in moveProps/defaults: cols, rows, columns, minChildWidth, gap(default), rowGap, columnGap, collapseBelow, span, rowSpan, offset, order, align |
| A4   | PASS   | Defaults in `defaults` object: `{ gap: 'md' }` |
| A5   | PASS   | Slots `['root']` used via cx/sp in GridRoot; `['cell']` used via cx/sp in GridCell |
| A6   | PASS   | `cx('root', ...)` on root, `cx('cell', ...)` on cell |
| A7   | PASS   | `sp('root')` destructured with className/style/rest; `sp('cell')` same |
| A8   | PASS   | `{...attrs}` and `{...spRest}` spread on root div in both GridRoot and GridCell |
| A9   | PASS   | `ref={ref}` on root element in both GridRoot and GridCell |
| A10  | N/A    | No variant/size/state -- Grid is presentational layout |
| A11  | PASS   | Import from `../../../engine` |
| A12  | PASS   | All Move-specific props in moveProps or defaults |
| A13  | N/A    | No animations declared in spec |
| A14  | PASS   | All renderContracts implemented: inline-style-layout, cell-inline-style-placement, grid-template-resolution, collapse-below-resize-observer |
| A15  | PASS   | All spec props present in public API |
| A16  | PASS   | Runtime default `gap: 'md'` matches spec |
| A17  | PASS   | Spec `defaultReview` present and approved |
| A18  | PASS   | No undefined defaults |
| A19  | PASS   | Only defaultable prop is `gap`, covered |
| B1   | PASS   | `.root` and `.cell` classes match slots |
| B2   | PASS   | No hard-coded colors/spacing (structural CSS grid only) |
| B3   | N/A    | No component tokens (spec notes: "No component-specific CSS custom property tokens") |
| B4   | PASS   | `[data-collapsed]` selector present for collapse state |
| B5   | N/A    | No component tokens to validate naming |
| B6   | PASS   | No CSS animations/keyframes/transitions |
| B7   | PASS   | No `var(--move-*)` references in CSS (layout uses inline styles with GAP_MAP) |
| C1   | PASS   | index.ts exports Grid, GridProps, GridCellProps, GridGap |
| C2   | PASS   | Grid in src/index.ts with correct types |
| D1   | PASS   | Demo file exists: demo/src/demos/generated/GridDemo.tsx |
| D2   | PASS   | Exports `demo` with name, category, render |
| D3   | PASS   | Controls: cols (number), gap (select), rows (number), minChildWidth (text) |
| D4   | PASS   | No animation overrides in demo |
| D5   | N/A    | No controlled booleans |
| D6   | N/A    | No text-bearing props |
| D7   | PASS   | No undefined literals in initialProps |
| D8   | N/A    | No text defaults to validate |
| E1   | N/A    | No user-visible strings |
| E2   | N/A    | No built-in icons |
| E3   | N/A    | No icons |
| F1   | PASS   | Component in core category |
| F2   | PASS   | src/index.ts path matches location |
| G1   | PASS   | Grid.test.tsx exists |
| G2   | PASS   | 31/31 tests pass |

Spec drift: none
Issues: 0
