# Component Migration Agent Instruction

You are migrating a component into the Move architecture. Follow every section below exactly. Do not skip steps, do not improvise structure. The output must pass the validation checklist at the end.

---

## 1. Component Tree & Placement Rules

```
src/
├── engine/                # Factory, types, mergeProps, context, hooks
├── animation/             # Animation system (anime.js hooks, presets, springs)
├── styles/                # Tokens, themes, visual systems
├── components/
│   ├── core/              # Fundamental building blocks (Button, Badge, Label, Icon, Tooltip, Link)
│   ├── form/              # User input & controls (Checkbox, Input, Select, Switch, Radio, Slider, DatePicker, TimePicker)
│   ├── panel/             # Layout & expandable containers (Accordion, Tabs, Collapsible, Sidebar, Card)
│   ├── overlay/           # Modal & floating layers (Dialog, AlertDialog, Popover, Dropdown, ContextMenu, HoverCard, Sheet, Toast)
│   ├── navigation/        # Routing & wayfinding (NavigationMenu, Menubar, Breadcrumb, Pagination, Link)
│   ├── data/              # Data display & tables (Table, DataGrid, List, Tree, Timeline)
│   ├── media/             # Media & visual content (Avatar, AspectRatio, Image, Video, Carousel)
│   ├── calendar/          # Inline calendar views (Calendar, WeekView, MonthView, AgendaView)
│   ├── file/              # File handling (FileUpload, FileDrop, FileList)
│   ├── toolbar/           # Toolbar-related controls (ToggleButton, ToggleGroup, Toolbar)
│   ├── loading/           # Loading & progress indicators (Spinner, Skeleton, Progress, ProgressBar)
│   └── misc/              # Everything else (Separator, ScrollArea, VisuallyHidden)
```

**Decision rules:**

