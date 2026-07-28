// Skeleton.spec.ts — Component specification

import type { ComponentSpec } from '../../../spec-type';

export const spec = {
  schemaVersion: 1 as const,
  name: 'Skeleton',
  animationPatterns: ['loader'],
  componentClass: 'presentational' as const,
  category: 'feedback',
  description: 'Compound placeholder shapes for loading states with pulse and wave animation modes',
  choreographies: ['loader'],
  families: {
    behavior: ['loading'],
    state: ['stateless'],
    a11y: ['none'],
  },

  compound: true,
  rootElement: 'div',
  slots: [
    {
      name: 'root',
      element: 'div',
      description:
        'Root container that provides context and inheritable CSS tokens; uses display:contents',
    },
    { name: 'circle', element: 'div', description: 'Circular skeleton placeholder shape' },
    {
      name: 'rectangle',
      element: 'div',
      description: 'Rectangular skeleton placeholder shape with sharp corners',
    },
    {
      name: 'rounded',
      element: 'div',
      description: 'Rounded skeleton placeholder shape with configurable border-radius',
    },
    {
      name: 'text',
      element: 'div',
      description: 'Text skeleton container with multiple line placeholders',
    },
    { name: 'line', element: 'div', description: 'Individual text line within SkeletonText' },
  ],

  subComponents: [
    {
      name: 'Root',
      slots: [
        {
          name: 'root',
          element: 'div',
          description: 'Root container providing SkeletonContext and wave animation driver',
        },
      ],
      props: [
        {
          name: 'children',
          type: 'React.ReactNode',
          moveSpecific: false,
          description: 'Shape sub-components to render',
        },
        {
          name: 'loading',
          type: 'boolean',
          default: 'true',
          moveSpecific: true,
          description: 'Whether to render skeleton (returns null when false)',
        },
        {
          name: 'animation',
          type: "'pulse' | 'wave' | false",
          default: "'pulse'",
          moveSpecific: true,
          description: 'Animation style: pulse fades opacity, wave sweeps a highlight gradient',
        },
      ],
      usesFactory: true,
      description:
        'Container that provides animation context and conditionally renders children based on loading state',
    },
    {
      name: 'Circle',
      slots: [
        { name: 'circle', element: 'div', description: 'Circular shape with full border-radius' },
      ],
      props: [
        {
          name: 'diameter',
          typeRef: 'Dimension',
          default: '40',
          moveSpecific: true,
          description:
            'Circle diameter. A number is pixels; a string is any CSS length. Named `diameter` rather than `size` because `size` is the scale token everywhere else in the library.',
        },
      ],
      usesFactory: true,
      description: 'Circular skeleton placeholder',
    },
    {
      name: 'Rectangle',
      slots: [
        {
          name: 'rectangle',
          element: 'div',
          description: 'Rectangular shape with no border-radius',
        },
      ],
      props: [
        {
          name: 'width',
          typeRef: 'Dimension',
          default: "'100%'",
          moveSpecific: true,
          description: 'Rectangle width',
        },
        {
          name: 'height',
          typeRef: 'Dimension',
          default: "'1rem'",
          moveSpecific: true,
          description: 'Rectangle height',
        },
      ],
      usesFactory: true,
      description: 'Rectangular skeleton placeholder with sharp corners',
    },
    {
      name: 'Rounded',
      slots: [
        {
          name: 'rounded',
          element: 'div',
          description: 'Rounded shape with configurable border-radius',
        },
      ],
      props: [
        {
          name: 'width',
          typeRef: 'Dimension',
          default: "'100%'",
          moveSpecific: true,
          description: 'Width of the rounded shape',
        },
        {
          name: 'height',
          typeRef: 'Dimension',
          default: "'1rem'",
          moveSpecific: true,
          description: 'Height of the rounded shape',
        },
        {
          name: 'radius',
          type: 'string',
          default: "'var(--move-skeleton-radius)'",
          moveSpecific: true,
          description: 'Border radius value',
        },
      ],
      usesFactory: true,
      description: 'Skeleton placeholder with configurable border-radius',
    },
    {
      name: 'Text',
      slots: [
        {
          name: 'text',
          element: 'div',
          description: 'Text skeleton container with flex column layout',
        },
        { name: 'line', element: 'div', description: 'Individual text line placeholder' },
      ],
      props: [
        {
          name: 'lines',
          type: 'number',
          default: '3',
          moveSpecific: true,
          description: 'Number of text lines to render',
        },
        {
          name: 'spacing',
          type: 'string',
          default: "'var(--move-skeleton-text-spacing)'",
          moveSpecific: true,
          description: 'Gap between lines',
        },
        {
          name: 'lineHeight',
          type: 'string',
          default: "'var(--move-skeleton-text-line-height)'",
          moveSpecific: true,
          description: 'Height of each line',
        },
        {
          name: 'lastLineWidth',
          type: 'string',
          default: "'60%'",
          moveSpecific: true,
          description: 'Width of the last line (shorter for realism)',
        },
      ],
      usesFactory: true,
      description: 'Multi-line text skeleton placeholder',
    },
  ],

  props: [
    {
      name: 'loading',
      type: 'boolean',
      default: 'true',
      moveSpecific: true,
      description: 'Whether to render the skeleton (Root prop)',
    },
    {
      name: 'animation',
      type: "'pulse' | 'wave' | false",
      default: "'pulse'",
      moveSpecific: true,
      description: 'Animation style (Root prop)',
    },
    {
      name: 'children',
      type: 'React.ReactNode',
      moveSpecific: false,
      description: 'Shape sub-components (Root prop)',
    },
  ],

  anatomy: {
    slot: 'root',
    dataAttributes: ['data-animation'],
    ariaAttributes: ['aria-busy', 'aria-live'],
    children: [
      { slot: 'circle' },
      { slot: 'rectangle' },
      { slot: 'rounded' },
      {
        slot: 'text',
        children: [{ slot: 'line' }],
      },
    ],
  },

  controlled: null,
  keyboard: null,
  focus: null,
  formType: null,
  asChild: false,

  animationCapabilities: ['valueLoop'],
  animations: [],

  renderContracts: [
    {
      id: 'loading-conditional',
      description: 'Root returns null when loading=false; renders children only when loading=true',
    },
    {
      id: 'context-provider',
      description: 'Root provides SkeletonContext with animation value to all child shapes',
    },
    {
      id: 'pulse-anime',
      description:
        'Pulse animation uses anime.js to loop opacity [1, 0.4, 1] over 1500ms with inOutQuad easing on each shape',
    },
    {
      id: 'wave-anime',
      description:
        'Wave animation uses anime.js on Root to animate --move-skeleton-wave-x from 100% to 0% (1800ms inOutSine loop); shapes inherit via CSS custom property',
    },
    {
      id: 'wave-gradient',
      description:
        'Wave shapes use CSS linear-gradient with background-position-x driven by --move-skeleton-wave-x',
    },
    {
      id: 'reduced-motion',
      description:
        'Both pulse and wave animations are skipped when prefersReducedMotion() returns true',
    },
    {
      id: 'text-last-line',
      description: 'SkeletonText renders last line at lastLineWidth (60% default) when lines > 1',
    },
    {
      id: 'size-inline-style',
      description:
        'Circle, Rectangle, and Rounded set dimensions via inline style (not data attributes)',
    },
    {
      id: 'rounded-radius-inline',
      description: 'Rounded sets borderRadius via inline style from radius prop',
    },
    {
      id: 'root-display-contents',
      description: 'Root uses display:contents to avoid layout impact',
    },
  ],

  tokens: [
    {
      name: '--move-skeleton-bg',
      value: 'var(--move-bg-emphasis)',
      description: 'Background color for all skeleton shapes',
    },
    {
      name: '--move-skeleton-radius',
      value: 'var(--move-rounded-md)',
      description: 'Default border radius for Rounded sub-component',
    },
    {
      name: '--move-skeleton-line-radius',
      value: 'var(--move-rounded-sm)',
      description: 'Border radius for text line elements',
    },
    {
      name: '--move-skeleton-text-spacing',
      value: 'var(--move-spacing-sm)',
      description: 'Gap between text lines',
    },
    {
      name: '--move-skeleton-text-line-height',
      value: '0.75rem',
      description: 'Height of each text line placeholder',
    },
  ],

  variants: {},
  sizes: [] as string[],

  labels: [],
  childrenKind: 'composition' as const,

  hasHook: false,
  engineImports: ['withMoveComponent'],

  componentDeps: [],

  testing: {
    behaviors: [
      'Root renders children when loading=true',
      'Root returns null when loading=false',
      'Root has aria-busy attribute',
      'Root has aria-live="polite" attribute',
      'Root sets data-animation attribute to animation value',
      'Root omits data-animation when animation is false',
      'Root uses display:contents',
      'Circle renders with full border-radius',
      'Circle size prop sets width and height (number converts to px)',
      'Circle defaults to size=40',
      'Rectangle renders with no border-radius',
      'Rectangle defaults to width=100% and height=1rem',
      'Rounded renders with configurable border-radius',
      'Rounded defaults to radius=var(--move-skeleton-radius)',
      'Text renders correct number of lines based on lines prop',
      'Text defaults to lines=3',
      'Text last line has width=60% when lines > 1',
      'Text spacing sets gap on text container',
      'All shapes inherit background-color from --move-skeleton-bg token',
      'Each sub-component forwards className and style',
      'Each sub-component forwards ref to its root element',
      'Each sub-component spreads HTML attributes',
    ],
    animation: [
      'Pulse: anime.js loops opacity [1, 0.4, 1] (1500ms inOutQuad) on each shape element',
      'Wave: anime.js animates --move-skeleton-wave-x on Root from 100% to 0% (1800ms inOutSine loop)',
      'Wave: shapes use CSS gradient with background-position-x driven by inherited --move-skeleton-wave-x',
      'Pulse and wave animations respect prefersReducedMotion',
    ],
  },
} satisfies ComponentSpec;
