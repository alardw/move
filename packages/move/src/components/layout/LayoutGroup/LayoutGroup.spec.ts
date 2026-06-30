// LayoutGroup.spec.ts — Component specification
// specHash: ca963d3b

import type { ComponentSpec } from '../../../spec-type';

export const spec = {
  schemaVersion: 7 as const,
  name: 'LayoutGroup',
  componentClass: 'presentational' as const,
  category: 'layout',
  description:
    'Container that FLIP-animates its direct children to their new positions when the set or order changes (filter, sort, reorder, add, remove)',

  synonyms: [
    'flip',
    'animated list',
    'auto animate',
    'reorder',
    'layout transition',
    'filter group',
  ],
  families: {
    behavior: ['layout', 'motion'],
    state: ['stateless'],
    a11y: ['none'],
  },

  compound: false,
  rootElement: 'div',
  slots: [
    {
      name: 'root',
      element: 'div',
      description:
        'Container whose direct children are FLIP-animated when they reorder, filter, add, or remove',
    },
  ],

  props: [
    {
      name: 'children',
      type: 'React.ReactNode',
      moveSpecific: false,
      description:
        'Items to lay out. Each needs a stable React key so the FLIP engine can track it across reorders.',
    },
    {
      name: 'as',
      type: "'div' | 'ul' | 'ol' | 'section'",
      default: "'div'",
      moveSpecific: true,
      description: 'Semantic container element to render.',
    },
    {
      name: 'asChild',
      type: 'boolean',
      default: 'false',
      moveSpecific: true,
      description:
        'Render onto the single child element (e.g. wrap a `Stack` or `Grid`) via Radix Slot, so that component provides the layout while LayoutGroup FLIP-animates its children. The wrapped element becomes the tracked container.',
    },
    {
      name: 'enter',
      type: "'fade' | 'scale' | 'fade-scale' | 'none'",
      default: "'fade-scale'",
      moveSpecific: true,
      description: 'Entrance animation for newly added children.',
    },
    {
      name: 'exit',
      type: "'fade' | 'scale' | 'fade-scale' | 'none'",
      default: "'fade-scale'",
      moveSpecific: true,
      description:
        'Exit animation for removed children (the node is briefly retained to animate out, then unmounted).',
    },
    {
      name: 'duration',
      type: 'number',
      default: '350',
      moveSpecific: true,
      description: 'Duration in ms of the position move and enter/exit animations.',
    },
    {
      name: 'stagger',
      type: 'number',
      default: '0',
      moveSpecific: true,
      description:
        'Delay in ms between children for the one-time `initial` mount reveal. Ongoing changes (moves, entrances, exits) stay synchronized so filtering reads as one coherent reflow rather than a top-to-bottom cascade. 0 disables staggering.',
    },
    {
      name: 'initial',
      type: 'boolean',
      default: 'false',
      moveSpecific: true,
      description:
        'Also play the enter animation (staggered) for the children present at mount — a one-time entrance reveal on load.',
    },
    {
      name: 'disabled',
      type: 'boolean',
      default: 'false',
      moveSpecific: true,
      description:
        'Opt out of animation — children jump straight to their final layout. Also implied by prefers-reduced-motion.',
    },
    {
      name: 'className',
      type: 'string',
      moveSpecific: false,
      description: 'Class applied to the root.',
    },
    {
      name: 'style',
      type: 'React.CSSProperties',
      moveSpecific: false,
      description: 'Inline style applied to the root.',
    },
  ],

  anatomy: {
    slot: 'root',
    dataAttributes: ['data-enter', 'data-exit'],
  },

  controlled: null,
  keyboard: null,
  focus: null,
  formType: null,
  asChild: true,

  // The animated node set is data-driven and only known at runtime, so it can't
  // be expressed by the declarative trigger system. FLIP is handled imperatively
  // by the useAutoLayout primitive, declared as the Tier-2 layoutFlip capability.
  animations: [],
  animationCapabilities: ['layoutFlip'],

  tokens: [],

  variants: {
    enter: ['fade', 'scale', 'fade-scale', 'none'],
    exit: ['fade', 'scale', 'fade-scale', 'none'],
  },
  sizes: [],

  labels: [],
  childrenKind: 'composition' as const,
  propRoles: {
    children: 'composition',
    enter: 'behavior',
    exit: 'behavior',
  },

  renderContracts: [
    {
      id: 'layout-flip',
      description:
        'Children are FLIP-animated via the useAutoLayout primitive (MutationObserver on the root + a per-element rect cache + anime.js animate). When the set/order changes: remaining children animate from their old to new positions (transforms only), added children play the `enter` animation, and removed children are briefly re-inserted to play the `exit` animation before being unmounted — so no React deferred-unmount/AnimatePresence is required.',
    },
    {
      id: 'reduced-motion-or-disabled',
      description:
        'When `disabled` is set or prefers-reduced-motion: reduce, no FLIP runs — children appear directly at their final layout.',
    },
    {
      id: 'a11y-visual-only',
      description:
        'Animations are purely visual (CSS transforms); the primitive never moves focus. Source order and tab order follow the real DOM (React-controlled). Children that are mid-exit are marked aria-hidden so assistive tech ignores the leaving copy.',
    },
    {
      id: 'stable-keys',
      description:
        'Children must have stable React keys; the engine tracks elements across reorders by DOM identity, so unkeyed/index-keyed children will mis-track.',
    },
    {
      id: 'polymorphic',
      description: 'Renders as the element from the `as` prop (div, ul, ol, section).',
    },
    {
      id: 'as-child',
      description:
        "With `asChild`, renders via Radix Slot onto the single child element (e.g. a `Stack` or `Grid`), merging ref + data attributes — so the wrapped component provides the flex/grid layout while LayoutGroup tracks and FLIP-animates that element's children.",
    },
  ],

  hasHook: false,
  engineImports: ['withMoveComponent', 'useMergedRef'],

  componentDeps: [],

  testing: {
    behaviors: [
      'Renders its children',
      'Renders as a div by default',
      'Renders as the specified element via as prop (ul, ol, section)',
      'Applies data-enter and data-exit attributes',
      'Forwards className and style',
      'Forwards ref to the root element',
      'Spreads HTML attributes',
      'Renders with no animation wiring when disabled',
    ],
    animation: [
      'Repositions remaining children when the order changes',
      'Plays the enter animation for newly added children',
      'Plays the exit animation for removed children, then unmounts them',
      'When disabled or prefers-reduced-motion, applies the final layout instantly',
    ],
  },

  defaultReview: {
    status: 'approved' as const,
    decisionSource: 'rule-based' as const,
    overrides: {},
  },
} satisfies ComponentSpec;
