# Factory Contract

The `withMoveComponent` factory is the standard way to create Move components. This document describes the exact contract.

## Signature

```ts
import { withMoveComponent } from '../../../engine';

withMoveComponent<TSlots, TProps, TRef, TSubs>({
  name: string;
  styles?: Record<string, string>;
  slots?: readonly TSlots[];
  defaults?: Partial<TProps>;
  moveProps?: readonly string[];
  subComponents?: TSubs;
  setup(context: SetupContext<TSlots, TProps, TRef>): { render(): ReactNode };
});
```

## SetupContext

| Property      | Type                              | Purpose |
|---------------|-----------------------------------|---------|
| `props`       | `TProps`                          | Resolved props: `defaults` merged with user props. Move-specific keys still accessible. |
| `ref`         | `Ref<TRef>`                       | Merged ref (forwarded + internal). Attach to root DOM element. |
| `internalRef` | `RefObject<TRef \| null>`         | Direct ref for imperative DOM access inside setup. |
| `cx`          | `(slot, ...extra) => string`      | Resolves CSS Module class for a slot, plus extra classNames. |
| `sp`          | `(slot, localProps?) => SlotProps` | Merges global slotProps → instance sp → local props for a slot. |
| `attrs`       | `Record<string, unknown>`         | HTML-safe props: user props minus all Move-specific keys. Spread on root element. |

## How `defaults`, `moveProps`, and `stripKeys` interact

The factory builds a `stripKeys` set from:
1. Internal keys: `['sp']`
2. Everything in `moveProps`
3. Every key in `defaults`

Any prop key in `stripKeys` is **excluded from `attrs`** so it won't leak to the HTML DOM element. Props are still accessible via `props.*` inside `setup()`.

**Rule:** If a prop is Move-specific (not a valid HTML attribute), it must appear in either `moveProps` or `defaults`.

## `cx()` — Class resolution

```ts
cx('root', props.className, spClass)
// → "Badge_root_abc123 my-custom-class sp-override-class"
```

- First arg is the slot name → looks up `styles[slot]` for the CSS Module class
- Remaining args are extra classNames (falsy values filtered out)

## `sp()` — Slot props merging

```ts
const rootSp = sp('root');
// Merges: globalSP.root → instanceSP.root → localProps
// className: concatenated
// style: shallow-merged (later wins)
// everything else: spread (later wins)
```

## Render pattern

Every factory component follows this pattern in `render()`:

```tsx
const rootSp = sp('root');
const { className: spClass, style: spStyle, ...spRest } = rootSp as Record<string, unknown>;

<div
  {...attrs}          // HTML-safe user props
  {...spRest}         // Slot props overrides (except className/style)
  ref={ref}
  className={cx('root', props.className, spClass as string | undefined)}
  style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
  data-variant={props.variant}
>
  {props.children}
</div>
```

Order matters:
1. `{...attrs}` first — base HTML props
2. `{...spRest}` second — slot props can override attrs
3. Explicit props (ref, className, style, data-*) last — always win

## Sub-component attachment

### Plain object (Root is stateless FC wrapping Radix/context):
```ts
export const Dialog = {
  Root: DialogRoot,
  Trigger: DialogTrigger,
  Content: DialogContent,
};
```

### Object.assign (Root uses factory):
```ts
export const Accordion = Object.assign(AccordionRoot, {
  Item: AccordionItem,
  Header: AccordionHeader,
  Trigger: AccordionTrigger,
  Content: AccordionContent,
});
```

## HTML-safe props (do NOT put in moveProps)

These are standard HTML/React props and should NOT appear in `moveProps` or `defaults`:
`className`, `style`, `children`, `disabled`, `type`, `name`, `value`, `required`, `onClick`, `onChange`, `onFocus`, `onBlur`, `onKey*`, `onMouse*`, `aria-*`, `data-*`, `role`, `tabIndex`, `id`, `title`, `placeholder`, `autoFocus`, `form`.

The `sp` prop is automatically handled by the factory.
