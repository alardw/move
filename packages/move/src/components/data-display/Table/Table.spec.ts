// Table.spec.ts — Component specification
// specHash: PLACEHOLDER

import type { ComponentSpec } from '../../../spec-type';

export const spec = {
  schemaVersion: 7 as const,
  name: 'Table',
  componentClass: 'display' as const,
  category: 'data-display',
  description:
    'Compound tabular data primitive. Variants for the frame (surface / lines / bordered), a striped modifier, a responsive mode (scroll default, stack below breakpoint), and a Group/GroupHeader compound for collapsible row groups.',

  synonyms: ['grid', 'data table', 'rows columns', 'data grid', 'datagrid', 'datatable', 'spreadsheet'],
  animationPatterns: ['listReveal'],
  families: {
    behavior:  ["data-row"],
    state:     ["stateless"],
    animation: ["stagger"],
    a11y:      ["none"],
  },
  // Shared click-affordance contract for the data-row family.
  // See `src/shared/families.ts` → DataRowBehavior.
  behavior: {
    dataRow: {
      interactiveProp: true,
      keyboardActivate: true,
      hoverAffordance: true,
      rootHoverModifier: 'hoverable',
    },
  },

  compound: true,
  rootElement: 'table',
  slots: [
    { name: 'root', element: 'table', description: 'Root table element with component tokens; wrapped by a scroll container div.' },
    { name: 'header', element: 'thead', description: 'Table header section. Children are used as the label source for stack-mode cells.' },
    { name: 'body', element: 'tbody', description: 'Table body section. Provides BodyContext so rows inject data-label per cell.' },
    { name: 'footer', element: 'tfoot', description: 'Table footer section.' },
    { name: 'row', element: 'tr', description: 'Table row with optional selected state and hover animation.' },
    { name: 'head', element: 'th', description: 'Header cell with optional sort indicator.' },
    { name: 'cell', element: 'td', description: 'Standard data cell. Receives data-label in stack mode.' },
    { name: 'caption', element: 'caption', description: 'Table caption rendered at bottom.' },
    { name: 'group', element: 'tbody', description: 'Collapsible row group; one tbody per group, data-open toggles visibility.' },
    { name: 'groupHeader', element: 'tr', description: 'Clickable row that toggles the enclosing group. role="button", aria-expanded.' },
  ],

  subComponents: [
    {
      name: 'Root',
      slots: [{ name: 'root', element: 'table', description: 'Root table element wrapped by a scroll container div.' }],
      props: [
        { name: 'variant', type: "'surface' | 'lines' | 'bordered' | 'ghost'", default: "'lines'", moveSpecific: true, description: 'Visual frame: borderless with horizontal rules (lines, default), card-like (surface), full grid (bordered), or no chrome at all (ghost — use with `striped` for zebra-only).' },
        { name: 'size', typeRef: 'Size', default: "'md'", moveSpecific: true, description: 'Cell padding and font size.' },
        { name: 'striped', type: 'boolean', moveSpecific: true, description: 'Zebra-stripe even rows in the body. Composes with any variant.' },
        { name: 'hoverable', type: 'boolean', moveSpecific: true, description: 'Tint rows on hover.' },
        { name: 'stickyHeader', type: 'boolean', moveSpecific: true, description: 'Stick the header to the top while the body scrolls.' },
        { name: 'responsive', type: "'scroll' | 'stack' | 'none'", default: "'scroll'", moveSpecific: true, description: 'Responsive strategy: overflow-x scroll (default), flip to stacked cards below stackBelow, or none.' },
        { name: 'stackBelow', type: 'number', default: '640', moveSpecific: true, description: 'Container-width breakpoint in pixels below which stack mode activates. Only used when responsive="stack".' },
        { name: 'animations', type: 'AnimationTrigger[] | false', moveSpecific: true, description: 'Staggered row entrance animation config or false to disable.' },
        { name: 'children', type: 'React.ReactNode', moveSpecific: false, description: 'Table sections (Header, Body, Footer, Group).' },
      ],
      usesFactory: true,
      description: 'Root table element wrapped by a scroll container. Provides context for row animations and column label inference used by stack mode.',
    },
    {
      name: 'Header',
      slots: [{ name: 'header', element: 'thead', description: 'Table header section.' }],
      props: [
        { name: 'children', type: 'React.ReactNode', moveSpecific: false, description: 'Header rows. Text inside Head cells is used as labels for stack mode.' },
      ],
      usesFactory: true,
      description: 'Table header. On mount, extracts text from its Head children and registers the labels with Table context so body rows can render them in stack mode.',
    },
    {
      name: 'Body',
      slots: [{ name: 'body', element: 'tbody', description: 'Table body section.' }],
      props: [
        { name: 'children', type: 'React.ReactNode', moveSpecific: false, description: 'Body rows.' },
      ],
      usesFactory: true,
      description: 'Table body. Provides BodyContext so its descendant rows inject data-label onto each cell (for stack mode).',
    },
    {
      name: 'Footer',
      slots: [{ name: 'footer', element: 'tfoot', description: 'Table footer section.' }],
      props: [
        { name: 'children', type: 'React.ReactNode', moveSpecific: false, description: 'Footer rows.' },
      ],
      usesFactory: true,
      description: 'Table footer (tfoot) with a muted background and top border.',
    },
    {
      name: 'Row',
      slots: [{ name: 'row', element: 'tr', description: 'Table row.' }],
      props: [
        { name: 'selected', type: 'boolean', moveSpecific: true, description: 'Mark row as selected.' },
        { name: 'interactive', type: 'boolean', moveSpecific: true, description: 'Make the row a click target. Adds cursor, hover tint, focus ring, and Enter/Space activation.' },
        { name: 'onClick', type: '(event: React.MouseEvent<HTMLTableRowElement>) => void', moveSpecific: false, description: 'Row click handler.' },
        { name: 'animations', type: 'AnimationTrigger[] | false', moveSpecific: true, description: 'Row-level hover animation config or false to disable.' },
        { name: 'children', type: 'React.ReactNode', moveSpecific: false, description: 'Row cells.' },
      ],
      usesFactory: true,
      description: 'Table row. Body-scoped rows clone their children with data-label so stack mode can render key/value pairs.',
    },
    {
      name: 'Head',
      slots: [{ name: 'head', element: 'th', description: 'Header cell.' }],
      props: [
        { name: 'sortable', type: 'boolean', moveSpecific: true, description: 'Enable sort interaction on this column.' },
        { name: 'sorted', type: "'asc' | 'desc' | false", moveSpecific: true, description: 'Current sort direction or false.' },
        { name: 'onSort', type: '() => void', moveSpecific: true, description: 'Callback when sort is triggered.' },
        { name: 'align', type: "'start' | 'center' | 'end'", moveSpecific: true, description: 'Column alignment for the header label.' },
        { name: 'children', type: 'React.ReactNode', moveSpecific: false, description: 'Header cell content.' },
      ],
      usesFactory: true,
      description: 'Header cell with optional sortable behavior, keyboard interaction, sort indicator, and alignment.',
    },
    {
      name: 'Cell',
      slots: [{ name: 'cell', element: 'td', description: 'Data cell.' }],
      props: [
        { name: 'align', type: "'start' | 'center' | 'end'", moveSpecific: true, description: 'Cell alignment.' },
        { name: 'description', type: 'React.ReactNode', moveSpecific: true, description: 'When set, the cell renders its children as a bold primary line with this muted description below.' },
        { name: 'children', type: 'React.ReactNode', moveSpecific: false, description: 'Cell content.' },
      ],
      usesFactory: true,
      description: 'Standard data cell. Supports alignment and an optional two-line "primary / description" layout. Rendered as key/value pair via CSS ::before + data-label when the table is in stack mode.',
    },
    {
      name: 'Caption',
      slots: [{ name: 'caption', element: 'caption', description: 'Table caption.' }],
      props: [
        { name: 'children', type: 'React.ReactNode', moveSpecific: false, description: 'Caption text.' },
      ],
      usesFactory: true,
      description: 'Table caption rendered at bottom of table.',
    },
    {
      name: 'Group',
      slots: [{ name: 'group', element: 'tbody', description: 'Collapsible row group (tbody).' }],
      props: [
        { name: 'collapsible', type: 'boolean', default: 'true', moveSpecific: true, description: 'When false, the group renders as a static section — header has no chevron and is not clickable.' },
        { name: 'open', type: 'boolean', moveSpecific: true, description: 'Controlled open state.' },
        { name: 'defaultOpen', type: 'boolean', default: 'true', moveSpecific: true, description: 'Initial open state when uncontrolled.' },
        { name: 'onOpenChange', type: '(open: boolean) => void', moveSpecific: true, description: 'Fires when the open state changes.' },
        { name: 'children', type: 'React.ReactNode', moveSpecific: false, description: 'GroupHeader followed by Rows.' },
      ],
      usesFactory: true,
      description: 'Collapsible row group rendered as its own <tbody>. Non-header rows hide via CSS when the group is closed.',
    },
    {
      name: 'GroupHeader',
      slots: [{ name: 'groupHeader', element: 'tr', description: 'Group header row (clickable).' }],
      props: [
        { name: 'colSpan', type: 'number', moveSpecific: false, description: 'Number of columns the header spans. Inferred from Table.Header column count by default.' },
        { name: 'children', type: 'React.ReactNode', moveSpecific: false, description: 'Group label.' },
      ],
      usesFactory: true,
      description: 'Clickable row that toggles its Group. role="button", aria-expanded bound to group open state.',
    },
  ],

  props: [
    { name: 'variant', type: "'surface' | 'lines' | 'bordered' | 'ghost'", default: "'lines'", moveSpecific: true, description: 'Visual frame variant.' },
    { name: 'size', typeRef: 'Size', default: "'md'", moveSpecific: true, description: 'Cell padding and font size.' },
    { name: 'striped', type: 'boolean', moveSpecific: true, description: 'Zebra-stripe body rows.' },
    { name: 'hoverable', type: 'boolean', moveSpecific: true, description: 'Tint rows on hover.' },
    { name: 'stickyHeader', type: 'boolean', moveSpecific: true, description: 'Stick the header on scroll.' },
    { name: 'responsive', type: "'scroll' | 'stack' | 'none'", default: "'scroll'", moveSpecific: true, description: 'Responsive strategy.' },
    { name: 'stackBelow', type: 'number', default: '640', moveSpecific: true, description: 'Stack-mode container breakpoint in px.' },
    { name: 'animations', type: 'AnimationTrigger[] | false', moveSpecific: true, description: 'Row entrance animation config or false.' },
    { name: 'children', type: 'React.ReactNode', moveSpecific: false, description: 'Table sections.' },
  ],

  anatomy: {
    slot: 'root',
    dataAttributes: ['data-variant', 'data-size', 'data-striped', 'data-hoverable', 'data-sticky-header', 'data-stack'],
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
              { slot: 'cell', dataAttributes: ['data-label'] },
            ],
          },
        ],
      },
      {
        slot: 'group',
        dataAttributes: ['data-open'],
        children: [
          { slot: 'groupHeader', ariaAttributes: ['aria-expanded'] },
          {
            slot: 'row',
            children: [{ slot: 'cell', dataAttributes: ['data-label'] }],
          },
        ],
      },
      {
        slot: 'footer',
        children: [
          { slot: 'row', children: [{ slot: 'cell' }] },
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
    { name: '--move-table-bg', value: 'var(--move-bg-base)', description: 'Table background color.' },
    { name: '--move-table-border', value: 'var(--move-border-base)', description: 'Outer frame color used by the surface and bordered variants.' },
    { name: '--move-table-radius', value: 'var(--move-rounded-lg)', description: 'Outer border radius (surface and bordered variants).' },
    { name: '--move-table-header-bg', value: 'transparent', description: 'Background behind the header row cells.' },
    { name: '--move-table-header-fg', value: 'var(--move-fg-base)', description: 'Header text color.' },
    { name: '--move-table-header-weight', value: 'var(--move-weight-semibold)', description: 'Header font weight.' },
    { name: '--move-table-header-border', value: 'var(--move-border-base)', description: 'Color of the rule that sits under every header cell and separates the header from the body.' },
    { name: '--move-table-header-border-width', value: '1px', description: 'Thickness of the rule under the header row.' },
    { name: '--move-table-cell-padding-x', value: 'var(--move-spacing-md)', description: 'Horizontal cell padding.' },
    { name: '--move-table-cell-padding-y', value: 'var(--move-spacing-sm)', description: 'Vertical cell padding.' },
    { name: '--move-table-cell-fg', value: 'var(--move-fg-base)', description: 'Cell text color.' },
    { name: '--move-table-cell-border', value: 'color-mix(in oklch, var(--move-fg-base) 10%, transparent)', description: 'Color of the inter-row hairline that runs under each body cell.' },
    { name: '--move-table-row-hover-bg', value: 'color-mix(in oklch, var(--move-fg-base) 4%, transparent)', description: 'Background applied when a body row is hovered — used by the `hoverable` prop on Root and by rows with `interactive` set.' },
    { name: '--move-table-row-selected-bg', value: 'var(--move-selected-bg)', description: 'Background for a row rendered with `selected` set (driven by useTableSelection or consumer state).' },
    { name: '--move-table-stripe-bg', value: 'color-mix(in oklch, var(--move-fg-base) 3%, transparent)', description: 'Background for odd body rows when the `striped` modifier is set — zebra starts on row 1 so the first body row is tinted.' },
    { name: '--move-table-caption-fg', value: 'var(--move-fg-muted)', description: 'Caption text color.' },
    { name: '--move-table-caption-size', value: 'var(--move-size-sm)', description: 'Caption font size.' },
    { name: '--move-table-group-header-bg', value: 'color-mix(in oklch, var(--move-fg-base) 5%, transparent)', description: 'Background for the Group header row (static or collapsible).' },
    { name: '--move-table-group-header-hover-bg', value: 'color-mix(in oklch, var(--move-fg-base) 8%, transparent)', description: 'Hover background for a collapsible Group header row — matches the stronger interactive feedback when the header is clickable.' },
  ],

  variants: {
    variant: ['surface', 'lines', 'bordered', 'ghost'] as string[],
    responsive: ['scroll', 'stack', 'none'] as string[],
  },
  sizes: ['sm', 'md', 'lg'] as string[],

  labels: [],
  childrenKind: 'composition' as const,

  renderContracts: [
    { id: 'scroll-wrapper', description: 'Root always renders a wrapping div with container-type: inline-size so stack-mode observes container width.' },
    { id: 'stack-breakpoint', description: 'When responsive="stack", a ResizeObserver on the wrapper toggles data-stack on the root table when its width drops below stackBelow (default 640px).' },
    { id: 'header-label-inference', description: 'Table.Header collects text from its Head children in a useEffect and registers the labels with TableContext. Body rows clone each cell with data-label={labels[idx]}.' },
    { id: 'body-row-scope', description: 'TableBodyContext is true inside Body and Group; only in-body rows inject data-label (header/footer rows do not).' },
    { id: 'row-selected-state', description: 'Row renders data-state="selected" when selected prop is true.' },
    { id: 'head-sort-indicator', description: 'Head renders an inline sort icon (↑ / ↓ / ↕) inside headContent when sortable.' },
    { id: 'head-keyboard-sort', description: 'Sortable Head triggers onSort on Enter and Space.' },
    { id: 'head-aria-sort', description: 'Sortable Head renders aria-sort based on sorted prop.' },
    { id: 'sticky-header-z', description: 'data-sticky-header sets header to position:sticky, top:0, z-index:1, with bg from table bg token.' },
    { id: 'group-open-state', description: 'Group renders data-open="true"/"false"; CSS hides non-groupHeader rows inside a closed group.' },
    { id: 'group-keyboard', description: 'GroupHeader is role="button", tabIndex=0, responds to Enter/Space to toggle. Updates aria-expanded on the row.' },
    { id: 'group-colspan', description: 'GroupHeader infers colSpan from the registered header labels length; override via colSpan prop.' },
    { id: 'row-hover-animation', description: 'Row supports per-row hover animations via animations prop; event handlers delegate to useAnimations.' },
    { id: 'caption-bottom', description: 'Caption renders with caption-side: bottom.' },
    { id: 'stack-row-layout', description: 'In stack mode rows render as flex columns of labeled cells; ::before pulls attr(data-label) for the key side.' },
  ],

  hasHook: true,
  engineImports: ['withMoveComponent', 'useMergedRef', 'useControlledState'] as string[],

  componentDeps: [] as string[],

  testing: {
    behaviors: [
      'Root renders a wrapping div with scroll behavior and the table inside.',
      'Root defaults to variant=surface and size=md.',
      'Root applies data-variant, data-size, data-striped, data-hoverable, data-sticky-header.',
      'Root sets data-stack on the table when responsive="stack" and the wrapper is narrower than stackBelow.',
      'Header renders as thead; on mount registers an array of labels extracted from its Head children.',
      'Body rows clone their cells with data-label={labels[idx]}.',
      'Header and footer rows do not get data-label injected.',
      'Footer renders as tfoot with muted background and top border.',
      'Row renders data-state="selected" when selected=true.',
      'Head is focusable (tabIndex=0) when sortable.',
      'Head renders aria-sort based on sorted prop.',
      'Group renders as tbody with data-open bound to internal/controlled state.',
      'GroupHeader is role="button" and toggles the parent Group on click / Enter / Space.',
      'GroupHeader renders a td that spans the inferred column count.',
      'Forwards className, style, and ref on every sub-component.',
    ],
    keyboard: [
      'Sortable Head triggers onSort on Enter and Space.',
      'GroupHeader toggles its Group on Enter and Space.',
    ],
    aria: [
      'Root renders as native table (implicit role).',
      'Sortable Head gets role="columnheader" and aria-sort.',
      'GroupHeader is role="button" with aria-expanded bound to group open state.',
    ],
    animation: [
      'Rows animate in with staggered opacity and translateY on mount.',
      'animations={false} on Root disables row entrance.',
      'Reduced motion preference skips animations.',
    ],
  },

  defaultReview: {
    status: 'approved' as const,
    decisionSource: 'user-confirmed' as const,
    overrides: {},
  },
} satisfies ComponentSpec;