| Category     | When to place here |
|--------------|--------------------|
| **core**     | Appears everywhere, no specific domain. The atoms other components compose with. Includes universally-used primitives like Tooltip. |
| **form**     | Captures user input, participates in form submission, has `value`/`checked`/`onChange`. Date and time pickers are form inputs. |
| **panel**    | Structures content in sections, expandable/collapsible, manages layout. |
| **overlay**  | Renders above the page in a portal/layer, has open/close lifecycle. |
| **navigation** | Moves the user between views/sections, contains links or route-aware items. |
| **data**     | Displays structured data (rows, columns, lists, trees). |
| **media**    | Renders images, video, avatars, or aspect-constrained content. |
| **calendar** | Inline calendar display with day/week/month/agenda views (Outlook-style). NOT for date picking (that's `form/`). |
| **file**     | File selection, upload, or preview. |
| **toolbar**  | Toolbar-related controls: toggle buttons, toggle groups, toolbar containers. |
| **loading**  | Feedback for async operations: spinners, skeletons, progress bars. |
| **misc**     | Utility/decoration that doesn't fit above. |

### Placement Consistency

The src category folder and the demo `componentGroups` label in `demo/src/App.tsx` **must match**. Use this exact mapping:

| src folder | App.tsx group label |
|------------|---------------------|
| `core/`    | `Core`              |
| `form/`    | `Form`              |
| `panel/`   | `Panel`             |
| `overlay/` | `Overlay`           |
| `navigation/` | `Navigation`     |
| `data/`    | `Data`              |
| `media/`   | `Media`             |
| `calendar/`| `Calendar`          |
| `file/`    | `File`              |
| `toolbar/` | `Toolbar`           |
| `loading/` | `Loading`           |
| `misc/`    | `Misc`              |

**All three locations must agree:**
1. **Source directory:** `src/components/{category}/{ComponentName}/`
2. **Package export:** `src/index.ts` import path uses `./components/{category}/{ComponentName}`
3. **Demo registration:** `demo/src/App.tsx` entry is under the group with the matching label

---

## 2. Factory Contract Reference

### `withMoveComponent` signature

```ts
import { withMoveComponent } from '../../../engine';
// or from the package: import { withMoveComponent } from 'move';

withMoveComponent<TSlots, TProps, TRef, TSubs>({
  name: string;              // Component display name (e.g. 'Button')
  styles?: Record<string, string>;  // CSS Module import
  slots?: readonly TSlots[]; // Slot names — must match ptm() and cx() calls
  defaults?: Partial<TProps>;       // Default prop values (merged into props)
  moveProps?: readonly string[];    // Move-specific prop keys stripped from attrs
  subComponents?: TSubs;            // Sub-components attached as static properties
  setup(context: SetupContext<TSlots, TProps, TRef>): { render(): ReactNode };
});
```

### SetupContext — what `setup()` receives

| Property      | Type                              | Purpose |
|---------------|-----------------------------------|---------|
| `props`       | `TProps`                          | Resolved props: `defaults` merged with user props. Move-specific keys still accessible here. |
| `ref`         | `Ref<TRef>`                       | Merged ref (forwarded + internal). Attach to root DOM element. |
| `internalRef` | `RefObject<TRef \| null>`         | Direct ref for imperative DOM access inside setup. |
| `cx`          | `(slot, ...extra) => string`      | Resolves CSS Module class for a slot, plus extra classNames. |
| `ptm`         | `(slot, localProps?) => SlotProps` | Merges global PT → instance PT → local props for a slot. |
| `attrs`       | `Record<string, unknown>`         | HTML-safe props: user props minus all Move-specific keys. Spread on root element. |

### How `defaults` and `moveProps` interact with `stripKeys`

The factory builds a `stripKeys` set from:
1. Internal keys: `['pt']`
2. Everything in `moveProps`
3. Every key in `defaults`

Any prop key in `stripKeys` is **excluded from `attrs`** so it won't leak to the HTML DOM element. Props are still accessible via `props.*` inside `setup()`.

**Rule:** If a prop is Move-specific (not a valid HTML attribute), it must appear in either `moveProps` or `defaults`.

### How `cx()` resolves classes

```ts
const cx = createCx(styles); // styles = CSS Module import

cx('root', props.className, ptClass)
// → "Badge_root_abc123 my-custom-class pt-override-class"
```

- First arg is the slot name → looks up `styles[slot]` for the CSS Module class
- Remaining args are extra classNames (falsy values filtered out)

### How `ptm()` merges pass-through props

```ts
const ptm = createPtm(globalPT, instancePT);

const rootPt = ptm('root');
// Merges: globalPT.root → instancePT.root → localProps
// className: concatenated
// style: shallow-merged (later wins)
// everything else: spread (later wins)
```

Usage pattern in `render()`:

```tsx
const rootPt = ptm('root');
const { className: ptClass, style: ptStyle, ...ptRest } = rootPt as Record<string, unknown>;

<div
  {...attrs}          // HTML-safe user props
  {...ptRest}         // PT overrides (except className/style which are merged manually)
  ref={ref}
  className={cx('root', props.className, ptClass as string | undefined)}
  style={{ ...props.style, ...(ptStyle as React.CSSProperties) }}
  data-variant={props.variant}
>
```

---

## 3. Four Canonical Patterns

### Pattern A — Simple Presentational (Badge)

Single slot, no state, no animation. The simplest possible Move component.

```tsx
// src/components/misc/Badge/Badge.tsx
'use client';

import { withMoveComponent } from '../../../engine';
import styles from './Badge.module.css';

export type BadgeVariant = 'primary' | 'secondary' | 'outline' | 'success' | 'warning' | 'danger';
export type BadgeSize = 'sm' | 'md' | 'lg';

export interface BadgeProps extends Record<string, unknown> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export const Badge = withMoveComponent<'root', BadgeProps, HTMLSpanElement>({
  name: 'Badge',
  styles,
  slots: ['root'] as const,
  defaults: { variant: 'primary', size: 'md' },
  moveProps: ['variant', 'size'],

  setup({ props, ref, cx, ptm, attrs }) {
    return {
      render() {
        const rootPt = ptm('root');
        const { className: ptClass, style: ptStyle, ...ptRest } = rootPt as Record<string, unknown>;

        return (
          <span
            {...attrs}
            {...ptRest}
            ref={ref}
            className={cx('root', props.className, ptClass as string | undefined)}
            style={{ ...props.style, ...(ptStyle as React.CSSProperties) }}
            data-variant={props.variant}
            data-size={props.size}
          >
            {props.children}
          </span>
        );
      },
    };
  },
});
```

**CSS Module** (`Badge.module.css`):
```css
.root {
  display: inline-flex;
  align-items: center;
  /* ...base styles... */
}

.root[data-variant='primary'],
.root:not([data-variant]) {
  background-color: var(--move-primary);
  color: var(--move-primary-fg);
}

.root[data-size='sm'] { /* ... */ }
.root[data-size='md'], .root:not([data-size]) { /* ... */ }
.root[data-size='lg'] { /* ... */ }
```

**Index** (`index.ts`):
```ts
export { Badge } from './Badge';
export type { BadgeProps, BadgeVariant, BadgeSize } from './Badge';
```

### Pattern B — Interactive with Animation (Button)

Single slot, `useInteractiveAnimate`, event handler merging, `useMergedRef`, `asChild` support.

```tsx
// src/components/core/Button/Button.tsx
'use client';

import * as React from 'react';
import { Slot } from 'radix-ui';
import { withMoveComponent, useMergedRef } from '../../../engine';
import { useInteractiveAnimate } from '../../../animation';
import { defaultAnimations, type InteractiveAnimate } from '../../../animation/types';
import styles from './Button.module.css';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends Record<string, unknown> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  animate?: InteractiveAnimate | false;
  asChild?: boolean;
  type?: string;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  onMouseDown?: React.MouseEventHandler<HTMLButtonElement>;
  onMouseUp?: React.MouseEventHandler<HTMLButtonElement>;
  onMouseEnter?: React.MouseEventHandler<HTMLButtonElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLButtonElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLButtonElement>;
  onKeyUp?: React.KeyboardEventHandler<HTMLButtonElement>;
}

export const Button = withMoveComponent<'root', ButtonProps, HTMLButtonElement>({
  name: 'Button',
  styles,
  slots: ['root'] as const,
  defaults: { variant: 'primary', size: 'md', asChild: false, type: 'button' },
  moveProps: ['variant', 'size', 'animate', 'asChild'],

  setup({ props, ref, cx, ptm, attrs }) {
    const {
      variant, size, animate: animateProp, asChild, type,
      className, style, children,
      onMouseDown, onMouseUp, onMouseEnter, onMouseLeave, onKeyDown, onKeyUp,
    } = props;

    // Wire up interactive animation
    const animateConfig = animateProp === false
      ? { hover: false as const, press: false as const }
      : { ...(animateProp || {}) };

    const { ref: animRef, handlers } = useInteractiveAnimate({
      animate: animateConfig as InteractiveAnimate,
      defaults: defaultAnimations.interactive,
      disabled: !!props.disabled,
    });

    const mergedRef = useMergedRef<HTMLButtonElement>(ref, animRef as React.Ref<HTMLButtonElement>);

    return {
      render() {
        const Comp = asChild ? Slot.Root : 'button';
        const rootPt = ptm('root');
        const { className: ptClass, style: ptStyle, ...ptRest } = rootPt as Record<string, unknown>;

        return (
          <Comp
            {...attrs}
            {...ptRest}
            ref={mergedRef}
            type={asChild ? undefined : (type as 'button' | 'submit' | 'reset')}
            className={cx('root', className, ptClass as string | undefined)}
            style={{ ...style, ...(ptStyle as React.CSSProperties) }}
            data-variant={variant}
            data-size={size}
            onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
              handlers.onMouseEnter();
              onMouseEnter?.(e);
            }}
            onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
              handlers.onMouseLeave();
              onMouseLeave?.(e);
            }}
            onMouseDown={(e: React.MouseEvent<HTMLButtonElement>) => {
              handlers.onMouseDown();
              onMouseDown?.(e);
            }}
            onMouseUp={(e: React.MouseEvent<HTMLButtonElement>) => {
              handlers.onMouseUp();
              onMouseUp?.(e);
            }}
            onKeyDown={(e: React.KeyboardEvent<HTMLButtonElement>) => {
              handlers.onKeyDown(e);
              onKeyDown?.(e);
            }}
            onKeyUp={(e: React.KeyboardEvent<HTMLButtonElement>) => {
              handlers.onKeyUp(e);
              onKeyUp?.(e);
            }}
          >
            {children}
          </Comp>
        );
      },
    };
  },
});
```

Key points:
- `useInteractiveAnimate` provides `ref` and `handlers` — merge them with the factory ref
- Every event handler calls the animation handler first, then the user's handler
- `asChild` uses `Slot.Root` from Radix to render as the child element

### Pattern C — Stateful with Headless Hook (Checkbox)

Multiple slots, headless hook (`useCheckbox`), toggle animation, form integration.

```tsx
// src/components/form/Checkbox/Checkbox.tsx
'use client';

import * as React from 'react';
import { withMoveComponent, useMergedRef } from '../../../engine';
import type { PassThrough } from '../../../engine/types';
import { useCheckbox } from './useCheckbox';
import { useToggleAnimation } from '../../../animation/hooks';
import type { ToggleableAnimate } from '../../../animation/types';
import { Icon } from '../../Icon/Icon';
import styles from './Checkbox.module.css';

type CheckboxSlots = 'root' | 'indicator' | 'icon';

export interface CheckboxProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  checked?: boolean;
  defaultChecked?: boolean;
  indeterminate?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  icon?: string;
  animate?: ToggleableAnimate | false;
  disabled?: boolean;
  name?: string;
  value?: string;
  required?: boolean;
  pt?: PassThrough<CheckboxSlots>;
}

const CheckboxRoot = withMoveComponent<CheckboxSlots, CheckboxProps, HTMLButtonElement>({
  name: 'Checkbox',
  styles,
  slots: ['root', 'indicator', 'icon'] as const,
  defaults: { icon: 'check' },
  moveProps: ['checked', 'defaultChecked', 'indeterminate', 'onCheckedChange',
              'icon', 'animate', 'disabled', 'name', 'value', 'required'],

  setup({ props, ref, cx, ptm, attrs }) {
    // Headless state
    const checkbox = useCheckbox({
      checked: props.checked as boolean | undefined,
      defaultChecked: props.defaultChecked as boolean | undefined,
      indeterminate: props.indeterminate as boolean | undefined,
      onChange: props.onCheckedChange as ((checked: boolean) => void) | undefined,
    });

    // Toggle animation
    const toggleAnim = useToggleAnimation({
      animate: props.animate as ToggleableAnimate | false | undefined,
      initialChecked: checkbox.checked,
      disabled: props.disabled as boolean,
    });

    const mergedRef = useMergedRef<HTMLButtonElement>(
      ref, toggleAnim.rootRef as React.Ref<HTMLButtonElement>
    );

    const handleClick = () => {
      if (props.disabled) return;
      const newChecked = !checkbox.checked;
      checkbox.toggle();
      if (newChecked) toggleAnim.animateChecked();
      else toggleAnim.animateUnchecked();
    };

    return {
      render() {
        const rootPt = ptm('root');
        const indicatorPt = ptm('indicator');
        const iconPt = ptm('icon');

        const { className: rootPtClass, style: rootPtStyle, ...rootPtRest } = rootPt as Record<string, unknown>;
        const { className: indPtClass, style: indPtStyle, ...indPtRest } = indicatorPt as Record<string, unknown>;
        const { className: iconPtClass, style: iconPtStyle, ...iconPtRest } = iconPt as Record<string, unknown>;

        const dataState = checkbox.indeterminate
          ? 'indeterminate'
          : checkbox.checked ? 'checked' : 'unchecked';

        return (
          <div className={styles.wrapper}>
            <button
              {...attrs}
              {...rootPtRest}
              ref={mergedRef}
              type="button"
              role="checkbox"
              aria-checked={checkbox.indeterminate ? 'mixed' : checkbox.checked}
              data-state={dataState}
              disabled={props.disabled as boolean}
              className={cx('root', props.className, rootPtClass as string | undefined)}
              style={{ ...props.style, ...(rootPtStyle as React.CSSProperties) }}
              onClick={handleClick}
              onMouseDown={toggleAnim.pressHandlers.onMouseDown}
              onMouseUp={toggleAnim.pressHandlers.onMouseUp}
              onMouseLeave={toggleAnim.pressHandlers.onMouseLeave}
            >
              <span
                {...indPtRest}
                ref={toggleAnim.indicatorRef as React.RefObject<HTMLSpanElement>}
                className={cx('indicator', indPtClass as string | undefined)}
                style={indPtStyle as React.CSSProperties}
              >
                <span {...iconPtRest}>
                  <Icon name={props.icon as string} size={18} />
                </span>
              </span>
            </button>
            {props.name && (
              <input type="hidden" name={props.name as string}
                value={checkbox.checked ? (props.value as string ?? 'on') : ''} />
            )}
            {props.children}
          </div>
        );
      },
    };
  },
});

export const Checkbox = CheckboxRoot;
```

**Headless hook** (`useCheckbox.ts`):
```ts
import { useCallback } from 'react';
import { useControlledState } from '../../../engine/useControlledState';

export interface UseCheckboxOptions {
  checked?: boolean;
  defaultChecked?: boolean;
  indeterminate?: boolean;
  onChange?: (checked: boolean) => void;
}

export interface UseCheckboxReturn {
  checked: boolean;
  indeterminate: boolean;
  toggle: () => void;
}

export function useCheckbox(options: UseCheckboxOptions = {}): UseCheckboxReturn {
  const { indeterminate = false, onChange } = options;

  const [checked, setChecked] = useControlledState<boolean>({
    value: options.checked,
    defaultValue: options.defaultChecked ?? false,
    onChange,
  });

  const toggle = useCallback(() => {
    setChecked((prev) => !prev);
  }, [setChecked]);

  return { checked, indeterminate, toggle };
}
```

Key points:
- Multiple slots (`root`, `indicator`, `icon`) — each gets its own `ptm()` and `cx()` call
- Headless hook lives next to the component as `use{Component}.ts`
- Hook uses `useControlledState` from `engine/` for controlled/uncontrolled pattern
- Hidden `<input>` for form submission when `name` is provided

### Pattern D — Compound Component (Dialog)

Multiple sub-components, shared context, `Object.assign` export. Some sub-components wrap Radix primitives, others are stateless.

```tsx
// src/components/overlay/Dialog/Dialog.tsx
'use client';

import * as React from 'react';
import { Dialog as RadixDialog } from 'radix-ui';
import { withMoveComponent } from '../../../engine';
import type { PassThrough } from '../../../engine/types';
import styles from './Dialog.module.css';

// --- Root (stateless — no factory needed) ---
export interface DialogRootProps {
  children?: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  modal?: boolean;
}

const DialogRoot: React.FC<DialogRootProps> = (props) => (
  <RadixDialog.Root {...props} />
);
DialogRoot.displayName = 'Dialog.Root';

// --- Trigger ---
export interface DialogTriggerProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  asChild?: boolean;
  pt?: PassThrough<'trigger'>;
}

const DialogTrigger = withMoveComponent<'trigger', DialogTriggerProps, HTMLButtonElement>({
  name: 'DialogTrigger',
  styles,
  slots: ['trigger'] as const,
  moveProps: ['asChild'],

  setup({ props, ref, cx, ptm, attrs }) {
    return {
      render() {
        const triggerPt = ptm('trigger');
        const { className: ptClass, style: ptStyle, ...ptRest } = triggerPt as Record<string, unknown>;
        return (
          <RadixDialog.Trigger
            {...attrs}
            {...ptRest}
            ref={ref}
            asChild={props.asChild as boolean}
            className={cx('trigger', props.className, ptClass as string | undefined)}
            style={{ ...props.style, ...(ptStyle as React.CSSProperties) }}
          >
            {props.children}
          </RadixDialog.Trigger>
        );
      },
    };
  },
});

// --- Content, Overlay, Title, Description, Close (similar pattern) ---
// Each sub-component follows the same ptm/cx/attrs/ref pattern.

// --- Export ---
export const Dialog = {
  Root: DialogRoot,
  Trigger: DialogTrigger,
  // Portal, Overlay, Content, Title, Description, Close...
};
```

Key points for compound components:
- **Root** manages state via context (or delegates to Radix). Often doesn't need the factory.
- **Sub-components** each use `withMoveComponent` with their own slot(s).
- **Export** uses `Object.assign` (when root uses factory) or plain object literal.
- **Context** is internal — not exported. Created with `React.createContext` in the same file.
- Accordion uses `Object.assign(AccordionRoot, { Item, Header, Trigger, Content })` because Root is built with the factory.
- Dialog uses a plain object `{ Root, Trigger, ... }` because Root is a stateless wrapper.

---

## 4. CSS Module Contract

### Token placement

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
  /* ... */
}
```

Exception: Accordion currently uses `:root` for tokens. New components should prefer `.root`.

### Attribute selectors

Use `data-*` attributes for variant/size/state styling:

```css
/* Variant */
.root[data-variant='primary'],
.root:not([data-variant]) { /* default variant */ }
.root[data-variant='secondary'] { /* ... */ }

