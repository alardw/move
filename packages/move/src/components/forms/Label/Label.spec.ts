// Label.spec.ts — Component specification

import type { ComponentSpec } from '../../../spec-type';

export const spec = {
  schemaVersion: 1 as const,
  name: 'Label',
  componentClass: 'presentational' as const,
  category: 'forms',
  description: 'Text label for form fields with required asterisk indicator and size variants',
  families: {
    behavior: ['typography'],
    state: ['stateless'],
    a11y: ['none'],
  },

  compound: false,
  rootElement: 'label',
  slots: [
    {
      name: 'root',
      element: 'label',
      description: 'Radix Label.Root element that renders as a native label',
    },
    {
      name: 'asterisk',
      element: 'span',
      description: 'Required field asterisk indicator (*), rendered when required=true',
    },
  ],

  props: [
    {
      name: 'htmlFor',
      type: 'string',
      moveSpecific: true,
      description: 'ID of the associated form element',
    },
    {
      name: 'required',
      type: 'boolean',
      moveSpecific: true,
      description: 'Show required asterisk indicator',
    },
    {
      name: 'disabled',
      type: 'boolean',
      moveSpecific: true,
      description: 'Whether the label appears in disabled styling',
    },
    {
      name: 'size',
      typeRef: 'Size',
      default: "'md'",
      moveSpecific: true,
      description: 'Font size of the label',
    },
    {
      name: 'truncate',
      typeRef: 'Truncate',
      moveSpecific: true,
      description: "Truncate overflowing text: true/'end', 'start', or 'clamp'",
    },
    {
      name: 'lines',
      type: 'number',
      moveSpecific: true,
      description: "Max lines for truncate='clamp' (default 2)",
    },
    {
      name: 'tooltip',
      type: 'boolean',
      moveSpecific: true,
      description: 'With truncate, show full text in a tooltip when actually cut off',
    },
    {
      name: 'children',
      type: 'React.ReactNode',
      moveSpecific: false,
      description: 'Label text content',
    },
  ],

  anatomy: {
    slot: 'root',
    dataAttributes: ['data-size', 'data-disabled'],
    children: [{ slot: 'asterisk', ariaAttributes: ['aria-hidden'] }],
  },

  controlled: null,
  keyboard: null,
  focus: null,
  formType: null,
  asChild: false,

  animations: [],

  tokens: [
    {
      name: '--move-label-font-size',
      value: 'inherit',
      description: 'Label font size (overridden per size)',
    },
    {
      name: '--move-label-font-weight',
      value: 'var(--move-weight-medium)',
      description: 'Label font weight',
    },
    { name: '--move-label-color', value: 'var(--move-fg-base)', description: 'Label text color' },
    {
      name: '--move-label-disabled-color',
      value: 'var(--move-fg-muted)',
      description: 'Label text color when disabled',
    },
  ],

  variants: {},
  sizes: ['sm', 'md', 'lg'] as string[],

  labels: [],
  childrenKind: 'text' as const,

  renderContracts: [
    {
      id: 'radix-label-root',
      description:
        'Renders as Radix Label.Root which provides native label element with click-to-focus behavior',
    },
    {
      id: 'asterisk-conditional',
      description: 'Asterisk slot is only rendered when required=true',
    },
    {
      id: 'asterisk-aria-hidden',
      description:
        'Asterisk is marked aria-hidden="true" since required state is conveyed via the input',
    },
    {
      id: 'disabled-conditional',
      description: 'data-disabled attribute is only set when disabled=true',
    },
    {
      id: 'htmlfor-passthrough',
      description:
        'htmlFor prop is passed directly to Radix Label.Root for native label-input association',
    },
  ],

  radixPrimitive: 'Label',

  hasHook: false,
  engineImports: ['withMoveComponent', 'useMergedRef'] as string[],

  componentDeps: [] as string[],

  testing: {
    behaviors: [
      'Renders as a native label element via Radix Label.Root',
      'Renders children as label text',
      'Applies size via data-size attribute (sm, md, lg)',
      'Defaults size to md with font-size var(--move-size-sm)',
      'Size sm applies font-size var(--move-size-xs)',
      'Size lg applies font-size var(--move-size-base)',
      'Shows asterisk (*) when required=true',
      'Hides asterisk when required is not set',
      'Asterisk has aria-hidden="true"',
      'Sets data-disabled when disabled=true',
      'Disabled label has reduced opacity and muted color',
      'Passes htmlFor to the underlying label element',
      'Forwards className and style',
      'Forwards ref to root element',
      'Spreads HTML attributes',
    ],
  },
} satisfies ComponentSpec;
