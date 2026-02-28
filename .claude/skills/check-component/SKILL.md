# Component Validation Agent

You are auditing Move components for conformance with the architecture defined in `.claude/migrate-component.md`. For each component, read the source files and report pass/fail against every rule below.

---

## How to Run

**Input:** A component name (e.g. "Badge") or "all" to check every component under `src/components/`. Optionally append "fix" (e.g. "Badge fix") to auto-fix all failures.

**Process:**
1. Find the component directory under `src/components/{category}/{ComponentName}/`
2. Read `{ComponentName}.tsx`, `{ComponentName}.module.css`, `index.ts`, and `use{ComponentName}.ts` (if it exists)
3. Read the component's demo file in `demo/src/demos/{ComponentName}Demo.tsx` (if it exists)
4. Check each rule below and report the result
5. Summarize findings
6. **If "fix" was requested:** automatically fix all FAIL items using the fix procedures below, then re-check to confirm all pass

---

## Fix Mode

When the input includes "fix", after completing the audit, fix every FAIL by applying the corresponding fix procedure. Then re-run the check to verify all issues are resolved.

**Fix priority order:** Fix items in this order to avoid cascading issues:
1. A-rules (component file) — fix structural issues first
2. B-rules (CSS module)
3. C-rules (exports)
4. D-rules (demo)
5. E-rules (accessibility)
6. F-rules (placement)

### Fix Procedures

#### A1 — Missing `'use client'` directive
Add `'use client';` as the very first line of the file.

#### A2 — Props interface missing `extends Record<string, unknown>`
Change `interface {Name}Props {` to `interface {Name}Props extends Record<string, unknown> {`. For compound components, apply to every sub-component props interface that is used with `withMoveComponent`.

**Exception:** Root sub-components that are plain `React.FC` wrappers around Radix primitives (like `DialogRoot`) do not need this — only factory-based sub-components do.

