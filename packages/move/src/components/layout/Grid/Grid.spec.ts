// Grid.spec.ts — Component specification
// specHash: 796ba7e8

import type { ComponentSpec } from '../../../spec-type';

export const spec = {
  schemaVersion: 7 as const,
  name: 'Grid',
  componentClass: 'presentational' as const,
  category: 'layout',
  description: 'CSS grid layout container with equal-column, span-based, and auto-fit modes plus a Cell sub-component for placement control',

  synonyms: ['layout grid', 'columns', 'simple grid', 'masonry', 'gallery', 'image grid'],
  animationPatterns: ['layoutReveal'],
  families: {
    behavior:  ["layout"],
    state:     ["stateless"],
    animation: ["stagger"],
    a11y:      ["none"],
  },

  compound: true,
  rootElement: 'div',
  slots: [
    { name: 'root', element: 'div', description: 'Grid container with CSS grid display' },
    { name: 'cell', element: 'div', description: 'Grid cell with span/offset/order control' },
  ],

  subComponents: [
    {
      name: 'Cell',
      slots: [{ name: 'cell', element: 'div', description: 'Grid cell' }],
      props: [
        { name: 'span', type: 'number', moveSpecific: true, description: 'Column span' },
        { name: 'rowSpan', type: 'number', moveSpecific: true, description: 'Row span' },
        { name: 'offset', type: 'number', moveSpecific: true, description: 'Columns to skip before this cell' },
        { name: 'order', type: 'number', moveSpecific: true, description: 'Visual order' },
        { name: 'align', type: "'start' | 'center' | 'end' | 'stretch'", moveSpecific: true, description: 'Self-alignment within the grid cell' },
        { name: 'children', type: 'React.ReactNode', moveSpecific: false, description: 'Cell content' },
      ],
      usesFactory: true,
      description: 'Grid cell with column span, row span, offset, and order control',
    },
  ],

  props: [
    { name: 'cols', type: 'number', moveSpecific: true, description: 'Equal-width columns (shorthand for repeat(N, 1fr))' },
    { name: 'rows', type: 'number', moveSpecific: true, description: 'Equal-height rows (shorthand for repeat(N, 1fr))' },
    { name: 'columns', type: 'number', moveSpecific: true, description: 'Total columns for span-based mode (default 12)' },
    { name: 'minChildWidth', type: 'string', moveSpecific: true, description: 'Auto-fit: minimum child width before wrapping (e.g. "200px")' },
    { name: 'gap', typeRef: 'Gap', default: "'md'", moveSpecific: true, description: 'Gap between grid items' },
    { name: 'rowGap', typeRef: 'Gap', moveSpecific: true, description: 'Row gap override' },
    { name: 'columnGap', typeRef: 'Gap', moveSpecific: true, description: 'Column gap override' },
    { name: 'collapseBelow', type: 'string', moveSpecific: true, description: 'Container width (px) below which grid collapses to 1 column' },
    { name: 'stagger', type: "boolean | { delay?: number; from?: 'first' | 'last' | 'center' }", default: 'false', moveSpecific: true, description: "Opt-in: reveal direct children with a staggered fade+rise entrance on mount. `true` uses defaults (60ms between items, from first); pass an object to tune `delay`/`from`. Off by default. Disable or override via the `animations` prop. (Replaces the former ImageGroup gallery component — use `<Grid stagger>` with `Image` children.)" },
    { name: 'animations', type: 'AnimationTrigger[] | false', moveSpecific: true, description: 'Override or disable the entrance stagger animation (only relevant when `stagger` is set).' },
    { name: 'children', type: 'React.ReactNode', moveSpecific: false, description: 'Grid.Cell children' },
  ],

  anatomy: {
    slot: 'root',
    dataAttributes: [],
    children: [
      { slot: 'cell' },
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
  childrenKind: 'composition' as const,

  renderContracts: [
    {
      id: 'inline-style-layout',
      description: 'Grid uses inline styles (not data-attributes) for layout: --_grid-template, --_grid-rows, gap, rowGap, columnGap are set via inline style. GAP_MAP resolves named gaps (xs/sm/md/lg/xl/none) to spacing token CSS custom properties.',
    },
    {
      id: 'cell-inline-style-placement',
      description: 'Cell uses inline styles for gridColumn, gridRow, order, and alignSelf. span+offset combines to gridColumn: "offset+1 / span N".',
    },
    {
      id: 'grid-template-resolution',
      description: 'Grid template resolves in priority order: minChildWidth -> repeat(auto-fill, minmax(W, 1fr)), cols -> repeat(N, 1fr), columns -> repeat(N, 1fr), fallback -> repeat(12, 1fr)',
    },
    {
      id: 'collapse-below-resize-observer',
      description: 'When collapseBelow is set, a ResizeObserver watches the root element and sets/removes data-collapsed attribute when width crosses the threshold',
    },
    {
      id: 'stagger-opt-in',
      description: "When the `stagger` prop is set, a Root.enter trigger animates direct children (`:scope > *`) with a staggered fade+rise (opacity 0→1, translateY 8→0, outQuart ~200ms) via useAnimations + resolveAnimationsConfig — the same declarative children-stagger pattern as List/Table/Timeline. When the prop is absent, no animation config is built and no animation wiring runs. Consumers can pass `animations={false}` to disable or an AnimationTrigger[] to override.",
    },
  ],

  hasHook: false,
  engineImports: ['withMoveComponent'],

  componentDeps: [],

  testing: {
    behaviors: [
      'Renders as div with CSS grid display',
      'Defaults to 12-column grid when no cols/columns/minChildWidth provided',
      'Sets --_grid-template via inline style for cols mode',
      'Sets --_grid-template via inline style for minChildWidth auto-fit mode',
      'Sets --_grid-rows via inline style when rows is provided',
      'Resolves gap values through GAP_MAP to spacing tokens',
      'Defaults to gap=md',
      'Supports rowGap and columnGap overrides',
      'Forwards className and style on root',
      'Forwards ref to root element',
      'Spreads HTML attributes',
      'Renders no animation wiring when stagger prop is absent (default off)',
      'Reveals direct children with a staggered entrance on mount when stagger prop is set',
    ],
    animation: [
      'stagger prop injects a Root.enter children-stagger; animations={false} disables it',
    ],
    cell: [
      'Cell renders as div',
      'Cell sets gridColumn for span',
      'Cell combines offset and span into gridColumn: "offset+1 / span N"',
      'Cell sets gridRow for rowSpan',
      'Cell sets order via inline style',
      'Cell sets alignSelf for align prop',
      'Cell forwards className and style',
      'Cell forwards ref',
    ],
    collapse: [
      'Sets data-collapsed attribute when container width falls below collapseBelow threshold',
      'Removes data-collapsed attribute when container width exceeds threshold',
      'CSS overrides grid-template-columns to 1fr when data-collapsed is set',
    ],
  },

  defaultReview: {
    status: 'approved' as const,
    decisionSource: 'rule-based' as const,
    overrides: {},
  },
} satisfies ComponentSpec;
