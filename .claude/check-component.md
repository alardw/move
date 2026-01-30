# Component Validation Agent

You are auditing Move components for conformance with the architecture defined in `.claude/migrate-component.md`. For each component, read the source files and report pass/fail against every rule below.

---

## How to Run

**Input:** A component name (e.g. "Badge") or "all" to check every component under `src/components/`.

**Process:**
1. Find the component directory under `src/components/{category}/{ComponentName}/`
2. Read `{ComponentName}.tsx`, `{ComponentName}.module.css`, `index.ts`, and `use{ComponentName}.ts` (if it exists)
3. Read the component's demo file in `demo/src/demos/{ComponentName}Demo.tsx` (if it exists)
4. Check each rule below and report the result
5. Summarize findings

---

## Validation Rules

### A. Component File (`{ComponentName}.tsx`)

| #  | Rule | How to check |
|----|------|-------------|
| A1 | `'use client'` directive at line 1 | First line of file is exactly `'use client';` |
| A2 | Props interface extends `Record<string, unknown>` | Look for `interface {Name}Props extends Record<string, unknown>` |
| A3 | All Move-specific props in `moveProps` or `defaults` | Every prop that isn't a valid HTML attribute must appear in `moveProps` array or as a key in `defaults`. Cross-reference the props interface against `moveProps` + `defaults` keys. Valid HTML pass-through props include: `className`, `style`, `children`, `disabled`, `type`, `name`, `value`, `required`, `onClick`, `onChange`, `onFocus`, `onBlur`, `onKey*`, `onMouse*`, `aria-*`, `data-*`, `role`, `tabIndex`, `id`, `title`, `placeholder`, `autoFocus`, `form`, `pt`. |
| A4 | All default values in `defaults` | Any prop with a default value assignment in the destructuring (e.g. `= 'primary'`) should instead be in `defaults` |
| A5 | `slots` array matches `ptm()` and `cx()` calls | Every string passed to `ptm('...')` and `cx('...')` must appear in the `slots` array. Every slot in the array should be used. |
| A6 | `cx()` used for every className on slotted elements | No slot element should have a raw `className={styles.foo}` — it should use `cx('foo', ...)` |
| A7 | `ptm()` called for every slot | Each slot has a corresponding `ptm('{slot}')` call, destructured as `{ className: ptClass, style: ptStyle, ...ptRest }` |
| A8 | `{...attrs}` and `{...ptRest}` spread on root | The root element has both `{...attrs}` and `{...ptRest}` spread |
| A9 | `ref` forwarded to root DOM element | The root element has `ref={ref}` or `ref={mergedRef}` |
| A10 | `data-variant`/`data-size`/`data-state` used where applicable | If the component has variant/size/state props, they're applied as `data-*` attributes |
| A11 | Import paths use `engine/` not `core/` | No imports from `../core` or `../../../core` — must be `engine/` |
| A12 | No Move-internal props leak to HTML | Props in `moveProps`/`defaults` are stripped via `stripKeys`. Verify no manual spreading of Move props onto DOM elements. |

### B. CSS Module (`{ComponentName}.module.css`)

| #  | Rule | How to check |
|----|------|-------------|
| B1 | Matching class for every slot | Each slot in the factory's `slots` array has a corresponding `.{slotName}` class |
| B2 | Design token variables, not hard-coded values | No raw hex colors (`#xxx`), no raw pixel values for spacing/radius. Should use `var(--move-*)` |
| B3 | Component tokens on `.root` not `:root` | Token declarations (`--move-{component}-*`) should be inside `.root { }`, not `:root { }` |
| B4 | Variant/size/state use data-attribute selectors | Variants use `.root[data-variant='...']`, sizes use `.root[data-size='...']`, states use `[data-state='...']` |
| B5 | CSS variable naming follows `--move-{component}-{property}` | All component-level custom properties follow the naming convention |

### C. Exports

| #  | Rule | How to check |
|----|------|-------------|
| C1 | `index.ts` exports component + all types | Barrel file exports the component and all public type interfaces |
| C2 | Component added to `src/index.ts` | The component is exported from the main package entry point |
| C3 | Headless hook exported (if exists) | If `use{Component}.ts` exists, both `index.ts` and `src/index.ts` export it with types |

### D. Demo Page

| #  | Rule | How to check |
|----|------|-------------|
| D1 | Demo file exists | `demo/src/demos/{ComponentName}Demo.tsx` exists |
| D2 | First example is "Usage" | `examples[0].id === 'usage'` or `examples[0].name === 'Usage'` with import + minimal code |
| D3 | Last example is "Custom Styling" | Last example shows `MoveProvider` with `pt` and/or instance `pt` prop |
| D4 | Code snippets are complete | No `...` or `// ...` placeholders in any `code` field |
| D5 | Descriptions are non-technical | No words like "factory", "hook", "PT", "slot", "pass-through", "render", "props interface" in descriptions |
| D6 | Registered in App.tsx | Component appears in `componentGroups` in `demo/src/App.tsx` |

### E. Placement Consistency

| #  | Rule | How to check |
|----|------|-------------|
| E1 | Component in valid category folder | Component directory is `src/components/{category}/{ComponentName}/` where `{category}` is one of: `core`, `form`, `panel`, `overlay`, `navigation`, `data`, `media`, `calendar`, `file`, `toolbar`, `loading`, `misc` |
| E2 | `src/index.ts` path matches actual location | The import path in `src/index.ts` (e.g. `./components/core/Button`) matches the component's actual directory on disk |
| E3 | Demo group matches src category | The `componentGroups` entry in `demo/src/App.tsx` uses the label that matches the src category: `core` → `Core`, `form` → `Form`, `panel` → `Panel`, `overlay` → `Overlay`, `navigation` → `Navigation`, `data` → `Data`, `media` → `Media`, `calendar` → `Calendar`, `file` → `File`, `toolbar` → `Toolbar`, `loading` → `Loading`, `misc` → `Misc` |
| E4 | Demo icon imported | The Lucide icon used in the `componentGroups` entry is imported in the icon import block at the top of `demo/src/App.tsx` |
| E5 | Unique `name` in componentGroups | The `name` value is unique across all groups and matches the exact PascalCase component name |

---

## Output Format

For each component, output a table:

```
## {ComponentName} — src/components/{category}/{ComponentName}/

| Rule | Status | Notes |
|------|--------|-------|
| A1   | PASS   |       |
| A2   | PASS   |       |
| A3   | FAIL   | `onCheckedChange` not in moveProps |
| ...  | ...    | ...   |

Issues: {count}
```

At the end, output a summary:

```
## Summary

| Component | Pass | Fail | Issues |
|-----------|------|------|--------|
| Badge     | 20   | 3    | B3: tokens on :root, D2: no Usage example, D3: no Custom Styling last |
| Button    | 22   | 1    | D2: no Usage example |
| ...       | ...  | ...  | ...    |
```

---

## Important Notes

- Only flag actual violations, not style preferences
- For compound components (Accordion, Dialog), validate the main file which contains all sub-components
- The `pt` prop is automatically handled by the factory — it doesn't need to be in `moveProps`
- `className`, `style`, and `children` are standard React props and don't need to be in `moveProps`
- Sub-component prop interfaces (e.g. `AccordionItemProps`) also need `extends Record<string, unknown>`
- Wrapper elements that aren't slots (like Checkbox's `.wrapper` div) are allowed to use `styles.wrapper` directly
