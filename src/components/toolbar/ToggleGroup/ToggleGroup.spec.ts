// ToggleGroup.spec.ts — Component specification
// specHash: PLACEHOLDER

export const spec = {
  schemaVersion: 6 as const,
  name: 'ToggleGroup',
  componentClass: 'interactive' as const,
  category: 'toolbar',
  description:
    'Segmented control with sliding indicator that allows single selection among a set of toggle items, using Radix ToggleGroup primitive',

  compound: {
    pattern: 'object' as const,
    subComponents: ['Root', 'Item'] as string[],
  },

  rootElement: 'div',
  anatomy: ['Root', 'Item'] as string[],
  slots: ['root', 'indicator', 'item'] as string[],

  props: {
    Root: [
      'value',
      'defaultValue',
      'onValueChange',
      'orientation',
      'disabled',
      'loop',
      'size',
      'variant',
      'animate',
      'children',
      'className',
      'style',
    ] as string[],
    Item: [
      'value',
      'disabled',
      'animate',
      'children',
      'className',
      'style',
    ] as string[],
  },

  defaults: {
    variant: 'secondary',
    size: 'md',
    orientation: 'horizontal',
    loop: true,
  },

  moveProps: [
    'value',
    'defaultValue',
    'onValueChange',
    'orientation',
    'disabled',
    'loop',
    'size',
    'variant',
    'animate',
  ] as string[],

  controlled: { pattern: 'value' as const },
  controlledProps: {
    value: {
      prop: 'value',
      defaultProp: 'defaultValue',
      onChange: 'onValueChange',
    },
  },

  keyboard: 'roving' as const,
  focus: 'roving' as const,
  formType: null,
  asChild: false,

  dismissBehavior: null,

  animations: [
    {
      slot: 'indicator',
      hook: 'usePositionTracker' as const,
      configType: 'PositionTracker',
      notes:
        'Sliding indicator tracks active item via useSlidingIndicator (aliased usePositionTracker). containerRef is root internalRef, activeSelector is [data-state="on"]. First render snaps instantly, subsequent changes animate with spring.',
    },
    {
      slot: 'indicator',
      hook: 'custom' as const,
      configType: 'InteractionAnimate',
      defaultConfig:
        '{ press: { scale: 0.92, easing: "spring", spring: { mass: 0.6, stiffness: 500, damping: 12 } } }',
      notes:
        'Indicator press animation: mouseDown on root scales indicator to 0.92 via spring, mouseUp/mouseLeave restores to 1. Raw anime.js animate() call, not via a standard hook.',
    },
    {
      slot: 'item',
      hook: 'useInteractionAnimate',
      configType: 'InteractionAnimate',
      defaultProfile: 'elementInteractive',
      defaultPreset: 'element',
      notes:
        'Item interaction animations are disabled by default (hover: false, press: false) because scaling breaks connected borders. Users can opt back in via the animate prop on Item.',
    },
  ],

  renderContracts: [
    { id: 'context-provides-size-variant', description: 'Root provides ToggleGroupContext with size and variant; Item reads from context to set data-variant and data-size' },
    { id: 'single-mode-no-deselect', description: 'Root is always type="single" and blocks deselection by ignoring empty-string onValueChange from Radix' },
    { id: 'indicator-absolutely-positioned', description: 'Indicator element is position:absolute inside Root, positioned by useSlidingIndicator to track [data-state="on"] item' },
    { id: 'indicator-aria-hidden', description: 'Indicator is decorative and carries aria-hidden="true"' },
    { id: 'item-composes-button', description: 'Item slot composes Button.module.css root class for shared sizing and typography' },
    { id: 'item-transparent-bg', description: 'Items have transparent background; the sliding indicator provides the active-item background' },
    { id: 'item-on-text-color', description: 'Selected item (data-state="on") uses --move-primary-fg text color; unselected uses --move-fg-muted' },
    { id: 'item-animate-disabled-default', description: 'Item hover/press animations are disabled by default to avoid scale artifacts on connected items' },
    { id: 'indicator-border-radius-calc', description: 'Indicator border-radius is calc(--move-toggle-group-radius - --move-toggle-group-padding) to create inset appearance' },
  ],

  tokens: [
    // Root
    { name: '--move-toggle-group-radius', value: 'var(--move-rounded-md)', description: 'Root container border radius' },
    { name: '--move-toggle-group-padding', value: '3px', description: 'Root inner padding (gap between edge and items)' },
    { name: '--move-toggle-group-bg', value: 'var(--move-bg-muted)', description: 'Root container background' },

    // Indicator
    { name: '--move-toggle-group-indicator-bg', value: 'var(--move-primary)', description: 'Sliding indicator background' },

    // Item states
    { name: '--move-toggle-group-item-fg-off', value: 'var(--move-fg-muted)', description: 'Item text color when unselected' },
    { name: '--move-toggle-group-item-fg-off-hover', value: 'var(--move-fg-base)', description: 'Item text color on hover when unselected' },
    { name: '--move-toggle-group-item-fg-on', value: 'var(--move-primary-fg)', description: 'Item text color when selected' },
  ],

  variants: {
    variant: ['primary', 'secondary', 'ghost', 'danger'] as string[],
  },
  sizes: ['sm', 'md', 'lg'] as string[],

  labels: [],

  radixPrimitive: 'ToggleGroup',
  hasHook: false,
  engineImports: ['withMoveComponent', 'useMergedRef'] as string[],
  animationImports: [
    'useInteractionAnimate',
    'useSlidingIndicator',
    'defaultAnimations',
  ] as string[],
  componentDeps: ['Button'] as string[],

  childrenKind: 'composition' as const,

  testing: {
    cases: [
      'Root renders as Radix ToggleGroup.Root with type="single"',
      'Root renders children',
      'Root forwards className and style',
      'Root forwards ref to root element',
      'Root defaults to variant=secondary',
      'Root defaults to size=md',
      'Root applies data-orientation attribute',
      'Root applies data-size attribute',
      'Root blocks deselection (ignores empty value)',
      'Root provides size and variant to Items via context',
      'Indicator renders with aria-hidden="true"',
      'Indicator is positioned by useSlidingIndicator',
      'Indicator receives press animation on mouseDown',
      'Item renders as Radix ToggleGroup.Item',
      'Item receives data-variant and data-size from context',
      'Item supports disabled prop',
      'Item has data-state="on" when selected',
      'Item has data-state="off" when not selected',
      'Item text color changes: --move-fg-muted when off, --move-primary-fg when on',
      'Item hover/press animations are disabled by default',
      'Item animations can be re-enabled via animate prop',
      'Controlled value prop selects the matching item',
      'onValueChange fires when selection changes',
      'Uncontrolled defaultValue sets initial selection',
      'Keyboard arrow keys move focus between items (roving tabindex)',
      'Vertical orientation uses flex-direction: column',
      'Size sm uses --move-rounded-md radius, size lg uses --move-rounded-lg radius',
    ] as string[],
  },

  defaultReview: {
    status: 'approved' as const,
    decisionSource: 'accept-all' as const,
    overrides: {},
  },
};
