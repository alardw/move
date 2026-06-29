// AnimatedText.spec.ts — Component specification
// specHash: e7eefb38

import type { ComponentSpec } from '../../../spec-type';

export const spec = {
  schemaVersion: 7 as const,
  name: 'AnimatedText',
  componentClass: 'presentational' as const,
  category: 'typography',
  description:
    'Reveals text with a staggered per-character, per-word, or per-line entrance animation (anime.js splitText)',

  synonyms: ['split text', 'text reveal', 'animated heading', 'stagger text', 'text animation'],
  families: {
    behavior: ['typography', 'motion'],
    state: ['stateless'],
    a11y: ['label'],
  },

  compound: false,
  rootElement: 'span',
  slots: [
    {
      name: 'root',
      element: 'span',
      description:
        'Text container (renders as the element from the `as` prop). Holds the split segments plus an injected visually-hidden full-text copy for screen readers.',
    },
  ],

  props: [
    {
      name: 'children',
      type: 'React.ReactNode',
      moveSpecific: false,
      description: 'The text to animate — a plain string, or (with `asChild`) a single element like `<Heading>` whose text content is split.',
    },
    {
      name: 'as',
      type: "'span' | 'p' | 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'",
      default: "'span'",
      moveSpecific: true,
      description: 'HTML element to render the container as. Typography is controlled by `size`/`weight`, not by the element — so the element is purely semantic.',
    },
    {
      name: 'asChild',
      type: 'boolean',
      default: 'false',
      moveSpecific: true,
      description: 'Render onto the single child element (e.g. wrap a `Heading` or `Text`) via Radix Slot, instead of AnimatedText\'s own element — so the animated text keeps the wrapped component\'s typography. The child\'s text content is what gets split.',
    },
    {
      name: 'size',
      type: "'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl'",
      moveSpecific: true,
      description: 'Optional font size from the Move typography scale. When omitted, the text inherits its surrounding typography (no data-size, no override).',
    },
    {
      name: 'weight',
      type: "'normal' | 'medium' | 'semibold' | 'bold'",
      moveSpecific: true,
      description: 'Optional font weight from the Move typography scale. When omitted, the text inherits its surrounding weight (no data-weight, no override).',
    },
    {
      name: 'by',
      type: "'character' | 'word' | 'line'",
      default: "'word'",
      moveSpecific: true,
      description: 'Granularity the text is split into before staggering',
    },
    {
      name: 'effect',
      type: "'fade' | 'slideUp' | 'blurUp' | 'scale'",
      default: "'fade'",
      moveSpecific: true,
      description: 'Per-segment entrance animation',
    },
    {
      name: 'trigger',
      type: "'mount' | 'inView' | 'hover'",
      default: "'inView'",
      moveSpecific: true,
      description:
        "When the reveal runs: immediately on mount, when scrolled into view (IntersectionObserver), or on pointer hover",
    },
    {
      name: 'once',
      type: 'boolean',
      default: 'true',
      moveSpecific: true,
      description: 'For inView/hover triggers, animate only the first time (do not re-run on re-entry)',
    },
    {
      name: 'stagger',
      type: 'number',
      default: 'null',
      moveSpecific: true,
      description:
        'Delay in ms between segments. When null, a sensible per-`by` default is used (~30 character / 60 word / 120 line).',
    },
    {
      name: 'delay',
      type: 'number',
      default: '0',
      moveSpecific: true,
      description: 'Delay in ms before the first segment animates',
    },
    {
      name: 'duration',
      type: 'number',
      default: '600',
      moveSpecific: true,
      description: 'Duration in ms of each segment animation',
    },
  ],

  anatomy: {
    slot: 'root',
    dataAttributes: ['data-by', 'data-effect', 'data-animated', 'data-size', 'data-weight'],
  },

  controlled: null,
  keyboard: null,
  focus: null,
  formType: null,
  asChild: true,

  // Declarative trigger system can't express a runtime-generated, data-dependent
  // node set. Splitting + staggering is handled imperatively by the useSplitText
  // primitive, declared as a Tier-2 textSplit capability.
  animations: [],
  animationCapabilities: ['textSplit'],

  tokens: [],

  variants: {
    effect: ['fade', 'slideUp', 'blurUp', 'scale'],
    by: ['character', 'word', 'line'],
    weight: ['normal', 'medium', 'semibold', 'bold'],
  },
  sizes: ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl'],

  labels: [],
  childrenKind: 'text' as const,
  propRoles: {
    children: 'displayText',
    by: 'behavior',
    effect: 'behavior',
    trigger: 'behavior',
  },

  renderContracts: [
    {
      id: 'accessible-split',
      description:
        'Splitting uses anime.js splitText({ accessible: true }): a visually-hidden span carrying the full original string is injected, and every generated visible segment is marked aria-hidden, so screen readers read the sentence once rather than segment-by-segment.',
    },
    {
      id: 'reduced-motion',
      description:
        'When prefers-reduced-motion: reduce, skip splitting/animation entirely and render the final text immediately (no hidden initial state).',
    },
    {
      id: 'resplit-on-change',
      description:
        'When the children string changes, revert the previous split and re-split/re-animate from the new text.',
    },
    {
      id: 'dynamic-element',
      description: 'Renders as the HTML element specified by the `as` prop (span, p, div, h1–h6).',
    },
    {
      id: 'trigger-inview',
      description:
        'trigger="inView" uses an IntersectionObserver on the root; with once=true the observer disconnects after the first reveal.',
    },
    {
      id: 'as-child',
      description: 'With `asChild`, renders via Radix Slot onto the single child element (e.g. a `Heading`), merging ref + data attributes; splitText runs on that element and the child\'s text content is split — so the animation inherits the wrapped component\'s typography with no size/weight needed.',
    },
    {
      id: 'typography-tokens',
      description: 'By default the text inherits its surrounding typography (no data-size/data-weight emitted). When `size`/`weight` are set they apply via data-size/data-weight (Move typography tokens), overriding any element default. The root always resets element margin to 0, so rendering as a heading or `<p>` does not add the browser default block margins.',
    },
    {
      id: 'no-layout-shift',
      description:
        'The initial pre-animation state must not collapse layout — segments occupy their final box (opacity/transform/filter only), so reserving space does not reflow surrounding content.',
    },
  ],

  hasHook: false,
  engineImports: ['withMoveComponent'],

  componentDeps: [],

  testing: {
    behaviors: [
      'Renders the full text content',
      'Renders as span by default',
      'Renders as specified element via as prop (p, div, h1–h6)',
      'Defaults to by=word',
      'Defaults to effect=fade',
      'Defaults to trigger=inView',
      'Defaults to once=true',
      'Defaults to duration=600',
      'Splits text into character segments when by=character',
      'Splits text into word segments when by=word',
      'Splits text into line segments when by=line',
      'Applies by via data-by attribute',
      'Applies effect via data-effect attribute',
      'Applies data-size only when size is set; inherits typography otherwise',
      'Applies data-weight only when weight is set; inherits weight otherwise',
      're-splits and re-animates when the children string changes',
      'trigger=mount begins animating without scroll/hover',
      'Forwards className and style',
      'Forwards ref to root element',
      'Spreads HTML attributes',
    ],
    aria: [
      'A visually-hidden element carries the full original text for screen readers',
      'Generated visible split segments are aria-hidden',
    ],
    animation: [
      'When prefers-reduced-motion: reduce, no split occurs and final text renders immediately',
      'Each segment is staggered by the resolved stagger delay',
      'Root sets data-animated after the reveal completes',
    ],
  },

  defaultReview: {
    status: 'approved' as const,
    decisionSource: 'rule-based' as const,
    overrides: {},
  },
} satisfies ComponentSpec;
