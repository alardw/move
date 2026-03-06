// EmptyState.spec.ts — Component specification
// specHash: PLACEHOLDER

export const spec = {
  schemaVersion: 7 as const,
  name: 'EmptyState',
  componentClass: 'presentational' as const,
  category: 'loading',
  description: 'Centered placeholder for empty views with icon, title, description, and optional action',

  compound: false,
  rootElement: 'div',
  slots: [
    { name: 'root', element: 'div', description: 'Outer container with flex column layout, centering, and size tokens' },
    { name: 'icon', element: 'span', description: 'Icon wrapper rendered when icon prop is provided' },
    { name: 'title', element: 'div', description: 'Title text rendered when title prop is provided' },
    { name: 'description', element: 'div', description: 'Description text rendered when description prop is provided' },
    { name: 'action', element: 'div', description: 'Action area rendered when action prop is provided' },
  ],

  props: [
    { name: 'icon', type: 'string', moveSpecific: true, description: 'Icon name to display above the title' },
    { name: 'title', type: 'React.ReactNode', moveSpecific: true, description: 'Title text content' },
    { name: 'description', type: 'React.ReactNode', moveSpecific: true, description: 'Description text content' },
    { name: 'action', type: 'React.ReactNode', moveSpecific: true, description: 'Action content (e.g. button) rendered below description' },
    { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", moveSpecific: true, description: 'Controls padding, gap, and typography sizes' },
    { name: 'children', type: 'React.ReactNode', moveSpecific: false, description: 'Additional content rendered after structured slots' },
  ],

  anatomy: {
    slot: 'root',
    dataAttributes: ['data-size'],
    children: [
      { slot: 'icon', ariaAttributes: ['aria-hidden'] },
      { slot: 'title' },
      { slot: 'description' },
      { slot: 'action' },
    ],
  },

  controlled: null,
  keyboard: null,
  focus: null,
  formType: null,
  asChild: false,

  animations: [],

  tokens: [
    { name: '--move-emptystate-icon-fg', value: 'var(--move-fg-subtle)', description: 'Icon color' },
    { name: '--move-emptystate-title-fg', value: 'var(--move-fg-base)', description: 'Title text color' },
    { name: '--move-emptystate-description-fg', value: 'var(--move-fg-muted)', description: 'Description text color' },
    { name: '--move-emptystate-padding', value: 'var(--move-spacing-xl)', description: 'Container padding (varies by size)' },
    { name: '--move-emptystate-gap', value: 'var(--move-spacing-sm)', description: 'Gap between slots (varies by size)' },
  ],

  variants: {},
  sizes: ['sm', 'md', 'lg'] as string[],

  labels: [],
  childrenKind: 'composition' as const,

  renderContracts: [
    { id: 'icon-conditional', description: 'Icon slot only renders when icon prop is provided' },
    { id: 'title-conditional', description: 'Title slot only renders when title prop is provided' },
    { id: 'description-conditional', description: 'Description slot only renders when description prop is provided' },
    { id: 'action-conditional', description: 'Action slot only renders when action prop is provided' },
    { id: 'icon-size-mapping', description: 'Icon size maps to sm=32, md=44, lg=56 based on the size prop' },
    { id: 'icon-aria-hidden', description: 'Icon wrapper has aria-hidden="true" since it is decorative' },
  ],

  hasHook: false,
  engineImports: ['withMoveComponent'],

  componentDeps: ['Icon'],

  testing: {
    behaviors: [
      'Renders as div element',
      'Renders icon when icon prop is provided',
      'Does not render icon slot when icon prop is omitted',
      'Renders title when title prop is provided',
      'Does not render title slot when title prop is omitted',
      'Renders description when description prop is provided',
      'Does not render description slot when description prop is omitted',
      'Renders action when action prop is provided',
      'Does not render action slot when action prop is omitted',
      'Renders children after structured slots',
      'Applies size via data-size attribute',
      'Defaults to size=md',
      'Icon has aria-hidden="true"',
      'Icon size is 32 when size=sm',
      'Icon size is 44 when size=md',
      'Icon size is 56 when size=lg',
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
