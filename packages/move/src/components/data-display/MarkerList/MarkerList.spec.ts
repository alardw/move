// MarkerList.spec.ts — Component specification

import type { ComponentSpec } from '../../../spec-type';

export const spec = {
  schemaVersion: 1 as const,
  name: 'MarkerList',
  componentClass: 'display' as const,
  category: 'data-display',
  description:
    'Nested marker list (semantic ul/ol) with a bullet, number, or icon marker per item, per-level markers that nested lists inherit by depth, and controllable indent — the marker-list family, distinct from the item-oriented ItemList',
  families: {
    behavior: ['display'],
    state: ['stateless'],
    a11y: ['none'],
  },

  compound: true,
  rootElement: 'ul',
  slots: [
    {
      name: 'root',
      element: 'ul',
      description: 'List container — renders <ul>, or <ol> when ordered. list-style: none.',
    },
    {
      name: 'item',
      element: 'li',
      description: 'List row — a flex row of marker cell + content cell.',
    },
    {
      name: 'marker',
      element: 'span',
      description:
        'The marker cell (bullet glyph, CSS-counter number, or icon). Decorative, aria-hidden.',
    },
    {
      name: 'content',
      element: 'div',
      description: 'The content cell — the item body and any nested MarkerList.',
    },
  ],

  subComponents: [
    {
      name: 'Root',
      slots: [{ name: 'root', element: 'ul', description: 'ul/ol list container' }],
      props: [
        {
          name: 'ordered',
          type: 'boolean',
          default: 'false',
          moveSpecific: true,
          description: 'Render an ordered <ol> (numbered) instead of an unordered <ul> (bulleted).',
        },
        {
          name: 'marker',
          type: "'disc' | 'circle' | 'square' | 'decimal' | 'alpha' | 'roman'",
          default: 'null',
          moveSpecific: true,
          description:
            'Marker style for this level. Bullets (disc/circle/square) for unordered, numbering (decimal/alpha/roman) for ordered. When null, derives disc (unordered) or decimal (ordered).',
        },
        {
          name: 'markers',
          type: "('disc' | 'circle' | 'square' | 'decimal' | 'alpha' | 'roman')[]",
          moveSpecific: true,
          description:
            'Per-depth marker styles (level 0, 1, 2…). Provided on the root and inherited via context by every nested MarkerList, which picks the entry for its own depth. `marker` overrides for a single level.',
        },
        {
          name: 'icon',
          type: 'string',
          default: 'null',
          moveSpecific: true,
          description:
            'Use a resolved Icon (by name) as the marker for every item at this level, instead of a bullet/number. Overridable per item.',
        },
        {
          name: 'spacing',
          type: "'none' | 'xs' | 'sm' | 'md' | 'lg'",
          default: "'xs'",
          moveSpecific: true,
          description: 'Vertical gap between items.',
        },
        {
          name: 'indent',
          type: "'none' | 'xs' | 'sm' | 'md' | 'lg'",
          default: "'md'",
          moveSpecific: true,
          description: 'Indentation added per nested level.',
        },
        {
          name: 'center',
          type: 'boolean',
          default: 'false',
          moveSpecific: true,
          description:
            'Vertically center each marker to its item. Default aligns the marker to the first line (correct for multi-line items).',
        },
        {
          name: 'children',
          type: 'React.ReactNode',
          moveSpecific: false,
          description: 'MarkerList.Item children.',
        },
      ],
      usesFactory: true,
      description:
        'The list container. Provides depth + per-level marker context so nested MarkerLists inherit markers automatically. Renders <ul>/<ol> with list-style: none.',
    },
    {
      name: 'Item',
      slots: [{ name: 'item', element: 'li', description: 'List row' }],
      props: [
        {
          name: 'marker',
          type: "'disc' | 'circle' | 'square' | 'decimal' | 'alpha' | 'roman'",
          default: 'null',
          moveSpecific: true,
          description: "Override this item's marker style.",
        },
        {
          name: 'icon',
          type: 'string',
          default: 'null',
          moveSpecific: true,
          description: "Override this item's marker with a resolved Icon (by name).",
        },
        {
          name: 'children',
          type: 'React.ReactNode',
          moveSpecific: false,
          description: 'Item content, and optionally a nested MarkerList.',
        },
      ],
      usesFactory: true,
      description:
        'A list row: a marker cell + a content cell. Nest a MarkerList inside to add a level (it inherits the per-level markers and indents).',
    },
  ],

  props: [
    {
      name: 'ordered',
      type: 'boolean',
      default: 'false',
      moveSpecific: true,
      description: 'Ordered <ol> vs unordered <ul>.',
    },
    {
      name: 'marker',
      type: "'disc' | 'circle' | 'square' | 'decimal' | 'alpha' | 'roman'",
      default: 'null',
      moveSpecific: true,
      description: 'Marker style for this level (null derives disc/decimal from ordered).',
    },
    {
      name: 'markers',
      type: "('disc' | 'circle' | 'square' | 'decimal' | 'alpha' | 'roman')[]",
      moveSpecific: true,
      description: 'Per-depth marker styles, inherited by nested lists.',
    },
    {
      name: 'icon',
      type: 'string',
      default: 'null',
      moveSpecific: true,
      description: 'Icon marker (by name) for all items at this level.',
    },
    {
      name: 'spacing',
      type: "'none' | 'xs' | 'sm' | 'md' | 'lg'",
      default: "'xs'",
      moveSpecific: true,
      description: 'Vertical gap between items.',
    },
    {
      name: 'indent',
      type: "'none' | 'xs' | 'sm' | 'md' | 'lg'",
      default: "'md'",
      moveSpecific: true,
      description: 'Indentation per nested level.',
    },
    {
      name: 'center',
      type: 'boolean',
      default: 'false',
      moveSpecific: true,
      description: 'Vertically center the marker (default: align to first line).',
    },
    {
      name: 'children',
      type: 'React.ReactNode',
      moveSpecific: false,
      description: 'MarkerList.Item children.',
    },
  ],

  anatomy: {
    slot: 'root',
    dataAttributes: ['data-ordered', 'data-marker', 'data-spacing', 'data-center', 'data-depth'],
    ariaAttributes: ['role=list'],
    children: [
      {
        slot: 'item',
        dataAttributes: ['data-marker'],
        children: [{ slot: 'marker' }, { slot: 'content' }],
      },
    ],
  },

  controlled: null,
  keyboard: null,
  focus: null,
  formType: null,
  asChild: false,

  animations: [],

  renderContracts: [
    {
      id: 'ordered-element',
      description:
        'Root renders <ol> when ordered=true (keeping native ordered-list number semantics) and <ul> otherwise. Both carry role="list".',
    },
    {
      id: 'list-style-none-rendered-marker',
      description:
        'Root sets list-style: none; the marker is rendered in a dedicated marker cell (bullet glyph / counter number / Icon) + a content cell — never via native ::marker, so styling, indent, and alignment are fully controllable.',
    },
    {
      id: 'ordered-counters',
      description:
        'Ordered numbering uses CSS counters: counter-reset on the ol, counter-increment on each li, and content on the marker cell (decimal/alpha/roman), so numbers stay automatic without threading indices.',
    },
    {
      id: 'per-level-inheritance',
      description:
        'Root provides { depth, markers, ordered, indent } via React context. A nested MarkerList reads the parent depth, renders at depth+1, and — unless it sets its own marker — selects markers[depth] (falling back to the single marker or the ordered/unordered default). This is how per-level markers inherit automatically.',
    },
    {
      id: 'marker-precedence',
      description:
        'Marker resolution order per item: Item.icon → Item.marker → list.icon → list.marker → markers[depth] → default (disc unordered / decimal ordered).',
    },
    {
      id: 'icon-marker-decorative',
      description:
        'Icon markers render a resolved <Icon> via useResolvedIcon and are aria-hidden — the <li> text carries the meaning. Bullet and number markers are likewise decorative.',
    },
    {
      id: 'marker-alignment',
      description:
        'The marker sits on the first text line baseline (align-items: baseline); center=true switches to align-items: center for single-line items.',
    },
    {
      id: 'indent-per-level',
      description:
        'Each nested level indents the content by --move-marker-list-indent (scaled by the indent prop). The root level is not indented.',
    },
    {
      id: 'semantic-list',
      description:
        'Screen readers see a proper list: role="list" on ul/ol, real <li> items, and ordered lists keep their number semantics.',
    },
  ],

  tokens: [
    {
      name: '--move-marker-list-gap',
      value: 'var(--move-spacing-xs)',
      description: 'Vertical gap between items (scaled by spacing prop)',
    },
    {
      name: '--move-marker-list-indent',
      value: 'var(--move-spacing-md)',
      description: 'Indentation added per nested level (scaled by indent prop)',
    },
    {
      name: '--move-marker-list-marker-gap',
      value: 'var(--move-spacing-sm)',
      description: 'Gap between the marker cell and the content cell',
    },
    {
      name: '--move-marker-list-marker-color',
      value: 'var(--move-fg-muted)',
      description: 'Marker (bullet/number/icon) color',
    },
    {
      name: '--move-marker-list-marker-size',
      value: 'var(--move-size-base)',
      description: 'Marker glyph/number/icon size',
    },
  ],

  variants: {
    marker: ['disc', 'circle', 'square', 'decimal', 'alpha', 'roman'] as string[],
  },
  sizes: [] as string[],

  labels: [],
  childrenKind: 'composition' as const,

  hasHook: false,
  engineImports: ['withMoveComponent', 'useMergedRef'] as string[],

  componentDeps: ['Stack', 'Icon'] as string[],

  testing: {
    behaviors: [
      'Root renders as ul with role=list by default',
      'Root renders as ol when ordered=true',
      'Root defaults to ordered=false, spacing=xs, indent=md, center=false',
      'Root sets list-style:none and renders markers in a marker cell (not via ::marker)',
      'Unordered default marker is disc; ordered default marker is decimal',
      'marker=circle/square renders the corresponding bullet glyph',
      'Ordered marker=alpha/roman renders letter/roman numerals via CSS counters',
      'Numbers increment automatically across items via CSS counters',
      'icon on Root renders a resolved Icon as the marker for every item',
      'Item.icon overrides the list marker for that item',
      'Item.marker overrides the list marker style for that item',
      'markers=[disc, circle, square] gives level 0 disc, level 1 circle, level 2 square automatically',
      'A nested MarkerList inherits the parent markers and renders at depth+1',
      'A nested MarkerList without its own marker uses markers[depth]',
      'Each nested level indents content by --move-marker-list-indent',
      'Root level is not indented',
      'Marker sits on the first text line baseline',
      'center=true vertically centers the marker to the item',
      'spacing controls the vertical gap between items',
      'Icon/bullet/number markers are aria-hidden',
      'Forwards className and style on all sub-components',
      'Forwards ref on Root and Item',
    ],
    aria: [
      'Root (ul/ol) has role=list',
      'Items render as real <li>',
      'Ordered list keeps <ol> number semantics',
      'Markers are decorative (aria-hidden)',
    ] as string[],
  },
} satisfies ComponentSpec;