#### A3 — Move-specific props missing from `moveProps`/`defaults`
Add the missing prop names to the `moveProps` array. If the prop has a default value, add it to `defaults` instead and remove it from `moveProps` (it's auto-stripped by defaults).

#### A4 — Default values in destructuring instead of `defaults`
Move the default value from the destructuring (e.g. `size = 'md'`) into the `defaults` object. Remove the `= 'md'` from the destructuring.

#### A5 — Slots mismatch
- If a slot is in the `slots` array but never used in `sp()`/`cx()`: remove it from `slots`.
- If `sp()`/`cx()` reference a slot not in `slots`: add it to the `slots` array.

#### A6 — Raw `className={styles.foo}` on slotted element
Replace `className={styles.foo}` with `className={cx('foo', ...)}`. If it also needs sp class merging, use `className={cx('foo', spClass as string | undefined)}`.

#### A7 — Missing `sp()` call for a slot
Add the `sp()` call and destructure it: `const {slotName}Sp = sp('{slotName}'); const { className: spClass, style: spStyle, ...spRest } = {slotName}Sp as Record<string, unknown>;`. Spread `spRest` onto the element and merge `spClass`/`spStyle`.

#### A8 — Missing `{...attrs}` or `{...spRest}` on root
Add `{...attrs}` and `{...spRest}` as the first spreads on the root DOM element (before explicit props).

**Special case — Plain FC Root:** If the Root sub-component is a plain `React.FC` (not factory-based) that wraps a Radix primitive or context provider, it does NOT need `attrs`/`spRest`. This pattern is acceptable for stateless Root wrappers (e.g. `DialogRoot`, `PopoverRoot`). Only factory-based components need `attrs`/`spRest`.

#### A9 — Missing ref forwarding
Add `ref={ref}` to the root DOM element. If the component needs multiple refs (e.g. animation + forwarded), use `useMergedRef`.

**Special case — Plain FC Root:** If migrating a plain FC Root to use `forwardRef`, wrap it with `React.forwardRef` and forward the ref to the root element. If the Root is a context provider wrapping children without a DOM element, ref forwarding is not applicable.

#### A10 — Missing data attributes
Add the appropriate `data-*` attributes to the root element: `data-variant={props.variant}`, `data-size={props.size}`, `data-state={derivedState}`.

#### A11 — Wrong import paths
Replace imports from `../core` or `../../../core` with the equivalent from `../../../engine` or `engine/`.

#### A12 — Move props leaking to HTML
Ensure all Move-specific props are in `moveProps` or `defaults`. The factory strips these automatically. If manual spreading is happening, replace it with `{...attrs}`.

#### B1 — Missing CSS class for slot
Add a `.{slotName} { }` rule to the CSS module with appropriate base styles.

#### B2 — Hard-coded values
Replace hard-coded hex colors with `var(--move-*)` tokens. Replace hard-coded pixel values for spacing/radius with token references. Raw pixel values for `width`, `height`, `border-width`, `font-size` in component-specific contexts are acceptable.

#### B3 — Tokens on `:root`
Move `--move-{component}-*` custom property declarations from `:root { }` to `.root { }`.

#### B4 — Missing data-attribute selectors
Replace class-based variant/size selectors (e.g. `.root.primary`) with `[data-variant='primary']` selectors.

#### B5 — Wrong CSS variable naming
Rename to follow `--move-{component}-{property}` convention.

#### B6 — CSS animations for state/entrance/exit
Remove `@keyframes`, `animation`, and `transition` rules (except for simple hover color/background transitions). State/entrance/exit animations should use the anime.js system.

#### C1 — Missing exports in `index.ts`
Add the missing exports to the barrel file.

#### C2 — Missing from `src/index.ts`
Add the component export to `src/index.ts` in the correct section.

#### C3 — Missing hook export
Add the hook and its types to both `index.ts` and `src/index.ts`.

#### D1 — Missing demo file
Create `demo/src/demos/{ComponentName}Demo.tsx` following the demo template in the migrate-component skill. Include at minimum a Usage example.

#### D2 — First example not "Usage"
Reorder the examples array so the first entry has `id: 'usage'` and `name: 'Usage'`.

#### D4 — Incomplete code snippets
Replace `...` or `// ...` placeholders with complete, copy-pasteable code.

#### D5 — Technical jargon in descriptions
Rewrite descriptions to be user-facing. Remove words like "factory", "hook", "slot props", "slot", "render", "props interface".

#### D6 — Not registered in App.tsx
Add a lazy import and `componentGroups` entry in `demo/src/App.tsx` under the correct category group.

#### D7 — Missing Parameters section
Add `<Heading level={3}>Parameters</Heading>` followed by `<DocPage.ApiSection>` blocks at the bottom of the demo, before the closing `</DocPage.Root>`. Document all public props for each sub-component.

#### D8 — Items not alphabetically ordered in group
Reorder the items within the affected `componentGroups` group in `demo/src/App.tsx` so they are sorted alphabetically by `name`.

#### E1 — Hardcoded user-visible strings
Add a prop (e.g. `removeLabel`, `closeLabel`) for each hardcoded string. Use the prop with a fallback: `aria-label={props.removeLabel || 'Remove'}`. Add the new prop to `moveProps`.

#### E2 — Icons not using `useResolvedIcon`
Replace direct icon imports/JSX with `useResolvedIcon(name, size)` calls. Import from `../../core/Icon/useResolvedIcon`.

#### E3 — Missing built-in icon fallback
Add the icon to `src/components/core/Icon/builtinIcons.tsx` in the `BUILTIN_ICONS` registry with a Lucide-compatible SVG.

#### E4 — Missing fallback children for icon slots
Add `{props.children || fallbackIcon}` pattern where `fallbackIcon` comes from `useResolvedIcon`.

#### F1–F5 — Placement issues
Move files to the correct category directory, update import paths in `src/index.ts`, and update the `componentGroups` entry in `demo/src/App.tsx`.

---

## Validation Rules

### A. Component File (`{ComponentName}.tsx`)

| #  | Rule | How to check |
|----|------|-------------|
| A1 | `'use client'` directive at line 1 | First line of file is exactly `'use client';` |
| A2 | Props interface extends `Record<string, unknown>` | Look for `interface {Name}Props extends Record<string, unknown>` |
| A3 | All Move-specific props in `moveProps` or `defaults` | Every prop that isn't a valid HTML attribute must appear in `moveProps` array or as a key in `defaults`. Cross-reference the props interface against `moveProps` + `defaults` keys. Valid HTML pass-through props include: `className`, `style`, `children`, `disabled`, `type`, `name`, `value`, `required`, `onClick`, `onChange`, `onFocus`, `onBlur`, `onKey*`, `onMouse*`, `aria-*`, `data-*`, `role`, `tabIndex`, `id`, `title`, `placeholder`, `autoFocus`, `form`, `sp`. |
| A4 | All default values in `defaults` | Any prop with a default value assignment in the destructuring (e.g. `= 'primary'`) should instead be in `defaults` |
| A5 | `slots` array matches `sp()` and `cx()` calls | Every string passed to `sp('...')` and `cx('...')` must appear in the `slots` array. Every slot in the array should be used. |
| A6 | `cx()` used for every className on slotted elements | No slot element should have a raw `className={styles.foo}` — it should use `cx('foo', ...)` |
| A7 | `sp()` called for every slot | Each slot has a corresponding `sp('{slot}')` call, destructured as `{ className: spClass, style: spStyle, ...spRest }` |
| A8 | `{...attrs}` and `{...spRest}` spread on root | The root element has both `{...attrs}` and `{...spRest}` spread |
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
| B6 | No CSS animations for state/entrance/exit | No `@keyframes`, `animation`, or `transition` for state changes, entrances, or exits. CSS `transition` is only allowed for simple hover color/background changes. All other motion must use the anime.js animation system. |

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
| D3 | ~~Removed~~ | — |
| D4 | Code snippets are complete | No `...` or `// ...` placeholders in any `code` field |
| D5 | Descriptions are non-technical | No words like "factory", "hook", "slot props", "slot", "render", "props interface" in descriptions |
| D6 | Registered in App.tsx | Component appears in `componentGroups` in `demo/src/App.tsx` |
| D7 | Parameters section present | Demo includes a `<Heading level={3}>Parameters</Heading>` followed by one or more `<DocPage.ApiSection>` blocks documenting the component's public props. Each sub-component with user-facing props should have its own ApiSection (e.g. `Root`, `Trigger`, `Item`). |
| D8 | Alphabetical order in group | Items within each `componentGroups` group in `demo/src/App.tsx` are sorted alphabetically by `name`. |

### E. Accessibility & i18n

| #  | Rule | How to check |
|----|------|-------------|
| E1 | No hardcoded user-visible strings | Any `aria-label`, `aria-labelledby`, placeholder text, or status text must be overridable via props. Hardcoded English strings (e.g. `aria-label={\`Remove ${name}\`}`) must have a corresponding prop that lets consumers override them for i18n. |
| E2 | Built-in icons use `useResolvedIcon` | Any icon rendered internally by the component (not passed as children) must use `useResolvedIcon(name, size)` from `../../core/Icon/useResolvedIcon`. This ensures the user's IconProvider is tried first, falling back to built-in SVGs. Components must NOT import specific icon libraries (e.g. `lucide-react`) directly. |
| E3 | Essential icons have built-in fallbacks | Icons used by the component must exist in `src/components/core/Icon/builtinIcons.tsx`'s `BUILTIN_ICONS` registry. If a component needs an icon not yet in the registry, it must be added. |
| E4 | Fallback children for icon slots | Sub-components that typically contain an icon (e.g. delete buttons, preview containers) should render a `useResolvedIcon` fallback when `props.children` is not provided, so the component works without consumers manually passing icons. Pattern: `{props.children \|\| fallbackIcon}` |

### F. Placement Consistency

| #  | Rule | How to check |
|----|------|-------------|
| F1 | Component in valid category folder | Component directory is `src/components/{category}/{ComponentName}/` where `{category}` is one of: `core`, `form`, `panel`, `overlay`, `navigation`, `data`, `media`, `calendar`, `file`, `toolbar`, `loading`, `misc` |
| F2 | `src/index.ts` path matches actual location | The import path in `src/index.ts` (e.g. `./components/core/Button`) matches the component's actual directory on disk |
| F3 | Demo group matches src category | The `componentGroups` entry in `demo/src/App.tsx` uses the label that matches the src category: `core` → `Core`, `form` → `Form`, `panel` → `Panel`, `overlay` → `Overlay`, `navigation` → `Navigation`, `data` → `Data`, `media` → `Media`, `calendar` → `Calendar`, `file` → `File`, `toolbar` → `Toolbar`, `loading` → `Loading`, `misc` → `Misc` |
| F4 | Demo icon imported | The Lucide icon used in the `componentGroups` entry is imported in the icon import block at the top of `demo/src/App.tsx` |
| F5 | Unique `name` in componentGroups | The `name` value is unique across all groups and matches the exact PascalCase component name |

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
- The `sp` prop is automatically handled by the factory — it doesn't need to be in `moveProps`
- `className`, `style`, and `children` are standard React props and don't need to be in `moveProps`
- Sub-component prop interfaces (e.g. `AccordionItemProps`) also need `extends Record<string, unknown>`
- Wrapper elements that aren't slots (like Checkbox's `.wrapper` div) are allowed to use `styles.wrapper` directly
