// Table.spec.ts — Component specification
// specHash: PLACEHOLDER

export const spec = {
  schemaVersion: 7 as const,
  name: 'Table',
  componentClass: 'display' as const,
  category: 'data',
  description: 'Data table with striped rows, sortable columns, sticky header, row selection, and staggered row entrance animation',

  compound: true,
  rootElement: 'table',
  slots: [
    { name: 'root', element: 'table', description: 'Root table element with component tokens' },
    { name: 'header', element: 'thead', description: 'Table header section' },
    { name: 'body', element: 'tbody', description: 'Table body section' },
    { name: 'footer', element: 'tfoot', description: 'Table footer section' },
    { name: 'row', element: 'tr', description: 'Table row with optional selected state and hover animation' },
    { name: 'head', element: 'th', description: 'Header cell with optional sort indicator' },
    { name: 'cell', element: 'td', description: 'Standard data cell' },
    { name: 'caption', element: 'caption', description: 'Table caption rendered at bottom' },
  ],

  subComponents: [
    {
      name: 'Root',
      slots: [{ name: 'root', element: 'table', description: 'Root table element' }],
      props: [
        { name: 'variant', type: "'default' | 'striped'", default: "'default'", moveSpecific: true, description: 'Row striping variant' },
        { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", moveSpecific: true, description: 'Cell padding and font size' },
        { name: 'bordered', type: 'boolean', moveSpecific: true, description: 'Add borders to all cells' },
        { name: 'hoverable', type: 'boolean', moveSpecific: true, description: 'Highlight rows on hover' },
        { name: 'stickyHeader', type: 'boolean', moveSpecific: true, description: 'Make header sticky on scroll' },
        { name: 'animations', type: 'AnimationTrigger[] | false', moveSpecific: true, description: 'Staggered row entrance animation config or false to disable' },
        { name: 'children', type: 'React.ReactNode', moveSpecific: false, description: 'Table sections (Header, Body, Footer)' },
      ],
      usesFactory: true,
      description: 'Root table element that provides context for variant, size, and stagger animation to child rows',
    },
    {
      name: 'Header',
      slots: [{ name: 'header', element: 'thead', description: 'Table header section' }],
      props: [
        { name: 'children', type: 'React.ReactNode', moveSpecific: false, description: 'Header rows' },
      ],
      usesFactory: true,
      description: 'Table header section (thead)',
    },
    {
      name: 'Body',
      slots: [{ name: 'body', element: 'tbody', description: 'Table body section' }],
      props: [
        { name: 'children', type: 'React.ReactNode', moveSpecific: false, description: 'Body rows' },
      ],
      usesFactory: true,
      description: 'Table body section (tbody)',
    },
    {
      name: 'Footer',
      slots: [{ name: 'footer', element: 'tfoot', description: 'Table footer section' }],
      props: [
        { name: 'children', type: 'React.ReactNode', moveSpecific: false, description: 'Footer rows' },
      ],
      usesFactory: true,
      description: 'Table footer section (tfoot) with header styling',
    },
    {
      name: 'Row',
      slots: [{ name: 'row', element: 'tr', description: 'Table row' }],
      props: [
        { name: 'selected', type: 'boolean', moveSpecific: true, description: 'Mark row as selected' },
        { name: 'animations', type: 'AnimationTrigger[] | false', moveSpecific: true, description: 'Row-level hover animation config or false to disable' },
        { name: 'children', type: 'React.ReactNode', moveSpecific: false, description: 'Row cells' },
      ],
      usesFactory: true,
      description: 'Table row that participates in stagger entrance and supports selection state and hover animation',
    },
    {
      name: 'Head',
      slots: [{ name: 'head', element: 'th', description: 'Header cell' }],
      props: [
        { name: 'sortable', type: 'boolean', moveSpecific: true, description: 'Enable sort interaction on this column' },
        { name: 'sorted', type: "'asc' | 'desc' | false", moveSpecific: true, description: 'Current sort direction or false' },
        { name: 'onSort', type: '() => void', moveSpecific: true, description: 'Callback when sort is triggered' },
        { name: 'children', type: 'React.ReactNode', moveSpecific: false, description: 'Header cell content' },
      ],
      usesFactory: true,
      description: 'Header cell with optional sortable behavior, keyboard interaction, and sort direction indicator',
    },
    {
      name: 'Cell',
      slots: [{ name: 'cell', element: 'td', description: 'Data cell' }],
      props: [
        { name: 'children', type: 'React.ReactNode', moveSpecific: false, description: 'Cell content' },
      ],
      usesFactory: true,
      description: 'Standard table data cell (td)',
    },
    {
      name: 'Caption',
      slots: [{ name: 'caption', element: 'caption', description: 'Table caption' }],
      props: [
        { name: 'children', type: 'React.ReactNode', moveSpecific: false, description: 'Caption text' },
      ],
      usesFactory: true,
      description: 'Table caption rendered at bottom of table',
    },
  ],

  props: [
    { name: 'variant', type: "'default' | 'striped'", default: "'default'", moveSpecific: true, description: 'Row striping variant' },
    { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", moveSpecific: true, description: 'Cell padding and font size' },
    { name: 'bordered', type: 'boolean', moveSpecific: true, description: 'Add borders to all cells' },
    { name: 'hoverable', type: 'boolean', moveSpecific: true, description: 'Highlight rows on hover' },
    { name: 'stickyHeader', type: 'boolean', moveSpecific: true, description: 'Make header sticky on scroll' },
    { name: 'animations', type: 'AnimationTrigger[] | false', moveSpecific: true, description: 'Staggered row entrance animation config or false to disable' },
    { name: 'children', type: 'React.ReactNode', moveSpecific: false, description: 'Table sections' },
  ],

  anatomy: {
    slot: 'root',
    dataAttributes: ['data-variant', 'data-size', 'data-bordered', 'data-hoverable', 'data-sticky-header'],
    children: [
      { slot: 'caption' },
      {
        slot: 'header',
        children: [
          {
            slot: 'row',
            children: [
              { slot: 'head', dataAttributes: ['data-sortable', 'data-sorted'], ariaAttributes: ['aria-sort'] },
            ],
          },
        ],
      },
      {
        slot: 'body',
        children: [
          {
            slot: 'row',
            dataAttributes: ['data-state'],
            children: [
              { slot: 'cell' },
            ],
          },
        ],
      },
      {
        slot: 'footer',
        children: [
          {
            slot: 'row',
            children: [
              { slot: 'cell' },
            ],
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

  animations: [
    { trigger: 'Root.enter', sequence: [{ children: 'tbody > tr', animation: { opacity: { from: 0, to: 1 }, y: { from: 8, to: 0 } }, stagger: { delay: 30 } }] },
  ],

  tokens: [
    { name: '--move-table-bg', value: 'var(--move-bg-base)', description: 'Table background color' },
    { name: '--move-table-border', value: 'var(--move-border-base)', description: 'Border color for rows and bordered mode' },
    { name: '--move-table-radius', value: 'var(--move-rounded-lg)', description: 'Table border radius' },
    { name: '--move-table-header-bg', value: 'var(--move-bg-muted)', description: 'Header and footer background' },
    { name: '--move-table-header-fg', value: 'var(--move-fg-base)', description: 'Header text color' },
    { name: '--move-table-header-weight', value: 'var(--move-weight-medium)', description: 'Header font weight' },
    { name: '--move-table-cell-padding-x', value: 'var(--move-spacing-md)', description: 'Horizontal cell padding' },
    { name: '--move-table-cell-padding-y', value: 'var(--move-spacing-sm)', description: 'Vertical cell padding' },
    { name: '--move-table-cell-fg', value: 'var(--move-fg-base)', description: 'Cell text color' },
    { name: '--move-table-row-hover-bg', value: 'var(--move-bg-emphasis)', description: 'Row hover background' },
    { name: '--move-table-row-selected-bg', value: 'var(--move-bg-emphasis)', description: 'Selected row background' },
    { name: '--move-table-stripe-bg', value: 'var(--move-bg-subtle)', description: 'Striped row background (even rows)' },
    { name: '--move-table-caption-fg', value: 'var(--move-fg-muted)', description: 'Caption text color' },
    { name: '--move-table-caption-size', value: 'var(--move-size-sm)', description: 'Caption font size' },
  ],

  variants: {
    variant: ['default', 'striped'] as string[],
  },
  sizes: ['sm', 'md', 'lg'] as string[],

  labels: [],
  childrenKind: 'composition' as const,

  renderContracts: [
    { id: 'context-stagger', description: 'Root provides stagger animation config and row index counter via React context; Row children consume context to compute stagger delay' },
    { id: 'row-selected-state', description: 'Row renders data-state="selected" when selected prop is true' },
    { id: 'head-sort-indicator', description: 'Head renders an inline sort icon (arrow up/down/both) inside a headContent wrapper when sortable is true' },
    { id: 'head-keyboard-sort', description: 'Sortable Head cells respond to Enter and Space key to trigger onSort' },
    { id: 'head-aria-sort', description: 'Sortable Head renders aria-sort="ascending" or "descending" based on sorted prop' },
    { id: 'bordered-cells', description: 'When data-bordered is set on root, head and cell elements get 1px solid border' },
    { id: 'sticky-header-z', description: 'When data-sticky-header is set, header gets position:sticky, top:0, z-index:1' },
    { id: 'row-hover-animation', description: 'Row supports per-row hover animation via ListItemAnimate config; uses direct animejs calls with WeakMap tracking' },
    { id: 'caption-bottom', description: 'Caption renders with caption-side: bottom' },
  ],

  hasHook: false,
  engineImports: ['withMoveComponent', 'useMergedRef'] as string[],

  componentDeps: [] as string[],

  testing: {
    behaviors: [
      'Root renders as table element',
      'Root defaults to variant=default and size=md',
      'Root applies data-variant attribute',
      'Root applies data-size attribute',
      'Root applies data-bordered boolean attribute when bordered=true',
      'Root applies data-hoverable boolean attribute when hoverable=true',
      'Root applies data-sticky-header boolean attribute when stickyHeader=true',
      'Header renders as thead element',
      'Body renders as tbody element',
      'Footer renders as tfoot element with header background and weight',
      'Row renders as tr element',
      'Row renders data-state="selected" when selected=true',
      'Row omits data-state when not selected',
      'Head renders as th element',
      'Head renders sort icon when sortable=true',
      'Head renders aria-sort="ascending" when sorted="asc"',
      'Head renders aria-sort="descending" when sorted="desc"',
      'Head omits aria-sort when not sorted',
      'Head is focusable (tabIndex=0) when sortable',
      'Cell renders as td element',
      'Caption renders as caption element with caption-side bottom',
      'Forwards className and style on all sub-components',
      'Forwards ref on all sub-components',
      'Spreads HTML attributes on all sub-components',
    ],
    keyboard: [
      'Sortable Head triggers onSort on Enter key',
      'Sortable Head triggers onSort on Space key',
    ],
    aria: [
      'Root renders as native table element (implicit table role)',
      'Sortable Head gets role="columnheader"',
      'Sortable Head gets aria-sort based on sorted prop',
    ],
    animation: [
      'Rows animate in with staggered opacity and translateY on mount',
      'Stagger delay is computed from row index and stagger config',
      'animations={false} on Root disables all row entrance animations',
      'Row hover animation triggers on mouseenter when ListItemAnimate.hover is provided',
      'Reduced motion preference skips animations',
    ],
  },

  defaultReview: {
    status: 'approved' as const,
    decisionSource: 'user-confirmed' as const,
    overrides: {},
  },
};
