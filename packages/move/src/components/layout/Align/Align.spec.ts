// Align.spec.ts — Component specification

import type { ComponentSpec } from '../../../spec-type';

export const spec = {
  schemaVersion: 1 as const,
  name: 'Align',
  componentClass: 'presentational' as const,
  category: 'layout',
  description: 'Horizontal bar with start/center/end distribution using CSS grid',
  families: {
    behavior: ['layout'],
    state: ['stateless'],
    a11y: ['none'],
  },

  compound: true,
  rootElement: 'div',
  slots: [
    { name: 'root', element: 'div', description: 'Grid container (1fr auto 1fr)' },
    { name: 'start', element: 'div', description: 'Start section (left-aligned)' },
    { name: 'center', element: 'div', description: 'Center section (centered)' },
    { name: 'end', element: 'div', description: 'End section (right-aligned)' },
  ],

  subComponents: [
    {
      name: 'Root',
      slots: [{ name: 'root', element: 'div', description: 'Grid container' }],
      props: [
        {
          name: 'gap',
          typeRef: 'Gap',
          default: "'md'",
          moveSpecific: true,
          description: 'Gap between items',
        },
        {
          name: 'align',
          type: "'start' | 'center' | 'end' | 'stretch' | 'baseline'",
          default: "'center'",
          moveSpecific: true,
          description: 'Vertical alignment of items',
        },
        {
          name: 'padding',
          typeRef: 'Gap',
          moveSpecific: true,
          description: 'Padding around the bar.',
        },
        {
          name: 'flex',
          type: 'boolean',
          moveSpecific: true,
          description:
            'Use flex (instead of grid) when you need natural-width children rather than the 1fr/auto/1fr distribution.',
        },
        {
          name: 'fill',
          type: "'parent' | 'remaining'",
          moveSpecific: true,
          description:
            "Where this box's height comes from. 'parent' = all of the parent's height (the parent must be sized, and you must be its only child); 'remaining' = the space left after siblings, waiving the automatic minimum size so a scroll region below can scroll. See /systems/layout.",
        },
        {
          name: 'children',
          type: 'React.ReactNode',
          moveSpecific: false,
          description: 'Align sections (Start, Center, End)',
        },
      ],
      usesFactory: true,
      description: 'Grid container with three slots distributed start/center/end.',
    },
    {
      name: 'Start',
      slots: [{ name: 'start', element: 'div', description: 'Start section (left-aligned)' }],
      props: [
        {
          name: 'children',
          type: 'React.ReactNode',
          moveSpecific: false,
          description: 'Start-aligned content.',
        },
      ],
      usesFactory: true,
      description: 'Left-aligned section of the Align bar.',
    },
    {
      name: 'Center',
      slots: [{ name: 'center', element: 'div', description: 'Center section (centered)' }],
      props: [
        {
          name: 'children',
          type: 'React.ReactNode',
          moveSpecific: false,
          description: 'Centered content.',
        },
      ],
      usesFactory: true,
      description: 'Centered middle section.',
    },
    {
      name: 'End',
      slots: [{ name: 'end', element: 'div', description: 'End section (right-aligned)' }],
      props: [
        {
          name: 'children',
          type: 'React.ReactNode',
          moveSpecific: false,
          description: 'End-aligned content.',
        },
      ],
      usesFactory: true,
      description: 'Right-aligned section of the Align bar.',
    },
  ],

  props: [
    {
      name: 'gap',
      typeRef: 'Gap',
      default: "'md'",
      moveSpecific: true,
      description: 'Gap between items',
    },
    {
      name: 'align',
      type: "'start' | 'center' | 'end' | 'stretch' | 'baseline'",
      default: "'center'",
      moveSpecific: true,
      description: 'Vertical alignment of items',
    },
    {
      name: 'children',
      type: 'React.ReactNode',
      moveSpecific: false,
      description: 'Align sections (Start, Center, End)',
    },
  ],

  anatomy: {
    slot: 'root',
    dataAttributes: ['data-gap', 'data-align'],
    children: [{ slot: 'start' }, { slot: 'center' }, { slot: 'end' }],
  },

  controlled: null,
  keyboard: null,
  focus: null,
  formType: null,
  asChild: false,

  animations: [],

  tokens: [],

  variants: {},
  sizes: [],

  labels: [],

  hasHook: false,
  engineImports: ['withMoveComponent'],

  componentDeps: [],

  testing: {
    behaviors: [
      'Renders as grid container',
      'Applies gap via data-gap attribute',
      'Applies vertical alignment via data-align attribute',
      'Defaults to gap=md',
      'Defaults to align=center',
      'Start section aligns left',
      'Center section aligns center',
      'End section aligns right',
      'Forwards className and style',
      'Forwards ref to root element',
    ],
  },
} satisfies ComponentSpec;
