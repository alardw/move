<!-- Validated: 2026-03-01 | sourceHash: c909e0e0 | specHash: c909e0e0 -->
# Avatar -- Validation Report

## Component File (Avatar.tsx)

| Rule | Status | Notes |
|------|--------|-------|
| A1   | PASS   | `'use client'` at line 1 |
| A2   | PASS   | All props interfaces extend `Record<string, unknown>` |
| A3   | PASS   | Move-specific props in `moveProps`/`defaults` (size, animate, staggerDelay, onLoadingStatusChange, delayMs) |
| A4   | PASS   | Defaults in `defaults` object, no inline defaults |
| A5   | PASS   | Slots match: root, image, fallback, group -- all used in `cx()`/`sp()` |
| A6   | PASS   | `cx()` used for all className on slotted elements |
| A7   | PASS   | `sp()` called for every slot with destructured pattern |
| A8   | PASS   | `{...attrs}` and `{...spRest}` on root elements |
| A9   | PASS   | `ref={mergedRef}` on Root, `ref={ref}` on other sub-components |
| A10  | PASS   | `data-size` on Root |
| A11  | PASS   | Imports from `../../../engine` and `../../../animation` |
| A12  | PASS   | All Move-specific props in moveProps/defaults |
| A13  | PASS   | Animation default matches spec `defaultConfig`: `{ enter: { scale: { value: [0, 1], easing: 'poppy' } } }` |
| A14  | PASS   | No controlled props, no dismiss behavior -- matches spec |
| A15  | PASS   | All spec props present: size, animate, src, alt, onLoadingStatusChange, delayMs, staggerDelay, children |
| A16  | PASS   | Runtime defaults: size='md', staggerDelay=50 -- matches spec |
| A17  | PASS   | Spec has `defaultReview` block with status='approved' |
| A18  | PASS   | No undefined defaults |
| A19  | PASS   | All defaultable props covered |

## CSS Module (Avatar.module.css)

| Rule | Status | Notes |
|------|--------|-------|
| B1   | PASS   | Classes: `.root`, `.image`, `.fallback`, `.group` -- matches slots |
| B2   | PASS   | All values use `var(--move-*)` tokens |
| B3   | PASS   | Component tokens on `.root` |
| B4   | PASS   | `[data-size]` selectors with `:not()` fallback for md |
| B5   | PASS   | Token naming: `--move-avatar-*` |
| B6   | PASS   | No CSS `@keyframes`/`animation`/`transition` for state/entrance/exit |
| B7   | PASS   | Token references match original component CSS |

## Exports

| Rule | Status | Notes |
|------|--------|-------|
| C1   | PASS   | `index.ts` exports Avatar + all types |
| C2   | PASS   | `src/index.ts` line 117-118 exports Avatar |
| C3   | N/A    | No headless hook |

## Demo File

| Rule | Status | Notes |
|------|--------|-------|
| D1   | PASS   | Demo exists at `demo/src/demos/generated/AvatarDemo.tsx` |
| D2   | PASS   | Exports `demo` with name, category, render |
| D3   | PASS   | Controls align: sample select, size, src, alt, text, delayMs |
| D4   | PASS   | No animation overrides in demo |
| D5   | N/A    | No controlled booleans |
| D6   | PASS   | Fallback text defaults to 'AW' |
| D7   | PASS   | No undefined literals in initialProps |
| D8   | PASS   | Defaults from demo.spec.ts |
| D9   | PASS   | Demo reflects Avatar.demo.spec.ts samples: single, fallbackOnly, group |
| D10  | N/A    | No reference images |
| D11  | PASS   | Controls nested under subComponents |
| D12  | PASS   | Matches generation pattern |
| D13  | PASS   | Consumer samples visible via select control |

## Accessibility & i18n

| Rule | Status | Notes |
|------|--------|-------|
| E1   | N/A    | No user-visible strings (fallback content is user-provided) |
| E2   | N/A    | No built-in icons |
| E3   | N/A    | No essential icons |
| E4   | N/A    | No icon slots |

## Placement

| Rule | Status | Notes |
|------|--------|-------|
| F1   | PASS   | `core` category, at `src/components/core/Avatar/` |
| F2   | PASS   | `src/index.ts` path matches |

## Tests

| Rule | Status | Notes |
|------|--------|-------|
| G1   | PASS   | `Avatar.test.tsx` exists |
| G2   | PASS   | All 18 tests pass |

## Spec Drift

Spec drift: none (provenance hash matches spec hash: c909e0e0)

## Summary

Issues: 0
Status: **PASS**
