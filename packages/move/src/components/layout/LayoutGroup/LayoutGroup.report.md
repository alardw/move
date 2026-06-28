<!-- Validated: 2026-06-28 | sourceHash: generated | specHash: ca963d3b -->
# LayoutGroup — Validation Report

| Rule | Status | Notes |
|------|--------|-------|
| A1   | PASS   | `'use client'` on line 1 |
| A2   | PASS   | `LayoutGroupProps extends Record<string, unknown>` |
| A3   | PASS   | All move-specific props in `moveProps` + `defaults` (as, enter, exit, duration, stagger, disabled) |
| A4   | PASS   | Defaults in `defaults` object |
| A5   | PASS   | Single `root` slot, used via `sp`/`cx` |
| A6   | PASS   | `cx('root', …)` on the root |
| A7   | PASS   | `sp('root')` destructured |
| A8   | PASS   | `{...attrs}` + `{...spRest}` on root |
| A9   | PASS   | `ref={mergedRef}` (engine ref + useAutoLayout ref) |
| A10  | PASS   | `data-enter` / `data-exit` reflect props |
| A11  | PASS   | Imports from `../../../engine` + `../../../animation` |
| A12  | PASS   | No internal props leak (runtime DOM-leak guard green) |
| A13  | N/A    | No declarative `animations` — Tier-2 `layoutFlip` capability |
| A20  | N/A    | No icons |
| B-*  | PASS   | Minimal CSS (display:block); no @keyframes |
| C1   | PASS   | `index.ts` exports component + types |
| C2   | PASS   | Exported from `src/index.ts` |
| E1   | N/A    | No user-facing strings |
| G1   | PASS   | `LayoutGroup.test.tsx` present |
| G2   | PASS   | Tests pass (10) |

Animation capability: `layoutFlip` (useAutoLayout primitive) — enforced by `check:animation-capabilities`.
Spec drift: none (68/68 clean).
Issues: none.
