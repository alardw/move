// List.spec.ts — Component specification
// specHash: PLACEHOLDER

export const spec = {
  schemaVersion: 7 as const,
  name: 'List',
  componentClass: 'display' as const,
  category: 'data',
  description: 'Stacked list with three-zone item layout (leading/content/trailing), responsive collapse, line clamping, dividers, density control, and optional Meta shorthand',

  synonyms: ['rows', 'items', 'list view', 'menu list'],
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
      rootHoverModifier: 'hover',
    },
  },

  compound: true,
  rootElement: 'ul',
  slots: [
    { name: 'root', element: 'ul', description: 'Root container with dividers and size/density tokens' },
    { name: 'item', element: 'li', description: 'Three-zone flex row: leading / content / trailing' },
    { name: 'leading', element: 'div', description: 'Fixed-width leading slot for avatar, icon, or checkbox' },
    { name: 'content', element: 'div', description: 'Flex-1 content zone with min-width:0 for truncation' },
    { name: 'title', element: 'p', description: 'Primary text line, semibold, truncated by default' },
    { name: 'description', element: 'p', description: 'Secondary text line, muted, line-clamp controlled' },
    { name: 'trailing', element: 'div', description: 'Fixed-width trailing slot for badge, button, timestamp, menu' },
    { name: 'meta', element: 'div', description: 'Convenience sub-component rendering leading+content+title+description from props' },
    { name: 'divider', element: 'hr', description: 'Visual divider between items (CSS-driven, not rendered per-item)' },
  ],

  subComponents: [
    {
      name: 'Root',
      slots: [{ name: 'root', element: 'ul', description: 'Root list container' }],
      props: [
        { name: 'size', typeRef: 'Size', default: "'md'", moveSpecific: true, description: 'Controls padding, font size, gap, and avatar sizing rhythm' },
        { name: 'dividers', type: 'boolean', default: 'true', moveSpecific: true, description: 'Show dividers between items' },
        { name: 'density', type: "'compact' | 'default' | 'comfortable'", default: "'default'", moveSpecific: true, description: 'Vertical padding scale for items' },
        { name: 'hover', type: 'boolean', default: 'false', moveSpecific: true, description: 'Enable hover highlight on items' },
        { name: 'radius', type: "'none' | 'sm' | 'md' | 'lg'", default: "'sm'", moveSpecific: true, description: 'Border radius applied to the list container and item hover/active highlights' },
        { name: 'separator', type: 'React.ReactNode', moveSpecific: true, description: 'Custom separator rendered between items (replaces the default divider).' },
        { name: 'animateKey', type: 'string | number', moveSpecific: true, description: 'Key that, when changed, replays the staggered entrance animation. Useful when the items array is replaced.' },
        { name: 'animations', type: 'AnimationTrigger[] | false', moveSpecific: true, description: 'Staggered entrance animation config or false to disable' },
        { name: 'children', type: 'React.ReactNode', moveSpecific: false, description: 'List.Item children' },
      ],
      usesFactory: true,
      description: 'Root list container providing context for size, density, hover, separator, and stagger animation',
    },
    {
      name: 'Item',
      slots: [{ name: 'item', element: 'li', description: 'Item row wrapper' }],
      props: [
        { name: 'as', type: "'li' | 'a' | 'button'", default: "'li'", moveSpecific: true, description: 'Rendered element — use a/button for interactive rows' },
        { name: 'href', type: 'string', moveSpecific: false, description: 'Link target — implies as="a"' },
        { name: 'onClick', type: '() => void', moveSpecific: false, description: 'Click handler.' },
        { name: 'interactive', type: 'boolean', moveSpecific: true, description: 'Make the row a click target. Adds cursor, hover tint, focus ring, and Enter/Space activation. Defaults to true when `href`, `onClick`, or `as="a"|"button"` is set.' },
        { name: 'active', type: 'boolean', default: 'false', moveSpecific: true, description: 'Visual active/selected state' },
        { name: 'disabled', type: 'boolean', default: 'false', moveSpecific: true, description: 'Dims item and prevents interaction' },
        { name: 'children', type: 'React.ReactNode', moveSpecific: false, description: 'Leading, Content, Trailing, or Meta children' },
      ],
      usesFactory: true,
      description: 'Polymorphic list row with three-zone flex layout. Renders as li, a, or button based on as/href props.',
    },
    {
      name: 'Leading',
      slots: [{ name: 'leading', element: 'div', description: 'Leading visual slot' }],
      props: [
        { name: 'children', type: 'React.ReactNode', moveSpecific: false, description: 'Avatar, icon, checkbox, or other leading visual' },
      ],
      usesFactory: true,
      description: 'Fixed-width leading slot, flex-shrink-0, vertically centered with content',
    },
    {
      name: 'Content',
      slots: [{ name: 'content', element: 'div', description: 'Content zone' }],
      props: [
        { name: 'children', type: 'React.ReactNode', moveSpecific: false, description: 'Title, Description, and any additional content' },
      ],
      usesFactory: true,
      description: 'Flex-1 content zone with min-width:0 ensuring text truncation works correctly',
    },
    {
      name: 'Title',
      slots: [{ name: 'title', element: 'p', description: 'Primary text' }],
      props: [
        { name: 'children', type: 'React.ReactNode', moveSpecific: false, description: 'Primary text content' },
      ],
      usesFactory: true,
      description: 'Primary text line — semibold, single-line truncation by default',
    },
    {
      name: 'Description',
      slots: [{ name: 'description', element: 'p', description: 'Secondary text' }],
      props: [
        { name: 'lines', type: "1 | 2 | 3 | 'none'", default: "'none'", moveSpecific: true, description: 'Number of visible lines before truncation (line-clamp). Defaults to none — opt into truncation explicitly.' },
        { name: 'children', type: 'React.ReactNode', moveSpecific: false, description: 'Secondary text content' },
      ],
      usesFactory: true,
      description: 'Secondary text line — muted color, configurable line clamp for truncation',
    },
    {
      name: 'Trailing',
      slots: [{ name: 'trailing', element: 'div', description: 'Trailing content slot' }],
      props: [
        { name: 'children', type: 'React.ReactNode', moveSpecific: false, description: 'Badge, button, timestamp, menu, or other trailing content' },
      ],
      usesFactory: true,
      description: 'Fixed-width trailing slot, flex-shrink-0, vertically centered',
    },
    // List.Meta was removed — consumers compose Leading/Content/Title/
    // Description explicitly. See git log: "refactor: remove List.Meta".
  ],

  props: [
    { name: 'size', typeRef: 'Size', default: "'md'", moveSpecific: true, description: 'Controls padding, font size, gap' },
    { name: 'dividers', type: 'boolean', default: 'true', moveSpecific: true, description: 'Show dividers between items' },
    { name: 'density', type: "'compact' | 'default' | 'comfortable'", default: "'default'", moveSpecific: true, description: 'Vertical padding scale' },
    { name: 'hover', type: 'boolean', default: 'false', moveSpecific: true, description: 'Enable hover highlight on items' },
    { name: 'animations', type: 'AnimationTrigger[] | false', moveSpecific: true, description: 'Staggered entrance animation config or false to disable' },
    { name: 'children', type: 'React.ReactNode', moveSpecific: false, description: 'List.Item children' },
  ],

  anatomy: {
    slot: 'root',
    dataAttributes: ['data-size', 'data-density', 'data-dividers', 'data-hover'],
    children: [
      {
        slot: 'item',
        dataAttributes: ['data-active', 'data-disabled', 'data-interactive'],
        children: [
          { slot: 'leading' },
          {
            slot: 'content',
            children: [
              { slot: 'title' },
              { slot: 'description', dataAttributes: ['data-lines'] },
            ],
          },
          { slot: 'trailing' },
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
    { trigger: 'Root.enter', sequence: [{ children: ':scope > *', animation: { opacity: { from: 0, to: 1 }, translateY: { from: 8, to: 0, ease: 'outQuart', duration: 200 } }, stagger: { delay: 60 } }] },
  ],

  tokens: [
    { name: '--move-list-gap', value: 'var(--move-spacing-md)', description: 'Horizontal gap between leading/content/trailing zones' },
    { name: '--move-list-padding-x', value: 'var(--move-spacing-md)', description: 'Horizontal padding on items' },
    { name: '--move-list-padding-y', value: 'var(--move-spacing-md)', description: 'Vertical padding on items (scaled by density)' },
    { name: '--move-list-divider-color', value: 'var(--move-border-subtle)', description: 'Divider line color between items' },
    { name: '--move-list-hover-bg', value: 'var(--move-bg-subtle)', description: 'Background color on item hover (when hover enabled)' },
    { name: '--move-list-active-bg', value: 'var(--move-bg-muted)', description: 'Background color for active/selected items' },
    { name: '--move-list-title-size', value: 'var(--move-size-base)', description: 'Title font size' },
    { name: '--move-list-title-weight', value: 'var(--move-weight-medium)', description: 'Title font weight' },
    { name: '--move-list-title-color', value: 'var(--move-fg-base)', description: 'Title text color' },
    { name: '--move-list-description-size', value: 'var(--move-size-sm)', description: 'Description font size' },
    { name: '--move-list-description-color', value: 'var(--move-fg-muted)', description: 'Description text color' },
    { name: '--move-list-disabled-opacity', value: '0.5', description: 'Opacity for disabled items' },
    { name: '--move-list-radius', value: 'var(--move-radius-sm)', description: 'Border radius for hover/active highlight' },
  ],

  variants: {
    density: ['compact', 'default', 'comfortable'] as string[],
  },
  sizes: ['sm', 'md', 'lg'] as string[],

  labels: [],
  childrenKind: 'composition' as const,

  renderContracts: [
    { id: 'three-zone-layout', description: 'Item uses flex row with leading (flex-shrink-0), content (flex-1, min-width-0), and trailing (flex-shrink-0) zones ensuring correct truncation' },
    { id: 'content-truncation', description: 'Content zone has min-width:0 so Title/Description text-overflow:ellipsis works within flex layout' },
    { id: 'title-truncation', description: 'Title renders with single-line truncation (text-overflow: ellipsis, white-space: nowrap, overflow: hidden) by default' },
    { id: 'description-line-clamp', description: 'Description supports line clamping via data-lines attribute: 1/2/3 use -webkit-line-clamp, none disables truncation' },
    { id: 'polymorphic-item', description: 'Item renders as li by default, as a when href is provided, as button when as="button". Sets data-interactive when clickable.' },
    { id: 'dividers-between-items', description: 'Dividers rendered between items (not around) via CSS border-bottom on items except :last-child, controlled by data-dividers on root' },
    { id: 'density-padding-scale', description: 'Density compact/default/comfortable scales --move-list-padding-y: compact=spacing-xs, default=spacing-md, comfortable=spacing-lg' },
    { id: 'size-token-scale', description: 'Size sm/md/lg scales gap, padding, font sizes, and title weight proportionally' },
    { id: 'hover-highlight', description: 'When data-hover on root, items show background transition on hover via --move-list-hover-bg' },
    { id: 'active-highlight', description: 'Items with data-active show persistent background highlight via --move-list-active-bg' },
    { id: 'disabled-state', description: 'Items with data-disabled get reduced opacity and pointer-events: none' },
    { id: 'responsive-trailing-collapse', description: 'Item uses container query — when item width is below threshold, trailing zone wraps below content zone' },
    { id: 'meta-auto-layout', description: 'Meta renders Leading (if avatar provided) + Content > Title + Description from its props, forwarding lines to Description' },
    { id: 'context-propagation', description: 'Root provides size, density, hover context to Items for consistent styling' },
    { id: 'semantic-list', description: 'Root renders as ul, Items as li (or a/button). Screen readers see a proper list structure.' },
  ],

  hasHook: false,
  engineImports: ['withMoveComponent', 'useMergedRef'] as string[],

  componentDeps: [] as string[],

  testing: {
    behaviors: [
      'Root renders as ul with list role',
      'Root defaults to size=md, dividers=true, density=default, hover=false',
      'Root applies data-size, data-density, data-dividers, data-hover attributes',
      'Item renders as li by default',
      'Item renders as anchor when href is provided',
      'Item renders as button when as="button"',
      'Item sets data-interactive when href or onClick is present',
      'Item applies data-active when active=true',
      'Item applies data-disabled when disabled=true and sets pointer-events none',
      'Leading renders children in flex-shrink-0 container',
      'Content renders children in flex-1 min-width-0 container',
      'Title renders with truncation (text-overflow ellipsis)',
      'Description defaults to lines=none (no truncation; opt into 1/2/3 explicitly)',
      'Description lines=2 applies -webkit-line-clamp: 2',
      'Description lines=3 applies -webkit-line-clamp: 3',
      'Description lines=none shows full text without truncation',
      'Trailing renders children in flex-shrink-0 container',
      'Dividers appear between items when dividers=true',
      'Dividers hidden when dividers=false',
      'Meta renders avatar in Leading slot when provided',
      'Meta renders title as Title',
      'Meta renders description as Description',
      'Meta forwards lines prop to Description',
      'Meta omits Leading when avatar is not provided',
      'Size sm reduces padding, gap, and font sizes',
      'Size lg increases padding, gap, and font sizes',
      'Density compact reduces vertical padding',
      'Density comfortable increases vertical padding',
      'Hover enabled shows background on item hover',
      'Forwards className and style on all sub-components',
      'Forwards ref on Root and Item',
    ],
    animation: [
      'Items animate in with staggered opacity and translateY on mount',
      'Stagger delay of 60ms per item',
      'animations={false} on Root disables entrance animations',
      'Reduced motion sets opacity to 1 and clears transform immediately',
    ],
  },

  defaultReview: {
    status: 'approved' as const,
    decisionSource: 'user-confirmed' as const,
    overrides: {},
  },
};
