// Card.spec.ts — Component specification
// specHash: PLACEHOLDER

export const spec = {
  schemaVersion: 6 as const,
  name: 'Card',
  componentClass: 'presentational' as const,
  category: 'panel',
  description: 'Presentational container with header, title, description, body, and footer sections for grouping related content',

  compound: true,
  rootElement: 'div',
  slots: [
    { name: 'root', element: 'div', description: 'Outer card container with background, border, radius, and shadow' },
    { name: 'header', element: 'div', description: 'Top section containing title and description' },
    { name: 'title', element: 'h3', description: 'Card heading text' },
    { name: 'description', element: 'p', description: 'Secondary descriptive text below the title' },
    { name: 'body', element: 'div', description: 'Main content area' },
    { name: 'footer', element: 'div', description: 'Bottom section for actions or metadata' },
    { name: 'footerStart', element: 'div', description: 'Left-aligned content within footer' },
    { name: 'footerEnd', element: 'div', description: 'Right-aligned content within footer (margin-left: auto)' },
  ],

  subComponents: [
    {
      name: 'Root',
      slots: [{ name: 'root', element: 'div', description: 'Outer card container' }],
      props: [
        { name: 'variant', type: "'default' | 'elevated' | 'ghost'", default: "'default'", moveSpecific: true, description: 'Visual style variant' },
        { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", moveSpecific: true, description: 'Card size controlling padding and title size' },
        { name: 'children', type: 'React.ReactNode', moveSpecific: false, description: 'Card content sections' },
      ],
      usesFactory: true,
      description: 'Root container that sets variant, size, and provides token scope for child slots',
    },
    {
      name: 'Header',
      slots: [{ name: 'header', element: 'div', description: 'Header container' }],
      props: [
        { name: 'children', type: 'React.ReactNode', moveSpecific: false, description: 'Title and description elements' },
      ],
      usesFactory: true,
      description: 'Container for title and description with vertical layout and gap',
    },
    {
      name: 'Title',
      slots: [{ name: 'title', element: 'h3', description: 'Heading element' }],
      props: [
        { name: 'children', type: 'React.ReactNode', moveSpecific: false, description: 'Title text' },
      ],
      usesFactory: true,
      description: 'Card heading rendered as h3',
    },
    {
      name: 'Description',
      slots: [{ name: 'description', element: 'p', description: 'Description paragraph' }],
      props: [
        { name: 'children', type: 'React.ReactNode', moveSpecific: false, description: 'Description text' },
      ],
      usesFactory: true,
      description: 'Secondary descriptive text rendered as p',
    },
    {
      name: 'Body',
      slots: [{ name: 'body', element: 'div', description: 'Body container' }],
      props: [
        { name: 'children', type: 'React.ReactNode', moveSpecific: false, description: 'Main body content' },
      ],
      usesFactory: true,
      description: 'Flex-grow main content area',
    },
    {
      name: 'Footer',
      slots: [{ name: 'footer', element: 'div', description: 'Footer container' }],
      props: [
        { name: 'children', type: 'React.ReactNode', moveSpecific: false, description: 'Footer content' },
      ],
      usesFactory: true,
      description: 'Bottom section with horizontal flex layout for actions',
    },
    {
      name: 'FooterStart',
      slots: [{ name: 'footerStart', element: 'div', description: 'Footer start container' }],
      props: [
        { name: 'children', type: 'React.ReactNode', moveSpecific: false, description: 'Left-aligned footer content' },
      ],
      usesFactory: true,
      description: 'Left-aligned subsection within Footer',
    },
    {
      name: 'FooterEnd',
      slots: [{ name: 'footerEnd', element: 'div', description: 'Footer end container' }],
      props: [
        { name: 'children', type: 'React.ReactNode', moveSpecific: false, description: 'Right-aligned footer content' },
      ],
      usesFactory: true,
      description: 'Right-aligned subsection within Footer (auto margin-left pushes to end)',
    },
  ],

  props: [
    { name: 'variant', type: "'default' | 'elevated' | 'ghost'", default: "'default'", moveSpecific: true, description: 'Visual style variant' },
    { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", moveSpecific: true, description: 'Card size' },
    { name: 'children', type: 'React.ReactNode', moveSpecific: false, description: 'Card content sections' },
  ],

  anatomy: {
    slot: 'root',
    dataAttributes: ['data-variant', 'data-size'],
    children: [
      {
        slot: 'header',
        children: [
          { slot: 'title' },
          { slot: 'description' },
        ],
      },
      { slot: 'body' },
      {
        slot: 'footer',
        children: [
          { slot: 'footerStart' },
          { slot: 'footerEnd' },
        ],
      },
    ],
  },

  controlled: null,
  keyboard: null,
  focus: null,
  formType: null,
  asChild: false,

  surface: {
    slot: 'root',
    level: 'subtle' as const,
  },

  animations: [],

  renderContracts: [
    { id: 'token-scope-on-root', description: 'All component tokens are declared on .root so child slots inherit via CSS cascade' },
    { id: 'elevated-transparent-border', description: 'Elevated variant sets border-color to transparent and uses shadow instead' },
    { id: 'ghost-transparent-bg-border', description: 'Ghost variant sets both background and border to transparent' },
    { id: 'footer-end-auto-margin', description: 'FooterEnd uses margin-left:auto to push content to the end of the footer' },
    { id: 'sub-components-independent', description: 'Each sub-component is independently created via withMoveComponent and can be used individually' },
  ],

  tokens: [
    { name: '--move-card-bg', value: 'var(--move-bg-subtle)', description: 'Card background color' },
    { name: '--move-card-border', value: 'var(--move-border-base)', description: 'Card border color' },
    { name: '--move-card-radius', value: 'var(--move-rounded-xl)', description: 'Card border radius' },
    { name: '--move-card-shadow', value: 'none', description: 'Card box shadow (elevated variant uses var(--move-shadow-md))' },
    { name: '--move-card-padding', value: 'var(--move-spacing-lg)', description: 'Card section padding' },
    { name: '--move-card-title-size', value: 'var(--move-size-lg)', description: 'Title font size' },
    { name: '--move-card-title-weight', value: 'var(--move-weight-semibold)', description: 'Title font weight' },
    { name: '--move-card-title-fg', value: 'var(--move-fg-base)', description: 'Title text color' },
    { name: '--move-card-description-size', value: 'var(--move-size-sm)', description: 'Description font size' },
    { name: '--move-card-description-fg', value: 'var(--move-fg-muted)', description: 'Description text color' },
  ],

  variants: {
    variant: ['default', 'elevated', 'ghost'] as string[],
  },
  sizes: ['sm', 'md', 'lg'] as string[],

  labels: [],
  childrenKind: 'composition' as const,

  hasHook: false,
  engineImports: ['withMoveComponent'] as string[],
  animationImports: [] as string[],
  componentDeps: [] as string[],

  testing: {
    behaviors: [
      'Root renders as div element',
      'Root applies variant via data-variant attribute',
      'Root applies size via data-size attribute',
      'Root defaults to variant=default',
      'Root defaults to size=md',
      'Header renders as div with vertical flex layout',
      'Title renders as h3 element',
      'Description renders as p element',
      'Body renders as div with flex:1',
      'Footer renders as div with horizontal flex layout',
      'FooterStart renders as div with flex alignment',
      'FooterEnd renders as div with margin-left:auto',
      'Elevated variant sets shadow and transparent border',
      'Ghost variant sets transparent background and border',
      'Size sm reduces padding and title font size',
      'Size lg increases padding and title font size',
      'Each sub-component forwards className and style',
      'Each sub-component forwards ref',
      'Each sub-component spreads HTML attributes',
    ],
  },

  defaultReview: {
    status: 'approved' as const,
    decisionSource: 'accept-all' as const,
    overrides: {},
  },
};
