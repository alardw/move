// Popover.spec.ts — Component specification
// specHash: PLACEHOLDER

export const spec = {
  schemaVersion: 6 as const,
  name: 'Popover',
  componentClass: 'overlay_popup' as const,
  category: 'overlay',
  description: 'Floating popup panel anchored to a trigger with close button, arrow, and optional close-on-scroll behavior',

  compound: true,
  rootElement: 'div',
  slots: [
    { name: 'trigger', element: 'RadixPopover.Trigger', description: 'Button that opens the popover' },
    { name: 'anchor', element: 'RadixPopover.Anchor', description: 'Alternative positioning anchor (instead of trigger)' },
    { name: 'content', element: 'RadixPopover.Content', description: 'Popup content panel with positioning and animation' },
    { name: 'arrow', element: 'RadixPopover.Arrow', description: 'Arrow pointing toward the trigger/anchor' },
    { name: 'close', element: 'button', description: 'Close button with X icon and animated close behavior' },
  ],

  subComponents: [
    {
      name: 'Root',
      slots: [],
      props: [
        { name: 'children', type: 'React.ReactNode', moveSpecific: false, description: 'Popover sub-components' },
        { name: 'open', type: 'boolean', moveSpecific: false, description: 'Controlled open state' },
        { name: 'defaultOpen', type: 'boolean', moveSpecific: false, description: 'Initial open state (uncontrolled)' },
        { name: 'onOpenChange', type: '(open: boolean) => void', moveSpecific: false, description: 'Called when open state changes' },
        { name: 'animate', type: 'PopupAnimate | false', moveSpecific: true, description: 'Animation config or false to disable' },
        { name: 'closeOnScroll', type: 'boolean', default: 'false', moveSpecific: true, description: 'Close the popover when an ancestor element scrolls' },
        { name: 'modal', type: 'boolean', moveSpecific: false, description: 'Whether to render as modal' },
      ],
      usesFactory: false,
      description: 'Stateful root that manages open/close state, animation context, and closeOnScroll option',
    },
    {
      name: 'Trigger',
      slots: [{ name: 'trigger', element: 'RadixPopover.Trigger', description: 'Trigger button' }],
      props: [
        { name: 'className', type: 'string', moveSpecific: false, description: 'CSS class name' },
        { name: 'style', type: 'React.CSSProperties', moveSpecific: false, description: 'Inline styles' },
        { name: 'children', type: 'React.ReactNode', moveSpecific: false, description: 'Trigger content' },
        { name: 'asChild', type: 'boolean', moveSpecific: true, description: 'Merge props onto child element instead of wrapping' },
      ],
      usesFactory: true,
      radixPrimitive: 'Popover.Trigger',
      description: 'Element that toggles the popover open/closed',
    },
    {
      name: 'Anchor',
      slots: [{ name: 'anchor', element: 'RadixPopover.Anchor', description: 'Anchor element' }],
      props: [
        { name: 'className', type: 'string', moveSpecific: false, description: 'CSS class name' },
        { name: 'style', type: 'React.CSSProperties', moveSpecific: false, description: 'Inline styles' },
        { name: 'children', type: 'React.ReactNode', moveSpecific: false, description: 'Anchor content' },
        { name: 'asChild', type: 'boolean', moveSpecific: true, description: 'Merge props onto child element instead of wrapping' },
      ],
      usesFactory: true,
      radixPrimitive: 'Popover.Anchor',
      description: 'Alternative positioning reference element (popover positions relative to this instead of trigger)',
    },
    {
      name: 'Portal',
      slots: [],
      props: [
        { name: 'children', type: 'React.ReactNode', moveSpecific: false, description: 'Portal content' },
        { name: 'container', type: 'HTMLElement', moveSpecific: false, description: 'Custom portal mount target' },
      ],
      usesFactory: false,
      description: 'Portals popover content to document body (or custom container)',
    },
    {
      name: 'Content',
      slots: [{ name: 'content', element: 'RadixPopover.Content', description: 'Popover content panel' }],
      props: [
        { name: 'className', type: 'string', moveSpecific: false, description: 'CSS class name' },
        { name: 'style', type: 'React.CSSProperties', moveSpecific: false, description: 'Inline styles' },
        { name: 'children', type: 'React.ReactNode', moveSpecific: false, description: 'Popover body content' },
        { name: 'side', type: "'top' | 'right' | 'bottom' | 'left'", moveSpecific: true, description: 'Preferred side relative to trigger' },
        { name: 'sideOffset', type: 'number', moveSpecific: true, description: 'Distance from trigger in px' },
        { name: 'align', type: "'start' | 'center' | 'end'", moveSpecific: true, description: 'Alignment along the side axis' },
        { name: 'alignOffset', type: 'number', moveSpecific: true, description: 'Alignment offset in px' },
        { name: 'onPointerDownOutside', type: '(e: Event) => void', moveSpecific: true, description: 'Called when pointer down outside content' },
        { name: 'onEscapeKeyDown', type: '(e: KeyboardEvent) => void', moveSpecific: true, description: 'Called when escape key pressed' },
        { name: 'onInteractOutside', type: '(e: Event) => void', moveSpecific: true, description: 'Called on any outside interaction' },
        { name: 'onOpenAutoFocus', type: '(e: Event) => void', moveSpecific: true, description: 'Called when content receives auto focus on open' },
        { name: 'onCloseAutoFocus', type: '(e: Event) => void', moveSpecific: true, description: 'Called when focus returns to trigger on close' },
      ],
      usesFactory: true,
      radixPrimitive: 'Popover.Content',
      description: 'Positioned popup panel with scale/opacity animation and Radix-provided transform-origin',
    },
    {
      name: 'Arrow',
      slots: [{ name: 'arrow', element: 'RadixPopover.Arrow', description: 'Arrow SVG' }],
      props: [
        { name: 'className', type: 'string', moveSpecific: false, description: 'CSS class name' },
        { name: 'style', type: 'React.CSSProperties', moveSpecific: false, description: 'Inline styles' },
        { name: 'width', type: 'number', moveSpecific: true, description: 'Arrow width in px' },
        { name: 'height', type: 'number', moveSpecific: true, description: 'Arrow height in px' },
      ],
      usesFactory: true,
      radixPrimitive: 'Popover.Arrow',
      description: 'Arrow element pointing from popover content toward trigger/anchor',
    },
    {
      name: 'Close',
      slots: [{ name: 'close', element: 'button', description: 'Close button' }],
      props: [
        { name: 'className', type: 'string', moveSpecific: false, description: 'CSS class name' },
        { name: 'style', type: 'React.CSSProperties', moveSpecific: false, description: 'Inline styles' },
        { name: 'children', type: 'React.ReactNode', moveSpecific: false, description: 'Close button content (defaults to X icon)' },
        { name: 'asChild', type: 'boolean', moveSpecific: true, description: 'Merge props onto child element instead of wrapping' },
        { name: 'closeLabel', type: 'string', default: "'Close'", moveSpecific: true, description: 'Accessible label for the close button' },
      ],
      usesFactory: true,
      radixPrimitive: 'Popover.Close',
      description: 'Button that triggers animated close via context; renders X icon by default or custom children',
    },
  ],

  props: [],

  anatomy: {
    slot: 'content',
    dataAttributes: ['data-state', 'data-side', 'data-align'],
    children: [
      { slot: 'arrow' },
      { slot: 'close' },
    ],
  },

  controlled: 'open' as const,
  controlledProps: {
    valueProp: 'open',
    defaultValueProp: 'defaultOpen',
    onChangeProp: 'onOpenChange',
  },
  keyboard: null,
  focus: 'self' as const,
  formType: null,
  asChild: true,

  dismissBehavior: 'unmountAfterExit' as const,

  surface: {
    slot: 'content',
    level: 'subtle' as const,
  },

  animations: [
    {
      slot: 'content',
      hook: 'useLifecycleAnimate',
      configType: 'LifecycleAnimate',
      defaultProfile: 'popupPresence',
      defaultConfig: "{ enter: { opacity: { value: [0, 1], easing: 'outQuart' }, scale: { value: [0.5, 1], easing: 'outQuart' } }, exit: { opacity: { value: [1, 0], easing: 'outQuart' }, scale: { value: [1, 0.95], easing: 'outQuart' }, duration: 200 } }",
    },
  ],

  renderContracts: [
    { id: 'animation-context', description: 'Root provides PopoverContext with isClosing, close(), onCloseComplete, animateConfig, and closeOnScroll to all sub-components' },
    { id: 'close-after-exit', description: 'Close triggers isClosing state; Content exit animation calls onCloseComplete which unmounts the popover' },
    { id: 'radix-open-override', description: 'Root keeps Radix open during exit animation (open={open || isClosing}) and ignores Radix close requests' },
    { id: 'content-portaled-font', description: 'Content is rendered in a portal and declares font-family: var(--move-font-body) for portal font isolation' },
    { id: 'close-on-scroll', description: 'When closeOnScroll is true, Content listens for scroll events on window (capture) and triggers close()' },
    { id: 'radix-transform-origin', description: 'Content uses var(--radix-popover-content-transform-origin) for position-aware animation origin' },
    { id: 'close-default-icon', description: 'Close renders X icon via useResolvedIcon when no children provided; supports asChild for custom close elements' },
    { id: 'close-accessible-label', description: 'Close button has aria-label from closeLabel prop (defaults to "Close")' },
    { id: 'escape-triggers-animated-close', description: 'Escape key and pointer-down-outside trigger animated close via context close()' },
    { id: 'arrow-fill-matches-bg', description: 'Arrow fill color matches popover content background via --move-popover-content-bg' },
  ],

  tokens: [
    { name: '--move-popover-content-bg', value: 'var(--move-bg-subtle)', description: 'Content panel background' },
    { name: '--move-popover-content-border', value: 'var(--move-border-base)', description: 'Content panel border color' },
    { name: '--move-popover-content-radius', value: 'var(--move-rounded-lg)', description: 'Content panel border radius' },
    { name: '--move-popover-content-shadow', value: 'var(--move-shadow-overlay)', description: 'Content panel box shadow' },
    { name: '--move-popover-content-padding', value: 'var(--move-spacing-md)', description: 'Content panel padding' },
    { name: '--move-popover-content-min-width', value: '12rem', description: 'Content minimum width' },
    { name: '--move-popover-content-max-width', value: '24rem', description: 'Content maximum width' },
    { name: '--move-popover-close-size', value: '24px', description: 'Close button width and height' },
    { name: '--move-popover-close-radius', value: 'var(--move-rounded-sm)', description: 'Close button border radius' },
    { name: '--move-popover-close-fg', value: 'var(--move-fg-muted)', description: 'Close button text color' },
    { name: '--move-popover-close-fg-hover', value: 'var(--move-fg-base)', description: 'Close button text color on hover' },
    { name: '--move-popover-close-bg-hover', value: 'var(--move-bg-muted)', description: 'Close button background on hover' },
  ],

  variants: {},
  sizes: [] as string[],

  labels: [
    { key: 'close', default: 'Close', description: 'Accessible label for the close button' },
  ],

  radixPrimitive: 'Popover',
  hasHook: false,
  engineImports: ['withMoveComponent', 'useMergedRef'] as string[],
  animationImports: ['useLifecycleAnimate'] as string[],
  componentDeps: [] as string[],

  testing: {
    behaviors: [
      'Root manages open/close state with controlled and uncontrolled patterns',
      'Root keeps popover mounted during exit animation (open || isClosing)',
      'Root ignores Radix onOpenChange(false) — closing is driven by close()',
      'Trigger toggles the popover on click',
      'Anchor provides alternative positioning reference',
      'Content renders in a portal',
      'Content uses Radix transform-origin CSS variable for position-aware animation',
      'Content respects side, sideOffset, align, and alignOffset props',
      'Content renders with min-width and max-width constraints',
      'Close button renders X icon by default',
      'Close button triggers animated close via context',
      'Close button supports asChild for custom close elements',
      'Close button has aria-label from closeLabel prop (defaults to "Close")',
      'Arrow fill color matches content background',
      'closeOnScroll=true closes popover on ancestor scroll',
      'closeOnScroll=false (default) does not close on scroll',
      'Forwards className and style on all factory sub-components',
      'onOpenAutoFocus and onCloseAutoFocus are forwarded to Radix Content',
    ],
    keyboard: [
      'Escape key triggers animated close',
    ],
    aria: [
      'Trigger has aria-expanded from Radix',
      'Trigger has aria-haspopup from Radix',
      'Close button has aria-label',
      'Close button has focus-visible outline',
    ],
    animation: [
      'Content entrance uses scale 0.5->1 + opacity 0->1 with outQuart',
      'Content exit uses scale 1->0.95 + opacity 1->0 in 200ms',
      'Content exit animation calls onCloseComplete to unmount',
      'animate=false disables all animations',
      'Reduced motion preference disables animations',
    ],
  },

  defaultReview: {
    status: 'approved' as const,
    decisionSource: 'user-confirmed' as const,
    overrides: {},
  },
};
