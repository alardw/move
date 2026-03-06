# ChatBubble — Validation Report
Generated from ChatBubble.spec.ts (schemaVersion: 6, specHash: af768c01)

## Checklist

| Rule | Status |
|------|--------|
| Provenance headers on all files | PASS |
| Props interface extends Record<string, unknown> | PASS |
| Factory contract (sp/cx/attrs pattern) | PASS |
| CSS: tokens on .root/.container | PASS |
| CSS: data-attribute selectors | PASS |
| CSS: variant color tokens use canonical names | PASS |
| CSS: no CSS animations | PASS |
| Compound component pattern (plain object) | PASS |
| Context: Root→Container placement | PASS |
| Avatar: internal Move Avatar rendering | PASS |
| Animation: lifecycle enter with stagger | PASS |
| Barrel exports (index.ts) | PASS |
| src/index.ts exports | PASS |
| className/style passthrough | PASS |
| Ref forwarding | PASS |
| Tests: all passing | PASS (13/13) |

## Delta Report (vs original)

### Token changes
- `--move-spacing-2xs` (header/footer padding) → `var(--move-spacing-xs)` — snapped; `--move-spacing-2xs` does not exist in semantic tokens.

### CSS changes
- Header `padding-bottom` and footer `padding-top` changed from `var(--move-spacing-2xs)` to `var(--move-spacing-xs)`.
- All other CSS preserved identically.

### Props
- `animate` type changed from `ElementAnimate` to `LifecycleAnimate` (canonical trigger type).
- No props added or removed.

### Structural changes
- Identical compound structure with 6 sub-components via plain object export.
- Animation uses raw `animate()` + `toAnimeParams` (preserved from original; not migrated to hook since it uses custom stagger logic).

### Behavior
- Visual output identical. Minor spacing change in header/footer padding (2xs→xs).
