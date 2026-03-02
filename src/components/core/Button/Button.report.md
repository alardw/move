# Button — Validation Report
Generated from Button.spec.ts (schemaVersion: 6, specHash: 2082df0a)

## Checklist

| Rule | Status |
|------|--------|
| Provenance headers on all files | PASS |
| Props interface extends Record<string, unknown> | PASS |
| Factory contract (sp/cx/attrs pattern) | PASS |
| CSS: tokens on .root | PASS |
| CSS: data-attribute selectors | PASS |
| CSS: variant color tokens use canonical names | PASS |
| CSS: no CSS animations (transition OK for hover) | PASS |
| Animation wiring (useInteractionAnimate) | PASS |
| Handler merging (mouse/keyboard events) | PASS |
| useMergedRef (factory ref + animation ref) | PASS |
| asChild support (Radix Slot) | PASS |
| Focus ring (:focus-visible) | PASS |
| Disabled state | PASS |
| Barrel exports (index.ts) | PASS |
| src/index.ts exports | PASS |
| className/style passthrough on root | PASS |
| Ref forwarding | PASS |
| Tests: all passing | PASS (18/18) |

## Delta Report (vs original)

### Token changes
- None — all 14 component tokens preserved with identical semantic token values.

### CSS changes
- Identical to original. All variant, size, hover, active, focus, and disabled selectors preserved.
- ButtonGroup gap changed from `0.5rem` to `var(--move-spacing-sm)` (same value, now token-referenced).

### Props
- `elevation` type simplified from `ElevationLevel` to `number` (ElevationLevel is a number type).
- `animate` type changed from `ElementAnimate` to `InteractionAnimate` (canonical trigger type name).
- No props added or removed.

### Structural changes
- Export pattern changed from factory `subComponents` to `Object.assign(ButtonRoot, { Group })` for consistency with other compound components.
- `moveProps` reduced: `variant`, `size`, `asChild` moved to `defaults` (auto-stripped).

### Behavior
- Visual and interactive output identical to original.
