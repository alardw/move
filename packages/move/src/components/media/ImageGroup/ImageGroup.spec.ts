// ImageGroup.spec.ts — Component specification
// specHash: PLACEHOLDER

import type { ComponentSpec } from '../../../spec-type';

export const spec = {
  schemaVersion: 7 as const,
  name: 'ImageGroup',
  componentClass: 'display' as const,
  category: 'media',
  description: 'CSS Grid wrapper for arranging images in a responsive column grid with gap, radius, and stagger enter animation',

  synonyms: ['gallery', 'image grid', 'photos', 'photo grid', 'thumbnails'],
  families: {
    behavior:  ["media"],
    state:     ["stateless"],
    animation: ["stagger"],
    a11y:      ["none"],
  },

  compound: false,
  rootElement: 'div',
  slots: [
    { name: 'root', element: 'div', description: 'Grid container with CSS grid layout; wrapped in a container-query wrapper for responsive breakpoints' },
  ],

  props: [
    { name: 'columns', type: 'number', default: '3', moveSpecific: true, description: 'Number of grid columns' },
    { name: 'gap', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'", default: "'md'", moveSpecific: true, description: 'Gap between grid items' },
    { name: 'radius', typeRef: 'Radius', moveSpecific: true, description: 'Border radius applied to child Image elements via CSS' },
    { name: 'animations', type: 'AnimationTrigger[] | false', moveSpecific: true, description: 'Stagger enter animation config for children, or false to disable' },
    { name: 'children', type: 'React.ReactNode', moveSpecific: false, description: 'Image components or other content placed in the grid' },
  ],

  anatomy: {
    slot: 'root',
    dataAttributes: ['data-columns', 'data-gap', 'data-radius'],
  },

  controlled: null,
  keyboard: null,
  focus: null,
  formType: null,
  asChild: false,

  animations: [
    { trigger: 'Root.enter', sequence: [{ children: ':scope > *', animation: { opacity: { from: 0, to: 1 }, scale: { from: 0.8, to: 1, ease: 'poppy' } }, stagger: { delay: 30 } }] },
  ],

  tokens: [] as { name: string; value: string; description: string }[],

  variants: {
    gap: ['xs', 'sm', 'md', 'lg', 'xl'] as string[],
    radius: ['none', 'sm', 'md', 'lg', 'full'] as string[],
  },
  sizes: [] as string[],

  labels: [],
  childrenKind: 'composition' as const,

  renderContracts: [
    { id: 'container-wrapper', description: 'Root is wrapped in a .wrapper div with container-type: inline-size to enable @container queries for responsive column collapse' },
    { id: 'columns-css-var', description: 'Column count is set via --move-imagegroup-columns CSS custom property on root inline style' },
    { id: 'responsive-collapse', description: 'At container width <= 40rem, 3+ column grids collapse to 2 columns; at <= 24rem, all grids collapse to 1 column' },
    { id: 'radius-child-inheritance', description: 'Radius is applied to direct children of root via .root[data-radius] > * CSS selectors, not on root itself' },
    { id: 'stagger-mount-animation', description: 'On mount, children animate in with staggered delay using anime.js; respects prefersReducedMotion' },
    { id: 'animate-false-disables', description: 'animations={false} disables the stagger enter animation entirely' },
  ],

  hasHook: false,
  engineImports: ['withMoveComponent', 'useMergedRef'] as string[],

  componentDeps: [] as string[],

  testing: {
    behaviors: [
      'Renders a grid with the specified number of columns (default 3)',
      'Sets --move-imagegroup-columns CSS variable on root',
      'Applies data-columns attribute on root',
      'Applies data-gap attribute on root (defaults to md)',
      'Applies data-radius attribute on root when provided',
      'Renders children inside the grid',
      'Wraps root in a container-query wrapper element',
      'Responsive: collapses to 2 columns at narrow container widths',
      'Responsive: collapses to 1 column at very narrow container widths',
      'Applies border-radius to direct children when radius is set',
      'Forwards className and style to root',
      'Forwards ref to root element',
      'Spreads HTML attributes',
    ],
    animation: [
      'Stagger enter animation plays on mount for child elements',
      'Children animate from opacity 0 + scale 0.5 to opacity 1 + scale 1 with stagger delay',
      'animations={false} disables stagger animation',
      'Reduced motion preference disables animation and sets final state immediately',
    ],
  },

  defaultReview: {
    status: 'approved' as const,
    decisionSource: 'user-confirmed' as const,
    overrides: {},
  },
} satisfies ComponentSpec;
