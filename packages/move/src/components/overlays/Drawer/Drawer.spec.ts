// Drawer.spec.ts — Component specification
// specHash: PLACEHOLDER

import type { ComponentSpec } from '../../../spec-type';

export const spec = {
  schemaVersion: 7 as const,
  name: 'Drawer',
  componentClass: 'overlay_layer' as const,
  category: 'overlays',
  preview: { staged: true, bare: true, width: 'lg' as const },
  description:
    'Slide-in panel from any edge with overlay backdrop, responsive auto-switching to bottom sheet on mobile, and structured header/body/footer layout',

  synonyms: [
    'sheet',
    'side panel',
    'offcanvas',
    'side sheet',
    'slide-in',
    'off-canvas',
    'slide-over',
  ],
  animationPatterns: ['sidePanel'],
  families: {
    behavior: ['modal-overlay'],
    state: ['controlled-open'],
    a11y: ['dialog'],
  },
  behavior: {
    modal: {
      closeOnEscape: true,
      closeOnOverlayClick: true,
      lockBodyScroll: true,
      trapFocus: true,
    },
  },

  compound: true,
  rootElement: 'div',
  slots: [
    {
      name: 'trigger',
      element: 'RadixDialog.Trigger',
      description: 'Button that opens the drawer',
    },
    {
      name: 'overlay',
      element: 'RadixDialog.Overlay',
      description: 'Backdrop overlay behind the drawer',
    },
    { name: 'content', element: 'RadixDialog.Content', description: 'Slide-in drawer panel' },
    {
      name: 'header',
      element: 'div',
      description: 'Top section containing title and close button',
    },
    { name: 'body', element: 'div', description: 'Scrollable content area' },
    { name: 'footer', element: 'div', description: 'Bottom section for actions' },
    {
      name: 'title',
      element: 'RadixDialog.Title',
      description: 'Heading element for the drawer title',
    },
    {
      name: 'description',
      element: 'RadixDialog.Description',
      description: 'Paragraph element for the drawer description',
    },
    {
      name: 'close',
      element: 'RadixDialog.Close',
      description: 'Button that triggers animated close',
    },
    {
      name: 'handle',
      element: 'div',
      description: 'Drag handle bar (optional, placed inside Content)',
    },
  ],

  subComponents: [
    {
      name: 'Root',
      slots: [],
      props: [
        {
          name: 'children',
          type: 'React.ReactNode',
          moveSpecific: false,
          description: 'Drawer sub-components',
        },
        {
          name: 'open',
          type: 'boolean',
          moveSpecific: false,
          description: 'Controlled open state',
        },
        {
          name: 'defaultOpen',
          type: 'boolean',
          moveSpecific: false,
          description: 'Initial open state (uncontrolled)',
        },
        {
          name: 'onOpenChange',
          type: '(open: boolean) => void',
          moveSpecific: false,
          description: 'Called when open state changes',
        },
        {
          name: 'animations',
          type: 'AnimationTrigger[] | false',
          moveSpecific: true,
          description: 'Animation config or false to disable',
        },
        {
          name: 'modal',
          type: 'boolean',
          default: 'true',
          moveSpecific: false,
          description: 'Whether to render as modal with backdrop',
        },
        {
          name: 'position',
          type: "'left' | 'right' | 'top' | 'bottom'",
          default: "'right'",
          moveSpecific: true,
          description:
            'Edge the drawer slides in from. Lives on Root so the entire compound (overlay, content, animations) can react to the side.',
        },
        {
          name: 'responsive',
          type: 'boolean',
          default: 'true',
          moveSpecific: true,
          description: 'Auto-switch to a bottom sheet on mobile viewport.',
        },
        {
          name: 'breakpoint',
          type: 'number',
          default: '768',
          moveSpecific: true,
          description: 'Viewport width below which responsive mode activates (px).',
        },
      ],
      usesFactory: false,
      description:
        'Stateful root that manages open/close state, animation context, position/responsive behavior, and close-after-exit-animation coordination.',
    },
    {
      name: 'Trigger',
      slots: [
        { name: 'trigger', element: 'RadixDialog.Trigger', description: 'Trigger button element' },
      ],
      props: [
        { name: 'className', type: 'string', moveSpecific: false, description: 'CSS class name' },
        {
          name: 'style',
          type: 'React.CSSProperties',
          moveSpecific: false,
          description: 'Inline styles',
        },
        {
          name: 'children',
          type: 'React.ReactNode',
          moveSpecific: false,
          description: 'Trigger content',
        },
        {
          name: 'asChild',
          type: 'boolean',
          moveSpecific: true,
          description: 'Merge props onto child element instead of wrapping',
        },
      ],
      usesFactory: true,
      radixPrimitive: 'Dialog.Trigger',
      description: 'Element that opens the drawer when clicked',
    },
    {
      name: 'Overlay',
      slots: [{ name: 'overlay', element: 'RadixDialog.Overlay', description: 'Backdrop element' }],
      props: [
        { name: 'className', type: 'string', moveSpecific: false, description: 'CSS class name' },
        {
          name: 'style',
          type: 'React.CSSProperties',
          moveSpecific: false,
          description: 'Inline styles',
        },
      ],
      usesFactory: true,
      radixPrimitive: 'Dialog.Overlay',
      description: 'Full-screen backdrop behind the drawer with fade in/out animation',
    },
    {
      name: 'Content',
      slots: [
        { name: 'content', element: 'RadixDialog.Content', description: 'Drawer content panel' },
      ],
      props: [
        { name: 'className', type: 'string', moveSpecific: false, description: 'CSS class name' },
        {
          name: 'style',
          type: 'React.CSSProperties',
          moveSpecific: false,
          description: 'Inline styles',
        },
        {
          name: 'children',
          type: 'React.ReactNode',
          moveSpecific: false,
          description: 'Drawer body content',
        },
        {
          name: 'size',
          typeRef: 'SizeFull',
          default: "'md'",
          moveSpecific: true,
          description: 'Drawer width (left/right) or height (top/bottom). Position lives on Root.',
        },
        {
          name: 'onOpenAutoFocus',
          type: '(event: Event) => void',
          moveSpecific: false,
          description: 'Called when content receives auto focus on open',
        },
        {
          name: 'onPointerDownOutside',
          type: '(event: Event) => void',
          moveSpecific: false,
          description: 'Called when pointer down outside content',
        },
        {
          name: 'onEscapeKeyDown',
          type: '(event: KeyboardEvent) => void',
          moveSpecific: false,
          description: 'Called when escape key pressed',
        },
        {
          name: 'onInteractOutside',
          type: '(event: Event) => void',
          moveSpecific: false,
          description: 'Called on any outside interaction',
        },
      ],
      usesFactory: true,
      radixPrimitive: 'Dialog.Content',
      description:
        'Slide-in panel with position variants, responsive bottom-sheet mode, and exit animation coordination',
    },
    {
      name: 'Header',
      slots: [{ name: 'header', element: 'div', description: 'Header container' }],
      props: [
        { name: 'className', type: 'string', moveSpecific: false, description: 'CSS class name' },
        {
          name: 'style',
          type: 'React.CSSProperties',
          moveSpecific: false,
          description: 'Inline styles',
        },
        {
          name: 'closable',
          type: 'boolean',
          default: 'true',
          moveSpecific: true,
          description: 'Render the auto-close button on the right side of the header.',
        },
        {
          name: 'children',
          type: 'React.ReactNode',
          moveSpecific: false,
          description: 'Header content (typically Title + Close)',
        },
      ],
      usesFactory: true,
      description:
        'Top section with flex layout for title and (when `closable`) an auto-close button.',
    },
    {
      name: 'Body',
      slots: [{ name: 'body', element: 'div', description: 'Body container' }],
      props: [
        { name: 'className', type: 'string', moveSpecific: false, description: 'CSS class name' },
        {
          name: 'style',
          type: 'React.CSSProperties',
          moveSpecific: false,
          description: 'Inline styles',
        },
        {
          name: 'children',
          type: 'React.ReactNode',
          moveSpecific: false,
          description: 'Scrollable body content',
        },
      ],
      usesFactory: true,
      description: 'Scrollable content area (flex: 1, overflow: auto)',
    },
    {
      name: 'Footer',
      slots: [{ name: 'footer', element: 'div', description: 'Footer container' }],
      props: [
        { name: 'className', type: 'string', moveSpecific: false, description: 'CSS class name' },
        {
          name: 'style',
          type: 'React.CSSProperties',
          moveSpecific: false,
          description: 'Inline styles',
        },
        {
          name: 'children',
          type: 'React.ReactNode',
          moveSpecific: false,
          description: 'Footer content (typically action buttons)',
        },
      ],
      usesFactory: true,
      description: 'Bottom action bar with flex layout',
    },
    {
      name: 'Title',
      slots: [{ name: 'title', element: 'RadixDialog.Title', description: 'Title heading' }],
      props: [
        { name: 'className', type: 'string', moveSpecific: false, description: 'CSS class name' },
        {
          name: 'style',
          type: 'React.CSSProperties',
          moveSpecific: false,
          description: 'Inline styles',
        },
        {
          name: 'children',
          type: 'React.ReactNode',
          moveSpecific: false,
          description: 'Title text',
        },
      ],
      usesFactory: true,
      radixPrimitive: 'Dialog.Title',
      description: 'Accessible drawer title rendered as heading element',
    },
    {
      name: 'Description',
      slots: [
        {
          name: 'description',
          element: 'RadixDialog.Description',
          description: 'Description paragraph',
        },
      ],
      props: [
        { name: 'className', type: 'string', moveSpecific: false, description: 'CSS class name' },
        {
          name: 'style',
          type: 'React.CSSProperties',
          moveSpecific: false,
          description: 'Inline styles',
        },
        {
          name: 'children',
          type: 'React.ReactNode',
          moveSpecific: false,
          description: 'Description text',
        },
      ],
      usesFactory: true,
      radixPrimitive: 'Dialog.Description',
      description: 'Accessible drawer description rendered as paragraph',
    },
    {
      name: 'Close',
      slots: [{ name: 'close', element: 'RadixDialog.Close', description: 'Close button' }],
      props: [
        { name: 'className', type: 'string', moveSpecific: false, description: 'CSS class name' },
        {
          name: 'style',
          type: 'React.CSSProperties',
          moveSpecific: false,
          description: 'Inline styles',
        },
        {
          name: 'children',
          type: 'React.ReactNode',
          moveSpecific: false,
          description: 'Close button content',
        },
        {
          name: 'asChild',
          type: 'boolean',
          moveSpecific: true,
          description: 'Merge props onto child element instead of wrapping',
        },
      ],
      usesFactory: true,
      radixPrimitive: 'Dialog.Close',
      description: 'Button that triggers animated close via context (does not immediately unmount)',
    },
    {
      name: 'Handle',
      slots: [{ name: 'handle', element: 'div', description: 'Drag handle bar' }],
      props: [
        { name: 'className', type: 'string', moveSpecific: false, description: 'CSS class name' },
        {
          name: 'style',
          type: 'React.CSSProperties',
          moveSpecific: false,
          description: 'Inline styles',
        },
      ],
      usesFactory: true,
      description:
        'Visual drag handle bar; place inside Content (typically the bottom-sheet/mobile layout)',
    },
  ],

  props: [],

  anatomy: {
    slot: 'overlay',
    children: [
      {
        slot: 'content',
        dataAttributes: ['data-position', 'data-size', 'data-responsive'],
        children: [
          {
            slot: 'header',
            children: [{ slot: 'title' }, { slot: 'close' }],
          },
          { slot: 'description' },
          { slot: 'body' },
          { slot: 'footer' },
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
  keyboard: null,
  focus: 'trap' as const,
  formType: null,
  asChild: true,

  dismissBehavior: 'unmountAfterExit' as const,

  surface: {
    slot: 'content',
    level: 'subtle' as const,
  },

  animations: [
    {
      trigger: 'Overlay.enter',
      sequence: [{ animation: { opacity: { from: 0, to: 1, duration: 200 } } }],
    },
    { trigger: 'Overlay.exit', sequence: [{ animation: { opacity: { to: 0, duration: 150 } } }] },
    {
      trigger: 'Content.enter',
      sequence: [{ animation: { translateX: { from: '100%', to: '0%', ease: 'smooth' } } }],
      note: 'Default for position=right. Position variants: left=-100%→0%, top=translateY -100%→0%, bottom=translateY 100%→0%',
    },
    {
      trigger: 'Content.exit',
      sequence: [{ animation: { translateX: { to: '100%', ease: 'snappy' } } }],
      note: 'Mirrors enter direction. Position variants adjust axis and direction.',
    },
  ],

  renderContracts: [
    {
      id: 'animation-context',
      description:
        'Root provides DrawerContext with isClosing, close(), onCloseComplete, and animation config to all sub-components',
    },
    {
      id: 'close-after-exit',
      description:
        'Close button triggers isClosing state; Content exit animation calls onCloseComplete which actually unmounts the drawer',
    },
    {
      id: 'radix-open-override',
      description:
        'Root keeps Radix open during exit animation (open={open || isClosing}) and ignores Radix close requests',
    },
    {
      id: 'content-portaled-font',
      description:
        'Content is rendered in a portal and declares font-family: var(--move-font-body) to ensure correct typography outside the tree',
    },
    {
      id: 'position-aware-animation',
      description:
        'Content determines slide axis (X or Y) and direction (positive or negative) based on effective position (respecting responsive override)',
    },
    {
      id: 'responsive-position-override',
      description:
        'When responsive=true and viewport < breakpoint, Content overrides position to bottom regardless of prop value',
    },
    {
      id: 'handle-manual',
      description:
        'Handle is an optional sub-component the consumer places inside Content (typically the bottom-sheet/mobile layout). Automatic rendering in bottom-sheet mode is a planned enhancement, not yet wired.',
    },
    {
      id: 'escape-triggers-animated-close',
      description:
        'Escape key and pointer-down-outside trigger animated close via context close() instead of Radix default unmount',
    },
  ],

  tokens: [
    {
      name: '--move-drawer-overlay-bg',
      value: 'var(--move-overlay-heavy)',
      description: 'Overlay backdrop color',
    },
    {
      name: '--move-drawer-overlay-backdrop-blur',
      value: 'var(--move-overlay-blur)',
      description: 'Overlay backdrop blur amount',
    },
    {
      name: '--move-drawer-content-bg',
      value: 'var(--move-surface-bg)',
      description: 'Content panel background',
    },
    {
      name: '--move-drawer-content-border',
      value: 'var(--move-border-base)',
      description: 'Content panel border color (inner edge only)',
    },
    {
      name: '--move-drawer-content-shadow',
      value: 'var(--move-shadow-overlay)',
      description: 'Content panel box shadow',
    },
    {
      name: '--move-drawer-content-padding',
      value: 'var(--move-spacing-lg)',
      description: 'Content panel padding',
    },
    {
      name: '--move-drawer-title-font-size',
      value: 'var(--move-size-lg)',
      description: 'Title font size',
    },
    {
      name: '--move-drawer-title-font-weight',
      value: 'var(--move-weight-semibold)',
      description: 'Title font weight',
    },
    {
      name: '--move-drawer-title-fg',
      value: 'var(--move-fg-base)',
      description: 'Title text color',
    },
    {
      name: '--move-drawer-description-font-size',
      value: 'var(--move-size-sm)',
      description: 'Description font size',
    },
    {
      name: '--move-drawer-description-fg',
      value: 'var(--move-fg-muted)',
      description: 'Description text color',
    },
    {
      name: '--move-drawer-close-size',
      value: 'var(--move-space-8)',
      description: 'Close button width and height',
    },
    {
      name: '--move-drawer-close-icon-size',
      value: 'var(--move-text-base)',
      description: 'Close button icon size',
    },
    {
      name: '--move-drawer-close-fg',
      value: 'var(--move-fg-muted)',
      description: 'Close button text color',
    },
    {
      name: '--move-drawer-close-fg-hover',
      value: 'var(--move-fg-base)',
      description: 'Close button text color on hover',
    },
    {
      name: '--move-drawer-close-bg-hover',
      value: 'var(--move-surface-hover)',
      description: 'Close button background on hover',
    },
    {
      name: '--move-drawer-close-radius',
      value: 'var(--move-rounded-sm)',
      description: 'Close button border radius',
    },
  ],

  variants: {
    position: {
      left: { description: 'Slides in from the left edge' },
      right: { description: 'Slides in from the right edge' },
      top: { description: 'Slides in from the top edge' },
      bottom: { description: 'Slides in from the bottom edge' },
    },
  },
  sizes: ['xs', 'sm', 'md', 'lg', 'xl', 'full'] as string[],

  labels: [],

  radixPrimitive: 'Dialog',
  hasHook: false,
  engineImports: ['withMoveComponent', 'useMergedRef', 'useControlledState'] as string[],

  componentDeps: [] as string[],

  childrenKind: 'composition' as const,

  testing: {
    behaviors: [
      'Root manages open/close state with controlled and uncontrolled patterns',
      'Root keeps drawer mounted during exit animation (open || isClosing)',
      'Root ignores Radix onOpenChange(false) — closing is driven by close()',
      'Trigger opens the drawer on click',
      'Content renders with data-position attribute matching effective position',
      'Content renders with data-size attribute matching size prop',
      'Content defaults to position right and size md',
      'Content position left anchors to left edge with full height',
      'Content position right anchors to right edge with full height',
      'Content position top anchors to top edge with full width',
      'Content position bottom anchors to bottom edge with full width',
      'Content size xs sets width to 16rem (left/right) or height to 16rem (top/bottom)',
      'Content size full sets width/height to 100%',
      'Content responsive=true switches position to bottom below breakpoint',
      'Content responsive=false preserves original position at all viewports',
      'Content applies top-only border-radius in bottom-sheet mode',
      'Content constrains max-height to 85vh in bottom-sheet mode',
      'Close button triggers animated close via context instead of immediate unmount',
      'Overlay and Content are rendered inside Portal',
      'Header lays out title and close button with space-between',
      'Body is scrollable (overflow: auto)',
      'Footer provides flex layout for action buttons',
      'Handle renders a centered horizontal bar',
      'Forwards className and style on all factory sub-components',
    ],
    keyboard: ['Escape key triggers animated close'],
    aria: [
      'Content has role=dialog from Radix',
      'Content has aria-modal from Radix',
      'Title provides aria-labelledby association from Radix',
      'Description provides aria-describedby association from Radix',
      'Close button has focus-visible outline',
    ],
    animation: [
      'Content entrance slides from edge using spring (smooth ease)',
      'Content exit slides back to edge using snappy ease',
      'Content slide direction matches position (translateX for left/right, translateY for top/bottom)',
      'Content slide direction is negative for left/top, positive for right/bottom',
      'Responsive mode switches animation axis when position overrides to bottom',
      'Overlay entrance fades in (200ms)',
      'Overlay exit fades out (150ms)',
      'Content exit animation calls onCloseComplete to unmount drawer',
      'animations={false} disables all animations and immediately unmounts on close',
      'Reduced motion preference skips animations',
    ],
  },

  iconsUsed: ['x'],
} satisfies ComponentSpec;
