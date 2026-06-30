// Heading.spec.ts — Component specification
// specHash: PLACEHOLDER

import type { ComponentSpec } from '../../../spec-type';

export const spec = {
  schemaVersion: 7 as const,
  name: 'Heading',
  componentClass: 'presentational' as const,
  category: 'typography',
  description:
    'Semantic heading element (h1-h6) with weight, color, tracking, alignment, and truncation control',

  synonyms: ['title', 'h1', 'h2', 'header', 'page title'],
  families: {
    behavior: ['typography'],
    state: ['stateless'],
    a11y: ['none'],
  },

  compound: false,
  rootElement: 'h2',
  slots: [
    {
      name: 'root',
      element: 'h1-h6',
      description: 'Heading element rendered as h1-h6 based on level prop',
    },
  ],

  props: [
    {
      name: 'level',
      type: '1 | 2 | 3 | 4 | 5 | 6',
      default: '2',
      moveSpecific: true,
      description: 'Heading level (determines HTML element h1-h6)',
    },
    {
      name: 'weight',
      type: "'medium' | 'semibold' | 'bold'",
      moveSpecific: true,
      description: 'Font weight',
    },
    {
      name: 'color',
      type: "'base' | 'muted' | 'subtle'",
      default: "'base'",
      moveSpecific: true,
      description: 'Text color',
    },
    {
      name: 'tracking',
      type: "'tight' | 'normal'",
      default: "'tight'",
      moveSpecific: true,
      description: 'Letter spacing',
    },
    {
      name: 'align',
      type: "'left' | 'center' | 'right'",
      moveSpecific: true,
      description: 'Text alignment (only set when provided)',
    },
    {
      name: 'truncate',
      type: 'boolean',
      moveSpecific: true,
      description: 'Enable text truncation with ellipsis',
    },
    { name: 'className', type: 'string', moveSpecific: false, description: 'Additional CSS class' },
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
      description: 'Heading text content',
    },
  ],

  anatomy: {
    slot: 'root',
    dataAttributes: [
      'data-size',
      'data-weight',
      'data-color',
      'data-tracking',
      'data-align',
      'data-truncate',
    ],
  },

  controlled: null,
  keyboard: null,
  focus: null,
  formType: null,
  asChild: false,

  animations: [],

  tokens: [
    {
      name: '--move-heading-color-base',
      value: 'var(--move-fg-base)',
      description: 'Text color for color=base',
    },
    {
      name: '--move-heading-color-muted',
      value: 'var(--move-fg-muted)',
      description: 'Text color for color=muted',
    },
    {
      name: '--move-heading-color-subtle',
      value: 'var(--move-fg-subtle)',
      description: 'Text color for color=subtle',
    },
  ],

  variants: {
    weight: ['medium', 'semibold', 'bold'],
    color: ['base', 'muted', 'subtle'],
    tracking: ['tight', 'normal'],
    align: ['left', 'center', 'right'],
  },
  sizes: ['base', 'lg', 'xl', '2xl', '3xl', '4xl'],

  labels: [],
  childrenKind: 'text' as const,

  renderContracts: [
    {
      id: 'level-to-element',
      description:
        'The level prop determines the rendered HTML element: level=1 -> h1, level=2 -> h2, ... level=6 -> h6. Default level is 2.',
    },
    {
      id: 'level-to-size-mapping',
      description:
        'Size is always derived from level via levelToSize map: 1->4xl, 2->3xl, 3->2xl, 4->xl, 5->lg, 6->base',
    },
    {
      id: 'data-align-conditional',
      description:
        'data-align is only set when align prop is explicitly provided; omitted otherwise',
    },
    {
      id: 'data-truncate-boolean',
      description:
        'data-truncate is set as empty string attribute when truncate=true; omitted when false/undefined',
    },
  ],

  hasHook: false,
  engineImports: ['withMoveComponent'],

  componentDeps: [],

  testing: {
    behaviors: [
      'Renders as h2 element by default',
      'Renders as h1-h6 based on level prop',
      'Renders children as text content',
      'Applies size via data-size attribute',
      'Derives size from level (level 1->4xl, 2->3xl, 3->2xl, 4->xl, 5->lg, 6->base)',
      'Applies weight via data-weight attribute',
      'weight omitted — unspecified headings inherit the --move-weight-heading token',
      'Applies color via data-color attribute',
      'Defaults to color=base',
      'Applies tracking via data-tracking attribute',
      'Defaults to tracking=tight',
      'Sets data-align only when align prop is provided',
      'Sets data-truncate when truncate=true',
      'Omits data-truncate when truncate is false or undefined',
      'Forwards className and style',
      'Forwards ref to root element',
      'Spreads HTML attributes',
    ],
  },
} satisfies ComponentSpec;