/* Size */
.root[data-size='sm'] { /* ... */ }
.root[data-size='md'], .root:not([data-size]) { /* default size */ }
.root[data-size='lg'] { /* ... */ }

/* State */
.root[data-state='checked'] { /* ... */ }
.root[data-state='open'] { /* ... */ }
```

### CSS variable naming

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

### Design token references

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

### Slot class naming

Each class in the CSS Module must match a slot name used in the factory:

```css
/* Slots: ['root', 'indicator', 'icon'] */
.root { /* ... */ }
.indicator { /* ... */ }
.icon { /* ... */ }
```

Additional utility classes (like `.wrapper`) are allowed but are not slots — they are referenced via `styles.wrapper` directly, not through `cx()`.

---

## 5. Step-by-Step Migration Procedure

For every component you migrate, follow these steps in order:

### Step 1: Classify the component

Determine which category the component belongs to using the decision rules in Section 1. This determines the folder path: `src/components/{category}/{ComponentName}/`.

### Step 2: Identify slots

List every DOM element the user might want to style via pass-through. Each becomes a slot name:
- `root` — always present (the outermost element receiving `ref`, `attrs`, `ptRest`)
- Additional slots for inner elements (e.g. `indicator`, `icon`, `content`, `title`)

### Step 3: Identify Move-specific props vs HTML pass-through

- **Move-specific**: `variant`, `size`, `animate`, `asChild`, `checked`, `onCheckedChange`, etc.
- **HTML pass-through**: `className`, `style`, `children`, `onClick`, `disabled`, `aria-*`, `data-*`, etc.
- Move-specific props go in `moveProps` array (or `defaults` object). Everything else passes through as `attrs`.

### Step 4: Choose animation type

| Component type | Animation hook | Config type |
|----------------|---------------|-------------|
| Clickable element | `useInteractiveAnimate` | `InteractiveAnimate` |
| Toggle control | `useToggleAnimation` | `ToggleableAnimate` |
| Expandable panel | `useExpandAnimation` | `ExpandableAnimate` |
| Overlay/modal | CSS keyframes or `Presence` | `OverlayAnimate` |
| Menu/dropdown | `Presence` + stagger | `MenuAnimate` |
| No animation | (skip) | — |

### Step 5: Determine if headless hook is needed

Create a `use{Component}.ts` hook if the component has:
- Controlled/uncontrolled value pattern
- Complex state management (open/close, selection, navigation)
- Keyboard navigation
- State that sub-components need to share

The hook uses `useControlledState` from `engine/useControlledState` for the controlled/uncontrolled pattern.

### Step 6: Determine if compound composition is needed

Use compound composition (sub-components) when:
- The component has multiple distinct parts the user arranges (e.g. `Dialog.Root`, `Dialog.Content`, `Dialog.Title`)
- Parts share state via context
- The user controls the DOM structure

Use a single component when:
- The component is self-contained (e.g. Badge, Button, Checkbox)
- Internal structure is fixed

### Step 7: Generate the component file

Create `src/components/{category}/{ComponentName}/{ComponentName}.tsx`:

1. `'use client'` directive at top
2. Imports from `../../../engine` (never `core/`)
3. Type exports (`{ComponentName}Props`, variant/size types)
4. Props interface `extends Record<string, unknown>`
5. `withMoveComponent` call with all required options
6. `setup()` with hooks, handlers, and `render()` return
7. In `render()`: `ptm()` → destructure → spread `attrs` + `ptRest` → `cx()` → `data-*` attributes

### Step 8: Generate the CSS module file

Create `src/components/{category}/{ComponentName}/{ComponentName}.module.css`:

1. Component tokens on `.root`
2. Base styles on `.root`
3. Variant styles via `[data-variant='...']`
4. Size styles via `[data-size='...']`
5. State styles via `[data-state='...']`
6. Focus, hover, disabled styles
7. Sub-slot styles (`.indicator`, `.content`, etc.)
8. All values reference design tokens

### Step 9: Generate the index.ts barrel

Create `src/components/{category}/{ComponentName}/index.ts`:

```ts
export { ComponentName } from './ComponentName';
export type { ComponentNameProps, /* all exported types */ } from './ComponentName';
```

If a headless hook exists:
```ts
export { useComponentName } from './useComponentName';
export type { UseComponentNameOptions, UseComponentNameReturn } from './useComponentName';
```

### Step 10: Add exports to src/index.ts

Add the component and its types to `src/index.ts`:

```ts
// Component
export { ComponentName } from './components/{category}/{ComponentName}';
export type { ComponentNameProps, /* types */ } from './components/{category}/{ComponentName}';
```

If a headless hook exists, also export it:
```ts
export { useComponentName } from './components/{category}/{ComponentName}/useComponentName';
export type { UseComponentNameOptions, UseComponentNameReturn } from './components/{category}/{ComponentName}/useComponentName';
```

---

## 6. Demo Page Generation

Every migrated component MUST include a demo page in `demo/src/demos/`.

### Page structure (top to bottom)

1. **Header** — title + short snappy description (no technical jargon)
2. **Usage block** — first example is always "Usage", showing the import and minimal usage code
3. **Feature examples** — each demonstrates one capability (variants, sizes, animation, etc.) with a short, appealing description
4. **Custom Styling** — last example, shows global and instance style overrides via `pt`

### Rules for demo descriptions

- Short and snappy, not technical
- No internal implementation details (no "factory", "hook", "PT", "slot", "pass-through")
- Describe what the user sees/gets, not how it works
- Examples: "A color for every occasion", "From compact to spacious", "Hover and press come to life"

### Demo file template

```tsx
import { ComponentName, MoveProvider } from 'move';
import { DocPage, type Example } from '../components/DocPage';
import { Stack } from '../components';

