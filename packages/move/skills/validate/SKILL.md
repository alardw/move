---
name: validate
description: "Validate component conformance, theme, spec drift. Writes report. Supports fix mode."
user-invocable: true
argument-hint: "[ComponentName|all|theme|registry]"
---

# Validate — Component & Theme Validator

Merged validation skill: component conformance, theme validation, spec drift detection, and registry management.

---

## How to Run

**Input:** One of:
- A component name (e.g. "Badge") — validate that component
- `"all"` — validate all components
- `"theme {name}"` or `"theme all"` — validate theme files
- `"registry"` — show registry status of all components
- Append `"fix"` to auto-fix failures (e.g. "Badge fix")

**Output:**
- `{Name}.report.md` written next to the component (for component validation)
- Stdout summary of results

---

## Component Validation

### Step 1 — Read files

1. `src/components/{category}/{Name}/{Name}.tsx` — component source
2. `src/components/{category}/{Name}/{Name}.module.css` — CSS module
3. `src/components/{category}/{Name}/index.ts` — barrel exports
4. `src/components/{category}/{Name}/use{Name}.ts` — headless hook (if exists)
5. `src/components/{category}/{Name}/{Name}.spec.ts` — spec (if exists)
6. `demo/src/demos/generated/{Name}Demo.tsx` — demo file (if exists)

### Step 2 — Run validation rules

#### A. Component File (`{Name}.tsx`)

| # | Rule | How to check |
|---|------|-------------|
| A1 | `'use client'` at line 1 | First line is `'use client';` |
| A2 | Props extends `Record<string, unknown>` | Every factory-based props interface |
| A3 | Move-specific props in `moveProps`/`defaults` | Cross-reference props interface vs moveProps + defaults keys |
| A4 | Default values in `defaults` object | No inline defaults in destructuring |
| A5 | `slots` array matches `sp()`/`cx()` calls | Every slot used, every used slot listed |
| A6 | `cx()` for every className on slotted elements | No raw `className={styles.foo}` |
| A7 | `sp()` called for every slot | Destructured as `{ className: spClass, style: spStyle, ...spRest }` |
| A8 | `{...attrs}` and `{...spRest}` on root | Both spread on root element |
| A9 | `ref` forwarded to root | `ref={ref}` or `ref={mergedRef}` |
| A10 | `data-variant`/`data-size`/`data-state` used | Where applicable |
| A11 | Import paths use `engine/` | No imports from `../core` |
| A12 | No Move-internal props leak to HTML | All Move-specific in moveProps/defaults |
| A13 | Animation defaults match spec triggers | Trigger-sequence pairs from spec are wired via useAnimations + resolveAnimationsConfig |
| A14 | Spec behavior contracts preserved | controlledProps, dismissBehavior, renderContracts are implemented |
| A15 | Spec prop parity | No spec prop silently dropped from generated public API |
| A16 | Default parity with spec | Runtime defaults in source match approved spec defaults |
| A17 | Default review audit present | Spec schema v5+ includes approved `defaultReview` block |
| A18 | No approved `undefined` defaults | Approved defaults are explicit values, `null`, or omitted keys |
| A19 | Defaultable prop coverage complete | Every defaultable prop has an explicit reviewed decision |

#### B. CSS Module (`{Name}.module.css`)

| # | Rule |
|---|------|
| B1 | Matching `.{slotName}` class for every slot |
| B2 | Design token variables, no hard-coded values |
| B3 | Component tokens on `.root` not `:root` |
| B4 | Data-attribute selectors for variant/size/state |
| B5 | CSS variable naming: `--move-{component}-{property}` |
| B6 | No CSS `@keyframes`/`animation`/`transition` for state/entrance/exit |
| B7 | All `var(--move-*)` references resolve to real tokens — cross-check against `references/component/tokens-primitive.ts` and `references/component/tokens-semantic.ts` |

#### C. Exports

| # | Rule |
|---|------|
| C1 | `index.ts` exports component + all types |
| C2 | Component added to `src/index.ts` |
| C3 | Headless hook exported (if exists) |

#### D. Demo File

| # | Rule |
|---|------|
| D1 | Demo file exists (`demo/src/demos/generated/{Name}Demo.tsx`) |
| D2 | Exports `demo` object with `name`, `category`, `render` |
| D3 | Controls + initialProps align with component props/spec |
| D4 | Demo does not override animation defaults unless explicitly requested/spec-driven |
| D5 | Controlled boolean defaults are neutral | `open`/`checked` defaults use omitted keys unless intentionally controlled |
| D6 | Text-bearing props have visible defaults | `children`/`label`/`title` should not default to empty when preview would appear blank |
| D7 | No `undefined` literals in `initialProps` | Demo defaults use explicit values, `null`, or omitted keys |
| D8 | Demo text defaults are generator-derived | Non-empty text defaults follow deterministic generation policy, not ad-hoc manual edits |
| D9 | Spec demo contract honored | If `spec.demo` exists, generated demo controls/samples/bindings reflect it |
| D10 | Reference image metadata preserved | If `spec.demo.referenceImages` exists, generated demo retains these references for QA |
| D11 | Compound controls are nested | For compound demos, controls are grouped under `subComponents` instead of flattened |
| D12 | No manual drift in generated files | Generated files match generation patterns/provenance; manual one-off edits are flagged |
| D13 | Consumer-first demo structure | When demo defines multiple samples, preview presents consumer samples by default (not hidden behind selector) and playground controls are secondary |

