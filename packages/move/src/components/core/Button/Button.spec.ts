// Button.spec.ts — Component specification
// specHash: e263843a

export const spec = {
  schemaVersion: 7 as const,
  name: 'Button',
  componentClass: 'interactive' as const,
  category: 'core',
  description: 'Clickable interactive element with variant, size, and animation support',

  compound: true,
  rootElement: 'button',
  slots: [
    { name: 'root', element: 'button', description: 'Button element (or Slot.Root when asChild)' },
  ],

  subComponents: [
    {
      name: 'Group',
      slots: [{ name: 'group', element: 'div', description: 'Container for grouped buttons' }],
      props: [
        { name: 'children', type: 'React.ReactNode', moveSpecific: false, description: 'Button children' },
      ],
      usesFactory: false,
      description: 'Groups related buttons together with role="group"',
    },
  ],

  props: [
    { name: 'variant', type: "'primary' | 'secondary' | 'ghost' | 'danger'", default: "'primary'", moveSpecific: true, description: 'Visual style variant' },
    { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", moveSpecific: true, description: 'Button size' },
    { name: 'animations', type: 'AnimationTrigger[] | false', moveSpecific: true, description: 'Animation config for hover/press interactions' },
    { name: 'elevation', type: 'ElevationLevel', default: 'null', moveSpecific: true, description: 'Shadow elevation level' },
    { name: 'asChild', type: 'boolean', default: 'false', moveSpecific: true, description: 'Render as child element via Radix Slot' },
    { name: 'type', type: 'string', default: "'button'", moveSpecific: false, description: 'HTML button type attribute' },
    { name: 'disabled', type: 'boolean', default: 'false', moveSpecific: false, description: 'Disabled state' },
    { name: 'children', type: 'React.ReactNode', moveSpecific: false, description: 'Button content' },
  ],

  anatomy: {
    slot: 'root',
    dataAttributes: ['data-variant', 'data-size'],
  },

  controlled: null,
  keyboard: null,
  focus: 'self' as const,
  formType: null,
  asChild: true,

  animations: [
    { trigger: 'Root.hover', sequence: [{ preset: 'scaleUp' }] },
    { trigger: 'Root.press', sequence: [{ preset: 'scaleDown' }] },
  ],

  tokens: [
    { name: '--move-button-primary-bg', value: 'var(--move-primary)', description: 'Primary variant background' },
    { name: '--move-button-primary-bg-hover', value: 'var(--move-primary-hover)', description: 'Primary variant hover background' },
    { name: '--move-button-primary-bg-active', value: 'var(--move-primary-active)', description: 'Primary variant active background' },
    { name: '--move-button-primary-fg', value: 'var(--move-primary-fg)', description: 'Primary variant foreground' },
    { name: '--move-button-secondary-bg', value: 'var(--move-bg-muted)', description: 'Secondary variant background' },
    { name: '--move-button-secondary-bg-hover', value: 'var(--move-bg-emphasis)', description: 'Secondary variant hover background' },
    { name: '--move-button-secondary-bg-active', value: 'var(--move-bg-muted)', description: 'Secondary variant active background' },
    { name: '--move-button-secondary-fg', value: 'var(--move-fg-base)', description: 'Secondary variant foreground' },
    { name: '--move-button-secondary-border', value: 'var(--move-border-base)', description: 'Secondary variant border' },
    { name: '--move-button-ghost-fg', value: 'var(--move-fg-base)', description: 'Ghost variant foreground' },
    { name: '--move-button-ghost-bg-hover', value: 'var(--move-bg-muted)', description: 'Ghost variant hover background' },
    { name: '--move-button-danger-bg', value: 'var(--move-error)', description: 'Danger variant background' },
    { name: '--move-button-danger-bg-hover', value: 'var(--move-error-hover)', description: 'Danger variant hover background' },
    { name: '--move-button-danger-fg', value: 'var(--move-error-fg)', description: 'Danger variant foreground' },
  ],

  variants: {
    variant: ['primary', 'secondary', 'ghost', 'danger'],
  },
  sizes: ['sm', 'md', 'lg'],

  labels: [],
  childrenKind: 'text' as const,
  propRoles: {
    variant: 'data',
    size: 'data',
    disabled: 'behavior',
    children: 'displayText',
  },
  demo: {
    renderMode: 'grid',
    controls: [
      { id: 'consumer.textOnly.variant', kind: 'select', options: ['primary', 'secondary', 'ghost', 'danger'], defaultValue: 'primary' },
      { id: 'consumer.withIcon.variant', kind: 'select', options: ['primary', 'secondary', 'ghost', 'danger'], defaultValue: 'secondary' },
      { id: 'consumer.size', kind: 'select', options: ['sm', 'md', 'lg'], defaultValue: 'md' },
      { id: 'consumer.disabled', kind: 'boolean', defaultValue: false },
      { id: 'playground.variant', kind: 'select', options: ['primary', 'secondary', 'ghost', 'danger'], defaultValue: 'primary' },
      { id: 'playground.size', kind: 'select', options: ['sm', 'md', 'lg'], defaultValue: 'md' },
      { id: 'playground.disabled', kind: 'boolean', defaultValue: false },
      { id: 'playground.text', kind: 'text', defaultValue: 'Button' },
      { id: 'playground.withIcon', kind: 'boolean', defaultValue: true },
      { id: 'playground.icon', kind: 'text', defaultValue: 'sparkles' },
      { id: 'playground.iconPosition', kind: 'select', options: ['left', 'right'], defaultValue: 'left' },
    ],
    samples: [
      { id: 'textOnly', label: 'Text Only', defaults: {} },
      { id: 'withIcon', label: 'Icon + Text', defaults: {} },
    ],
    bindings: [
      { control: 'consumer.textOnly.variant', target: 'consumer.textOnly.Button.variant' },
      { control: 'consumer.withIcon.variant', target: 'consumer.withIcon.Button.variant' },
      { control: 'consumer.size', target: 'consumer.Button.size' },
      { control: 'consumer.disabled', target: 'consumer.Button.disabled' },
      { control: 'playground.variant', target: 'playground.Button.variant' },
      { control: 'playground.size', target: 'playground.Button.size' },
      { control: 'playground.disabled', target: 'playground.Button.disabled' },
      { control: 'playground.text', target: 'playground.Button.childrenText' },
      { control: 'playground.withIcon', target: 'playground.Icon.visible' },
      { control: 'playground.icon', target: 'playground.Icon.name' },
      { control: 'playground.iconPosition', target: 'playground.Icon.position' },
    ],
  },

  hasHook: false,
  engineImports: ['withMoveComponent', 'useMergedRef'],
  componentDeps: [],

  testing: {
    behaviors: [
      'Renders as button element',
      'Renders children content',
      'Applies variant via data-variant attribute',
      'Applies size via data-size attribute',
      'Defaults to variant=primary',
      'Defaults to size=md',
      'Defaults to type=button',
      'Forwards className and style',
      'Forwards ref to root element',
      'Spreads HTML attributes',
      'Supports disabled state',
      'Renders as child via asChild',
    ],
    animation: [
      'Uses Root.hover and Root.press event triggers for interactive animation',
      'Disables animation when animations={false}',
      'Disables animation when disabled',
    ],
  },

  defaultReview: {
    status: 'approved' as const,
    decisionSource: 'accept-all' as const,
    overrides: {},
  },
};
