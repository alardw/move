// Textarea.spec.ts — Component specification

import type { ComponentSpec } from '../../../spec-type';

export const spec = {
  schemaVersion: 1 as const,
  name: 'Textarea',
  componentClass: 'input_plain' as const,
  category: 'forms',
  description:
    'Multi-line text input with outlined/filled variants, auto-resize support, and configurable size',
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
      description: 'Wrapper container that handles border, background, and focus-within styling',
    },
    {
      name: 'textarea',
      element: 'textarea',
      description: 'Native textarea element that receives focus and user text',
    },
  ],

  props: [
    {
      name: 'variant',
      type: "'outlined' | 'filled'",
      default: "'outlined'",
      moveSpecific: true,
      description: 'Visual style variant',
    },
    {
      name: 'size',
      typeRef: 'Size',
      default: "'md'",
      moveSpecific: true,
      description: 'Size controlling padding and font size',
    },
    {
      name: 'invalid',
      type: 'boolean',
      moveSpecific: true,
      description: 'Whether the textarea is in an invalid/error state',
    },
    {
      name: 'autoSize',
      type: 'boolean',
      moveSpecific: true,
      description: 'Automatically adjust height based on content',
    },
    {
      name: 'minRows',
      type: 'number',
      moveSpecific: true,
      description: 'Minimum number of visible rows when autoSize is enabled',
    },
    {
      name: 'maxRows',
      type: 'number',
      moveSpecific: true,
      description: 'Maximum number of visible rows when autoSize is enabled',
    },
    {
      name: 'rows',
      type: 'number',
      default: '3',
      moveSpecific: true,
      description: 'Number of visible text rows',
    },
    {
      name: 'resize',
      type: "'none' | 'vertical' | 'horizontal' | 'both'",
      default: "'vertical'",
      moveSpecific: true,
      description: 'CSS resize behavior (overridden to none when autoSize is true)',
    },
    {
      name: 'width',
      typeRef: 'FieldWidth',
      default: "'full'",
      moveSpecific: true,
      description:
        "How wide the field is, from the field-width scale. Steps are sized in ch for the content each expects, and every one is capped at the space available. 'full' takes the column.",
    },
    {
      name: 'disabled',
      type: 'boolean',
      moveSpecific: false,
      description: 'Whether the textarea is disabled',
    },
    {
      name: 'readOnly',
      type: 'boolean',
      moveSpecific: false,
      description: 'Whether the textarea is read-only',
    },
    { name: 'placeholder', type: 'string', moveSpecific: false, description: 'Placeholder text' },
    {
      name: 'value',
      type: 'string',
      moveSpecific: false,
      description: 'Controlled textarea value',
    },
    {
      name: 'defaultValue',
      type: 'string',
      moveSpecific: false,
      description: 'Uncontrolled default textarea value',
    },
    { name: 'name', type: 'string', moveSpecific: false, description: 'Form submission name' },
    {
      name: 'id',
      type: 'string',
      moveSpecific: false,
      description: 'Element id for label association',
    },
    {
      name: 'required',
      type: 'boolean',
      moveSpecific: false,
      description: 'Whether the textarea is required',
    },
    {
      name: 'autoFocus',
      type: 'boolean',
      moveSpecific: false,
      description: 'Whether to auto-focus on mount',
    },
    {
      name: 'onChange',
      type: 'React.ChangeEventHandler<HTMLTextAreaElement>',
      moveSpecific: false,
      description: 'Change event handler',
    },
    {
      name: 'onFocus',
      type: 'React.FocusEventHandler<HTMLTextAreaElement>',
      moveSpecific: false,
      description: 'Focus event handler',
    },
    {
      name: 'onBlur',
      type: 'React.FocusEventHandler<HTMLTextAreaElement>',
      moveSpecific: false,
      description: 'Blur event handler',
    },
    {
      name: 'onKeyDown',
      type: 'React.KeyboardEventHandler<HTMLTextAreaElement>',
      moveSpecific: false,
      description: 'Keydown event handler',
    },
  ],

  anatomy: {
    slot: 'root',
    dataAttributes: [
      'data-variant',
      'data-size',
      'data-width',
      'data-invalid',
      'data-disabled',
      'data-readonly',
    ],
    children: [{ slot: 'textarea' }],
  },

  controlled: null,
  keyboard: null,
  focus: 'delegated' as const,
  formType: 'native-name' as const,
  asChild: false,

  animations: [],

  tokens: [
    {
      name: '--move-textarea-bg',
      value: 'var(--move-bg-base)',
      description: 'Textarea background color',
    },
    {
      name: '--move-textarea-border',
      value: 'var(--move-border-interactive)',
      description: 'Textarea border color',
    },
    {
      name: '--move-textarea-border-hover',
      value: 'var(--move-border-emphasis)',
      description: 'Textarea border color on hover',
    },
    {
      name: '--move-textarea-border-focus',
      value: 'var(--move-primary)',
      description: 'Textarea border color on focus',
    },
    {
      name: '--move-textarea-radius',
      value: 'var(--move-rounded-md)',
      description: 'Textarea border radius',
    },
    {
      name: '--move-textarea-padding-x',
      value: 'var(--move-spacing-sm)',
      description: 'Textarea horizontal padding',
    },
    {
      name: '--move-textarea-padding-y',
      value: 'var(--move-spacing-sm)',
      description: 'Textarea vertical padding',
    },
    {
      name: '--move-textarea-font-size',
      value: 'inherit',
      description: 'Textarea font size (overridden per size)',
    },
    {
      name: '--move-textarea-fg',
      value: 'var(--move-fg-base)',
      description: 'Textarea text color',
    },
    {
      name: '--move-textarea-placeholder',
      value: 'var(--move-fg-muted)',
      description: 'Textarea placeholder text color',
    },
  ],

  variants: {
    variant: ['outlined', 'filled'] as string[],
  },
  sizes: ['sm', 'md', 'lg'] as string[],

  labels: [],
  childrenKind: undefined,

  renderContracts: [
    {
      id: 'root-click-focuses-textarea',
      description: 'Clicking anywhere on the root wrapper focuses the native textarea element',
    },
    {
      id: 'attrs-on-textarea',
      description:
        'Remaining HTML attributes (attrs) are spread onto the native textarea element, not root',
    },
    {
      id: 'ref-on-textarea',
      description:
        'Forwarded ref is merged and attached to the native textarea element via useMergedRef',
    },
    {
      id: 'autosize-adjusts-height',
      description:
        'When autoSize=true, textarea height adjusts automatically on input and value changes',
    },
    {
      id: 'autosize-disables-resize',
      description: 'When autoSize=true, CSS resize is forced to none',
    },
    {
      id: 'autosize-respects-minrows-maxrows',
      description: 'autoSize height calculation respects minRows and maxRows bounds',
    },
    {
      id: 'width-inline-style',
      description: 'When width prop is provided, it is applied as inline style on root',
    },
    {
      id: 'filled-transparent-border',
      description: 'Filled variant uses transparent border that reveals on hover/focus',
    },
    {
      id: 'invalid-error-ring',
      description: 'Invalid state overrides border and focus ring color to --move-error',
    },
    {
      id: 'resize-inline-style',
      description: 'Resize value is applied as inline style on the textarea element',
    },
  ],

  hasHook: false,
  engineImports: ['withMoveComponent', 'useMergedRef'] as string[],

  componentDeps: [] as string[],

  testing: {
    behaviors: [
      'Renders root div with textarea element inside',
      'Applies variant via data-variant attribute (outlined, filled)',
      'Defaults to variant=outlined',
      'Applies size via data-size attribute (sm, md, lg)',
      'Defaults to size=md',
      'Defaults rows to 3',
      'Defaults resize to vertical',
      'Clicking root focuses the native textarea',
      'Applies width as inline style on root when provided',
      'Sets data-invalid on root when invalid=true',
      'Sets data-disabled on root when disabled=true',
      'Sets data-readonly on root when readOnly=true',
      'Disabled textarea has reduced opacity',
      'Forwards ref to the native textarea element',
      'Spreads HTML attributes onto the native textarea',
      'Forwards className and style on root',
      'autoSize adjusts height on mount',
      'autoSize adjusts height on input',
      'autoSize adjusts height on value change',
      'autoSize respects minRows constraint',
      'autoSize respects maxRows constraint',
      'autoSize forces resize to none',
      'Resize prop is applied as inline style when autoSize is false',
    ],
    aria: [
      'Native textarea provides implicit ARIA role',
      'Label association works via id/htmlFor or aria-label',
      'aria-invalid should be conveyed when invalid',
    ],
    form: [
      'Textarea participates in native form submission via name attribute',
      'Value is read from native textarea element',
    ],
  },
} satisfies ComponentSpec;
