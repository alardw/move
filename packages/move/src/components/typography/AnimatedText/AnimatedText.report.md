<!-- Validated: 2026-06-27 | sourceHash: 224caa4a | specHash: e7eefb38 -->
# AnimatedText — Validation Report

| Rule | Status | Notes |
|------|--------|-------|
| A1   | PASS   | `'use client'` on line 1 |
| A2   | PASS   | `AnimatedTextProps extends Record<string, unknown>` |
| A3   | PASS   | All move-specific props in `moveProps` + `defaults` |
| A4   | PASS   | Defaults in `defaults` object, none inline |
| A5   | PASS   | Single `root` slot, used via `sp('root')`/`cx('root')` |
| A6   | PASS   | `cx('root', …)` on the rendered element |
| A7   | PASS   | `sp('root')` destructured `{ className, style, ...spRest }` |
| A8   | PASS   | `{...attrs}` and `{...spRest}` spread on root |
| A9   | PASS   | `ref={mergedRef}` (factory ref merged with hook ref via `useMergedRef`) |
| A10  | PASS   | `data-by`, `data-effect`, conditional `data-animated` |
| A11  | PASS   | Imports from `../../../engine` and `../../../animation` only |
| A12  | PASS   | No move-internal props leak (all in moveProps) |
| A13  | PASS   | No declarative `animations`; animation is the `textSplit` Tier-2 capability via `useSplitText` |
| A14  | PASS   | renderContracts implemented: accessible split, reduced-motion bypass, re-split on change, dynamic element, inView observer, no-layout-shift |
| A15  | PASS   | All spec props present in public API |
| A16  | PASS   | Runtime defaults match spec (as=span, by=word, effect=fade, trigger=inView, once=true, stagger=null, delay=0, duration=600) |
| A17  | PASS   | `defaultReview.status === 'approved'` |
| A18  | PASS   | No `undefined` defaults (`stagger` is explicit `null`) |
| A19  | PASS   | All defaultable props covered |
| A20  | PASS   | No inline `<svg>` — component renders text only |
| B1   | PASS   | `.root` class present |
| B2   | PASS   | No hard-coded color/spacing values (component inherits typography) |
| B3   | PASS   | No `:root` tokens; spec declares no component tokens |
| B4   | PASS   | `[data-by='line']` selector present |
| B5   | PASS   | n/a — no component CSS variables |
| B6   | PASS   | No `@keyframes`; the reveal runs through `useSplitText` (anime.js), declared as `textSplit` |
| B7   | PASS   | No `var(--move-*)` references in CSS |
| C1   | PASS   | `index.ts` exports component + all 5 types |
| C2   | PASS   | Exported from `src/index.ts` |
| C3   | n/a    | No headless hook (`hasHook: false`) |
| E1   | PASS   | No hardcoded `aria-label` literals, no flat `*Label` props; accessible string injected by anime.js `splitText({ accessible: true })` |
| E2   | n/a    | No icons |
| F1   | PASS   | Lives in `typography/` |
| F2   | PASS   | `src/index.ts` path matches location |
| G1   | PASS   | `AnimatedText.test.tsx` present |
| G2   | PASS   | 13/13 tests pass; full suite 1770/1770 |

Spec drift: none (sourceHash header in sync; `check:spec-drift` 68/68 clean)
`check:animation-capabilities`: 68 components — 0 errors, 0 warnings (`textSplit` enforced both directions)
Issues: 0

## Notes

This is the first component using the new Tier-2 `textSplit` capability. Supporting
infrastructure landed alongside it:
- `useSplitText` primitive in `src/animation/` (barrel-exported), wrapping anime.js
  `splitText` — the component never imports `animejs` directly.
- `textSplit` added to the `AnimationCapability` union in `src/spec-type.ts` (with doc-comment).
- `scripts/checks/animation-capabilities.mjs` detects `useSplitText` and enforces
  `animationCapabilities: ['textSplit']` symmetrically (like `slidingIndicator`).
- Registry prose added to skills `references/component/engine-api.ts` + `animation-map.ts`.
- `vitest.setup.ts` gained no-op `IntersectionObserver` and `document.fonts` mocks
  (jsdom implements neither; anime.js `splitText` reads `document.fonts.status`).
