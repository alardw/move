// TableOfContents.spec.ts — Component specification

import type { ComponentSpec } from '../../../spec-type';

export const spec = {
  schemaVersion: 7 as const,
  name: 'TableOfContents',
  componentClass: 'navigation' as const,
  category: 'navigation',
  description: 'Right-rail table of contents with scroll-spy active-state tracking, indented nesting, and smooth-scroll anchor navigation.',

  synonyms: ['toc', 'on this page', 'page nav', 'page outline', 'anchors'],
  families: {
    behavior:  ["navigation"],
    state:     ["stateless"],
    animation: ["none"],
    a11y:      ["none"],
  },

  compound: true,
  rootElement: 'nav',
  slots: [
    { name: 'root', element: 'nav', description: 'Navigation landmark wrapping the list of items' },
    { name: 'item', element: 'a', description: 'Individual anchor item with active state' },
    { name: 'indicator', element: 'div', description: 'Active-item indicator' },
  ],

  subComponents: [
    {
      name: 'Root',
      slots: [{ name: 'root', element: 'nav', description: 'Navigation landmark' }],
      props: [
        { name: 'className', type: 'string', moveSpecific: false, description: 'CSS class name' },
        { name: 'style', type: 'React.CSSProperties', moveSpecific: false, description: 'Inline styles' },
        { name: 'children', type: 'React.ReactNode', moveSpecific: false, description: 'TableOfContents.Item elements' },
        { name: 'offset', type: 'number', default: '80', moveSpecific: true, description: 'Top-of-viewport offset (in px) used to decide which heading is current' },
        { name: 'labels', type: 'Partial<TableOfContentsLabels>', moveSpecific: true, description: 'Override accessible label strings' },
      ],
      usesFactory: true,
      description: 'Container and scroll-spy state manager. Tracks which registered heading intersects the viewport above the offset line and exposes activeHref via context.',
    },
    {
      name: 'Item',
      slots: [{ name: 'item', element: 'a', description: 'Anchor link to a page heading' }],
      props: [
        { name: 'className', type: 'string', moveSpecific: false, description: 'CSS class name' },
        { name: 'style', type: 'React.CSSProperties', moveSpecific: false, description: 'Inline styles' },
        { name: 'children', type: 'React.ReactNode', moveSpecific: false, description: 'Item label' },
        { name: 'href', type: 'string', moveSpecific: false, description: 'Anchor href — e.g. "#section-id"' },
        { name: 'depth', type: '1 | 2 | 3 | 4', default: '1', moveSpecific: true, description: 'Nesting level; visually indents the item' },
      ],
      usesFactory: true,
      description: 'Anchor link that registers its href with the Root, applies data-active when current, and smooth-scrolls to the target on click.',
    },
  ],

  props: [],

  anatomy: {
    slot: 'root',
    children: [
      { slot: 'item', dataAttributes: ['data-active', 'data-depth'] },
    ],
  },

  controlled: null,
  keyboard: null,
  focus: null,
  formType: null,
  asChild: false,

  animationCapabilities: ['slidingIndicator'],
  animations: [],

  renderContracts: [
    { id: 'scroll-spy', description: 'Root uses IntersectionObserver to watch all registered heading elements; data-active lands on the first Item whose target is intersecting the viewport above the offset line.' },
    { id: 'smooth-scroll', description: 'Clicking an Item scrolls its target heading into view with behavior:smooth and updates the URL hash without pushing history.' },
    { id: 'aria-current', description: 'Active Item gets aria-current="location" for screen reader support.' },
    { id: 'nav-landmark', description: 'Root renders a <nav> with aria-label="On this page".' },
  ],

  surface: {
    slot: 'root',
    level: 'base' as const,
  },

  tokens: [
    { name: '--move-toc-indicator-color', value: 'var(--move-primary)', description: 'Left-border indicator color on the active item' },
    { name: '--move-toc-indicator-width', value: '2px', description: 'Indicator / active-border width' },
    { name: '--move-toc-rail-color', value: 'var(--move-border-base)', description: 'Vertical rail color running alongside the items' },
    { name: '--move-toc-item-fg', value: 'var(--move-fg-muted)', description: 'Default item text color' },
    { name: '--move-toc-item-fg-hover', value: 'var(--move-fg-base)', description: 'Item text color on hover' },
    { name: '--move-toc-item-fg-active', value: 'var(--move-primary)', description: 'Active item text color' },
    { name: '--move-toc-item-font-size', value: 'var(--move-size-sm)', description: 'Item text size' },
    { name: '--move-toc-item-padding-x', value: 'var(--move-spacing-md)', description: 'Item horizontal padding' },
    { name: '--move-toc-item-padding-y', value: '6px', description: 'Item vertical padding' },
    { name: '--move-toc-depth-indent', value: '1rem', description: 'Indent added per depth level' },
  ],

  variants: {},
  sizes: [] as string[],
  labels: [
    { key: 'label', default: 'On this page', description: 'Accessible label for the navigation landmark' },
  ],

  radixPrimitive: null,
  hasHook: false,
  engineImports: ['withMoveComponent'] as string[],

  componentDeps: [] as string[],

  childrenKind: 'composition' as const,

  testing: {
    behaviors: [
      'Root renders as <nav> with aria-label="On this page"',
      'Item renders as anchor with the provided href',
      'Active item gets data-active and aria-current="location"',
      'Clicking an item smooth-scrolls to the target heading',
      'IntersectionObserver tracks the first heading above the offset line',
      'Item indents based on depth prop',
      'Forwards className and style on Root and Item',
    ],
    aria: [
      'Root sets role=navigation via the <nav> element',
      'Active Item has aria-current="location"',
    ],
  },

  defaultReview: {
    status: 'approved' as const,
    decisionSource: 'user-confirmed' as const,
    overrides: {},
  },
} satisfies ComponentSpec;