#### E. Accessibility & i18n

| # | Rule |
|---|------|
| E1 | All user-visible strings come from `labels` prop with defaults (no hardcoded strings) |
| E2 | Built-in icons use `useResolvedIcon` |
| E3 | Essential icons have built-in fallbacks |
| E4 | Fallback children for icon slots |

#### F. Placement Consistency

| # | Rule |
|---|------|
| F1 | Component in valid category folder |
| F2 | `src/index.ts` path matches actual location |

#### G. Tests

| # | Rule |
|---|------|
| G1 | Test file exists (`{Name}.test.tsx`) |
| G2 | Tests pass (`npx vitest run src/components/{category}/{Name}/{Name}.test.tsx`) |

### Step 3 — Spec drift detection (if spec exists)

Compare spec hash in the component's provenance header against the current spec file's hash. If they differ, the component may be out of date with the spec.

Also validate that:
- All spec tokens reference real tokens from `references/component/tokens-primitive.ts` and `references/component/tokens-semantic.ts`
- Spec's slots match component's slots
- Spec's props match component's props
- Source defaults object matches spec default decisions
- Spec animation trigger-sequence pairs match generated source (useAnimations + resolveAnimationsConfig wiring)
- Spec behavior contracts match generated source (`controlledProps`, `dismissBehavior`, `renderContracts`)
- Spec default-review audit exists and is approved (`defaultReview.status === 'approved'`)
- Approved defaults do not use `undefined` literals
- Defaultable props are all covered by the review decision set (no skipped booleans like `closable`)

### Step 3b — Validation severity and gating

Severity:
- **BLOCKER:** A13, A14, A15, A16, A17, A18, A19, B7, C1, C2, E1, G2
- **HIGH:** D3, D4, D5, D6, D7, D8, D9, D10, D11, D12, D13
- **MEDIUM:** all other failures

Gate rule:
- Any **BLOCKER** failure => overall status `FAIL` and generation pipeline must stop.
- HIGH/MEDIUM failures are reported, but only HIGH marked as `needs-fix` in report summary.

### Step 4 — Write report

Write `src/components/{category}/{Name}/{Name}.report.md`:

```markdown
<!-- Validated: {timestamp} | sourceHash: {hash} | specHash: {hash or 'none'} -->
# {Name} — Validation Report

| Rule | Status | Notes |
|------|--------|-------|
| A1   | PASS   |       |
| A2   | PASS   |       |
| ...  | ...    | ...   |

Spec drift: {none | detected}
Issues: {count}

## Component Issues

<!-- Issues discovered during generation or validation that need attention.
     These are NOT rule violations — they are behavioral, visual, or architectural
     problems found in the generated component itself. -->

| # | Severity | Description | Proposed Fix |
|---|----------|-------------|-------------|
| 1 | MEDIUM   | Vertical line gap between items | Make .line position:absolute |
| ...| ...     | ...         | ...         |

<!-- If no issues found, omit this section entirely. -->
```

The **Component Issues** section captures problems found during generation that go beyond rule violations — things like visual regressions, behavioral bugs inherited from originals, Radix quirks affecting runtime behavior, or architectural issues that need manual attention. Each issue should include a severity (BLOCKER/HIGH/MEDIUM/LOW), a clear description, and a proposed fix.

This section is only written when issues are found. Omit it entirely for clean components.

### Step 5 — Update registry

Update `src/components/specs.registry.ts` with the component's validation status.

---

## Theme Validation

When input starts with "theme":

### Rules

| # | Rule |
|---|------|
| A1 | No hardcoded hex colors in token values |
| A2 | All referenced primitives exist in primitives/colors.css |
| A3 | Non-color values (rgba, transparent) exempt from A1 |
| B1 | Theme implements all required ThemeTokens keys |
| B2 | No extra tokens beyond ThemeTokens interface |
| B3 | Animation config is complete |
| C1 | CSS defaults reference primitives |
| C2 | Every ThemeTokens key has a CSS default |
| D1 | Theme values do not reference semantic tokens |
| D2 | CSS defaults do not reference other semantic tokens |
| E1 | Theme has a name property |
| E2 | Token keys match naming convention |

### Files to read

- `src/styles/tokens/primitives/colors.css`
- `src/styles/tokens/semantic.css`
- `src/styles/themes/types.ts`
- `src/styles/themes/{name}.ts`

---

## Registry Mode

When input is "registry":

Read `src/components/specs.registry.ts` and output a summary table:

```
| Component | Category | Spec | Status |
|-----------|----------|------|--------|
| Badge     | misc     | yes  | valid  |
| Button    | core     | no   | no-spec|
| ...       | ...      | ...  | ...    |
```

---

## Fix Mode

When input includes "fix", after audit:

1. Fix failures in order: A → B → C → D → E → F
2. Apply fix procedures (see fix procedures in reference)
3. Re-run validation to confirm fixes

---

## Report staleness detection

`/validate` detects stale reports by comparing the `sourceHash` in the report header against the current source hash. If they differ, the report is regenerated.

---

## Important Notes

- Only flag actual violations, not style preferences
- For compound components, validate the main file containing all sub-components
- `sp` is auto-handled by factory — not needed in `moveProps`
- `className`, `style`, `children` don't need to be in `moveProps`
- Wrapper elements that aren't slots may use `styles.wrapper` directly
