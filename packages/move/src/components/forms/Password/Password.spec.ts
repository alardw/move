// Password.spec.ts — Component specification
// specHash: PLACEHOLDER

import type { ComponentSpec } from '../../../spec-type';

export const spec = {
  schemaVersion: 7 as const,
  name: 'Password',
  componentClass: 'input_plain' as const,
  category: 'forms',
  description:
    'Password input with visibility toggle button, outlined/filled variants, and optional left icon',

  synonyms: ['secret', 'pin field', 'password input', 'masked input'],
  families: {
    behavior: ['form-input'],
    state: ['controlled-value'],
    a11y: ['none'],
  },

  compound: false,
  rootElement: 'div',
  slots: [
    {
      name: 'root',
      element: 'div',
      description: 'Wrapper div containing input, icons, and toggle button',
    },
    {
      name: 'input',
      element: 'input',
      description: 'Native input element (type toggles between text and password)',
    },
    { name: 'iconLeft', element: 'span', description: 'Optional left icon slot' },
    {
      name: 'toggle',
      element: 'button',
      description: 'Visibility toggle button with show/hide icon',
    },
    { name: 'toggleIcon', element: 'span', description: 'Icon wrapper inside toggle button' },
  ],

  subComponents: [],

  props: [
    {
      name: 'variant',
      type: "'outlined' | 'filled'",
      default: "'outlined'",
      moveSpecific: true,
      description: 'Visual variant',
    },
    {
      name: 'size',
      typeRef: 'Size',
      default: "'md'",
      moveSpecific: true,
      description: 'Input size',
    },
    {
      name: 'invalid',
      type: 'boolean',
      moveSpecific: true,
      description: 'Invalid state with error border styling',
    },
    {
      name: 'iconLeft',
      type: 'React.ReactNode',
      moveSpecific: true,
      description: 'Optional icon rendered before input',
    },
    {
      name: 'showIcon',
      type: 'React.ReactNode',
      moveSpecific: true,
      description: 'Custom icon for show password state (defaults to eye icon)',
    },
    {
      name: 'hideIcon',
      type: 'React.ReactNode',
      moveSpecific: true,
      description: 'Custom icon for hide password state (defaults to eye-off icon)',
    },
    {
      name: 'width',
      type: "React.CSSProperties['width']",
      moveSpecific: true,
      description: 'Custom width override',
    },
    {
      name: 'visible',
      type: 'boolean',
      moveSpecific: true,
      description: 'Controlled visibility state',
    },
    {
      name: 'defaultVisible',
      type: 'boolean',
      default: 'false',
      moveSpecific: true,
      description: 'Default visibility state (uncontrolled)',
    },
    {
      name: 'onVisibleChange',
      type: '(visible: boolean) => void',
      moveSpecific: true,
      description: 'Called when visibility toggles',
    },
    { name: 'disabled', type: 'boolean', moveSpecific: false, description: 'Disabled state' },
    { name: 'readOnly', type: 'boolean', moveSpecific: false, description: 'Read-only state' },
    {
      name: 'placeholder',
      type: 'string',
      moveSpecific: false,
      description: 'Input placeholder text',
    },
    { name: 'value', type: 'string', moveSpecific: false, description: 'Controlled input value' },
    {
      name: 'defaultValue',
      type: 'string',
      moveSpecific: false,
      description: 'Default input value (uncontrolled)',
    },
    { name: 'name', type: 'string', moveSpecific: false, description: 'Form input name' },
    { name: 'id', type: 'string', moveSpecific: false, description: 'Input element id' },
    { name: 'required', type: 'boolean', moveSpecific: false, description: 'Required state' },
    { name: 'autoFocus', type: 'boolean', moveSpecific: false, description: 'Auto-focus on mount' },
    {
      name: 'onChange',
      type: 'React.ChangeEventHandler<HTMLInputElement>',
      moveSpecific: false,
      description: 'Input change handler',
    },
    {
      name: 'onFocus',
      type: 'React.FocusEventHandler<HTMLInputElement>',
      moveSpecific: false,
      description: 'Input focus handler',
    },
    {
      name: 'onBlur',
      type: 'React.FocusEventHandler<HTMLInputElement>',
      moveSpecific: false,
      description: 'Input blur handler',
    },
    {
      name: 'onKeyDown',
      type: 'React.KeyboardEventHandler<HTMLInputElement>',
      moveSpecific: false,
      description: 'Input keydown handler',
    },
    { name: 'className', type: 'string', moveSpecific: false, description: 'CSS class name' },
    {
      name: 'style',
      type: 'React.CSSProperties',
      moveSpecific: false,
      description: 'Inline styles',
    },
  ],

  anatomy: {
    slot: 'root',
    dataAttributes: ['data-variant', 'data-size', 'data-invalid', 'data-disabled', 'data-readonly'],
    children: [
      { slot: 'iconLeft', ariaAttributes: ['aria-hidden'] },
      { slot: 'input' },
      {
        slot: 'toggle',
        ariaAttributes: ['aria-label'],
        children: [{ slot: 'toggleIcon', ariaAttributes: ['aria-hidden'] }],
      },
    ],
  },

  controlled: 'value' as const,
  controlledProps: {
    valueProp: 'visible',
    defaultValueProp: 'defaultVisible',
    onChangeProp: 'onVisibleChange',
  },
  keyboard: null,
  focus: 'delegated' as const,
  formType: 'native-name' as const,
  asChild: false,

  animations: [],

  renderContracts: [
    {
      id: 'root-click-focuses-input',
      description: 'Clicking anywhere on the root wrapper focuses the input element',
    },
    {
      id: 'toggle-type-switch',
      description:
        'Toggle button switches input type between "text" (visible) and "password" (hidden)',
    },
    {
      id: 'toggle-visibility-controlled',
      description:
        'Visibility supports controlled (visible prop) and uncontrolled (defaultVisible) patterns',
    },
    {
      id: 'toggle-tabindex-negative',
      description:
        'Toggle button has tabIndex=-1 to keep it out of tab order (input is the focus target)',
    },
    {
      id: 'toggle-stop-propagation',
      description: 'Toggle click calls stopPropagation to prevent root click from refocusing input',
    },
    {
      id: 'ref-forwards-to-input',
      description: 'Component ref forwards to the native input element, not the root div',
    },
    {
      id: 'attrs-spread-to-input',
      description: 'HTML attributes (from attrs) are spread to the input element, not the root div',
    },
    {
      id: 'default-eye-icons',
      description:
        'Default show/hide icons are inline SVG eye/eye-off icons when showIcon/hideIcon not provided',
    },
  ],

  tokens: [
    {
      name: '--move-password-bg',
      value: 'var(--move-bg-subtle)',
      description: 'Root background color',
    },
    {
      name: '--move-password-border',
      value: 'var(--move-border-base)',
      description: 'Root border color',
    },
    {
      name: '--move-password-border-hover',
      value: 'var(--move-border-emphasis)',
      description: 'Root hover border color',
    },
    {
      name: '--move-password-border-focus',
      value: 'var(--move-primary)',
      description: 'Root focus border color',
    },
    {
      name: '--move-password-radius',
      value: 'var(--move-rounded-md)',
      description: 'Root border radius',
    },
    {
      name: '--move-password-padding-x',
      value: 'var(--move-spacing-sm)',
      description: 'Root horizontal padding',
    },
    {
      name: '--move-password-padding-y',
      value: 'var(--move-spacing-xs)',
      description: 'Root vertical padding',
    },
    {
      name: '--move-password-font-size',
      value: 'inherit',
      description: 'Input font size (inherits, overridden by size)',
    },
    { name: '--move-password-fg', value: 'var(--move-fg-base)', description: 'Input text color' },
    {
      name: '--move-password-placeholder',
      value: 'var(--move-fg-subtle)',
      description: 'Placeholder text color',
    },
    {
      name: '--move-password-height',
      value: 'var(--move-control-height-md)',
      description: 'Root height',
    },
    {
      name: '--move-password-icon-color',
      value: 'var(--move-fg-muted)',
      description: 'Icon and toggle color',
    },
    {
      name: '--move-password-icon-gap',
      value: 'var(--move-spacing-sm)',
      description: 'Gap between icon, input, and toggle',
    },
  ],

  variants: {
    variant: ['outlined', 'filled'] as string[],
  },
  sizes: ['sm', 'md', 'lg'] as string[],

  labels: [
    {
      key: 'showPassword',
      default: 'Show password',
      description: 'Toggle button aria-label when password is hidden',
    },
    {
      key: 'hidePassword',
      default: 'Hide password',
      description: 'Toggle button aria-label when password is visible',
    },
  ],

  hasHook: false,
  engineImports: ['withMoveComponent', 'useMergedRef'] as string[],

  componentDeps: [] as string[],

  testing: {
    behaviors: [
      'Renders root div with input, toggle button, and optional left icon',
      'Input type is "password" by default (hidden)',
      'Input type becomes "text" when visibility toggled on',
      'Toggle button switches visibility state on click',
      'Toggle shows eye icon when password hidden, eye-off when visible',
      'Toggle aria-label changes between "Show password" and "Hide password"',
      'Toggle has tabIndex=-1',
      'Toggle click stopsPropagation',
      'Root click focuses the input element',
      'Controlled visibility via visible prop',
      'Uncontrolled visibility via defaultVisible prop',
      'onVisibleChange fires on toggle click',
      'Defaults variant=outlined and size=md',
      'Applies data-variant, data-size, data-invalid, data-disabled, data-readonly',
      'Filled variant changes background and hides border',
      'Invalid state shows error border color',
      'Disabled state reduces opacity and prevents toggle',
      'ReadOnly state prevents border hover changes',
      'Custom width prop applied to root style',
      'Custom showIcon/hideIcon props override default SVGs',
      'iconLeft renders left icon slot with aria-hidden',
      'Ref forwards to native input element',
      'HTML attrs spread to input element',
      'Forwards className and style on root',
      'Size sm: smaller height, font-size, padding',
      'Size lg: larger height, font-size, padding',
    ],
    keyboard: ['Tab focuses the input element (not the toggle)'] as string[],
    aria: [
      'Toggle button has aria-label for show/hide state',
      'Toggle button type=button (not submit)',
      'Left icon has aria-hidden=true',
      'Toggle icon has aria-hidden=true',
      'Input supports aria-label/aria-labelledby via HTML attrs',
    ] as string[],
    form: [
      'Native input participates in form submission via name prop',
      'Input supports required attribute',
      'Input value is readable as password text regardless of visibility',
    ] as string[],
  },

  iconsUsed: ['eye', 'eye-off'],
  defaultReview: {
    status: 'approved' as const,
    decisionSource: 'accept-all' as const,
    overrides: {},
  },
} satisfies ComponentSpec;
