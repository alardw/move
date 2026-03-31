# Move Recipes — Shared Reference Patterns

Recipes are reference patterns used by all generation skills (composite, page, feature, and library recipe).
They demonstrate how to use Move components correctly in practice.

## Structure

```
recipes/
├── component/          # Single-component usage patterns
│   ├── Table/
│   ├── Badge/
│   ├── Button/
│   └── ...
└── composite/          # Multi-component compositions
    ├── authentication/
    ├── data/
    └── ...
```

## Hierarchy

Generation skills follow a strict hierarchy — each level delegates down:

```
feature   →  orchestrates pages + routing + shared state
  page    →  arranges composites + components into a layout
    composite  →  composes components into a reusable pattern
      component  →  single Move component usage
```

- **Feature** generates pages, composites, and routing — delegates to page/composite patterns
- **Page** arranges composites and components — delegates to composite/component patterns
- **Composite** composes multiple components — references component patterns for correct API usage
- **Component recipe** shows how to use a single component's API

Each level must **never rebuild** what the level below provides.

## Golden Rules

1. **Only Move components** — no custom CSS, no raw HTML elements (`<div>`, `<span>`, `<button>`), no inline styles
2. **Respect component defaults** — don't pass props that match the default value
3. **i18n ready** — all user-facing strings via `defaultLabels` + `labels?: Partial<Labels>` + `const t = { ...defaultLabels, ...labels }`
4. **Use Icon component** — no unicode characters for visual indicators
5. **FormField.Description** — for both hints and errors (with `error` prop), not FormField.Hint/FormField.Error
6. **Boolean DOM attrs** — use `invalid={value || undefined}` to avoid React warnings for non-boolean HTML attributes
7. **Responsive by default** — don't override component defaults (e.g. Drawer is already responsive)
8. **Footer alignment** — `FooterStart` for secondary/back actions (left), `FooterEnd` for primary actions (right)
9. **Dialog.Header** — auto-renders close button. Don't add `<Dialog.Close />` inside header unless `closable={false}`
10. **Dialog/Drawer triggers** — use `asChild` when wrapping a Move Button to avoid nested `<button>` elements
11. **Always use FormField** — every form input (InputText, Select, Checkbox, etc.) must be wrapped in `FormField.Root` with `FormField.Label` and `FormField.Field`. Never render a bare input without its FormField wrapper
12. **Re-animate on data change** — components with stagger entrance animations (List, Timeline) only animate on mount. When children change dynamically (filter, sort, search), pass `animateKey` to replay the stagger: `<List animateKey={filterState}>`. Derive `animateKey` from whatever state drives the content change (search query, active filters, sort key). Without it, filtered results appear instantly with no transition
