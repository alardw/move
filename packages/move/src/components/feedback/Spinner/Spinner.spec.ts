// Spinner.spec.ts — Component specification
// specHash: PLACEHOLDER

import type { ComponentSpec } from '../../../spec-type';

export const spec = {
  schemaVersion: 7 as const,
  name: 'Spinner',
  componentClass: 'presentational' as const,
  category: 'feedback',
  description: 'SVG-based spinning loading indicator with CSS keyframe animations for rotation and stroke dash',

  synonyms: ['loader', 'busy indicator', 'loading'],
  families: {
    behavior:  ["loading"],
    state:     ["stateless"],
    animation: ["continuous-loop"],
    a11y:      ["none"],
  },

  compound: false,
  rootElement: 'div',
  slots: [
    { name: 'root', element: 'div', description: 'Outer container with role="progressbar", sized via CSS token' },
    { name: 'svg', element: 'svg', description: 'SVG element with CSS keyframe rotation animation' },
    { name: 'circle', element: 'circle', description: 'SVG circle with CSS keyframe stroke-dash animation' },
  ],

  props: [
    { name: 'size', typeRef: 'Size', default: "'md'", moveSpecific: true, description: 'Spinner size' },
    { name: 'variant', type: "'default' | 'secondary' | 'current'", default: "'default'", moveSpecific: true, description: 'Stroke color variant' },
    { name: 'strokeWidth', type: 'number', default: '3', moveSpecific: true, description: 'SVG stroke width' },
  ],

  anatomy: {
    slot: 'root',
    dataAttributes: ['data-size', 'data-variant'],
    ariaAttributes: ['role', 'aria-busy'],
    children: [
      {
        slot: 'svg',
        children: [
          { slot: 'circle' },
        ],
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
    { id: 'css-rotation', description: 'SVG rotates via CSS @keyframes spinner-rotate (var(--move-spinner-speed) linear infinite)' },
    { id: 'css-dash', description: 'Circle stroke-dasharray animates via CSS @keyframes spinner-dash (1.5s ease-in-out infinite)' },
    { id: 'reduced-motion', description: 'CSS @media (prefers-reduced-motion: reduce) disables both rotation and dash animations' },
    { id: 'svg-viewbox', description: 'SVG viewBox is "25 25 50 50" with circle at cx=50 cy=50 r=20' },
  ],

  tokens: [
    { name: '--move-spinner-size', value: '48px', description: 'Overall width and height (varies by size prop)' },
    { name: '--move-spinner-stroke', value: 'var(--move-primary)', description: 'Circle stroke color (varies by variant prop)' },
    { name: '--move-spinner-speed', value: '2s', description: 'SVG rotation animation duration' },
  ],

  variants: {
    variant: ['default', 'secondary', 'current'] as string[],
  },
  sizes: ['sm', 'md', 'lg'] as string[],

  labels: [],

  hasHook: false,
  engineImports: ['withMoveComponent'],

  componentDeps: [],

  testing: {
    behaviors: [
      'Renders as div element with role="progressbar"',
      'Has aria-busy attribute',
      'Defaults to size=md',
      'Defaults to variant=default',
      'Defaults to strokeWidth=3',
      'Applies size via data-size attribute',
      'Applies variant via data-variant attribute',
      'Renders SVG with viewBox="25 25 50 50"',
      'Renders circle with cx=50, cy=50, r=20, fill=none',
      'strokeWidth prop is passed to circle element',
      'Circle has strokeMiterlimit=10',
      'Circle has strokeLinecap=round via CSS',
      'Forwards className and style',
      'Forwards ref to root element',
      'Spreads HTML attributes',
    ],
    animation: [
      'SVG rotates via CSS @keyframes spinner-rotate (360deg, linear, infinite)',
      'Circle stroke-dasharray animates via CSS @keyframes spinner-dash (1.5s ease-in-out infinite)',
      'Both animations disabled via prefers-reduced-motion media query',
    ],
  },

  defaultReview: {
    status: 'approved' as const,
    decisionSource: 'rule-based' as const,
    overrides: {},
  },
} satisfies ComponentSpec;