function UsageExample() {
  return <ComponentName>Hello</ComponentName>;
}

function VariantsExample() {
  return (
    <Stack gap="md" wrap>
      <ComponentName variant="primary">Primary</ComponentName>
      <ComponentName variant="secondary">Secondary</ComponentName>
    </Stack>
  );
}

function CustomStylingExample() {
  return (
    <MoveProvider pt={{ ComponentName: { root: { style: { /* override */ } } } }}>
      <Stack gap="md">
        <ComponentName>Global Style Applied</ComponentName>
        <ComponentName pt={{ root: { style: { /* instance override */ } } }}>
          Instance Style
        </ComponentName>
      </Stack>
    </MoveProvider>
  );
}

const examples: Example[] = [
  {
    id: 'usage',
    name: 'Usage',
    description: 'Import and basic usage',
    component: <UsageExample />,
    code: `import { ComponentName } from 'move';\n\n<ComponentName>Hello</ComponentName>`,
  },
  {
    id: 'variants',
    name: 'Variants',
    description: 'A look for every context',
    component: <VariantsExample />,
    code: `<ComponentName variant="primary">Primary</ComponentName>\n<ComponentName variant="secondary">Secondary</ComponentName>`,
  },
  // ...more feature examples...
  {
    id: 'custom-styling',
    name: 'Custom Styling',
    description: 'Tweak styles globally or per instance',
    component: <CustomStylingExample />,
    code: `<MoveProvider pt={{ ComponentName: { root: { style: { /* ... */ } } } }}>\n  <ComponentName>Global Style Applied</ComponentName>\n  <ComponentName pt={{ root: { style: { /* ... */ } } }}>Instance Style</ComponentName>\n</MoveProvider>`,
  },
];

