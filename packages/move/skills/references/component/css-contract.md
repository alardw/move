# CSS Module Contract

## Token placement

Component tokens go on `.root` (not `:root`) so they resolve semantic tokens in the element's local scope, enabling scoped ThemeProvider to work:

```css
.root {
  /* Component tokens — resolve in local scope */
  --move-button-primary-bg: var(--move-primary);
  --move-button-primary-bg-hover: var(--move-primary-hover);
  --move-button-primary-fg: var(--move-primary-fg);

  /* Base styles */
  display: inline-flex;
  align-items: center;
}
```

## Data-attribute selectors

Use `data-*` attributes for variant/size/state styling:

```css
/* Variant — include :not() fallback for default */
.root[data-variant='primary'],
.root:not([data-variant]) { /* default variant */ }
.root[data-variant='secondary'] { /* ... */ }

/* Size — include :not() fallback for default */
.root[data-size='sm'] { /* ... */ }
.root[data-size='md'], .root:not([data-size]) { /* default size */ }
.root[data-size='lg'] { /* ... */ }

/* State */
.root[data-state='checked'] { /* ... */ }
.root[data-state='open'] { /* ... */ }
```

## Layout prop selectors

Layout props (gap, align, justify, direction, wrap) use `data-*` attributes resolved in CSS — **never inline styles with JS maps**. This keeps all visual output in the CSS module and avoids React inline style rendering quirks.

```css
/* Gap — include :not() fallback for default */
.root[data-gap='none'] { gap: 0; }
.root[data-gap='xs'] { gap: var(--move-spacing-xs); }
.root[data-gap='sm'] { gap: var(--move-spacing-sm); }
.root[data-gap='md'],
.root:not([data-gap]) { gap: var(--move-spacing-md); }
.root[data-gap='lg'] { gap: var(--move-spacing-lg); }
.root[data-gap='xl'] { gap: var(--move-spacing-xl); }

/* Align — include :not() fallback for default */
.root[data-align='start'] { align-items: flex-start; }
.root[data-align='center'] { align-items: center; }
.root[data-align='end'] { align-items: flex-end; }
.root[data-align='stretch'],
.root:not([data-align]) { align-items: stretch; }
.root[data-align='baseline'] { align-items: baseline; }
```

The component only sets `data-gap={gap}`, `data-align={align}` etc. on the element — no inline style for these props.

## CSS variable naming

```
--move-{component}-{property}
--move-{component}-{variant}-{property}
--move-{component}-{slot}-{property}
```

Examples:
```css
--move-button-primary-bg
--move-checkbox-size
--move-accordion-trigger-bg-hover
--move-dialog-content-radius
```

## Design token references

Always reference design tokens, never hard-code colors or spacing:

```css
/* Good */
background-color: var(--move-primary);
padding: var(--move-spacing-md);
border-radius: var(--move-rounded-md);
font-family: var(--move-font-body);

/* Bad */
background-color: #3b82f6;
padding: 16px;
border-radius: 8px;
```

## Variant color tokens — canonical names

When generating variant-specific color overrides, use **exactly** these token names. Do NOT invent token names like `--move-danger`, `--move-on-success`, etc.

| Variant | Background | Foreground |
|---------|-----------|------------|
| primary | `var(--move-primary)` | `var(--move-primary-fg)` |
| secondary | `var(--move-secondary)` | `var(--move-secondary-fg)` |
| success | `var(--move-success)` | `var(--move-success-fg)` |
| warning | `var(--move-warning)` | `var(--move-warning-fg)` |
| error / danger | `var(--move-error)` | `var(--move-error-fg)` |
| info | `var(--move-info)` | `var(--move-info-fg)` |

Hover variants: `var(--move-{name}-hover)`. Subtle variants: `var(--move-{name}-subtle)`.

Cross-reference `references/component/tokens-semantic.ts` if unsure — if a token isn't defined there, it doesn't exist.

## Slot class naming

Each class in the CSS Module must match a slot name used in the factory:

```css
/* Slots: ['root', 'indicator', 'icon'] */
.root { /* ... */ }
.indicator { /* ... */ }
.icon { /* ... */ }
```

Additional utility classes (like `.wrapper`) are allowed but are not slots — they are referenced via `styles.wrapper` directly, not through `cx()`.

## Portaled content

Radix portals (`Tooltip.Portal`, `Dialog.Portal`, `Popover.Portal`, etc.) render content at `document.body`, **outside** the `[data-move-theme]` scope. Inherited CSS properties (font-family, color, line-height) from the theme wrapper do NOT reach portaled content. Always set `font-family: var(--move-font-body)` explicitly on the portaled content slot's CSS class.

## Animation prohibition

**No CSS animations** for state/entrance/exit. Never use:
- `@keyframes`
- `animation` property
- `transition` for state changes, entrances, or exits

All motion goes through the anime.js-based animation system.

**Exception:** CSS `transition` is acceptable for simple hover color/background changes on non-animated elements (e.g. close button hover).

## Focus and disabled patterns

```css
/* Focus ring */
.root:focus-visible {
  outline: var(--move-focus-ring);
  outline-offset: var(--move-focus-ring-offset);
}

/* Disabled */
.root:disabled,
.root[data-disabled] {
  opacity: var(--move-disabled-opacity);
  pointer-events: none;
}
```
