// Divider.spec.ts — Component specification
// specHash: PLACEHOLDER

import type { ComponentSpec } from '../../../spec-type';

export const spec = {
  schemaVersion: 7 as const,
  name: 'Divider',
  componentClass: 'presentational' as const,
  category: 'layout',
  description:
    'Visual separator for content sections with optional inline label, orientation, line style, and alignment',
  families: {
    behavior: ['display'],
    state: ['stateless'],
    a11y: ['none'],
  },

  compound: false,
  rootElement: 'div',
  slots: [
    {
      name: 'root',
      element: 'div',
      description: 'Separator element with CSS pseudo-element lines',
    },
    {
      name: 'content',
      element: 'span',
      description: 'Optional inline label/content between the separator lines',
    },
  ],

  props: [
    {
      name: 'orientation',
      type: "'horizontal' | 'vertical'",
      default: "'horizontal'",
      moveSpecific: true,
      description: 'Divider direction',
    },
    {
      name: 'type',
      type: "'solid' | 'dashed' | 'dotted'",
      default: "'solid'",
      moveSpecific: true,
      description: 'Border line style',
    },
    {
      name: 'align',
      type: "'left' | 'center' | 'right' | 'top' | 'bottom'",
      default: "'center'",
      moveSpecific: true,
      description: 'Position of inline content along the divider',
    },
    {
      name: 'size',
      typeRef: 'Size',
      default: "'sm'",
      moveSpecific: true,
      description: 'Line thickness',
    },
    {
      name: 'children',
      type: 'React.ReactNode',
      moveSpecific: false,
      description: 'Optional inline content (text or element)',
    },
  ],

  anatomy: {
    slot: 'root',
    dataAttributes: [
      'data-orientation',
      'data-type',
      'data-size',
      'data-has-content',
      'data-align',
    ],
    ariaAttributes: ['role=separator', 'aria-orientation'],
    children: [{ slot: 'content' }],
  },

  controlled: null,
  keyboard: null,
  focus: null,
  formType: null,
  asChild: false,

  animations: [],

  renderContracts: [
    {
      id: 'content-conditional',
      description: 'Content slot only renders when children are provided',
    },
    {
      id: 'has-content-data-attr',
      description:
        'data-has-content and data-align are only set on root when children are provided',
    },
    {
      id: 'pseudo-element-lines',
      description:
        'Separator lines are rendered via CSS ::before and ::after pseudo-elements on root, not as DOM nodes',
    },
    {
      id: 'single-line-no-content',
      description: 'When no content is provided, ::after is hidden so only a single line renders',
    },
    {
      id: 'vertical-padding-override',
      description: 'In vertical orientation, content padding switches from horizontal to vertical',
    },
  ],

  tokens: [
    { name: '--move-divider-color', value: 'var(--move-border-base)', description: 'Line color' },
    {
      name: '--move-divider-size',
      value: '1px',
      description: 'Line thickness (overridden per size)',
    },
    {
      name: '--move-divider-margin',
      value: 'var(--move-spacing-md) 0',
      description: 'Outer margin',
    },
    {
      name: '--move-divider-content-bg',
      value: 'var(--move-bg-base)',
      description: 'Content label background',
    },
    {
      name: '--move-divider-content-color',
      value: 'var(--move-fg-muted)',
      description: 'Content label text color',
    },
    {
      name: '--move-divider-content-padding',
      value: '0 var(--move-spacing-md)',
      description: 'Content label padding',
    },
    {
      name: '--move-divider-content-size',
      value: 'var(--move-font-size-sm)',
      description: 'Content label font size',
    },
  ],

  variants: {
    type: ['solid', 'dashed', 'dotted'] as string[],
    align: ['left', 'center', 'right', 'top', 'bottom'] as string[],
  },
  sizes: ['sm', 'md', 'lg'] as string[],

  labels: [],
  childrenKind: 'text' as const,

  hasHook: false,
  engineImports: ['withMoveComponent'] as string[],

  componentDeps: [] as string[],

  testing: {
    behaviors: [
      'Renders as div element with role=separator',
      'Renders horizontal orientation by default',
      'Renders vertical orientation when orientation=vertical',
      'Sets aria-orientation matching orientation prop',
      'Applies line style via data-type attribute',
      'Defaults to type=solid',
      'Defaults to size=sm',
      'Defaults to orientation=horizontal',
      'Defaults to align=center',
      'Applies data-size attribute',
      'Renders content slot when children are provided',
      'Does not render content slot when no children',
      'Sets data-has-content when children are provided',
      'Sets data-align when children are provided',
      'Omits data-has-content and data-align when no children',
      'Forwards className and style',
      'Forwards ref to root element',
      'Spreads HTML attributes',
    ],
    aria: [
      'Root has role=separator',
      'Root has aria-orientation matching orientation prop',
    ] as string[],
  },
} satisfies ComponentSpec;