export function ComponentNameDemo() {
  return (
    <DocPage.Root defaultExample="usage">
      <DocPage.Header
        title="ComponentName"
        description="Short, snappy one-liner."
      />
      <DocPage.Examples examples={examples} />
    </DocPage.Root>
  );
}
```

### Code snippet rules

- Every `code` field must be complete and self-contained — a developer can copy-paste it and it works
- Never use `...` as placeholder
- Include the import statement in the Usage example code
- Show all props/children that appear in the live component

### Registration

Add the new demo to `demo/src/App.tsx`:

1. Import the demo component at the top with the other demo imports
2. Add an entry to the correct `componentGroups` category
3. Choose an appropriate Lucide icon for the sidebar
4. Import the icon from `lucide-react` in the icon import block

```tsx
// In icon imports:
import { ..., NewIcon } from 'lucide-react';

// In demo imports:
import { ComponentNameDemo } from './demos/ComponentNameDemo';

// In componentGroups, under the correct category:
{ name: 'ComponentName', component: ComponentNameDemo, icon: NewIcon },
```

### Routing

The demo app uses hash-based routing. The `name` in `componentGroups` is the **canonical key** — it's used to:
- Match `activeComponent` state to look up the demo component
- Generate the URL hash via `name.toLowerCase().replace(/\s+/g, '-')`
- Match the URL hash back to the component on load

The routing uses `history.pushState` for navigation (avoids hashchange race conditions) and a `hashchange` listener only for browser back/forward. **Do not** set `window.location.hash` directly — always use `handleComponentChange(name)`.

**Important:** The `name` must be unique across all groups and must be the exact PascalCase component name (e.g. `'FormField'`, `'RadioGroup'`, `'Dropdown'`).

---

## 7. Strict Validation Checklist

Before considering the migration complete, verify every item:

### Component file
- [ ] 1. `'use client'` directive present at line 1
- [ ] 2. Props interface `extends Record<string, unknown>`
- [ ] 3. All Move-specific props listed in `moveProps` (or `defaults`)
- [ ] 4. All default values listed in `defaults`
- [ ] 5. `slots` array matches all `ptm()` and `cx()` calls
- [ ] 6. `cx()` used for every `className` on slotted elements
- [ ] 7. `ptm()` called for every slot, destructured correctly (`className`, `style`, `...rest`)
- [ ] 8. `{...attrs}` and `{...ptRest}` spread on root element
- [ ] 9. `ref` forwarded to the root DOM element
- [ ] 10. `data-variant` / `data-size` / `data-state` attributes used (where applicable)

### CSS Module
- [ ] 11. Matching class for every slot in the factory
- [ ] 12. Uses design token variables, not hard-coded values
- [ ] 13. Component tokens on `.root` (not `:root`)

### Exports
- [ ] 14. `index.ts` barrel exports component + all types
- [ ] 15. Component and types added to `src/index.ts`

### Safety
- [ ] 16. No Move-internal props leak to HTML (checked via `moveProps` + `defaults`)

### Paths
- [ ] 17. Import paths use `engine/` (not `core/`)

### Placement consistency
- [ ] 18. Component lives in `src/components/{category}/{ComponentName}/` where `{category}` is a valid category
- [ ] 19. `src/index.ts` import path matches actual directory location
- [ ] 20. Demo registered under the correct `componentGroups` label matching the src category

### Demo
- [ ] 21. Demo page exists in `demo/src/demos/`
- [ ] 22. Usage as first example, Custom Styling as last
- [ ] 23. All demo `code` snippets are complete (no `...` placeholders)
- [ ] 24. Demo descriptions are short and non-technical
