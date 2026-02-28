# Storybook Story Generator

Generate a Storybook story file for a Move component by reading its source and extracting metadata. The story stays in sync with the component because defaults and prop types come directly from the source.

---

## How to Run

**Input:** A component name (e.g. "Button", "Select", "Dialog").

**Output:** A `.stories.tsx` file written next to the component, with a summary of what was generated.

---

## Process

### Step 1 — Locate the component

Find the component directory: `src/components/{category}/{Name}/{Name}.tsx`

Use glob to search if the category is unknown:
```
src/components/**/{Name}/{Name}.tsx
```

Also check if a demo file exists: `demo/src/demos/{Name}Demo.tsx`

### Step 2 — Read and extract metadata

Read `{Name}.tsx` and extract:

| Field | Where to find it |
|-------|-----------------|
| `defaults` | Object literal in `withMoveComponent({ defaults: { ... } })` |
| `moveProps` | Array in `withMoveComponent({ moveProps: [...] })` |
| `slots` | Array in `withMoveComponent({ slots: [...] })` |
| Props interface | `export interface {Name}Props extends Record<string, unknown> { ... }` |
| Event handlers | Any prop whose name starts with `on` + uppercase (e.g. `onClick`, `onValueChange`) |
| Category | From the file path segment after `src/components/` (e.g. `core`, `form`, `overlay`) |

Determine the **component pattern**:

- **Simple** — exported as a single component (e.g. `export const Button = withMoveComponent(...)`)
- **Compound** — exported as a namespace object (e.g. `export const Dialog = { Root, Trigger, Content, ... }`)

For compound components, also identify the Root's props interface and its event handler props.

### Step 3 — Build the story

#### Imports

```tsx
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { ComponentName } from './ComponentName';
```

For compound components that need other Move components in the render (e.g. Dialog needs Button), add those imports.

#### Meta

```tsx
const meta: Meta = {
  title: '{Category}/{Name}',
  component: ComponentName,
  args: { ... },
  argTypes: { ... },
  render: (args) => <ComponentName {...args} />,  // only for simple components
};
export default meta;
```

**`title`** — Map the category from the file path:
- `core` → `Core`, `form` → `Form`, `overlay` → `Overlay`, `panel` → `Panel`
- `navigation` → `Navigation`, `data` → `Data`, `media` → `Media`
- `calendar` → `Calendar`, `toolbar` → `Toolbar`, `loading` → `Loading`, `misc` → `Misc`

#### Args

**Do NOT put default values in `args`** — they pollute the generated code sample. Only include:
- `fn()` for every event handler prop
- `children: '{Name}'` for components that render children as text
- Props that have no default but are required for rendering

Default values are communicated via `table.defaultValue` in argTypes instead.

Example for Button:
```tsx
// Source: defaults: { variant: 'primary', size: 'md', asChild: false, type: 'button' }
args: {
  children: 'Button',   // needed for rendering, not a default
  onClick: fn(),         // event handler
},
```

#### ArgTypes (controls)

Create one `argTypes` entry per prop from the interface. Map types to controls:

| Prop type | Control | Example |
|-----------|---------|---------|
| Union of string literals (`'a' \| 'b' \| 'c'`) | `control: 'select', options: ['a', 'b', 'c']` | `variant` |
| `boolean` | `control: 'boolean'` | `disabled` |
| `string` | `control: 'text'` | `className` |
| `number` | `control: 'number'` | `columns` |
| `React.ReactNode` (children) | `control: 'text'` | `children` |
| Event handler (`on...`) | `action: 'eventName'` | `onClick` |
| Complex objects (`React.CSSProperties`, `SlotPropsMap`, etc.) | Omit from argTypes | `style`, `sp` |
| `ElementAnimate \| false` or similar animation config | Omit from argTypes | `animate` |

Add `description` from JSDoc comments if present on the prop. Otherwise omit description.

For every argType whose prop has a default value (from `defaults` object or the `args`), add `table.defaultValue`:

```tsx
size: {
  control: 'select',
  options: ['sm', 'md', 'lg'],
  table: { defaultValue: { summary: 'md' } },
},
```

#### Skip these props from argTypes
- `className`, `style` — always available, not useful in controls
- `sp` — slot props, too complex for controls
- `animate` — animation config objects
- `asChild` — internal Radix concern

#### Render function

**Simple components:**
```tsx
render: (args) => <ComponentName {...args} />
```

**Compound components:** Write a render function that composes the sub-components in the standard usage pattern. Use the demo file (`demo/src/demos/{Name}Demo.tsx`) as reference for the composition. Wire Root-level event callbacks to `args`:

```tsx
render: (args) => (
  <Select.Root onValueChange={args.onValueChange} onOpenChange={args.onOpenChange}>
    <Select.Trigger>
      <Select.Value placeholder="Choose..." />
      <Select.Icon />
    </Select.Trigger>
    <Select.Portal>
      <Select.Content sideOffset={4}>
        <Select.Item value="a">Option A</Select.Item>
        <Select.Item value="b">Option B</Select.Item>
      </Select.Content>
    </Select.Portal>
  </Select.Root>
),
```

#### Story export

Only one story — controls handle all variants:

```tsx
type Story = StoryObj;

export const Default: Story = {};
```

For compound components where args don't flow through automatically:

```tsx
export const Default: Story = {
  render: (args) => ( ... ),
};
```

### Step 4 — Write the file

Write to `src/components/{category}/{Name}/{Name}.stories.tsx`

### Step 5 — Verify

Run `npx tsc --noEmit` and check for type errors in the generated file. Fix any issues.

---

## Rules

1. **Always read the component source first** — never guess prop types or defaults
2. **Use the demo file as reference** for compound component composition if it exists
3. **Don't create variant stories** (Primary, Secondary, etc.) — one Default story, controls handle the rest
4. **Don't add argTypes for complex props** (style, sp, animate, className) — they clutter the controls panel
5. **Use `fn()` from `'storybook/test'`** for all event handler args
6. **For compound components**, only put Root-level callbacks in args/argTypes — don't try to control individual sub-component props
