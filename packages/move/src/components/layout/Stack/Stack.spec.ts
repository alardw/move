// Stack.spec.ts — Component specification
// specHash: ff9e4b6e

import type { ComponentSpec } from '../../../spec-type';

export const spec = {
  schemaVersion: 7 as const,
  name: 'Stack',
  componentClass: 'presentational' as const,
  category: 'layout',
  description: 'Flex layout container for vertical or horizontal stacking with configurable gap, alignment, and responsive collapse',

  synonyms: ['flex', 'column', 'row', 'flex layout'],
  animationPatterns: ['layoutReveal'],
  families: {
    behavior:  ["layout"],
    state:     ["stateless"],
    a11y:      ["none"],
  },

  compound: false,
  rootElement: 'div',
  slots: [
    { name: 'root', element: 'div', description: 'Flex container element' },
  ],

  props: [
    { name: 'direction', type: "'row' | 'column'", default: "'column'", moveSpecific: true, description: 'Flex direction' },
    { name: 'gap', typeRef: 'Gap', default: "'md'", moveSpecific: true, description: 'Gap between children' },
    { name: 'padding', typeRef: 'GapWithXL2', moveSpecific: true, description: 'Padding around the stack. Uses the extended scale (adds 2xl/3xl) since stacks frequently sit at page-level scope.' },
    { name: 'align', type: "'start' | 'center' | 'end' | 'stretch' | 'baseline'", default: "'stretch'", moveSpecific: true, description: 'Cross-axis alignment (align-items)' },
    { name: 'justify', type: "'start' | 'center' | 'end' | 'between' | 'evenly'", default: "'start'", moveSpecific: true, description: 'Main-axis alignment (justify-content)' },
    { name: 'wrap', type: 'boolean', default: 'false', moveSpecific: true, description: 'Allow children to wrap to next line' },
    { name: 'collapseBelow', type: 'string', moveSpecific: true, description: 'Container width threshold (px) below which direction collapses to column' },
    { name: 'flex', type: "1 | 'auto' | 'none'", moveSpecific: true, description: "Flex sizing along the parent's main axis. 1 = grow to fill remaining space (with min-width:0 so wide children scroll instead of overflowing the row); 'auto' = size to content but allow grow/shrink; 'none' = fixed at content size." },
    { name: 'fill', type: "boolean | 'screen'", moveSpecific: true, description: "Stretch to fill height. true = 100% of the parent (the parent must be sized); 'screen' = the viewport (100dvh), for app-shell roots that own the full window height." },
    { name: 'stagger', type: "boolean | { delay?: number; from?: 'first' | 'last' | 'center' }", default: 'false', moveSpecific: true, description: "Opt-in: reveal direct children with a staggered fade+rise entrance on mount. `true` uses defaults (60ms between items, from first); pass an object to tune `delay`/`from`. Off by default — when unset, Stack renders with no animation. Disable or override via the `animations` prop." },
    { name: 'animations', type: 'AnimationTrigger[] | false', moveSpecific: true, description: 'Override or disable the entrance stagger animation (only relevant when `stagger` is set).' },
    { name: 'children', type: 'React.ReactNode', moveSpecific: false, description: 'Child elements to lay out' },
  ],

  anatomy: {
    slot: 'root',
    dataAttributes: ['data-direction', 'data-gap', 'data-align', 'data-justify', 'data-padding', 'data-wrap', 'data-collapsed', 'data-flex', 'data-fill'],
  },

  controlled: null,
  keyboard: null,
  focus: null,
  formType: null,
  asChild: false,

  animations: [],

  tokens: [
    { name: '--move-stack-gap-none', value: '0', description: 'Gap when gap=none' },
    { name: '--move-stack-gap-xs', value: 'var(--move-spacing-xs)', description: 'Gap when gap=xs' },
    { name: '--move-stack-gap-sm', value: 'var(--move-spacing-sm)', description: 'Gap when gap=sm' },
    { name: '--move-stack-gap-md', value: 'var(--move-spacing-md)', description: 'Gap when gap=md' },
    { name: '--move-stack-gap-lg', value: 'var(--move-spacing-lg)', description: 'Gap when gap=lg' },
    { name: '--move-stack-gap-xl', value: 'var(--move-spacing-xl)', description: 'Gap when gap=xl' },
  ],

  variants: {
    direction: ['row', 'column'] as string[],
    gap: ['xs', 'sm', 'md', 'lg', 'xl', 'none'] as string[],
    align: ['start', 'center', 'end', 'stretch', 'baseline'] as string[],
    justify: ['start', 'center', 'end', 'between', 'evenly'] as string[],
  },
  sizes: [] as string[],

  labels: [],
  childrenKind: 'composition' as const,

  renderContracts: [
    { id: 'direction-data-attr', description: 'Direction is applied via data-direction attribute, flex-direction resolved in CSS' },
    { id: 'gap-data-attr', description: 'Gap is applied via data-gap attribute, gap value resolved via component tokens in CSS' },
    { id: 'align-data-attr', description: 'Align is applied via data-align attribute, align-items resolved in CSS' },
    { id: 'justify-data-attr', description: 'Justify is applied via data-justify attribute, justify-content resolved in CSS' },
    { id: 'wrap-data-attr', description: 'Wrap is applied via data-wrap boolean attribute when wrap=true' },
    { id: 'collapse-responsive', description: 'When collapseBelow is set, a ResizeObserver sets data-collapsed on the root when container width is below the threshold, overriding direction to column' },
    { id: 'stagger-opt-in', description: "When the `stagger` prop is set, a Root.enter trigger animates direct children (`:scope > *`) with a staggered fade+rise (opacity 0→1, translateY 8→0, outQuart ~200ms) via useAnimations + resolveAnimationsConfig — the same declarative children-stagger pattern as List/Table/Timeline. When the prop is absent, no animation config is built and no animation wiring runs. Consumers can pass `animations={false}` to disable or an AnimationTrigger[] to override." },
  ],

  hasHook: false,
  engineImports: ['withMoveComponent'],

  componentDeps: [] as string[],

  testing: {
    behaviors: [
      'Renders as div element',
      'Renders children content',
      'Applies direction via data-direction attribute',
      'Applies gap via data-gap attribute',
      'Applies align via data-align attribute',
      'Applies justify via data-justify attribute',
      'Defaults to direction=column',
      'Defaults to gap=md',
      'Defaults to align=stretch',
      'Defaults to justify=start',
      'Defaults to wrap=false (no data-wrap attribute)',
      'Applies data-wrap attribute when wrap=true',
      'Omits data-wrap when wrap is false or not provided',
      'Sets data-collapsed when container width is below collapseBelow threshold',
      'Removes data-collapsed when container width is at or above collapseBelow threshold',
      'Omits collapse behavior when collapseBelow is not provided',
      'Forwards className and style',
      'Forwards ref to root element',
      'Spreads HTML attributes',
      'Renders no animation wiring when stagger prop is absent (default off)',
      'Reveals direct children with a staggered entrance on mount when stagger prop is set',
    ],
    animation: [
      'stagger prop injects a Root.enter children-stagger; animations={false} disables it',
    ],
  },

  defaultReview: {
    status: 'approved' as const,
    decisionSource: 'rule-based' as const,
    overrides: {},
  },
} satisfies ComponentSpec;
