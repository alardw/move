// ScrollArea.spec.ts — Component specification
// specHash: PLACEHOLDER

import type { ComponentSpec } from '../../../spec-type';

export const spec = {
  schemaVersion: 7 as const,
  name: 'ScrollArea',
  componentClass: 'presentational' as const,
  category: 'layout',
  description:
    'Scrollable content container with customizable scrollbar styling, optional sticky header and footer',

  synonyms: ['scrollbar', 'overflow', 'scroll container', 'scrollable', 'scroller'],
  families: {
    behavior: ['layout'],
    state: ['stateless'],
    a11y: ['none'],
  },

  compound: true,
  rootElement: 'div',
  slots: [
    {
      name: 'root',
      element: 'div',
      description: 'Outer flex column container that defines scroll area dimensions',
    },
    {
      name: 'header',
      element: 'div',
      description: 'Optional sticky header above scrollable content',
    },
    {
      name: 'content',
      element: 'div',
      description: 'Scrollable content area with custom scrollbar styling',
    },
    {
      name: 'footer',
      element: 'div',
      description: 'Optional sticky footer below scrollable content',
    },
  ],

  subComponents: [
    {
      name: 'Root',
      slots: [{ name: 'root', element: 'div', description: 'Outer flex container' }],
      props: [
        {
          name: 'children',
          type: 'React.ReactNode',
          moveSpecific: false,
          description: 'Header, Content, and Footer elements',
        },
        {
          name: 'fill',
          type: "boolean | 'screen'",
          moveSpecific: true,
          description:
            "Stretch to fill height. The Root already fills its parent (100%); set 'screen' to own the viewport height (100dvh) when it's the app-shell root with no sized ancestor.",
        },
        { name: 'className', type: 'string', moveSpecific: false, description: 'CSS class name' },
        {
          name: 'style',
          type: 'React.CSSProperties',
          moveSpecific: false,
          description: 'Inline styles',
        },
      ],
      usesFactory: true,
      description: 'Outer container with flex column layout, 100% width/height, overflow hidden',
    },
    {
      name: 'Header',
      slots: [{ name: 'header', element: 'div', description: 'Sticky header area' }],
      props: [
        {
          name: 'children',
          type: 'React.ReactNode',
          moveSpecific: false,
          description: 'Header content',
        },
        { name: 'className', type: 'string', moveSpecific: false, description: 'CSS class name' },
        {
          name: 'style',
          type: 'React.CSSProperties',
          moveSpecific: false,
          description: 'Inline styles',
        },
        {
          name: 'padded',
          type: 'boolean',
          default: 'true',
          moveSpecific: true,
          description: 'Whether to apply padding using the scroll area padding token',
        },
      ],
      usesFactory: true,
      description: 'Non-scrolling header area with border-bottom, flex-shrink: 0',
    },
    {
      name: 'Content',
      slots: [{ name: 'content', element: 'div', description: 'Scrollable area' }],
      props: [
        {
          name: 'children',
          type: 'React.ReactNode',
          moveSpecific: false,
          description: 'Scrollable content',
        },
        { name: 'className', type: 'string', moveSpecific: false, description: 'CSS class name' },
        {
          name: 'style',
          type: 'React.CSSProperties',
          moveSpecific: false,
          description: 'Inline styles',
        },
        {
          name: 'padded',
          type: 'boolean',
          default: 'false',
          moveSpecific: true,
          description: 'Whether to apply padding using the scroll area padding token',
        },
      ],
      usesFactory: true,
      description:
        'Scrollable flex-1 area with custom scrollbar styling via CSS and webkit pseudo-elements',
    },
    {
      name: 'Footer',
      slots: [{ name: 'footer', element: 'div', description: 'Sticky footer area' }],
      props: [
        {
          name: 'children',
          type: 'React.ReactNode',
          moveSpecific: false,
          description: 'Footer content',
        },
        { name: 'className', type: 'string', moveSpecific: false, description: 'CSS class name' },
        {
          name: 'style',
          type: 'React.CSSProperties',
          moveSpecific: false,
          description: 'Inline styles',
        },
        {
          name: 'padded',
          type: 'boolean',
          default: 'true',
          moveSpecific: true,
          description: 'Whether to apply padding using the scroll area padding token',
        },
      ],
      usesFactory: true,
      description: 'Non-scrolling footer area with border-top, flex-shrink: 0',
    },
  ],

  props: [],

  anatomy: {
    slot: 'root',
    dataAttributes: ['data-fill'],
    children: [
      {
        slot: 'header',
        dataAttributes: ['data-padded'],
      },
      {
        slot: 'content',
        dataAttributes: ['data-padded'],
      },
      {
        slot: 'footer',
        dataAttributes: ['data-padded'],
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
      id: 'padded-via-data-attr',
      description:
        'Each sub-component (Header, Content, Footer) sets data-padded attribute which CSS uses to conditionally apply padding.',
    },
    {
      id: 'content-overflow-scroll',
      description:
        'Content uses overflow-y: auto and overflow-x: hidden with custom scrollbar styling via scrollbar-width: thin and webkit pseudo-elements.',
    },
    {
      id: 'header-footer-flex-shrink',
      description:
        'Header and Footer have flex-shrink: 0 to remain fixed while Content (flex: 1) scrolls.',
    },
    {
      id: 'scrollbar-hover-emphasis',
      description:
        'Webkit scrollbar thumb uses --move-border-emphasis on hover for visual feedback.',
    },
  ],

  tokens: [
    { name: '--move-scrollarea-bg', value: 'transparent', description: 'Root background color' },
    {
      name: '--move-scrollarea-header-bg',
      value: 'transparent',
      description: 'Header background color',
    },
    {
      name: '--move-scrollarea-footer-bg',
      value: 'transparent',
      description: 'Footer background color',
    },
    {
      name: '--move-scrollarea-padding',
      value: 'var(--move-spacing-md)',
      description: 'Padding applied when padded=true',
    },
    {
      name: '--move-scrollarea-scrollbar-size',
      value: '8px',
      description: 'Scrollbar width for webkit scrollbars',
    },
    {
      name: '--move-scrollarea-scrollbar-thumb',
      value: 'var(--move-scrollbar-thumb)',
      description: 'Scrollbar thumb color',
    },
    {
      name: '--move-scrollarea-scrollbar-track',
      value: 'var(--move-scrollbar-track)',
      description: 'Scrollbar track color',
    },
    {
      name: '--move-scrollarea-scrollbar-radius',
      value: 'var(--move-rounded-full)',
      description: 'Scrollbar thumb/track border radius',
    },
  ],

  variants: {},
  sizes: [] as string[],

  labels: [],

  hasHook: false,
  engineImports: ['withMoveComponent'] as string[],

  componentDeps: [] as string[],

  testing: {
    behaviors: [
      'Root renders a div with flex column layout',
      'Root takes full width and height',
      'Header renders with border-bottom',
      'Header padded=true (default) applies padding',
      'Header padded=false removes padding',
      'Content renders as scrollable area with overflow-y: auto',
      'Content padded=false (default) has no padding',
      'Content padded=true applies padding',
      'Footer renders with border-top',
      'Footer padded=true (default) applies padding',
      'Footer padded=false removes padding',
      'Content uses custom scrollbar-color and scrollbar-width',
      'Webkit scrollbar thumb uses component token color',
      'Webkit scrollbar thumb hover uses emphasis color',
      'Forwards className and style on all sub-components',
      'Header and Footer stay fixed while Content scrolls',
      'All sub-components forward data-padded attribute',
    ],
  },
} satisfies ComponentSpec;
