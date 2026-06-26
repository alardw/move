<!-- Validated: 2026-03-01 | sourceHash: generated | specHash: PLACEHOLDER -->
# InputText — Validation Report

| Rule | Status | Notes |
|------|--------|-------|
| A1   | PASS   | `'use client'` at line 1 |
| A2   | PASS   | Props extends `Record<string, unknown>` |
| A3   | PASS   | Move-specific props in moveProps/defaults |
| A4   | PASS   | Defaults in `defaults` object |
| A5   | PASS   | Slots match sp()/cx() calls: root, input, iconLeft, iconRight |
| A6   | PASS   | cx() used for all slot classNames |
| A7   | PASS   | sp() called for all 4 slots with proper destructuring |
| A8   | PASS   | spRest spread on root; attrs spread on input (per render contract) |
| A9   | PASS   | ref forwarded via useMergedRef to native input |
| A10  | PASS   | data-variant, data-size, data-invalid, data-disabled, data-readonly used |
| A11  | PASS   | Imports from engine/ |
| A12  | PASS   | No Move props leak to HTML |
| A13  | N/A    | No animations |
| A14  | PASS   | All renderContracts implemented |
| A15  | PASS   | All spec props present in source |
| A16  | PASS   | Defaults match spec (variant=outlined, size=md, type=text) |
| A17  | PASS   | defaultReview approved |
| A18  | PASS   | No undefined defaults |
| A19  | PASS   | All defaultable props covered |
| B1   | PASS   | .root, .input, .iconLeft, .iconRight classes present |
| B2   | PASS   | All values use design tokens |
| B3   | PASS   | Component tokens on .root |
| B4   | PASS   | data-attribute selectors for variant/size/state |
| B5   | PASS   | Token naming: --move-input-* |
| B6   | PASS   | Only hover transition (allowed exception) |
| B7   | PASS   | All token references valid |
| C1   | PASS   | index.ts exports component + types |
| C2   | PASS   | Added to src/index.ts |
| C3   | N/A    | No hook |
| D1   | PASS   | Demo file exists |
| D2   | PASS   | Exports demo with name, category, render |
| D3   | PASS   | Controls align with component props |
| D4   | N/A    | No animations |
| D5   | N/A    | No controlled booleans |
| D6   | PASS   | Placeholder text defaults provided |
| D7   | PASS   | No undefined literals |
| D8   | PASS   | Text defaults follow generation policy |
| D13  | PASS   | Consumer-first demo structure with sections |
| E1   | N/A    | No user-visible strings (input component) |
| E2   | N/A    | No built-in icons |
| F1   | PASS   | form/ category correct |
| F2   | PASS   | src/index.ts path matches |
| G1   | PASS   | Test file exists |
| G2   | PASS   | All 26 tests pass |

Spec drift: none
Issues: 0
