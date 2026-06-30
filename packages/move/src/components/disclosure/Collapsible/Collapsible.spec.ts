// Collapsible.spec.ts — Component specification
// specHash: PLACEHOLDER

import type { ComponentSpec } from '../../../spec-type';

export const spec = {
  schemaVersion: 7 as const,
  name: 'Collapsible',
  componentClass: 'disclosure' as const,
  category: 'disclosure',
  description: 'Single disclosure panel with open/close toggle, animated content reveal, optional asChild trigger, and auto-rotating icon',

  synonyms: ['expander', 'show more', 'disclosure', 'reveal', 'accordion'],
  animationPatterns: ['disclosure'],
  families: {
    behavior:  ['disclosure'],
    state:     ['controlled-open'],
    a11y:      ['disclosure'],
  },
  behavior: {
    disclosure: {
      animatesOpen: true,
      animatesClose: true,
      keyboardToggle: true,
      multipleOpen: false,             // single panel
    },
  },

  compound: true,
  rootElement: 'div',
  slots: [
    { name: 'root', element: 'div', description: 'Outer collapsible container with data-state' },
    { name: 'trigger', element: 'button', description: 'Button (or Slot.Root with asChild) that toggles open/closed' },
    { name: 'icon', element: 'span', description: 'Auto-rotating chevron indicator synchronized with content animation' },
    { name: 'content', element: 'div', description: 'Collapsible content region with height animation' },
    { name: 'contentInner', element: 'div', description: 'Inner content wrapper for opacity animation' },
  ],

  subComponents: [
    {
      name: 'Root',
      slots: [{ name: 'root', element: 'div', description: 'Outer container' }],
      props: [
        { name: 'open', type: 'boolean', moveSpecific: true, description: 'Controlled open state' },
        { name: 'defaultOpen', type: 'boolean', moveSpecific: true, description: 'Default open state for uncontrolled mode' },
        { name: 'onOpenChange', type: '(open: boolean) => void', moveSpecific: true, description: 'Called when open state changes' },
        { name: 'disabled', type: 'boolean', default: 'false', moveSpecific: true, description: 'Disable the collapsible (prevents toggling)' },
        { name: 'animations', type: 'AnimationTrigger[] | false', moveSpecific: true, description: 'Content animation config or false to disable' },
        { name: 'children', type: 'React.ReactNode', moveSpecific: false, description: 'Trigger, icon, and content elements' },
      ],
      usesFactory: true,
      description: 'Root container providing collapsible context (open state, animation config, disabled) to children',
    },
    {
      name: 'Trigger',
      slots: [{ name: 'trigger', element: 'button', description: 'Toggle button' }],
      props: [
        { name: 'asChild', type: 'boolean', moveSpecific: true, description: 'Merge props onto child element via Radix Slot instead of wrapping in button' },
        { name: 'children', type: 'React.ReactNode', moveSpecific: false, description: 'Trigger content' },
      ],
      usesFactory: true,
      radixPrimitive: 'Slot',
      description: 'Toggle button that calls context.toggle on click; supports asChild for custom trigger elements',
    },
    {
      name: 'Icon',
      slots: [{ name: 'icon', element: 'span', description: 'Icon wrapper' }],
      props: [
        { name: 'children', type: 'React.ReactNode', moveSpecific: false, description: 'Custom icon replacing the default chevron' },
      ],
      usesFactory: true,
      description: 'Auto-rotating chevron indicator that synchronizes rotation with content expand/collapse duration',
    },
    {
      name: 'Content',
      slots: [
        { name: 'content', element: 'div', description: 'Content outer (height animation)' },
        { name: 'contentInner', element: 'div', description: 'Content inner (opacity animation)' },
      ],
      props: [
        { name: 'children', type: 'React.ReactNode', moveSpecific: false, description: 'Collapsible content' },
      ],
      usesFactory: true,
      description: 'Animated collapsible region with coordinated height and opacity transitions',
    },
  ],

  props: [
    { name: 'open', type: 'boolean', moveSpecific: true, description: 'Controlled open state' },
    { name: 'defaultOpen', type: 'boolean', moveSpecific: true, description: 'Default open state for uncontrolled mode' },
    { name: 'onOpenChange', type: '(open: boolean) => void', moveSpecific: true, description: 'Called when open state changes' },
    { name: 'disabled', type: 'boolean', default: 'false', moveSpecific: true, description: 'Disable the collapsible' },
    { name: 'animations', type: 'AnimationTrigger[] | false', moveSpecific: true, description: 'Content animation config or false to disable' },
    { name: 'children', type: 'React.ReactNode', moveSpecific: false, description: 'Trigger, icon, and content' },
  ],

  anatomy: {
    slot: 'root',
    dataAttributes: ['data-state', 'data-disabled'],
    children: [
      {
        slot: 'trigger',
        dataAttributes: ['data-state', 'data-disabled'],
        ariaAttributes: ['aria-expanded'],
      },
      { slot: 'icon', ariaAttributes: ['aria-hidden=true'] },
      {
        slot: 'content',
        dataAttributes: ['data-state'],
        ariaAttributes: ['role=region'],
        children: [
          { slot: 'contentInner' },
        ],
      },
    ],
  },

  controlled: 'open' as const,
  controlledProps: {
    valueProp: 'open',
    defaultValueProp: 'defaultOpen',
    onChangeProp: 'onOpenChange',
  },
  keyboard: 'toggle' as const,
  focus: 'self' as const,
  formType: null,
  asChild: true,

  states: [
    { name: 'open', slot: 'Root', source: 'data-state', value: 'open' },
    { name: 'close', slot: 'Root', source: 'data-state', value: 'closed' },
  ],

  animations: [
    { trigger: 'open', sequence: [{ target: 'content', fn: 'animateDimension', animation: { height: { ease: 'poppy' } } }] },
    { trigger: 'close', sequence: [{ target: 'content', fn: 'animateDimension', animation: { height: { ease: 'snappy' } } }] },
  ],

  renderContracts: [
    { id: 'context-provider', description: 'Root wraps children in CollapsibleContext.Provider to share open state, animation config, and disabled state' },
    { id: 'trigger-as-child', description: 'When asChild=true, Trigger renders via Radix Slot.Root merging props onto the child element instead of wrapping in a button' },
    { id: 'trigger-type-button', description: 'When asChild is not set, Trigger renders as button with type=button' },
    { id: 'trigger-disabled', description: 'Trigger sets disabled and data-disabled when context.disabled is true' },
    { id: 'icon-rotation-sync', description: 'Icon rotation is synchronized with content expand/collapse animation duration via anime.js' },
    { id: 'icon-aria-hidden', description: 'Icon sets aria-hidden=true as it is a decorative indicator' },
    { id: 'icon-default-chevron', description: 'Icon renders a default chevron-down via useResolvedIcon when no children are provided' },
    { id: 'content-conditional-render', description: 'Content only renders when open or during close animation (unmounts when fully closed)' },
    { id: 'content-height-opacity', description: 'Content expand animates height from 0 to scrollHeight with delayed opacity fade-in; collapse reverses with early opacity fade-out' },
    { id: 'initial-state-mount', description: 'On mount, content sets height:0 and opacity:0 when closed, or height:auto and opacity:1 when open (no animation)' },
  ],

  tokens: [] as { name: string; value: string; description: string }[],

  variants: {},
  sizes: [] as string[],

  labels: [],
  childrenKind: 'composition' as const,

  radixPrimitive: 'Slot',

  hasHook: true,
  engineImports: ['withMoveComponent', 'useMergedRef'] as string[],

  componentDeps: [] as string[],

  testing: {
    behaviors: [
      'Root renders as div with data-state=open when open',
      'Root renders as div with data-state=closed when closed',
      'Root defaults to closed',
      'Root defaults to disabled=false',
      'Root sets data-disabled when disabled=true',
      'Trigger renders as button with type=button by default',
      'Trigger renders via Slot.Root when asChild=true',
      'Trigger sets aria-expanded=true when open',
      'Trigger sets aria-expanded=false when closed',
      'Trigger sets data-state matching open state',
      'Trigger sets disabled and data-disabled when disabled',
      'Clicking trigger toggles open state',
      'Clicking trigger when disabled does not toggle',
      'Icon renders default chevron-down when no children',
      'Icon renders custom children when provided',
      'Icon has aria-hidden=true',
      'Content renders role=region',
      'Content only renders when open or animating closed',
      'Content unmounts when fully closed',
      'Controlled open prop controls visibility',
      'onOpenChange fires when toggled',
      'defaultOpen=true starts open',
      'Each sub-component forwards className and style',
      'Each sub-component forwards ref',
    ],
    keyboard: [
      'Enter on trigger toggles open state',
      'Space on trigger toggles open state',
    ] as string[],
    aria: [
      'Trigger has aria-expanded reflecting open state',
      'Content has role=region',
      'Icon has aria-hidden=true',
      'Trigger sets data-disabled when disabled',
    ] as string[],
    animation: [
      'Content animates height from 0 to auto on open',
      'Content inner fades in with delayed opacity on open',
      'Content animates height to 0 on close',
      'Content inner fades out before height collapse',
      'Icon rotates to 180deg when opening',
      'Icon rotates to 0deg when closing',
      'Icon rotation duration matches content animation duration',
      'animations={false} disables content animation',
      'Reduced motion preference skips all animations',
      'Initial mount state sets correct height/opacity without animation',
    ] as string[],
  },

  iconsUsed: ['chevron-down'],
  defaultReview: {
    status: 'approved' as const,
    decisionSource: 'accept-all' as const,
    overrides: {},
  },
} satisfies ComponentSpec;
