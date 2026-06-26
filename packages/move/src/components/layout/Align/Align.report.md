# Align — Validation Report
Generated from Align.spec.ts (schemaVersion: 6, specHash: 6cbf8097)

## Checklist

| Rule | Status |
|------|--------|
| Provenance headers on all files | PASS |
| Props interface extends Record<string, unknown> | PASS |
| Factory contract (sp/cx/attrs pattern) | PASS |
| CSS: tokens on .root | PASS (no tokens declared) |
| CSS: data-attribute selectors for layout props | PASS |
| CSS: no hardcoded values | PASS |
| CSS: no CSS animations | PASS |
| Compound component pattern (Object.assign) | PASS |
| Barrel exports (index.ts) | PASS |
| src/index.ts exports | PASS |
| className/style passthrough on root | PASS |
| Ref forwarding | PASS |
| Layout props via data-attributes (not inline styles) | PASS |
| Tests: all passing | PASS (13/13) |

## Delta Report (vs original)

### Structural changes
- **Layout props moved from JS to CSS**: Original used `GAP_MAP` and `ALIGN_MAP` JS objects to set inline `gap` and `alignItems` styles. Generated uses `data-gap` and `data-align` attributes with CSS selectors. This follows css-contract.md.
- **className passthrough**: Original did not pass `props.className` to `cx()` on root. Generated correctly includes `props.className` in `cx('root', props.className, spClass)`.
- **moveProps**: Original had `moveProps: ['gap', 'align']`. Generated has `moveProps: []` since gap/align are in `defaults` and filtered automatically.

### CSS changes
- **Added data-attribute selectors**: 6 `[data-gap='...']` selectors and 5 `[data-align='...']` selectors replace inline JS style application.
- **Default fallbacks**: Added `.root:not([data-gap])` and `.root:not([data-align])` CSS selectors for safe defaults.
- **Token references preserved**: All gap values use the same `var(--move-spacing-*)` tokens as the original's JS map.

### Props
- No props added or removed.

### Behavior
- Visual output is identical — same grid layout, same gap values, same alignment behavior.
