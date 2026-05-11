// Timeline.spec.ts — Component specification
// specHash: PLACEHOLDER

export const spec = {
  schemaVersion: 7 as const,
  name: 'Timeline',
  componentClass: 'display' as const,
  category: 'data',
  description: 'Vertical timeline with progress tracking, custom bullets, color-coded states, alternate alignment, and staggered entrance animation',

  synonyms: ['log', 'history', 'feed', 'activity feed'],
  families: {
    behavior:  ["data-row"],
    state:     ["stateless"],
    animation: ["stagger"],
    a11y:      ["none"],
  },

  compound: true,
  rootElement: 'div',
  slots: [
    { name: 'root', element: 'div', description: 'Root container with flex column layout and component tokens' },
    { name: 'item', element: 'div', description: 'Individual timeline item containing separator and content' },
    { name: 'bullet', element: 'div', description: 'Circular indicator for each timeline item, optionally holding custom content' },
    { name: 'line', element: 'div', description: 'Vertical connector line between timeline items' },
    { name: 'content', element: 'div', description: 'Content area for each timeline item' },
    { name: 'title', element: 'div', description: 'Optional title text above item content' },
  ],

  subComponents: [
    {
      name: 'Root',
      slots: [{ name: 'root', element: 'div', description: 'Root timeline container' }],
      props: [
        { name: 'active', type: 'number', default: '-1', moveSpecific: true, description: 'Index of the active step (-1 for all inactive)' },
        { name: 'align', type: "'left' | 'right' | 'alternate'", default: "'left'", moveSpecific: true, description: 'Content alignment relative to the timeline line' },
        { name: 'size', typeRef: 'Size', default: "'md'", moveSpecific: true, description: 'Timeline size affecting bullet, line width, and spacing' },
        { name: 'color', typeRef: 'Color', default: "'indigo'", moveSpecific: true, description: 'Default color for active/completed items' },
        { name: 'lineVariant', type: "'solid' | 'dashed' | 'dotted'", default: "'solid'", moveSpecific: true, description: 'Line style for connectors' },
        { name: 'reverseActive', type: 'boolean', default: 'false', moveSpecific: true, description: 'Reverse active direction (items after active index are completed)' },
        { name: 'animations', type: 'AnimationTrigger[] | false', moveSpecific: true, description: 'Staggered entrance animation config or false to disable' },
        { name: 'children', type: 'React.ReactNode', moveSpecific: false, description: 'Timeline.Item children' },
      ],
      usesFactory: true,
      description: 'Root timeline container that provides context for alignment, size, color, active state, and stagger animation',
    },
    {
      name: 'Item',
      slots: [
        { name: 'item', element: 'div', description: 'Item wrapper' },
        { name: 'bullet', element: 'div', description: 'Bullet indicator' },
        { name: 'line', element: 'div', description: 'Connector line' },
        { name: 'content', element: 'div', description: 'Content area' },
        { name: 'title', element: 'div', description: 'Title text' },
      ],
      props: [
        { name: 'bullet', type: 'React.ReactNode', moveSpecific: true, description: 'Custom bullet content (icon, avatar, etc.)' },
        { name: 'title', type: 'React.ReactNode', moveSpecific: true, description: 'Item title text' },
        { name: 'lineVariant', type: "'solid' | 'dashed' | 'dotted'", moveSpecific: true, description: 'Override line variant for this item' },
        { name: 'color', typeRef: 'Color', moveSpecific: true, description: 'Override color for this item' },
        { name: 'children', type: 'React.ReactNode', moveSpecific: false, description: 'Item body content' },
      ],
      usesFactory: true,
      description: 'Individual timeline entry with bullet, connecting line, title, and content. Derives state (completed/active/inactive) from context.',
    },
  ],

  props: [
    { name: 'active', type: 'number', default: '-1', moveSpecific: true, description: 'Index of the active step' },
    { name: 'align', type: "'left' | 'right' | 'alternate'", default: "'left'", moveSpecific: true, description: 'Content alignment' },
    { name: 'size', typeRef: 'Size', default: "'md'", moveSpecific: true, description: 'Timeline size' },
    { name: 'color', typeRef: 'Color', default: "'indigo'", moveSpecific: true, description: 'Default color for active/completed items' },
    { name: 'lineVariant', type: "'solid' | 'dashed' | 'dotted'", default: "'solid'", moveSpecific: true, description: 'Line style for connectors' },
    { name: 'reverseActive', type: 'boolean', default: 'false', moveSpecific: true, description: 'Reverse active direction' },
    { name: 'animations', type: 'AnimationTrigger[] | false', moveSpecific: true, description: 'Staggered entrance animation config or false to disable' },
    { name: 'children', type: 'React.ReactNode', moveSpecific: false, description: 'Timeline.Item children' },
  ],

  anatomy: {
    slot: 'root',
    dataAttributes: ['data-align', 'data-size'],
    children: [
      {
        slot: 'item',
        dataAttributes: ['data-state', 'data-color', 'data-line-variant', 'data-content-side'],
        children: [
          {
            slot: 'bullet',
            dataAttributes: ['data-has-content'],
          },
          { slot: 'line' },
          {
            slot: 'content',
            children: [
              { slot: 'title' },
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
    { trigger: 'Root.enter', sequence: [{ children: ':scope > *', animation: { opacity: { from: 0, to: 1 }, y: { from: 8, to: 0, ease: 'poppy' } }, stagger: { delay: 50 } }] },
  ],

  tokens: [
    { name: '--move-timeline-bullet-size', value: '10px', description: 'Bullet diameter (no content)' },
    { name: '--move-timeline-bullet-content-size', value: '24px', description: 'Bullet diameter when containing custom content' },
    { name: '--move-timeline-line-width', value: '2px', description: 'Connector line width' },
    { name: '--move-timeline-gap', value: 'var(--move-spacing-md)', description: 'Gap between bullet/line column and content' },
    { name: '--move-timeline-item-spacing', value: 'var(--move-spacing-lg)', description: 'Vertical spacing between items' },
    { name: '--move-timeline-bullet-bg', value: 'var(--move-bg-base)', description: 'Bullet background (inactive)' },
    { name: '--move-timeline-bullet-border', value: 'var(--move-border-emphasis)', description: 'Bullet border color (inactive)' },
    { name: '--move-timeline-line-color', value: 'var(--move-border-base)', description: 'Connector line color (inactive)' },
    { name: '--move-timeline-active-color', value: 'var(--move-primary)', description: 'Color for active/completed bullet and line' },
    { name: '--move-timeline-title-size', value: 'var(--move-size-base)', description: 'Title font size' },
  ],

  variants: {
    color: ['primary', 'gray', 'success', 'warning', 'danger'] as string[],
    lineVariant: ['solid', 'dashed', 'dotted'] as string[],
    align: ['left', 'right', 'alternate'] as string[],
  },
  sizes: ['sm', 'md', 'lg'] as string[],

  labels: [],
  childrenKind: 'composition' as const,

  renderContracts: [
    { id: 'context-stagger', description: 'Root provides stagger animation config and item index counter via React context; Item children consume context to compute stagger delay' },
    { id: 'item-state-derivation', description: 'Item state (completed/active/inactive) is derived from the active index and reverseActive flag in context' },
    { id: 'item-color-override', description: 'Item can override the root-level color via its own color prop' },
    { id: 'item-line-variant-override', description: 'Item can override the root-level lineVariant via its own lineVariant prop' },
    { id: 'alternate-content-side', description: 'In alternate alignment mode, even items show content on right and odd items on left via data-content-side attribute' },
    { id: 'separator-structural', description: 'Bullet and line are wrapped in a structural separator div (not a named slot) for layout purposes' },
    { id: 'bullet-custom-content', description: 'Bullet renders data-has-content when custom bullet content is provided, which increases bullet size' },
    { id: 'last-item-no-line', description: 'The last item hides its connector line via CSS :last-child' },
    { id: 'completed-line-color', description: 'Completed items use the active color for their connector line, including dashed/dotted variants' },
    { id: 'active-bullet-glow', description: 'Active item bullet gets a box-shadow glow ring using the active color at 20% opacity' },
  ],

  hasHook: false,
  engineImports: ['withMoveComponent', 'useMergedRef'] as string[],

  componentDeps: [] as string[],

  testing: {
    behaviors: [
      'Root renders as div with flex column layout',
      'Root defaults to active=-1, align=left, size=md, color=primary, lineVariant=solid',
      'Root applies data-align and data-size attributes',
      'Item derives state=completed when index < active',
      'Item derives state=active when index === active',
      'Item derives state=inactive when index > active',
      'Item respects reverseActive flag to reverse state derivation',
      'Item renders data-state, data-color, data-line-variant attributes',
      'Item renders custom bullet content via bullet prop',
      'Item renders data-has-content on bullet when custom content is present',
      'Item renders title via title prop when provided',
      'Item inherits color from Root context',
      'Item can override color with its own color prop',
      'Item inherits lineVariant from Root context',
      'Item can override lineVariant with its own lineVariant prop',
      'Last item hides connector line',
      'Alternate align renders items with alternating content-side',
      'Right align reverses item flex direction',
      'Forwards className and style on Root and Item',
      'Forwards ref on Root and Item',
    ],
    animation: [
      'Items animate in with staggered opacity, translateY, and scale on mount',
      'Stagger delay of 80ms per item index',
      'animations={false} on Root disables all item entrance animations',
      'Reduced motion preference sets opacity to 1 and clears transform immediately',
    ],
  },

  defaultReview: {
    status: 'approved' as const,
    decisionSource: 'user-confirmed' as const,
    overrides: {},
  },
};
