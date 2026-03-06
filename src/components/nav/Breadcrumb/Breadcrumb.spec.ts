// Breadcrumb.spec.ts — Component specification
// specHash: PLACEHOLDER

export const spec = {
  schemaVersion: 7 as const,
  name: 'Breadcrumb',
  componentClass: 'display' as const,
  category: 'nav',
  description: 'Navigation breadcrumb trail with auto-injected separators, collapsible overflow with ellipsis, and customizable separator content',

  compound: true,
  rootElement: 'nav',
  slots: [
    { name: 'root', element: 'nav', description: 'Root nav element with aria-label="Breadcrumb"' },
    { name: 'list', element: 'ol', description: 'Ordered list containing breadcrumb items and separators' },
    { name: 'item', element: 'li', description: 'List item wrapper for each breadcrumb entry' },
    { name: 'link', element: 'a', description: 'Anchor link for navigable breadcrumb items' },
    { name: 'page', element: 'span', description: 'Current page indicator (non-navigable, aria-current="page")' },
    { name: 'separator', element: 'li', description: 'Separator between breadcrumb items (aria-hidden)' },
    { name: 'ellipsis', element: 'li', description: 'Ellipsis indicator for collapsed items' },
  ],

  subComponents: [
    {
      name: 'Root',
      slots: [
        { name: 'root', element: 'nav', description: 'Root nav element' },
        { name: 'list', element: 'ol', description: 'Ordered list wrapper' },
      ],
      props: [
        { name: 'separator', type: 'React.ReactNode', moveSpecific: true, description: 'Custom separator content (defaults to chevron-right icon)' },
        { name: 'maxItems', type: 'number', moveSpecific: true, description: 'Maximum visible items before collapsing with ellipsis' },
        { name: 'itemsBeforeCollapse', type: 'number', default: '1', moveSpecific: true, description: 'Number of items to show before ellipsis when collapsed' },
        { name: 'itemsAfterCollapse', type: 'number', default: '1', moveSpecific: true, description: 'Number of items to show after ellipsis when collapsed' },
        { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", moveSpecific: true, description: 'Breadcrumb size affecting font size and gap' },
        { name: 'children', type: 'React.ReactNode', moveSpecific: false, description: 'Breadcrumb.Item children' },
      ],
      usesFactory: true,
      description: 'Root nav element that manages separator injection and item collapsing via context',
    },
    {
      name: 'Item',
      slots: [{ name: 'item', element: 'li', description: 'List item wrapper' }],
      props: [
        { name: 'children', type: 'React.ReactNode', moveSpecific: false, description: 'Item content (Link or Page)' },
      ],
      usesFactory: true,
      description: 'List item container for a breadcrumb entry',
    },
    {
      name: 'Link',
      slots: [{ name: 'link', element: 'a', description: 'Anchor link' }],
      props: [
        { name: 'asChild', type: 'boolean', default: 'false', moveSpecific: true, description: 'Render as Slot to merge props onto child element (e.g. router Link)' },
        { name: 'children', type: 'React.ReactNode', moveSpecific: false, description: 'Link content' },
      ],
      usesFactory: true,
      description: 'Navigable link element within a breadcrumb item; supports asChild for custom link components',
    },
    {
      name: 'Page',
      slots: [{ name: 'page', element: 'span', description: 'Current page span' }],
      props: [
        { name: 'children', type: 'React.ReactNode', moveSpecific: false, description: 'Current page text' },
      ],
      usesFactory: true,
      description: 'Non-navigable current page indicator with aria-current="page"',
    },
    {
      name: 'Separator',
      slots: [{ name: 'separator', element: 'li', description: 'Separator list item' }],
      props: [
        { name: 'children', type: 'React.ReactNode', moveSpecific: false, description: 'Custom separator content (falls back to context separator)' },
      ],
      usesFactory: true,
      description: 'Separator element between items; uses context separator by default or custom children',
    },
    {
      name: 'Ellipsis',
      slots: [{ name: 'ellipsis', element: 'li', description: 'Ellipsis list item' }],
      props: [
        { name: 'children', type: 'React.ReactNode', moveSpecific: false, description: 'Custom ellipsis content (defaults to horizontal ellipsis character)' },
      ],
      usesFactory: true,
      description: 'Ellipsis indicator shown when items are collapsed',
    },
  ],

  props: [
    { name: 'separator', type: 'React.ReactNode', moveSpecific: true, description: 'Custom separator content' },
    { name: 'maxItems', type: 'number', moveSpecific: true, description: 'Maximum visible items before collapsing' },
    { name: 'itemsBeforeCollapse', type: 'number', default: '1', moveSpecific: true, description: 'Items shown before ellipsis' },
    { name: 'itemsAfterCollapse', type: 'number', default: '1', moveSpecific: true, description: 'Items shown after ellipsis' },
    { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", moveSpecific: true, description: 'Breadcrumb size' },
    { name: 'children', type: 'React.ReactNode', moveSpecific: false, description: 'Breadcrumb.Item children' },
  ],

  anatomy: {
    slot: 'root',
    dataAttributes: ['data-size'],
    ariaAttributes: ['aria-label'],
    children: [
      {
        slot: 'list',
        children: [
          {
            slot: 'item',
            children: [
              { slot: 'link' },
            ],
          },
          {
            slot: 'separator',
            ariaAttributes: ['aria-hidden'],
          },
          {
            slot: 'item',
            children: [
              { slot: 'page', ariaAttributes: ['aria-current', 'aria-disabled'] },
            ],
          },
          {
            slot: 'ellipsis',
          },
        ],
      },
    ],
  },

  controlled: null,
  keyboard: null,
  focus: null,
  formType: null,
  asChild: false,

  animations: [],

  tokens: [
    { name: '--move-breadcrumb-gap', value: 'var(--move-spacing-xs)', description: 'Gap between breadcrumb items and separators' },
    { name: '--move-breadcrumb-fg', value: 'var(--move-fg-muted)', description: 'Link text color' },
    { name: '--move-breadcrumb-fg-current', value: 'var(--move-fg-base)', description: 'Current page text color' },
    { name: '--move-breadcrumb-separator-color', value: 'var(--move-fg-subtle)', description: 'Separator and ellipsis color' },
  ],

  variants: {},
  sizes: ['sm', 'md', 'lg'] as string[],

  labels: [],
  childrenKind: 'composition' as const,

  renderContracts: [
    { id: 'auto-separator-injection', description: 'Root automatically injects Separator components between visible Item children' },
    { id: 'item-collapsing', description: 'When maxItems is set and children count exceeds it, Root shows itemsBeforeCollapse items, an Ellipsis, then itemsAfterCollapse items' },
    { id: 'default-separator-icon', description: 'Default separator is a chevron-right Icon at xs size; overridden by separator prop on Root' },
    { id: 'separator-from-context', description: 'Separator component reads separator content from BreadcrumbContext; custom children override context value' },
    { id: 'page-aria-current', description: 'Page renders aria-current="page" and aria-disabled="true" with role="link"' },
    { id: 'separator-aria-hidden', description: 'Separator renders role="presentation" and aria-hidden="true"' },
    { id: 'ellipsis-default-char', description: 'Ellipsis defaults to horizontal ellipsis character when no children provided' },
    { id: 'link-as-child', description: 'Link supports asChild via Radix Slot to compose with router link components' },
    { id: 'root-nav-label', description: 'Root nav element has aria-label="Breadcrumb"' },
  ],

  hasHook: false,
  engineImports: ['withMoveComponent'] as string[],

  componentDeps: ['Icon'] as string[],

  testing: {
    behaviors: [
      'Root renders as nav element with aria-label="Breadcrumb"',
      'Root renders list as ol element',
      'Root defaults to size=md',
      'Root applies data-size attribute',
      'Root auto-injects separators between Item children',
      'Root collapses items with Ellipsis when maxItems is exceeded',
      'Root defaults to itemsBeforeCollapse=1 and itemsAfterCollapse=1',
      'Item renders as li element',
      'Link renders as anchor element by default',
      'Link renders as Slot when asChild=true',
      'Page renders as span with aria-current="page"',
      'Page renders aria-disabled="true"',
      'Page renders role="link"',
      'Separator renders as li with role="presentation" and aria-hidden="true"',
      'Separator uses context separator when no children provided',
      'Separator uses custom children when provided',
      'Ellipsis renders horizontal ellipsis character by default',
      'Ellipsis renders custom children when provided',
      'Default separator is chevron-right icon',
      'Custom separator prop overrides default icon',
      'Link hover applies underline and base color',
      'Forwards className and style on all sub-components',
      'Forwards ref on all sub-components',
    ],
    aria: [
      'Root nav has aria-label="Breadcrumb"',
      'Page has aria-current="page"',
      'Page has aria-disabled="true"',
      'Separator has aria-hidden="true"',
      'Separator has role="presentation"',
      'Ellipsis has role="presentation"',
    ],
  },

  defaultReview: {
    status: 'approved' as const,
    decisionSource: 'user-confirmed' as const,
    overrides: {},
  },
};
