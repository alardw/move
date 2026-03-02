# Component Token Conventions

## Naming Convention

Component tokens follow the pattern:

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

## Placement

Component tokens are declared on `.root` (not `:root`) so they resolve semantic tokens in the element's local scope. This enables scoped `ThemeProvider` to work correctly.

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

## Rules

1. **Always reference semantic tokens** — component token values must use `var(--move-*)` semantic tokens, never primitive tokens or hardcoded values.

   ```css
   /* Correct */
   --move-button-primary-bg: var(--move-primary);

   /* Wrong — references primitive */
   --move-button-primary-bg: var(--move-sage-600);

   /* Wrong — hardcoded value */
   --move-button-primary-bg: #7c3aed;
   ```

2. **Exception: component-specific dimensions** — values without a semantic token equivalent (like specific component widths/heights) may use literal values.

   ```css
   /* Acceptable — no semantic token for checkbox size */
   --move-checkbox-size: 1.125rem;
   ```

3. **Property suffixes** — use consistent suffixes:
   - `-bg` / `-bg-hover` / `-bg-active` for backgrounds
   - `-fg` for foreground/text color
   - `-border` for border color
   - `-radius` for border radius
   - `-size` for dimensions
   - `-gap` for spacing
   - `-shadow` for box shadow
