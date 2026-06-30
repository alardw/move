// RadioGroup.spec.ts — Component specification
// specHash: PLACEHOLDER

import type { ComponentSpec } from '../../../spec-type';

export const spec = {
  schemaVersion: 7 as const,
  name: 'RadioGroup',
  componentClass: 'input_toggle' as const,
  category: 'forms',
  description:
    'Radio button group built on Radix RadioGroup with toggle animation for checked/unchecked indicator state',
  animationPatterns: ['toggle'],
  families: {
    behavior: ['form-input'],
    state: ['controlled-value'],
    a11y: ['listbox'],
  },

  compound: true,
  rootElement: 'div',
  slots: [
    {
      name: 'root',
      element: 'div',
      description: 'Radix RadioGroup.Root container with flex layout',
    },
    { name: 'item', element: 'button', description: 'Radix RadioGroup.Item radio button element' },
    {
      name: 'indicator',
      element: 'span',
      description: 'Radix RadioGroup.Indicator containing the dot, force-mounted for animation',
    },
    { name: 'dot', element: 'span', description: 'Visual radio dot inside the indicator' },
  ],

  subComponents: [
    {
      name: 'Root',
      slots: [{ name: 'root', element: 'div', description: 'RadioGroup root container' }],
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
          description: 'RadioGroup.Item children',
        },
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
          name: 'disabled',
          type: 'boolean',
          moveSpecific: false,
          description: 'Disable all radio items',
        },
        {
          name: 'name',
          type: 'string',
          moveSpecific: false,
          description: 'Form input name for hidden inputs',
        },
        {
          name: 'required',
          type: 'boolean',
          moveSpecific: false,
          description: 'Mark all items as required',
        },
        {
          name: 'invalid',
          type: 'boolean',
          moveSpecific: true,
          description: 'Invalid state applied to all items via data-invalid',
        },
        {
          name: 'size',
          typeRef: 'Size',
          default: "'md'",
          moveSpecific: true,
          description: 'Size of all radio items',
        },
        {
          name: 'orientation',
          type: "'horizontal' | 'vertical'",
          default: "'vertical'",
          moveSpecific: false,
          description: 'Layout orientation',
        },
        {
          name: 'loop',
          type: 'boolean',
          moveSpecific: false,
          description: 'Whether keyboard navigation loops',
        },
      ],
      usesFactory: true,
      radixPrimitive: 'RadioGroup.Root',
      description:
        'Root container wrapping Radix RadioGroup.Root with flex layout, size and invalid data attributes',
    },
    {
      name: 'Item',
      slots: [
        { name: 'item', element: 'button', description: 'Radio button' },
        { name: 'indicator', element: 'span', description: 'Indicator container' },
        { name: 'dot', element: 'span', description: 'Dot element' },
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
          description: 'Label content rendered next to radio',
        },
        {
          name: 'value',
          type: 'string',
          moveSpecific: true,
          description: 'Value of this radio option',
        },
        { name: 'disabled', type: 'boolean', moveSpecific: false, description: 'Disabled state' },
        {
          name: 'animations',
          type: 'AnimationTrigger[] | false',
          moveSpecific: true,
          description: 'Toggle animation config or false to disable',
        },
      ],
      usesFactory: true,
      radixPrimitive: 'RadioGroup.Item',
      description:
        'Individual radio item with toggle animation on checked/unchecked state, wrapped in a clickable span',
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
    {
      name: 'disabled',
      type: 'boolean',
      moveSpecific: false,
      description: 'Disable all radio items',
    },
    { name: 'name', type: 'string', moveSpecific: false, description: 'Form input name' },
    { name: 'required', type: 'boolean', moveSpecific: false, description: 'Required state' },
    { name: 'invalid', type: 'boolean', moveSpecific: true, description: 'Invalid state' },
    {
      name: 'size',
      typeRef: 'Size',
      default: "'md'",
      moveSpecific: true,
      description: 'Radio item size',
    },
    {
      name: 'orientation',
      type: "'horizontal' | 'vertical'",
      default: "'vertical'",
      moveSpecific: false,
      description: 'Layout orientation',
    },
    {
      name: 'loop',
      type: 'boolean',
      moveSpecific: false,
      description: 'Whether keyboard navigation loops',
    },
    {
      name: 'children',
      type: 'React.ReactNode',
      moveSpecific: false,
      description: 'RadioGroup.Item children',
    },
  ],

  anatomy: {
    slot: 'root',
    dataAttributes: ['data-invalid', 'data-size'],
    ariaAttributes: ['aria-orientation'],
    children: [
      {
        slot: 'item',
        dataAttributes: ['data-state', 'data-disabled'],
        children: [
          {
            slot: 'indicator',
            dataAttributes: ['data-state'],
            children: [{ slot: 'dot' }],
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
  keyboard: 'roving' as const,
  focus: 'roving' as const,
  formType: 'hidden-input' as const,
  asChild: false,

  states: [
    { name: 'checked', slot: 'Root', source: 'data-state', value: 'checked' },
    { name: 'unchecked', slot: 'Root', source: 'data-state', value: 'unchecked' },
  ],

  animations: [
    {
      trigger: 'checked',
      sequence: [
        { target: 'indicator', animation: { opacity: { to: 1 }, scale: { to: 1, ease: 'poppy' } } },
      ],
    },
    {
      trigger: 'unchecked',
      sequence: [
        {
          target: 'indicator',
          animation: { opacity: { to: 0 }, scale: { to: 0.5, ease: 'snappy' } },
        },
      ],
    },
    { trigger: 'Root.press', sequence: [{ animation: { scale: { to: 0.96, ease: 'snappy' } } }] },
  ],

  renderContracts: [
    {
      id: 'item-wrapper-click',
      description:
        'Item is wrapped in a span.wrapper that forwards click to the hidden Radix RadioGroup.Item button (pointer-events:none on item)',
    },
    {
      id: 'indicator-force-mount',
      description: 'RadioGroup.Indicator is force-mounted to enable exit animation when unchecked',
    },
    {
      id: 'indicator-opacity-zero-unchecked',
      description: 'Indicator has opacity:0 when data-state=unchecked via CSS',
    },
    {
      id: 'press-handlers-on-wrapper',
      description:
        'Press animation handlers (onMouseDown/Up/Leave) are attached to wrapper span via Root.press trigger',
    },
    {
      id: 'size-cascades-from-root',
      description:
        'Size is set as data-size on Root and cascades to items via CSS descendant selectors',
    },
    {
      id: 'invalid-cascades-from-root',
      description:
        'Invalid is set as data-invalid on Root and cascades border/outline color changes to items',
    },
  ],

  tokens: [
    { name: '--move-radio-size', value: '1.5rem', description: 'Radio button width and height' },
    {
      name: '--move-radio-radius',
      value: 'var(--move-rounded-full)',
      description: 'Radio button border radius (always circle)',
    },
    {
      name: '--move-radio-bg',
      value: 'var(--move-bg-muted)',
      description: 'Unchecked background color',
    },
    {
      name: '--move-radio-bg-hover',
      value: 'var(--move-bg-emphasis)',
      description: 'Unchecked hover background color',
    },
    {
      name: '--move-radio-bg-checked',
      value: 'var(--move-primary)',
      description: 'Checked background color',
    },
    {
      name: '--move-radio-bg-checked-hover',
      value: 'var(--move-primary-hover)',
      description: 'Checked hover background color',
    },
    {
      name: '--move-radio-border',
      value: 'var(--move-border-base)',
      description: 'Unchecked border color',
    },
    {
      name: '--move-radio-border-hover',
      value: 'var(--move-border-emphasis)',
      description: 'Unchecked hover border color',
    },
    {
      name: '--move-radio-fg',
      value: 'var(--move-primary-fg)',
      description: 'Dot foreground color',
    },
    { name: '--move-radio-dot-size', value: '0.5rem', description: 'Inner dot size' },
  ],

  variants: {},
  sizes: ['sm', 'md', 'lg'] as string[],

  labels: [],

  radixPrimitive: 'RadioGroup',
  hasHook: false,
  engineImports: ['withMoveComponent', 'useMergedRef'] as string[],
  componentDeps: [] as string[],

  testing: {
    behaviors: [
      'Root renders as Radix RadioGroup.Root div',
      'Root defaults to vertical orientation with flex column layout',
      'Root horizontal orientation uses flex row layout',
      'Root applies data-invalid when invalid prop is true',
      'Root applies data-size when size is not md',
      'Root passes value, defaultValue, onValueChange to Radix',
      'Root passes name, required, disabled, loop to Radix',
      'Item renders Radix RadioGroup.Item as button inside a wrapper span',
      'Item renders children as label content next to the radio button',
      'Item applies data-state=checked when selected',
      'Item applies data-state=unchecked when not selected',
      'Item supports disabled state',
      'Indicator is force-mounted to support exit animation',
      'Indicator has opacity 0 when unchecked via CSS',
      'Dot renders inside indicator with configured dot size',
      'Wrapper span click forwards to item button',
      'Forwards className and style on Root',
      'Forwards className and style on Item',
      'Forwards ref on Root and Item',
    ],
    keyboard: [
      'ArrowDown/ArrowRight moves focus to next radio item',
      'ArrowUp/ArrowLeft moves focus to previous radio item',
      'Space selects the focused item',
      'Tab moves focus into/out of the group',
    ] as string[],
    aria: [
      'Root has role=radiogroup from Radix',
      'Items have role=radio from Radix',
      'Items have aria-checked from Radix',
      'Disabled items have aria-disabled',
    ] as string[],
    form: [
      'Hidden input with name prop is rendered by Radix for form submission',
      'Required attribute is forwarded to Radix',
    ] as string[],
    animation: [
      'Uses state triggers for checked/unchecked indicator animation',
      'State trigger fires checked animation on indicator',
      'State trigger fires unchecked animation on indicator',
      'Press animation handlers fire on wrapper mouseDown/mouseUp/mouseLeave',
      'animations={false} disables toggle animation',
      'Animation disabled when item is disabled',
    ] as string[],
  },
} satisfies ComponentSpec;
