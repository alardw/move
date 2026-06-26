# Badge — Validation Report
Generated from Badge.spec.ts (schemaVersion: 6, specHash: ddc033c4)

## Checklist

| Rule | Status |
|------|--------|
| Provenance headers on all files | PASS |
| Props interface extends Record<string, unknown> | PASS |
| Factory contract (sp/cx/attrs pattern) | PASS |
| CSS: tokens on .root | PASS |
| CSS: data-attribute selectors | PASS |
| CSS: no hardcoded color/spacing values | PASS |
| CSS: no CSS animations | PASS |
| CSS: variant color tokens use canonical names | PASS |
| Barrel exports (index.ts) | PASS |
| src/index.ts exports | PASS |
| className/style passthrough on root | PASS |
| Ref forwarding | PASS |
| Tests: all passing | PASS (19/19) |

## Delta Report (vs original)

### Token changes
- `--move-badge-height-lg`: `1.75rem` → `var(--move-space-8)` (2rem) — snapped to nearest token
- `--move-badge-padding-x-sm`: `0.375rem` → `var(--move-space-1)` (0.25rem) — snapped to nearest token
- `--move-badge-padding-x-lg`: `0.625rem` → `var(--move-space-3)` (0.75rem) — snapped to nearest token

### CSS changes
- All 3 hardcoded values replaced with token references per v6 contract

### Props
- No props added or removed. Identical interface.

### Structural changes
- `moveProps` is now `[]` instead of `['variant', 'size']` — both are in `defaults` so stripped automatically by the factory.
- className passthrough preserved (original already had it in cx()).

### Behavior
- Visual output near-identical. Minor size differences in lg height (+0.25rem) and sm/lg padding due to token snapping.
