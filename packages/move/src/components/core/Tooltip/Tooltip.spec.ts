// Tooltip.spec.ts — Component specification
// specHash: PLACEHOLDER

export const spec = {
  schemaVersion: 7 as const,
  name: 'Tooltip',
  componentClass: 'overlay_popup' as const,
  category: 'core',
  description: 'Floating label that appears on hover/focus to describe an element, with spring entrance and direction-aware positioning',

  synonyms: ['hint', 'tip', 'label', 'overlay tip'],
  families: {
    behavior:  ['popup-anchored'],
    state:     ['controlled-open'],
    animation: ['scale-fade'],
    a11y:      ['tooltip'],
  },
  behavior: {
    popup: {
      // Tooltip closes when the trigger loses hover/focus, not on
      // outside click or escape — those flags don't apply. Same with
      // scroll/resize, which keep the tooltip pinned via Radix.
      closeOnEscape: false,
      closeOnOutsideClick: false,
      closeOnScroll: false,
      closeOnResize: false,
    },
  },

  compound: true,
  rootElement: 'div',
  slots: [
    { name: 'trigger', element: 'button', description: 'Element that activates the tooltip on hover/focus' },
    { name: 'content', element: 'div', description: 'Tooltip popup container with inverted colors' },
    { name: 'arrow', element: 'svg', description: 'Arrow pointing toward the trigger' },
  ],

  subComponents: [
    {
      name: 'Provider',
      slots: [],
      props: [
        { name: 'children', type: 'React.ReactNode', moveSpecific: false, description: 'App or section content' },
        { name: 'delayDuration', type: 'number', moveSpecific: false, description: 'Delay before first tooltip opens (ms)' },
        { name: 'skipDelayDuration', type: 'number', moveSpecific: false, description: 'Delay before subsequent tooltips open (ms)' },
        { name: 'disableHoverableContent', type: 'boolean', moveSpecific: false, description: 'Prevent tooltip content from staying open on hover' },
      ],
      usesFactory: false,
      description: 'Context provider to share delay settings across tooltip instances',
    },
    {
      name: 'Root',
      slots: [],
      props: [
        { name: 'children', type: 'React.ReactNode', moveSpecific: false, description: 'Trigger and content elements' },
        { name: 'open', type: 'boolean', moveSpecific: false, description: 'Controlled open state' },
        { name: 'defaultOpen', type: 'boolean', moveSpecific: false, description: 'Initial open state (uncontrolled)' },
        { name: 'onOpenChange', type: '(open: boolean) => void', moveSpecific: false, description: 'Called when open state changes' },
        { name: 'delayDuration', type: 'number', moveSpecific: false, description: 'Delay before tooltip opens (ms)' },
        { name: 'disableHoverableContent', type: 'boolean', moveSpecific: false, description: 'Prevent content from staying open on hover' },
      ],
      usesFactory: false,
      description: 'Stateless root that manages open/close state via Radix Tooltip.Root',
    },
    {
      name: 'Trigger',
      slots: [{ name: 'trigger', element: 'button', description: 'Trigger element' }],
      props: [
        { name: 'className', type: 'string', moveSpecific: false, description: 'CSS class name' },
        { name: 'style', type: 'React.CSSProperties', moveSpecific: false, description: 'Inline styles' },
        { name: 'children', type: 'React.ReactNode', moveSpecific: false, description: 'Trigger content' },
        { name: 'asChild', type: 'boolean', moveSpecific: false, description: 'Merge props onto child element instead of wrapping' },
      ],
      usesFactory: true,
      description: 'Element that opens tooltip on hover/focus; wraps Radix Tooltip.Trigger',
    },
    {
      name: 'Content',
      slots: [{ name: 'content', element: 'div', description: 'Tooltip popup container' }],
      props: [
        { name: 'className', type: 'string', moveSpecific: false, description: 'CSS class name' },
        { name: 'style', type: 'React.CSSProperties', moveSpecific: false, description: 'Inline styles' },
        { name: 'children', type: 'React.ReactNode', moveSpecific: false, description: 'Tooltip content' },
        { name: 'side', type: "'top' | 'right' | 'bottom' | 'left'", default: "'top'", moveSpecific: false, description: 'Preferred side relative to trigger' },
        { name: 'sideOffset', type: 'number', moveSpecific: false, description: 'Distance from trigger in px' },
        { name: 'align', type: "'start' | 'center' | 'end'", default: "'center'", moveSpecific: false, description: 'Alignment along the side axis' },
        { name: 'alignOffset', type: 'number', moveSpecific: false, description: 'Alignment offset in px' },
        { name: 'container', type: 'HTMLElement', moveSpecific: false, description: 'Custom portal mount target. Defaults to document.body.' },
        { name: 'animations', type: 'AnimationTrigger[] | false', moveSpecific: true, description: 'Animation config or false to disable' },
      ],
      usesFactory: true,
      description: 'Positioned tooltip popup with spring entrance animation and CSS exit animation',
    },
    {
      name: 'Arrow',
      slots: [{ name: 'arrow', element: 'svg', description: 'Arrow SVG' }],
      props: [
        { name: 'className', type: 'string', moveSpecific: false, description: 'CSS class name' },
        { name: 'style', type: 'React.CSSProperties', moveSpecific: false, description: 'Inline styles' },
        { name: 'width', type: 'number', moveSpecific: false, description: 'Arrow width in px' },
        { name: 'height', type: 'number', moveSpecific: false, description: 'Arrow height in px' },
      ],
      usesFactory: true,
      description: 'Arrow element pointing from tooltip content toward trigger',
    },
  ],

  props: [
    { name: 'label', type: 'React.ReactNode', moveSpecific: true, description: 'Tooltip text content' },
    { name: 'children', type: 'React.ReactElement', moveSpecific: false, description: 'Trigger element (rendered via asChild)' },
    { name: 'side', type: "'top' | 'right' | 'bottom' | 'left'", default: "'top'", moveSpecific: false, description: 'Preferred placement side' },
    { name: 'sideOffset', type: 'number', default: '6', moveSpecific: false, description: 'Distance from trigger in px' },
    { name: 'align', type: "'start' | 'center' | 'end'", moveSpecific: false, description: 'Alignment along the side axis' },
    { name: 'arrow', type: 'boolean', default: 'true', moveSpecific: true, description: 'Show arrow pointing to trigger' },
    { name: 'animations', type: 'AnimationTrigger[] | false', moveSpecific: true, description: 'Animation config or false to disable' },
    { name: 'delayDuration', type: 'number', moveSpecific: false, description: 'Delay before tooltip opens (ms)' },
    { name: 'open', type: 'boolean', moveSpecific: false, description: 'Controlled open state' },
    { name: 'onOpenChange', type: '(open: boolean) => void', moveSpecific: false, description: 'Called when open state changes' },
  ],

  anatomy: {
    slot: 'content',
    dataAttributes: ['data-state', 'data-side', 'data-align'],
    children: [
      { slot: 'arrow' },
    ],
  },

  controlled: 'open' as const,
  controlledProps: {
    valueProp: 'open',
    defaultValueProp: 'defaultOpen',
    onChangeProp: 'onOpenChange',
  },
  keyboard: null,
  focus: null,
  formType: null,
  asChild: true,
  surface: null,

  animations: [
    { trigger: 'Content.enter', sequence: [{ animation: { opacity: { from: 0, to: 1, duration: 150 }, y: { from: 4, to: 0, ease: 'snappy' } } }] },
    { trigger: 'Content.exit', sequence: [{ animation: { opacity: { to: 0, duration: 100 } } }] },
  ],

  tokens: [
    { name: '--move-tooltip-content-bg', value: 'var(--move-fg-base)', description: 'Content background (inverted — uses foreground color)' },
    { name: '--move-tooltip-content-fg', value: 'var(--move-bg-base)', description: 'Content text color (inverted — uses background color)' },
    { name: '--move-tooltip-content-radius', value: 'var(--move-rounded-md)', description: 'Content border radius' },
    { name: '--move-tooltip-content-shadow', value: 'var(--move-shadow-elevated)', description: 'Content box shadow' },
    { name: '--move-tooltip-content-padding-x', value: 'var(--move-spacing-md)', description: 'Content horizontal padding' },
    { name: '--move-tooltip-content-padding-y', value: 'var(--move-spacing-sm)', description: 'Content vertical padding' },
    { name: '--move-tooltip-content-font-size', value: 'var(--move-size-sm)', description: 'Content font size' },
    { name: '--move-tooltip-content-max-width', value: '18rem', description: 'Content maximum width' },
  ],

  variants: {},
  sizes: [],

  labels: [],

  renderContracts: [
    { id: 'simple-forwards-animate', description: 'Simple API forwards animate prop into Content sub-component' },
    { id: 'simple-forwards-positioning', description: 'Simple API forwards side, sideOffset, and align into Content sub-component' },
    { id: 'simple-forwards-controlled', description: 'Simple API forwards open and onOpenChange into Root sub-component' },
    { id: 'content-portaled-font', description: 'Content is rendered in a portal and declares font-family: var(--move-font-body) to ensure correct typography outside the tree' },
    { id: 'direction-aware-entrance', description: 'Entrance animation computes translate offset from data-side attribute: top=translateY(6), bottom=translateY(-6), left=translateX(6), right=translateX(-6)' },
    { id: 'css-exit-animation', description: 'Exit animation uses CSS @keyframes tooltip-out (opacity 1->0, scale 1->0.9, 120ms) triggered by data-state=closed' },
    { id: 'arrow-fill-matches-bg', description: 'Arrow fill color matches tooltip content background via --move-tooltip-content-bg' },
  ],

  hasHook: false,
  engineImports: ['withMoveComponent', 'useMergedRef'],
  componentDeps: [],

  testing: {
    behaviors: [
      'Simple API renders tooltip content on hover',
      'Simple API renders label as tooltip text',
      'Simple API renders children as trigger via asChild',
      'Simple API shows arrow by default',
      'Simple API hides arrow when arrow=false',
      'Simple API defaults sideOffset to 6',
      'Content renders with data-side attribute',
      'Content renders with data-state attribute',
      'Content renders with data-align attribute',
      'Content is rendered in a portal',
      'Content has font-family set for portal isolation',
      'Content respects max-width token',
      'Arrow fill matches content background color',
      'Forwards className and style on Content',
      'Forwards className and style on Trigger',
      'Provider shares delay settings across instances',
    ],
    aria: [
      'Trigger has appropriate aria attributes from Radix',
      'Content has role=tooltip from Radix',
      'Content is associated with trigger via aria-describedby',
    ],
    animation: [
      'Entrance spring animation plays on Content mount',
      'Entrance animation is direction-aware based on side prop',
      'Exit CSS animation plays on Content unmount via data-state=closed',
      'animations={false} disables entrance animation',
      'Reduced motion preference disables animation',
    ],
  },

  defaultReview: {
    status: 'approved' as const,
    decisionSource: 'rule-based' as const,
    overrides: {},
  },
};
