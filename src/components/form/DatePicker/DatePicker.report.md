# DatePicker — Validation Report
Generated from DatePicker.spec.ts (schemaVersion: 6, specHash: 891de3de)

## Checklist

| Rule | Status |
|------|--------|
| Provenance headers on all files | PASS |
| CSS: tokens on .content | PASS |
| CSS: data-attribute selectors | PASS |
| CSS: no CSS animations | PASS |
| CSS: font-family on portaled content | PASS |
| CSS: all token references valid | PASS |
| Compound component pattern (plain object) | PASS |
| Context: Root→children placement | PASS |
| Animation: useLifecycleAnimate wiring | PASS |
| Animation: stagger config ([role="gridcell"], delay 15) | PASS |
| Barrel exports (index.ts) | PASS |
| src/index.ts exports | PASS |
| className/style passthrough | PASS |
| Ref forwarding (Content) | PASS |
| Labels type and defaults (7 keys) | PASS |
| Controlled triads (open + value) | PASS |
| Hook file (useDatePicker.ts) | PASS |
| Tests: all passing | BLOCKED (dependencies missing) |

## Test Status

Tests cannot run — DatePicker depends on Calendar, InputText, and TimeField which have not been generated yet. Once those are available, the 16 test cases should execute.

## Delta Report (vs original)

### Animation changes
- **Raw anime.js → useLifecycleAnimate hook** — Content no longer manually manages anime.js instances. Uses standardized `useLifecycleAnimate` with `isClosing`/`onCloseComplete` pattern and built-in stagger support.
- Day cell stagger preserved via `stagger: { selector: '[role="gridcell"]', config: { stagger: { delay: 15 } } }`.
- Exit stagger timing handled by hook defaults (reverse order, 20ms delay) vs original's custom 10ms reverse.
- Spring config for stagger uses hook's default `{ mass: 0.6, stiffness: 400, damping: 20 }` — identical to original's `springConfig`.

### Icon changes
- **Icon component → useResolvedIcon hook** — Calendar icon in SingleInput, RangeInput, and DatePickerIcon now uses `useResolvedIcon('calendar', 16)` instead of `<Icon name="calendar" size="sm" />`. This follows infrastructure guidelines (useResolvedIcon for component internals).

### CSS changes
- Added `font-family: var(--move-font-body)` on `.content` — required for portaled content (Radix Portal escapes theme scope).
- All other CSS preserved identically.

### Structural changes
- Content uses `React.forwardRef` (original did not forward ref on Content).
- Content wraps children in `<div ref={innerRef}>` for useLifecycleAnimate stagger support.
- `useMergedRef` from engine used to merge forwarded ref with hook's contentRef.

### Props
- No props added or removed.
- `animate` type changed from `PopupAnimate` (old system) to `LifecycleAnimate` (standard trigger type).

### Behavior
- Visual output identical. Animation timing near-identical (exit stagger 20ms vs 10ms per cell from hook defaults).
- All controlled triads, dismiss flow, range field logic, time integration preserved.
