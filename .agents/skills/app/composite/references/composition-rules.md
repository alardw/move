# Composite Composition Rules

Composites are app-specific components built entirely from Move core components. They are NOT Move library components — they live in the consumer's app and are reused across pages.

## Golden Rule

**No custom CSS. No raw HTML for layout. Only Move components.**

## What a composite IS

- A React component that combines Move core components into a reusable unit
- Has typed props for dynamic content
- Used across multiple pages in the app
- Examples: `UserCard`, `NavHeader`, `MetricsPanel`, `NotificationItem`

## What a composite is NOT

- Not a Move library component (no spec, no withMoveComponent, no CSS module)
- Not a page (composites are used within pages)
- Not a recipe (composites are app-specific, recipes are public examples)

## Rules

1. **Only Move imports** — all UI elements come from `'move'`
2. **No custom CSS** — no className with custom styles, no CSS files, no styled-components
3. **No inline layout styles** — use Stack `gap`, Grid `cols`, Align sections
4. **Typed props** — export an interface for the composite's props
5. **Single responsibility** — one composite does one thing well
6. **No internal state for layout** — composites are presentational; state lives in pages or hooks

## Available components

See `app/references/layout-composition.md` for the full list of Move layout components and their props.
