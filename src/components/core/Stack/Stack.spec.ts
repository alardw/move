// Stack.spec.ts — Component specification
// specHash: PLACEHOLDER

export const spec = {
  schemaVersion: 6 as const,
  name: 'Stack',
  componentClass: 'presentational' as const,
  category: 'core',
  description: 'Flex layout container for vertical or horizontal stacking with configurable gap, alignment, and responsive collapse',

  compound: false,
  rootElement: 'div',
  slots: [
    { name: 'root', element: 'div', description: 'Flex container element' },
  ],

  props: [
    { name: 'direction', type: "'row' | 'column'", default: "'column'", moveSpecific: true, description: 'Flex direction' },
    { name: 'gap', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'none'", default: "'md'", moveSpecific: true, description: 'Gap between children' },
    { name: 'align', type: "'start' | 'center' | 'end' | 'stretch' | 'baseline'", default: "'stretch'", moveSpecific: true, description: 'Cross-axis alignment (align-items)' },
    { name: 'justify', type: "'start' | 'center' | 'end' | 'between' | 'evenly'", default: "'start'", moveSpecific: true, description: 'Main-axis alignment (justify-content)' },
    { name: 'wrap', type: 'boolean', default: 'false', moveSpecific: true, description: 'Allow children to wrap to next line' },
    { name: 'collapseBelow', type: 'string', moveSpecific: true, description: 'Container width threshold (px) below which direction collapses to column' },
    { name: 'children', type: 'React.ReactNode', moveSpecific: false, description: 'Child elements to lay out' },
  ],

  anatomy: {
    slot: 'root',
    dataAttributes: ['data-direction', 'data-gap', 'data-align', 'data-justify', 'data-wrap', 'data-collapsed'],
  },

  controlled: null,
  keyboard: null,
  focus: null,
  formType: null,
  asChild: false,

  animations: [],

  tokens: [
    { name: '--move-stack-gap-none', value: '0', description: 'Gap when gap=none' },
    { name: '--move-stack-gap-xs', value: 'var(--move-spacing-xs)', description: 'Gap when gap=xs' },
    { name: '--move-stack-gap-sm', value: 'var(--move-spacing-sm)', description: 'Gap when gap=sm' },
    { name: '--move-stack-gap-md', value: 'var(--move-spacing-md)', description: 'Gap when gap=md' },
    { name: '--move-stack-gap-lg', value: 'var(--move-spacing-lg)', description: 'Gap when gap=lg' },
    { name: '--move-stack-gap-xl', value: 'var(--move-spacing-xl)', description: 'Gap when gap=xl' },
  ],

  variants: {
    direction: ['row', 'column'] as string[],
    gap: ['xs', 'sm', 'md', 'lg', 'xl', 'none'] as string[],
    align: ['start', 'center', 'end', 'stretch', 'baseline'] as string[],
    justify: ['start', 'center', 'end', 'between', 'evenly'] as string[],
  },
  sizes: [] as string[],

  labels: [],
  childrenKind: 'composition' as const,

  renderContracts: [
    { id: 'direction-data-attr', description: 'Direction is applied via data-direction attribute, flex-direction resolved in CSS' },
    { id: 'gap-data-attr', description: 'Gap is applied via data-gap attribute, gap value resolved via component tokens in CSS' },
    { id: 'align-data-attr', description: 'Align is applied via data-align attribute, align-items resolved in CSS' },
    { id: 'justify-data-attr', description: 'Justify is applied via data-justify attribute, justify-content resolved in CSS' },
    { id: 'wrap-data-attr', description: 'Wrap is applied via data-wrap boolean attribute when wrap=true' },
    { id: 'collapse-responsive', description: 'When collapseBelow is set, a ResizeObserver sets data-collapsed on the root when container width is below the threshold, overriding direction to column' },
  ],

  hasHook: false,
  engineImports: ['withMoveComponent'],
  animationImports: [] as string[],
  componentDeps: [] as string[],

  testing: {
    behaviors: [
      'Renders as div element',
      'Renders children content',
      'Applies direction via data-direction attribute',
      'Applies gap via data-gap attribute',
      'Applies align via data-align attribute',
      'Applies justify via data-justify attribute',
      'Defaults to direction=column',
      'Defaults to gap=md',
      'Defaults to align=stretch',
      'Defaults to justify=start',
      'Defaults to wrap=false (no data-wrap attribute)',
      'Applies data-wrap attribute when wrap=true',
      'Omits data-wrap when wrap is false or not provided',
      'Sets data-collapsed when container width is below collapseBelow threshold',
      'Removes data-collapsed when container width is at or above collapseBelow threshold',
      'Omits collapse behavior when collapseBelow is not provided',
      'Forwards className and style',
      'Forwards ref to root element',
      'Spreads HTML attributes',
    ],
  },

  defaultReview: {
    status: 'approved' as const,
    decisionSource: 'rule-based' as const,
    overrides: {},
  },
};
