// Align.spec.ts — Component specification
// specHash: 6cbf8097

export const spec = {
  schemaVersion: 7 as const,
  name: 'Align',
  componentClass: 'presentational' as const,
  category: 'core',
  description: 'Horizontal bar with start/center/end distribution using CSS grid',

  compound: true,
  rootElement: 'div',
  slots: [
    { name: 'root', element: 'div', description: 'Grid container (1fr auto 1fr)' },
    { name: 'start', element: 'div', description: 'Start section (left-aligned)' },
    { name: 'center', element: 'div', description: 'Center section (centered)' },
    { name: 'end', element: 'div', description: 'End section (right-aligned)' },
  ],

  props: [
    { name: 'gap', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'none'", default: "'md'", moveSpecific: true, description: 'Gap between items' },
    { name: 'align', type: "'start' | 'center' | 'end' | 'stretch' | 'baseline'", default: "'center'", moveSpecific: true, description: 'Vertical alignment of items' },
    { name: 'children', type: 'React.ReactNode', moveSpecific: false, description: 'Align sections (Start, Center, End)' },
  ],

  anatomy: {
    slot: 'root',
    dataAttributes: ['data-gap', 'data-align'],
    children: [
      { slot: 'start' },
      { slot: 'center' },
      { slot: 'end' },
    ],
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

  defaultReview: {
    status: 'approved' as const,
    decisionSource: 'rule-based' as const,
    overrides: {},
  },
};
