// Splitter.spec.ts — Component specification
// specHash: PLACEHOLDER

import type { ComponentSpec } from '../../../spec-type';

export const spec = {
  schemaVersion: 7 as const,
  name: 'Splitter',
  componentClass: 'interactive' as const,
  category: 'layout',
  description: 'Resizable panel layout with draggable gutters, keyboard resize support, and responsive collapse to vertical stacking',

  synonyms: ['resizer', 'pane split', 'panes', 'resizable panels', 'split pane', 'divider'],
  families: {
    behavior:  ["layout"],
    state:     ["controlled-value"],
    animation: ["none"],
    a11y:      ["none"],
  },

  compound: true,
  rootElement: 'div',
  slots: [
    { name: 'root', element: 'div', description: 'Flex container that holds panels and auto-injected gutters' },
    { name: 'panel', element: 'div', description: 'Resizable panel section sized by percentage' },
    { name: 'gutter', element: 'div', description: 'Internal draggable separator between panels (auto-injected by Root)' },
  ],

  subComponents: [
    {
      name: 'Root',
      slots: [{ name: 'root', element: 'div', description: 'Splitter flex container' }],
      props: [
        { name: 'children', type: 'React.ReactNode', moveSpecific: false, description: 'Panel children (gutters are injected automatically between them)' },
        { name: 'className', type: 'string', moveSpecific: false, description: 'CSS class name' },
        { name: 'style', type: 'React.CSSProperties', moveSpecific: false, description: 'Inline styles' },
        { name: 'layout', type: "'horizontal' | 'vertical'", default: "'horizontal'", moveSpecific: true, description: 'Layout direction of the panels' },
        { name: 'gutterSize', type: 'number', default: '4', moveSpecific: true, description: 'Size of the gutter/handle in pixels' },
        { name: 'collapseBelow', type: 'number', moveSpecific: true, description: 'Container width in pixels below which horizontal layout collapses to vertical stacking' },
        { name: 'onResizeEnd', type: '(sizes: number[]) => void', moveSpecific: true, description: 'Callback fired when panel resize completes, with current sizes as percentages' },
      ],
      usesFactory: true,
      description: 'Root container that manages panel sizes via context, injects gutters between children, and supports responsive collapse',
    },
    {
      name: 'Panel',
      slots: [{ name: 'panel', element: 'div', description: 'Panel container' }],
      props: [
        { name: 'children', type: 'React.ReactNode', moveSpecific: false, description: 'Panel content' },
        { name: 'className', type: 'string', moveSpecific: false, description: 'CSS class name' },
        { name: 'style', type: 'React.CSSProperties', moveSpecific: false, description: 'Inline styles' },
        { name: 'size', type: 'number', moveSpecific: true, description: 'Initial size as percentage (auto-distributed if not specified)' },
        { name: 'minSize', type: 'number', default: '5', moveSpecific: true, description: 'Minimum size as percentage (prevents panel from collapsing below this)' },
      ],
      usesFactory: true,
      description: 'Individual resizable panel that registers its size with Root context',
    },
  ],

  props: [],

  anatomy: {
    slot: 'root',
    dataAttributes: ['data-layout', 'data-collapsed'],
    children: [
      {
        slot: 'panel',
        dataAttributes: ['data-layout'],
      },
      {
        slot: 'gutter',
        dataAttributes: ['data-dragging'],
        ariaAttributes: ['role=separator', 'aria-orientation', 'aria-valuenow'],
      },
      {
        slot: 'panel',
        dataAttributes: ['data-layout'],
      },
    ],
  },

  controlled: null,
  keyboard: 'linear' as const,
  focus: 'self' as const,
  formType: null,
  asChild: false,

  animations: [],

  renderContracts: [
    { id: 'auto-inject-gutters', description: 'Root automatically injects SplitterGutter components between each Panel child. Gutters are not user-facing sub-components.' },
    { id: 'gutter-role-separator', description: 'Each gutter has role="separator" with aria-orientation perpendicular to layout (horizontal layout gets vertical separator).' },
    { id: 'gutter-valuenow', description: 'Each gutter reports aria-valuenow as the rounded percentage size of the panel before it.' },
    { id: 'gutter-focusable', description: 'Gutters have tabIndex=0 and are keyboard-operable with Arrow keys, Home, and End.' },
    { id: 'gutter-hidden-collapsed', description: 'When isCollapsed is true (container width < collapseBelow), gutters return null and panels stack vertically.' },
    { id: 'panel-size-percentage', description: 'Panel width (horizontal) or height (vertical) is set via inline style as percentage. Falls back to flex: 1 when size is not yet determined.' },
    { id: 'panel-index-from-dom', description: 'Panel determines its index from its DOM position among siblings with the panel class, via useLayoutEffect.' },
    { id: 'panel-auto-size', description: 'When size prop is not specified, panel initial size is auto-distributed as 100/panelCount percent.' },
    { id: 'collapse-resize-observer', description: 'Root uses ResizeObserver on its container to detect when width falls below collapseBelow, switching to vertical layout.' },
    { id: 'min-size-enforced', description: 'During drag and keyboard resize, both adjacent panels are constrained to not go below their minSize (default 5%).' },
    { id: 'context-internal', description: 'Splitter uses an internal SplitterContext (not exposed) to share layout, sizes, and register/setPanelSize between Root, Panel, and Gutter.' },
    { id: 'gutter-expanded-hit-area', description: 'Gutters have a ::before pseudo-element expanding the hit area by spacing-sm on each side for easier grabbing.' },
  ],

  tokens: [
    { name: '--move-splitter-gutter-bg', value: 'var(--move-bg-emphasis)', description: 'Gutter default background color' },
    { name: '--move-splitter-gutter-bg-hover', value: 'var(--move-border-emphasis)', description: 'Gutter background on hover' },
    { name: '--move-splitter-gutter-bg-active', value: 'var(--move-primary)', description: 'Gutter background while dragging' },
  ],

  variants: {},
  sizes: [] as string[],

  labels: [],

  hasHook: false,
  engineImports: ['withMoveComponent', 'useMergedRef'] as string[],

  componentDeps: [] as string[],

  testing: {
    behaviors: [
      'Root renders a flex container with data-layout',
      'Root defaults layout to horizontal',
      'Root defaults gutterSize to 4',
      'Root auto-injects gutters between Panel children',
      'Root provides context to Panel and Gutter sub-components',
      'Panel renders with percentage width in horizontal layout',
      'Panel renders with percentage height in vertical layout',
      'Panel defaults minSize to 5',
      'Panel auto-distributes size when size prop not specified',
      'Panel determines index from DOM position',
      'Gutter renders with role=separator',
      'Gutter aria-orientation is vertical for horizontal layout',
      'Gutter aria-orientation is horizontal for vertical layout',
      'Gutter aria-valuenow reflects panel percentage',
      'Gutter is focusable (tabIndex=0)',
      'Dragging gutter resizes adjacent panels',
      'Dragging respects minSize constraint',
      'Drag sets data-dragging on gutter',
      'onResizeEnd called after drag completes',
      'collapseBelow uses ResizeObserver to detect collapse',
      'Collapsed state switches horizontal to vertical layout',
      'Gutters hidden when collapsed',
      'Panels stack vertically when collapsed',
      'data-collapsed set on root when collapsed',
      'Forwards className and style on Root and Panel',
    ],
    keyboard: [
      'ArrowLeft/ArrowRight resize panels in horizontal layout (2% step)',
      'ArrowUp/ArrowDown resize panels in vertical layout (2% step)',
      'Home minimizes the panel before the gutter',
      'End maximizes the panel before the gutter',
      'Keyboard resize respects minSize constraint',
      'onResizeEnd called after keyboard resize',
    ],
    aria: [
      'Gutter has role=separator',
      'Gutter has aria-orientation perpendicular to layout direction',
      'Gutter has aria-valuenow with current panel size percentage',
      'Gutter is keyboard-focusable',
    ],
  },

  defaultReview: {
    status: 'approved' as const,
    decisionSource: 'user-confirmed' as const,
    overrides: {},
  },
} satisfies ComponentSpec;
