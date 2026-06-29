// InputText.spec.ts — Component specification
// specHash: PLACEHOLDER

import type { ComponentSpec } from '../../../spec-type';

export const spec = {
  schemaVersion: 7 as const,
  name: 'InputText',
  componentClass: 'input_plain' as const,
  category: 'forms',
  description: 'Single-line text input with outlined/filled variants, icon slots, and configurable size',

  synonyms: ['text field', 'text input', 'string input', 'input', 'textfield', 'textbox'],
  families: {
    behavior:  ["form-input"],
    state:     ["controlled-value"],
    a11y:      ["none"],
  },

  compound: false,
  rootElement: 'div',
  slots: [
    { name: 'root', element: 'div', description: 'Wrapper container that handles border, background, and focus-within styling' },
    { name: 'input', element: 'input', description: 'Native input element that receives focus and user text' },
    { name: 'iconLeft', element: 'span', description: 'Optional icon rendered before the input' },
    { name: 'iconRight', element: 'span', description: 'Optional icon rendered after the input' },
  ],

  props: [
    { name: 'variant', type: "'outlined' | 'filled'", default: "'outlined'", moveSpecific: true, description: 'Visual style variant' },
    { name: 'size', typeRef: 'Size', default: "'md'", moveSpecific: true, description: 'Size controlling height and font size' },
    { name: 'invalid', type: 'boolean', moveSpecific: true, description: 'Whether the input is in an invalid/error state' },
    { name: 'iconLeft', type: 'React.ReactNode', moveSpecific: true, description: 'Icon element rendered before the input' },
    { name: 'iconRight', type: 'React.ReactNode', moveSpecific: true, description: 'Icon element rendered after the input' },
    { name: 'width', type: "React.CSSProperties['width']", moveSpecific: true, description: 'Explicit width override for the root wrapper' },
    { name: 'disabled', type: 'boolean', moveSpecific: false, description: 'Whether the input is disabled' },
    { name: 'readOnly', type: 'boolean', moveSpecific: false, description: 'Whether the input is read-only' },
    { name: 'placeholder', type: 'string', moveSpecific: false, description: 'Placeholder text' },
    { name: 'value', type: 'string', moveSpecific: false, description: 'Controlled input value' },
    { name: 'defaultValue', type: 'string', moveSpecific: false, description: 'Uncontrolled default input value' },
    { name: 'type', type: 'string', default: "'text'", moveSpecific: false, description: 'HTML input type attribute' },
    { name: 'name', type: 'string', moveSpecific: false, description: 'Form submission name' },
    { name: 'id', type: 'string', moveSpecific: false, description: 'Element id for label association' },
    { name: 'required', type: 'boolean', moveSpecific: false, description: 'Whether the input is required' },
    { name: 'autoFocus', type: 'boolean', moveSpecific: false, description: 'Whether to auto-focus on mount' },
    { name: 'onChange', type: 'React.ChangeEventHandler<HTMLInputElement>', moveSpecific: false, description: 'Change event handler' },
    { name: 'onFocus', type: 'React.FocusEventHandler<HTMLInputElement>', moveSpecific: false, description: 'Focus event handler' },
    { name: 'onBlur', type: 'React.FocusEventHandler<HTMLInputElement>', moveSpecific: false, description: 'Blur event handler' },
    { name: 'onKeyDown', type: 'React.KeyboardEventHandler<HTMLInputElement>', moveSpecific: false, description: 'Keydown event handler' },
  ],

  anatomy: {
    slot: 'root',
    dataAttributes: ['data-variant', 'data-size', 'data-invalid', 'data-disabled', 'data-readonly'],
    children: [
      { slot: 'iconLeft', ariaAttributes: ['aria-hidden'] },
      { slot: 'input' },
      { slot: 'iconRight', ariaAttributes: ['aria-hidden'] },
    ],
  },

  controlled: null,
  keyboard: null,
  focus: 'delegated' as const,
  formType: 'native-name' as const,
  asChild: false,

  animations: [],

  tokens: [
    { name: '--move-input-bg', value: 'var(--move-bg-subtle)', description: 'Input background color' },
    { name: '--move-input-border', value: 'var(--move-border-base)', description: 'Input border color' },
    { name: '--move-input-border-hover', value: 'var(--move-border-emphasis)', description: 'Input border color on hover' },
    { name: '--move-input-border-focus', value: 'var(--move-primary)', description: 'Input border color on focus' },
    { name: '--move-input-radius', value: 'var(--move-rounded-md)', description: 'Input border radius' },
    { name: '--move-input-padding-x', value: 'var(--move-spacing-sm)', description: 'Input horizontal padding' },
    { name: '--move-input-padding-y', value: 'var(--move-spacing-xs)', description: 'Input vertical padding' },
    { name: '--move-input-font-size', value: 'inherit', description: 'Input font size (overridden per size)' },
    { name: '--move-input-fg', value: 'var(--move-fg-base)', description: 'Input text color' },
    { name: '--move-input-placeholder', value: 'var(--move-fg-subtle)', description: 'Input placeholder text color' },
    { name: '--move-input-height', value: 'var(--move-control-height-md)', description: 'Input height' },
    { name: '--move-input-icon-color', value: 'var(--move-fg-muted)', description: 'Icon slot color' },
    { name: '--move-input-icon-gap', value: 'var(--move-spacing-sm)', description: 'Gap between icons and input' },
  ],

  variants: {
    variant: ['outlined', 'filled'] as string[],
  },
  sizes: ['sm', 'md', 'lg'] as string[],

  labels: [],
  childrenKind: undefined,

  renderContracts: [
    { id: 'root-click-focuses-input', description: 'Clicking anywhere on the root wrapper focuses the native input element' },
    { id: 'icon-conditional-render', description: 'iconLeft and iconRight slots are only rendered when their respective props are provided' },
    { id: 'icon-aria-hidden', description: 'Icon slots are marked aria-hidden="true" since they are decorative' },
    { id: 'width-inline-style', description: 'When width prop is provided, it is applied as inline style on root' },
    { id: 'attrs-on-input', description: 'Remaining HTML attributes (attrs) are spread onto the native input element, not root' },
    { id: 'ref-on-input', description: 'Forwarded ref is merged and attached to the native input element via useMergedRef' },
    { id: 'filled-transparent-border', description: 'Filled variant uses transparent border that reveals on hover/focus' },
    { id: 'invalid-error-ring', description: 'Invalid state overrides border and focus ring color to --move-error' },
  ],

  hasHook: false,
  engineImports: ['withMoveComponent', 'useMergedRef'] as string[],

  componentDeps: [] as string[],

  testing: {
    behaviors: [
      'Renders root div with input element inside',
      'Applies variant via data-variant attribute (outlined, filled)',
      'Defaults to variant=outlined',
      'Applies size via data-size attribute (sm, md, lg)',
      'Defaults to size=md',
      'Defaults type to text',
      'Renders iconLeft slot when iconLeft prop is provided',
      'Renders iconRight slot when iconRight prop is provided',
      'Does not render icon slots when icon props are not provided',
      'Icon slots have aria-hidden="true"',
      'Clicking root focuses the native input',
      'Applies width as inline style on root when provided',
      'Sets data-invalid on root when invalid=true',
      'Sets data-disabled on root when disabled=true',
      'Sets data-readonly on root when readOnly=true',
      'Disabled input has reduced opacity',
      'Forwards ref to the native input element',
      'Spreads HTML attributes onto the native input',
      'Forwards className and style on root',
    ],
    aria: [
      'Native input provides implicit ARIA role',
      'Label association works via id/htmlFor or aria-label',
      'aria-invalid should be conveyed when invalid',
    ],
    form: [
      'Input participates in native form submission via name attribute',
      'Value is read from native input element',
    ],
  },

  defaultReview: {
    status: 'approved' as const,
    decisionSource: 'accept-all' as const,
    overrides: {},
  },
} satisfies ComponentSpec;
