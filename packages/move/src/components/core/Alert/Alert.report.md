<!-- Validated: 2026-02-28 | specHash: b9fbaaa9 -->
# Alert — Validation Report

| Rule | Status | Notes |
|------|--------|-------|
| A1   | PASS   | `'use client'` at line 1 |
| A2   | PASS   | Props extends `Record<string, unknown>` |
| A3   | PASS   | Move-specific props in moveProps/defaults |
| A4   | PASS   | Defaults in `defaults` object |
| A5   | PASS   | All 6 slots listed and used |
| A6   | PASS   | `cx()` on all slotted elements |
| A7   | PASS   | `sp()` called for all 6 slots |
| A8   | PASS   | `{...attrs}` and `{...spRest}` on root |
| A9   | PASS   | `ref={mergedRef}` on root |
| A10  | PASS   | data-variant, data-size, data-surface used |
| A11  | PASS   | Imports from `../../../engine` |
| A12  | PASS   | No Move-internal props leak to HTML |
| A13  | PASS   | DEFAULT_LIFECYCLE matches spec defaultConfig |
| A14  | PASS   | dismissBehavior=unmountAfterExit implemented |
| A15  | PASS   | All spec props in public API |
| A16  | PASS   | Runtime defaults match spec (variant=info, size=md, icon=true, closable=false) |
| A17  | PASS   | defaultReview present and approved |
| A18  | PASS   | No undefined defaults |
| A19  | PASS   | All defaultable props covered |
| B1   | PASS   | All slot classes present |
| B2   | PASS   | Design tokens used (small px tweaks acceptable) |
| B3   | PASS   | Component tokens on `.root` |
| B4   | PASS   | data-attribute selectors for variant/size |
| B5   | PASS   | `--move-alert-*` naming |
| B6   | PASS   | No CSS animations (transition on .close:hover is acceptable) |
| B7   | PASS   | All token references verified |
| C1   | PASS   | index.ts exports Alert + types |
| C2   | PASS   | Alert in src/index.ts |
| D1   | PASS   | Demo file exists |
| D2   | PASS   | Exports demo with name, category, render |
| D3   | PASS   | Controls align with spec |
| D4   | PASS   | No animation overrides in demo |
| D5   | PASS   | No forced controlled booleans |
| D6   | PASS   | Text props have visible defaults |
| D7   | PASS   | No undefined literals |
| D8   | PASS   | Text defaults follow generation policy |
| E1   | PASS   | Close label via labels prop with defaults |
| E2   | PASS   | useResolvedIcon for built-in icons |
| E3   | PASS   | Essential icons in BUILTIN_ICONS |
| F1   | PASS   | Component in core category |
| F2   | PASS   | src/index.ts path matches location |
| G1   | PASS   | Test file exists |
| G2   | PASS   | 26/26 tests pass |

Spec drift: none
Issues: 0
