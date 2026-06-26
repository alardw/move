// Loader.spec.ts — Component specification
// specHash: PLACEHOLDER

export const spec = {
  schemaVersion: 7 as const,
  name: 'Loader',
  componentClass: 'presentational' as const,
  category: 'loading',
  description: 'Animated loading indicator with spinner (SVG) and dots (bouncing) variants using anime.js perpetual animations',

  synonyms: ['spinner', 'loading', 'wait', 'progress indicator', 'busy indicator'],
  families: {
    behavior:  ["loading"],
    state:     ["stateless"],
    animation: ["continuous-loop"],
    a11y:      ["none"],
  },

  compound: false,
  rootElement: 'div',
  slots: [
    { name: 'root', element: 'div', description: 'Outer container with role="progressbar", variant-dependent sizing' },
    { name: 'svg', element: 'svg', description: 'SVG element for spinner variant with rotation animation' },
    { name: 'circle', element: 'circle', description: 'SVG circle with stroke-dash animation for spinner variant' },
    { name: 'dot', element: 'span', description: 'Bouncing dot element for dots variant (rendered 3 times)' },
  ],

  props: [
    { name: 'variant', type: "'spinner' | 'dots'", default: "'spinner'", moveSpecific: true, description: 'Loading indicator style' },
    { name: 'color', type: "'primary' | 'secondary' | 'current'", default: "'primary'", moveSpecific: true, description: 'Indicator color' },
    { name: 'size', typeRef: 'Size', default: "'md'", moveSpecific: true, description: 'Indicator size' },
    { name: 'strokeWidth', type: 'number', default: '3', moveSpecific: true, description: 'SVG stroke width for spinner variant' },
  ],

  anatomy: {
    slot: 'root',
    dataAttributes: ['data-variant', 'data-color', 'data-size'],
    ariaAttributes: ['role', 'aria-busy', 'aria-label'],
    children: [
      {
        slot: 'svg',
        children: [
          { slot: 'circle' },
        ],
      },
      { slot: 'dot' },
    ],
  },

  controlled: null,
  keyboard: null,
  focus: null,
  formType: null,
  asChild: false,

  animations: [],

  renderContracts: [
    { id: 'variant-spinner', description: 'When variant=spinner, renders svg+circle slots; dot slots are not rendered' },
    { id: 'variant-dots', description: 'When variant=dots, renders 3 dot span elements; svg+circle slots are not rendered' },
    { id: 'dots-aria-label', description: 'Dots variant includes aria-label="Loading" on root' },
    { id: 'anime-spinner', description: 'Spinner uses anime.js for SVG rotation (2s linear loop) and stroke-dasharray animation (1.5s inOutQuad loop)' },
    { id: 'anime-dots', description: 'Dots use anime.js for bouncing translateY + squish scaleX/scaleY (500ms out(2) alternate loop, staggered delays)' },
    { id: 'reduced-motion', description: 'Respects prefersReducedMotion: spinner shows static stroke-dasharray, dots skip animation' },
  ],

  tokens: [
    { name: '--move-loader-size', value: '48px', description: 'Spinner variant overall size (varies by size prop)' },
    { name: '--move-loader-color', value: 'var(--move-primary)', description: 'Indicator color (varies by color prop)' },
    { name: '--move-loader-dot-size', value: '8px', description: 'Dot diameter for dots variant (varies by size prop)' },
    { name: '--move-loader-travel', value: '22px', description: 'Dot bounce travel distance (varies by size prop)' },
  ],

  variants: {
    variant: ['spinner', 'dots'] as string[],
    color: ['primary', 'secondary', 'current'] as string[],
  },
  sizes: ['sm', 'md', 'lg'] as string[],

  labels: [
    { key: 'loading', default: 'Loading', description: 'Accessible label announced while loading (dots variant)' },
  ],

  hasHook: false,
  engineImports: ['withMoveComponent'],

  componentDeps: [],

  testing: {
    behaviors: [
      'Renders as div element with role="progressbar"',
      'Has aria-busy attribute',
      'Defaults to variant=spinner',
      'Defaults to color=primary',
      'Defaults to size=md',
      'Defaults to strokeWidth=3',
      'Applies variant via data-variant attribute',
      'Applies color via data-color attribute',
      'Applies size via data-size attribute',
      'Spinner variant renders svg and circle elements',
      'Spinner variant does not render dot elements',
      'Dots variant renders 3 span dot elements',
      'Dots variant does not render svg element',
      'Dots variant has aria-label="Loading"',
      'Spinner SVG has viewBox="25 25 50 50"',
      'Circle has correct cx, cy, r, fill, strokeMiterlimit attributes',
      'strokeWidth prop is passed to circle element',
      'Forwards className and style',
      'Forwards ref to root element',
      'Spreads HTML attributes',
    ],
    animation: [
      'Spinner: SVG rotates 360deg with 2s linear loop via anime.js',
      'Spinner: circle stroke-dasharray animates via anime.js (1.5s inOutQuad loop)',
      'Dots: each dot bounces with translateY and squish via anime.js (500ms out(2) alternate loop)',
      'Dots: bounce travel distance varies by size (sm=14, md=22, lg=32)',
      'Dots: stagger delays are [0, 200, 300]ms',
      'Reduced motion: spinner shows static dasharray without animation',
      'Reduced motion: dots skip animation entirely',
    ],
  },

  defaultReview: {
    status: 'approved' as const,
    decisionSource: 'rule-based' as const,
    overrides: {},
  },
};
