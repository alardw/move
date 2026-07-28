// Select.spec.ts — Component specification

import type { ComponentSpec } from '../../../spec-type';

export const spec = {
  schemaVersion: 1 as const,
  name: 'Select',
  animationPatterns: ['popupMenu'],
  componentClass: 'input_popup' as const,
  category: 'forms',
  description:
    'Dropdown select built on Radix Select — a combobox trigger, listbox popup with option items, and a hidden native <select> for form submission — with an animated popup and item stagger',
  choreographies: ['popupMenu'],
  families: {
    behavior: ['popup-anchored'],
    state: ['controlled-value', 'controlled-open'],
    a11y: ['combobox', 'listbox'],
  },
  behavior: {
    popup: {
      closeOnEscape: true,
      closeOnOutsideClick: true,
      closeOnScroll: true,
      closeOnResize: true,
    },
  },

  compound: true,
  rootElement: 'div',
  slots: [
    { name: 'trigger', element: 'button', description: 'Button that opens the select dropdown' },
    {
      name: 'value',
      element: 'span',
      description: 'Display of the currently selected value or placeholder',
    },
    {
      name: 'icon',
      element: 'span',
      description: 'Chevron indicator icon with open/close rotation animation',
    },
    {
      name: 'content',
      element: 'div',
      description: 'Dropdown popup container with enter/exit animation',
    },
    { name: 'contentInner', element: 'div', description: 'Scrollable inner container for items' },
    { name: 'viewport', element: 'div', description: 'Structural viewport wrapper for items' },
    { name: 'item', element: 'div', description: 'Selectable item within the dropdown' },
    { name: 'group', element: 'div', description: 'Visual grouping of related items' },
    { name: 'label', element: 'div', description: 'Group label for a set of items' },
    { name: 'separator', element: 'div', description: 'Visual divider between groups or items' },
  ],

  subComponents: [
    {
      name: 'Root',
      slots: [],
      props: [
        {
          name: 'value',
          type: 'string',
          moveSpecific: false,
          description: 'Controlled selected value',
        },
        {
          name: 'defaultValue',
          type: 'string',
          moveSpecific: false,
          description: 'Default selected value (uncontrolled)',
        },
        {
          name: 'onValueChange',
          type: '(value: string) => void',
          moveSpecific: false,
          description: 'Called when selected value changes',
        },
        {
          name: 'open',
          type: 'boolean',
          moveSpecific: false,
          description: 'Controlled open state',
        },
        {
          name: 'defaultOpen',
          type: 'boolean',
          moveSpecific: false,
          description: 'Default open state (uncontrolled)',
        },
        {
          name: 'onOpenChange',
          type: '(open: boolean) => void',
          moveSpecific: false,
          description: 'Called when open state changes',
        },
        {
          name: 'name',
          type: 'string',
          moveSpecific: false,
          description:
            'Name of the hidden native <select> — set it to submit the value with a form',
        },
        {
          name: 'required',
          type: 'boolean',
          moveSpecific: false,
          description: 'Marks the underlying native select required for form validation',
        },
        {
          name: 'disabled',
          type: 'boolean',
          moveSpecific: false,
          description: 'Disables the trigger and the native select',
        },
        {
          name: 'animations',
          type: 'AnimationTrigger[] | false',
          moveSpecific: true,
          advanced: true,
          description: 'Animation config or false to disable',
        },
        {
          name: 'children',
          type: 'React.ReactNode',
          moveSpecific: false,
          description: 'Select sub-components',
        },
      ],
      usesFactory: false,
      radixPrimitive: 'DropdownMenu.Root',
      description:
        'Stateful root that manages value, open/close, animation context, and label registry via SelectContext',
    },
    {
      name: 'Trigger',
      slots: [{ name: 'trigger', element: 'button', description: 'Trigger button element' }],
      props: [
        { name: 'className', type: 'string', moveSpecific: false, description: 'CSS class name' },
        {
          name: 'style',
          type: 'React.CSSProperties',
          moveSpecific: false,
          description: 'Inline styles',
        },
        {
          name: 'children',
          type: 'React.ReactNode',
          moveSpecific: false,
          description: 'Trigger content (typically Value + Icon)',
        },
        { name: 'disabled', type: 'boolean', moveSpecific: false, description: 'Disabled state' },
        { name: 'invalid', type: 'boolean', moveSpecific: true, description: 'Invalid state' },
        {
          name: 'size',
          typeRef: 'Size',
          default: "'md'",
          moveSpecific: true,
          description: 'Trigger size',
        },
        {
          name: 'variant',
          type: "'outlined' | 'filled'",
          default: "'outlined'",
          moveSpecific: true,
          description: 'Visual variant',
        },
        {
          name: 'width',
          typeRef: 'Dimension',
          moveSpecific: true,
          description: 'Custom width override',
        },
        {
          name: 'minWidth',
          typeRef: 'Dimension',
          moveSpecific: true,
          description: 'Minimum width override (token default: 10rem)',
        },
        {
          name: 'maxWidth',
          typeRef: 'Dimension',
          moveSpecific: true,
          description:
            'Maximum width override (token default: 30rem — prevents absurdly wide selects in stretched parents)',
        },
      ],
      usesFactory: true,
      radixPrimitive: 'DropdownMenu.Trigger',
      description:
        'Button trigger wrapping Radix DropdownMenu.Trigger with size/variant/invalid data attributes. Defaults to min-width 10rem / max-width 30rem; override per-instance with minWidth/maxWidth props or globally via tokens.',
    },
    {
      name: 'Value',
      slots: [{ name: 'value', element: 'span', description: 'Value display span' }],
      props: [
        { name: 'className', type: 'string', moveSpecific: false, description: 'CSS class name' },
        {
          name: 'style',
          type: 'React.CSSProperties',
          moveSpecific: false,
          description: 'Inline styles',
        },
        {
          name: 'placeholder',
          type: 'string',
          moveSpecific: true,
          description: 'Text shown when no value selected',
        },
        {
          name: 'children',
          type: 'React.ReactNode',
          moveSpecific: false,
          description: 'Custom render override for selected value',
        },
      ],
      usesFactory: true,
      description:
        'Displays selected value label from label registry or placeholder when empty; sets data-placeholder when no value',
    },
    {
      name: 'Icon',
      slots: [{ name: 'icon', element: 'span', description: 'Chevron icon container' }],
      props: [
        { name: 'className', type: 'string', moveSpecific: false, description: 'CSS class name' },
        {
          name: 'style',
          type: 'React.CSSProperties',
          moveSpecific: false,
          description: 'Inline styles',
        },
        {
          name: 'children',
          type: 'React.ReactNode',
          moveSpecific: false,
          description: 'Custom icon content (defaults to chevron-down)',
        },
      ],
      usesFactory: true,
      description: 'Chevron icon that rotates 180deg on open via MutationObserver on data-state',
    },
    {
      name: 'Content',
      slots: [
        { name: 'content', element: 'div', description: 'Popup container' },
        { name: 'contentInner', element: 'div', description: 'Scrollable inner wrapper' },
      ],
      props: [
        { name: 'className', type: 'string', moveSpecific: false, description: 'CSS class name' },
        {
          name: 'style',
          type: 'React.CSSProperties',
          moveSpecific: false,
          description: 'Inline styles',
        },
        {
          name: 'children',
          type: 'React.ReactNode',
          moveSpecific: false,
          description: 'Content children (Viewport, Items, etc.)',
        },
        {
          name: 'sideOffset',
          type: 'number',
          default: '4',
          moveSpecific: false,
          description: 'Distance from trigger in px',
        },
        {
          name: 'align',
          type: "'start' | 'center' | 'end'",
          moveSpecific: false,
          description: 'Alignment along the trigger axis',
        },
        {
          name: 'container',
          type: 'HTMLElement',
          moveSpecific: false,
          advanced: true,
          description: 'Custom portal mount target. Defaults to document.body.',
        },
        {
          name: 'width',
          typeRef: 'Dimension',
          moveSpecific: true,
          description: 'Custom width override — by default matches trigger width',
        },
        {
          name: 'minWidth',
          typeRef: 'Dimension',
          moveSpecific: true,
          description: 'Minimum width override (token default: 10rem)',
        },
        {
          name: 'maxWidth',
          typeRef: 'Dimension',
          moveSpecific: true,
          description: 'Maximum width override (token default: 30rem)',
        },
        {
          name: 'onPointerDownOutside',
          type: '(e: Event) => void',
          moveSpecific: false,
          advanced: true,
          description: 'Pointer down outside handler',
        },
        {
          name: 'onEscapeKeyDown',
          type: '(e: KeyboardEvent) => void',
          moveSpecific: false,
          advanced: true,
          description: 'Escape key handler',
        },
      ],
      usesFactory: true,
      radixPrimitive: 'DropdownMenu.Content',
      description:
        'Animated popup content. Defaults to matching trigger width (var(--radix-dropdown-menu-trigger-width)) with min/max-width clamping. Tall content scrolls via max-height; items truncate with ellipsis. Height animation, stagger enter, scroll-to-selected on open.',
    },
    {
      name: 'Viewport',
      slots: [{ name: 'viewport', element: 'div', description: 'Viewport wrapper' }],
      props: [
        { name: 'className', type: 'string', moveSpecific: false, description: 'CSS class name' },
        {
          name: 'style',
          type: 'React.CSSProperties',
          moveSpecific: false,
          description: 'Inline styles',
        },
        {
          name: 'children',
          type: 'React.ReactNode',
          moveSpecific: false,
          description: 'Items and groups',
        },
      ],
      usesFactory: true,
      description: 'Structural viewport wrapper for select items',
    },
    {
      name: 'Item',
      slots: [{ name: 'item', element: 'div', description: 'Selectable item' }],
      props: [
        { name: 'className', type: 'string', moveSpecific: false, description: 'CSS class name' },
        {
          name: 'style',
          type: 'React.CSSProperties',
          moveSpecific: false,
          description: 'Inline styles',
        },
        {
          name: 'children',
          type: 'React.ReactNode',
          moveSpecific: false,
          description: 'Item content',
        },
        {
          name: 'value',
          type: 'string',
          moveSpecific: true,
          description: 'Value to select when chosen',
        },
        {
          name: 'label',
          type: 'React.ReactNode',
          moveSpecific: true,
          description: 'Display label registered in SelectValue (defaults to children)',
        },
        { name: 'disabled', type: 'boolean', moveSpecific: false, description: 'Disabled state' },
        {
          name: 'onSelect',
          type: '(e: Event) => void',
          moveSpecific: false,
          description: 'Called when item is selected',
        },
      ],
      usesFactory: true,
      radixPrimitive: 'DropdownMenu.Item',
      description:
        'Selectable item with spring hover animation, selected highlight, and label registration. Long labels truncate with ellipsis (white-space: nowrap, overflow: hidden, text-overflow: ellipsis) — they are clipped by the Content max-width bound.',
    },
    {
      name: 'Group',
      slots: [{ name: 'group', element: 'div', description: 'Group container' }],
      props: [
        { name: 'className', type: 'string', moveSpecific: false, description: 'CSS class name' },
        {
          name: 'style',
          type: 'React.CSSProperties',
          moveSpecific: false,
          description: 'Inline styles',
        },
        {
          name: 'children',
          type: 'React.ReactNode',
          moveSpecific: false,
          description: 'Group label and items',
        },
      ],
      usesFactory: true,
      radixPrimitive: 'DropdownMenu.Group',
      description: 'Visual grouping container for related items',
    },
    {
      name: 'Label',
      slots: [{ name: 'label', element: 'div', description: 'Group label text' }],
      props: [
        { name: 'className', type: 'string', moveSpecific: false, description: 'CSS class name' },
        {
          name: 'style',
          type: 'React.CSSProperties',
          moveSpecific: false,
          description: 'Inline styles',
        },
        {
          name: 'children',
          type: 'React.ReactNode',
          moveSpecific: false,
          description: 'Label text',
        },
      ],
      usesFactory: true,
      radixPrimitive: 'DropdownMenu.Label',
      description: 'Non-interactive label for a group of items',
    },
    {
      name: 'Separator',
      slots: [{ name: 'separator', element: 'div', description: 'Visual divider' }],
      props: [
        { name: 'className', type: 'string', moveSpecific: false, description: 'CSS class name' },
        {
          name: 'style',
          type: 'React.CSSProperties',
          moveSpecific: false,
          description: 'Inline styles',
        },
      ],
      usesFactory: true,
      radixPrimitive: 'DropdownMenu.Separator',
      description: 'Horizontal divider between groups or items',
    },
  ],

  props: [
    {
      name: 'value',
      type: 'string',
      moveSpecific: false,
      description: 'Controlled selected value',
    },
    {
      name: 'defaultValue',
      type: 'string',
      moveSpecific: false,
      description: 'Default selected value (uncontrolled)',
    },
    {
      name: 'onValueChange',
      type: '(value: string) => void',
      moveSpecific: false,
      description: 'Called when selected value changes',
    },
    { name: 'open', type: 'boolean', moveSpecific: false, description: 'Controlled open state' },
    {
      name: 'defaultOpen',
      type: 'boolean',
      moveSpecific: false,
      description: 'Default open state (uncontrolled)',
    },
    {
      name: 'onOpenChange',
      type: '(open: boolean) => void',
      moveSpecific: false,
      description: 'Called when open state changes',
    },
    {
      name: 'animations',
      type: 'AnimationTrigger[] | false',
      moveSpecific: true,
      description: 'Animation config or false to disable',
    },
    {
      name: 'children',
      type: 'React.ReactNode',
      moveSpecific: false,
      description: 'Select sub-components',
    },
  ],

  anatomy: {
    slot: 'content',
    dataAttributes: ['data-state'],
    children: [
      {
        slot: 'contentInner',
        children: [
          {
            slot: 'viewport',
            children: [
              {
                slot: 'item',
                dataAttributes: ['data-selected', 'data-highlighted', 'data-disabled'],
              },
            ],
          },
        ],
      },
    ],
  },

  controlled: 'value' as const,
  controlledProps: {
    valueProp: 'value',
    defaultValueProp: 'defaultValue',
    onChangeProp: 'onValueChange',
  },
  keyboard: 'linear' as const,
  focus: 'delegated' as const,
  formType: 'hidden-input' as const,
  asChild: false,

  dismissBehavior: 'unmountAfterExit' as const,

  animations: [
    {
      trigger: 'open',
      sequence: [
        [
          { target: 'Content', fn: 'animateDimension', animation: { height: { ease: 'poppy' } } },
          {
            target: 'ContentInner',
            children: '[role="option"]',
            animation: { scale: { from: 0.8, to: 1, ease: 'poppy' }, opacity: { from: 0, to: 1 } },
            stagger: { delay: 30 },
          },
          { target: 'Icon', animation: { rotate: { to: 180, ease: 'outQuart', duration: 300 } } },
        ],
      ],
    },
    {
      trigger: 'closed',
      sequence: [
        [
          { target: 'Content', fn: 'animateDimension', animation: { height: { ease: 'snappy' } } },
          {
            target: 'ContentInner',
            children: '[role="option"]',
            animation: { scale: { to: 0.8, ease: 'snappy' }, opacity: { to: 0 } },
            stagger: { delay: 20, from: 'last' },
          },
          { target: 'Icon', animation: { rotate: { to: 0, ease: 'outQuart', duration: 300 } } },
        ],
      ],
    },
  ],

  renderContracts: [
    {
      id: 'root-manages-animation-close',
      description:
        'Root intercepts close from Radix and coordinates via isClosing state to allow exit animation before unmount',
    },
    {
      id: 'root-label-registry',
      description:
        'Root maintains a label map (value -> ReactNode) via registerLabel/getLabel so SelectValue can display the label for the current value',
    },
    {
      id: 'content-height-animation',
      description: 'Content uses animateDimension for height reveal from 0 on open',
    },
    {
      id: 'content-scroll-to-selected',
      description: 'Content scrolls to selected item (data-selected) before enter animation',
    },
    {
      id: 'content-focus-selected-on-open',
      description:
        'Content focuses the selected item on open complete, or dispatches ArrowDown if none selected',
    },
    {
      id: 'trigger-move-state',
      description:
        'Trigger sets data-move-state="open"|"closed" reflecting true animation state (closed during exit, unlike Radix data-state which stays open)',
    },
    {
      id: 'icon-rotation-animation',
      description:
        'Icon observes data-move-state on Trigger ancestor via MutationObserver and animates rotation to 180deg on open, 0deg on close',
    },
    {
      id: 'item-spring-hover',
      description:
        'Item uses spring animation to scale to 1.02 on mouse enter and back to 1 on mouse leave',
    },
    {
      id: 'item-registers-label',
      description:
        'Item registers its label (or children) in the SelectContext label map on mount/update',
    },
    {
      id: 'item-select-closes',
      description:
        'Item selection calls onValueChange, fires onSelect callback, and triggers animated close',
    },
  ],

  surface: {
    slot: 'content',
    level: 'subtle' as const,
  },

  tokens: [
    // Trigger tokens
    {
      name: '--move-select-trigger-bg',
      value: 'var(--move-bg-subtle)',
      description: 'Trigger background color',
    },
    {
      name: '--move-select-trigger-border',
      value: 'var(--move-border-interactive)',
      description: 'Trigger border color',
    },
    {
      name: '--move-select-trigger-radius',
      value: 'var(--move-rounded-md)',
      description: 'Trigger border radius',
    },
    {
      name: '--move-select-trigger-padding-x',
      value: 'var(--move-spacing-sm)',
      description: 'Trigger horizontal padding',
    },
    {
      name: '--move-select-trigger-padding-y',
      value: 'var(--move-spacing-xs)',
      description: 'Trigger vertical padding',
    },
    {
      name: '--move-select-trigger-font-size',
      value: 'var(--move-size-sm)',
      description: 'Trigger font size',
    },
    {
      name: '--move-select-trigger-fg',
      value: 'var(--move-fg-base)',
      description: 'Trigger text color',
    },
    {
      name: '--move-select-trigger-height',
      value: 'var(--move-control-height-md)',
      description: 'Trigger height',
    },
    {
      name: '--move-select-trigger-min-width',
      value: '10rem',
      description: 'Trigger minimum width',
    },
    {
      name: '--move-select-trigger-max-width',
      value: 'none',
      description: 'Trigger maximum width — prevents absurdly wide selects in stretched parents',
    },
    // Content tokens
    {
      name: '--move-select-content-bg',
      value: 'var(--move-bg-subtle)',
      description: 'Content background color',
    },
    {
      name: '--move-select-content-border',
      value: 'var(--move-border-base)',
      description: 'Content border color',
    },
    {
      name: '--move-select-content-radius',
      value: 'var(--move-rounded-lg)',
      description: 'Content border radius',
    },
    {
      name: '--move-select-content-shadow',
      value: 'var(--move-shadow-overlay)',
      description: 'Content box shadow',
    },
    {
      name: '--move-select-content-padding',
      value: 'var(--move-spacing-xs)',
      description: 'Content inner padding',
    },
    {
      name: '--move-select-content-min-width',
      value: '10rem',
      description: 'Content minimum width (floor when matching trigger)',
    },
    {
      name: '--move-select-content-max-width',
      value: 'none',
      description: 'Content maximum width (cap when matching trigger)',
    },
    // Item tokens
    {
      name: '--move-select-item-radius',
      value: 'var(--move-rounded-md)',
      description: 'Item border radius',
    },
    {
      name: '--move-select-item-padding-x',
      value: 'var(--move-spacing-sm)',
      description: 'Item horizontal padding',
    },
    {
      name: '--move-select-item-padding-y',
      value: 'var(--move-spacing-xs)',
      description: 'Item vertical padding',
    },
    { name: '--move-select-item-fg', value: 'var(--move-fg-base)', description: 'Item text color' },
    {
      name: '--move-select-item-fg-disabled',
      value: 'var(--move-fg-subtle)',
      description: 'Item disabled text color',
    },
    {
      name: '--move-select-item-bg-highlight',
      value: 'var(--move-bg-muted)',
      description: 'Item highlighted background',
    },
    {
      name: '--move-select-item-font-size',
      value: 'var(--move-size-sm)',
      description: 'Item font size',
    },
    // Label tokens
    {
      name: '--move-select-label-padding-x',
      value: 'var(--move-spacing-sm)',
      description: 'Label horizontal padding',
    },
    {
      name: '--move-select-label-padding-y',
      value: 'var(--move-spacing-xs)',
      description: 'Label vertical padding',
    },
    {
      name: '--move-select-label-font-size',
      value: 'var(--move-size-xs)',
      description: 'Label font size',
    },
    {
      name: '--move-select-label-fg',
      value: 'var(--move-fg-subtle)',
      description: 'Label text color',
    },
    {
      name: '--move-select-label-font-weight',
      value: 'var(--move-weight-semibold)',
      description: 'Label font weight',
    },
    // Separator tokens
    {
      name: '--move-select-separator-color',
      value: 'var(--move-border-base)',
      description: 'Separator line color',
    },
    {
      name: '--move-select-separator-margin',
      value: 'var(--move-spacing-xs)',
      description: 'Separator vertical margin',
    },
  ],

  variants: {
    variant: ['outlined', 'filled'] as string[],
  },
  sizes: ['sm', 'md', 'lg'] as string[],

  labels: [],

  radixPrimitive: 'DropdownMenu',
  hasHook: false,
  engineImports: ['withMoveComponent', 'useMergedRef'] as string[],
  componentDeps: [] as string[],

  testing: {
    behaviors: [
      'Root renders with SelectContext provider wrapping Radix DropdownMenu.Root',
      'Root manages controlled/uncontrolled value state',
      'Root manages controlled/uncontrolled open state',
      'Root maintains label registry mapping value to ReactNode',
      'Root coordinates animated close via isClosing state',
      'Trigger renders as Radix DropdownMenu.Trigger button',
      'Trigger applies data-size, data-variant, data-disabled, data-invalid attributes',
      'Trigger defaults to size=md and variant=outlined',
      'Trigger supports custom width prop',
      'Value displays selected item label from label registry',
      'Value displays placeholder with data-placeholder attribute when no value',
      'Value falls back to value string when no label registered',
      'Icon renders chevron-down by default via useResolvedIcon',
      'Icon rotates 180deg on open and 0deg on close',
      'Icon animation observes data-state via MutationObserver',
      'Portal renders via Radix DropdownMenu.Portal',
      'Content renders inside Radix DropdownMenu.Content',
      'Content defaults sideOffset to 4',
      'Content scrolls to selected item before enter animation',
      'Content focuses selected item on open complete',
      'Content dispatches ArrowDown if no item selected on open',
      'Content intercepts pointer-down-outside and escape to trigger animated close',
      'ContentInner provides scrollable area with custom scrollbar styling',
      'Item renders as Radix DropdownMenu.Item',
      'Item sets data-selected when its value matches context value',
      'Item registers label in SelectContext on mount',
      'Item select calls onValueChange and triggers close',
      'Item has spring scale animation on hover (1.02)',
      'Group renders as Radix DropdownMenu.Group',
      'Label renders as Radix DropdownMenu.Label with semibold weight',
      'Separator renders as Radix DropdownMenu.Separator',
      'Forwards className and style on Trigger',
      'Forwards className and style on Content',
      'Forwards className and style on Item',
    ],
    keyboard: [
      'ArrowDown navigates to next item',
      'ArrowUp navigates to previous item',
      'Enter selects highlighted item and closes',
      'Escape closes dropdown with exit animation',
      'Type-ahead focuses matching item',
    ] as string[],
    aria: [
      'Trigger has aria-expanded from Radix',
      'Trigger has aria-haspopup from Radix',
      'Content has role=menu from Radix DropdownMenu',
      'Items have role=menuitem from Radix',
      'Disabled items have data-disabled attribute',
      'Icon has aria-hidden=true',
    ] as string[],
    form: ['Hidden input participates in form submission via name prop'] as string[],
    animation: [
      'Content enter animation: opacity [0,1] + scale [0.5,1] with outQuart easing',
      'Content exit animation: opacity [1,0] + scale [1,0.95] with outQuart easing, 200ms',
      'Content stagger: items enter with 30ms stagger delay',
      'Content uses animateDimension for height reveal from 0',
      'Icon rotation animation uses outQuart easing over 300ms',
      'Item hover uses spring animation (mass:0.6, stiffness:400, damping:20)',
      'animations={false} disables all animations including icon rotation',
      'Reduced motion preference disables animation durations',
    ] as string[],
  },

  iconsUsed: ['chevron-down'],
} satisfies ComponentSpec;
