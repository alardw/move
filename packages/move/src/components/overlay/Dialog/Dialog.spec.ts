// Dialog.spec.ts — Component specification
// specHash: PLACEHOLDER

export const spec = {
  schemaVersion: 7 as const,
  name: 'Dialog',
  componentClass: 'overlay_layer' as const,
  category: 'overlay',
  description: 'Modal dialog overlay with backdrop, spring entrance animation, and structured header/body/footer layout',

  synonyms: ['modal', 'popup', 'lightbox', 'overlay', 'alert dialog'],
  families: {
    behavior:  ['modal-overlay'],
    state:     ['controlled-open'],
    animation: ['scale-fade'],
    a11y:      ['dialog'],
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
    { name: 'trigger', element: 'RadixDialog.Trigger', description: 'Button that opens the dialog' },
    { name: 'overlay', element: 'RadixDialog.Overlay', description: 'Backdrop overlay behind the dialog' },
    { name: 'content', element: 'RadixDialog.Content', description: 'Main dialog panel with centered fixed positioning' },
    { name: 'header', element: 'div', description: 'Top section containing title and close button' },
    { name: 'body', element: 'div', description: 'Scrollable content area' },
    { name: 'footer', element: 'div', description: 'Bottom section for actions' },
    { name: 'footerStart', element: 'div', description: 'Left-aligned area within footer' },
    { name: 'footerEnd', element: 'div', description: 'Right-aligned area within footer (margin-left: auto)' },
    { name: 'title', element: 'RadixDialog.Title', description: 'Heading element for the dialog title' },
    { name: 'description', element: 'RadixDialog.Description', description: 'Paragraph element for the dialog description' },
    { name: 'close', element: 'RadixDialog.Close', description: 'Button that triggers animated close' },
  ],

  subComponents: [
    {
      name: 'Root',
      slots: [],
      props: [
        { name: 'children', type: 'React.ReactNode', moveSpecific: false, description: 'Dialog sub-components' },
        { name: 'open', type: 'boolean', moveSpecific: false, description: 'Controlled open state' },
        { name: 'defaultOpen', type: 'boolean', moveSpecific: false, description: 'Initial open state (uncontrolled)' },
        { name: 'onOpenChange', type: '(open: boolean) => void', moveSpecific: false, description: 'Called when open state changes' },
        { name: 'animations', type: 'AnimationTrigger[] | false', moveSpecific: true, description: 'Animation config or false to disable' },
        { name: 'modal', type: 'boolean', moveSpecific: false, description: 'Whether to render as modal with backdrop' },
      ],
      usesFactory: false,
      description: 'Stateful root that manages open/close state, animation context, and close-after-exit-animation coordination',
    },
    {
      name: 'Trigger',
      slots: [{ name: 'trigger', element: 'RadixDialog.Trigger', description: 'Trigger button element' }],
      props: [
        { name: 'className', type: 'string', moveSpecific: false, description: 'CSS class name' },
        { name: 'style', type: 'React.CSSProperties', moveSpecific: false, description: 'Inline styles' },
        { name: 'children', type: 'React.ReactNode', moveSpecific: false, description: 'Trigger content' },
        { name: 'asChild', type: 'boolean', moveSpecific: true, description: 'Merge props onto child element instead of wrapping' },
      ],
      usesFactory: true,
      radixPrimitive: 'Dialog.Trigger',
      description: 'Element that opens the dialog when clicked',
    },
    {
      name: 'Overlay',
      slots: [{ name: 'overlay', element: 'RadixDialog.Overlay', description: 'Backdrop element' }],
      props: [
        { name: 'className', type: 'string', moveSpecific: false, description: 'CSS class name' },
        { name: 'style', type: 'React.CSSProperties', moveSpecific: false, description: 'Inline styles' },
      ],
      usesFactory: true,
      radixPrimitive: 'Dialog.Overlay',
      description: 'Full-screen backdrop behind the dialog with fade in/out animation',
    },
    {
      name: 'Content',
      slots: [{ name: 'content', element: 'RadixDialog.Content', description: 'Dialog content panel' }],
      props: [
        { name: 'className', type: 'string', moveSpecific: false, description: 'CSS class name' },
        { name: 'style', type: 'React.CSSProperties', moveSpecific: false, description: 'Inline styles' },
        { name: 'children', type: 'React.ReactNode', moveSpecific: false, description: 'Dialog body content' },
        { name: 'size', type: "'sm' | 'md' | 'lg' | 'xl' | 'full'", default: "'md'", moveSpecific: true, description: 'Dialog width preset' },
        { name: 'onOpenAutoFocus', type: '(event: Event) => void', moveSpecific: true, description: 'Called when content receives auto focus on open' },
        { name: 'onPointerDownOutside', type: '(event: Event) => void', moveSpecific: true, description: 'Called when pointer down outside content' },
        { name: 'onEscapeKeyDown', type: '(event: KeyboardEvent) => void', moveSpecific: true, description: 'Called when escape key pressed' },
        { name: 'onInteractOutside', type: '(event: Event) => void', moveSpecific: true, description: 'Called on any outside interaction' },
      ],
      usesFactory: true,
      radixPrimitive: 'Dialog.Content',
      description: 'Centered dialog panel with spring entrance, size variants, and smart auto-focus',
    },
    {
      name: 'Header',
      slots: [{ name: 'header', element: 'div', description: 'Header container' }],
      props: [
        { name: 'className', type: 'string', moveSpecific: false, description: 'CSS class name' },
        { name: 'style', type: 'React.CSSProperties', moveSpecific: false, description: 'Inline styles' },
        { name: 'closable', type: 'boolean', default: 'true', moveSpecific: true, description: 'Render the auto-close button on the right side of the header.' },
        { name: 'children', type: 'React.ReactNode', moveSpecific: false, description: 'Header content (typically Title + Close)' },
      ],
      usesFactory: true,
      description: 'Top section with flex layout for title and (when `closable`) an auto-close button.',
    },
    {
      name: 'Body',
      slots: [{ name: 'body', element: 'div', description: 'Body container' }],
      props: [
        { name: 'className', type: 'string', moveSpecific: false, description: 'CSS class name' },
        { name: 'style', type: 'React.CSSProperties', moveSpecific: false, description: 'Inline styles' },
        { name: 'children', type: 'React.ReactNode', moveSpecific: false, description: 'Scrollable body content' },
      ],
      usesFactory: true,
      description: 'Scrollable content area (flex: 1, overflow: auto)',
    },
    {
      name: 'Footer',
      slots: [{ name: 'footer', element: 'div', description: 'Footer container' }],
      props: [
        { name: 'className', type: 'string', moveSpecific: false, description: 'CSS class name' },
        { name: 'style', type: 'React.CSSProperties', moveSpecific: false, description: 'Inline styles' },
        { name: 'children', type: 'React.ReactNode', moveSpecific: false, description: 'Footer content (typically action buttons)' },
      ],
      usesFactory: true,
      description: 'Bottom action bar with flex layout',
    },
    {
      name: 'FooterStart',
      slots: [{ name: 'footerStart', element: 'div', description: 'Left-aligned footer area' }],
      props: [
        { name: 'className', type: 'string', moveSpecific: false, description: 'CSS class name' },
        { name: 'style', type: 'React.CSSProperties', moveSpecific: false, description: 'Inline styles' },
        { name: 'children', type: 'React.ReactNode', moveSpecific: false, description: 'Left-side footer content' },
      ],
      usesFactory: true,
      description: 'Left-aligned container within footer',
    },
    {
      name: 'FooterEnd',
      slots: [{ name: 'footerEnd', element: 'div', description: 'Right-aligned footer area' }],
      props: [
        { name: 'className', type: 'string', moveSpecific: false, description: 'CSS class name' },
        { name: 'style', type: 'React.CSSProperties', moveSpecific: false, description: 'Inline styles' },
        { name: 'children', type: 'React.ReactNode', moveSpecific: false, description: 'Right-side footer content' },
      ],
      usesFactory: true,
      description: 'Right-aligned container within footer (margin-left: auto)',
    },
    {
      name: 'Title',
      slots: [{ name: 'title', element: 'RadixDialog.Title', description: 'Title heading' }],
      props: [
        { name: 'className', type: 'string', moveSpecific: false, description: 'CSS class name' },
        { name: 'style', type: 'React.CSSProperties', moveSpecific: false, description: 'Inline styles' },
        { name: 'children', type: 'React.ReactNode', moveSpecific: false, description: 'Title text' },
      ],
      usesFactory: true,
      radixPrimitive: 'Dialog.Title',
      description: 'Accessible dialog title rendered as heading element',
    },
    {
      name: 'Description',
      slots: [{ name: 'description', element: 'RadixDialog.Description', description: 'Description paragraph' }],
      props: [
        { name: 'className', type: 'string', moveSpecific: false, description: 'CSS class name' },
        { name: 'style', type: 'React.CSSProperties', moveSpecific: false, description: 'Inline styles' },
        { name: 'children', type: 'React.ReactNode', moveSpecific: false, description: 'Description text' },
      ],
      usesFactory: true,
      radixPrimitive: 'Dialog.Description',
      description: 'Accessible dialog description rendered as paragraph',
    },
    {
      name: 'Close',
      slots: [{ name: 'close', element: 'RadixDialog.Close', description: 'Close button' }],
      props: [
        { name: 'className', type: 'string', moveSpecific: false, description: 'CSS class name' },
        { name: 'style', type: 'React.CSSProperties', moveSpecific: false, description: 'Inline styles' },
        { name: 'children', type: 'React.ReactNode', moveSpecific: false, description: 'Close button content' },
        { name: 'asChild', type: 'boolean', moveSpecific: true, description: 'Merge props onto child element instead of wrapping' },
      ],
      usesFactory: true,
      radixPrimitive: 'Dialog.Close',
      description: 'Button that triggers animated close via context (does not immediately unmount)',
    },
  ],

  props: [],

  anatomy: {
    slot: 'overlay',
    children: [
      {
        slot: 'content',
        dataAttributes: ['data-size'],
        children: [
          {
            slot: 'header',
            children: [
              { slot: 'title' },
              { slot: 'close' },
            ],
          },
          {
            slot: 'body',
          },
          {
            slot: 'footer',
            children: [
              { slot: 'footerStart' },
              { slot: 'footerEnd' },
            ],
          },
          { slot: 'description' },
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
    { trigger: 'Overlay.enter', sequence: [{ animation: { opacity: { from: 0, to: 1, duration: 200 } } }] },
    { trigger: 'Overlay.exit', sequence: [{ animation: { opacity: { to: 0, duration: 150 } } }] },
    { trigger: 'Content.enter', sequence: [{ animation: { opacity: { from: 0, to: 1 }, scale: { from: 0.95, to: 1, ease: 'poppy' } } }] },
    { trigger: 'Content.exit', sequence: [{ animation: { opacity: { to: 0 }, scale: { to: 0.95, ease: 'snappy' } } }] },
  ],

  renderContracts: [
    { id: 'animation-context', description: 'Root provides DialogContext with isClosing, close(), onCloseComplete, and animation config to all sub-components' },
    { id: 'close-after-exit', description: 'Close button triggers isClosing state; Content exit animation calls onCloseComplete which actually unmounts the dialog' },
    { id: 'radix-open-override', description: 'Root keeps Radix open during exit animation (open={open || isClosing}) and ignores Radix close requests' },
    { id: 'content-portaled-font', description: 'Content is rendered in a portal and declares font-family: var(--move-font-body) to ensure correct typography outside the tree' },
    { id: 'smart-auto-focus', description: 'Content auto-focuses first form field in body, falling back to first button in body or footer' },
    { id: 'overlay-dual-animation', description: 'Overlay animates independently (fade) while Content animates with spring scale; Content exit drives onCloseComplete' },
    { id: 'escape-triggers-animated-close', description: 'Escape key and pointer-down-outside trigger animated close via context close() instead of Radix default unmount' },
  ],

  tokens: [
    { name: '--move-dialog-overlay-bg', value: 'var(--move-overlay-heavy)', description: 'Overlay backdrop color' },
    { name: '--move-dialog-overlay-backdrop-blur', value: 'var(--move-overlay-blur)', description: 'Overlay backdrop blur amount' },
    { name: '--move-dialog-content-bg', value: 'var(--move-bg-subtle)', description: 'Content panel background' },
    { name: '--move-dialog-content-border', value: 'var(--move-border-base)', description: 'Content panel border color' },
    { name: '--move-dialog-content-radius', value: 'var(--move-rounded-xl)', description: 'Content panel border radius' },
    { name: '--move-dialog-content-shadow', value: 'var(--move-shadow-overlay)', description: 'Content panel box shadow' },
    { name: '--move-dialog-content-padding', value: 'var(--move-spacing-lg)', description: 'Content panel padding' },
    { name: '--move-dialog-content-width', value: '28rem', description: 'Content default width' },
    { name: '--move-dialog-content-max-width', value: '90vw', description: 'Content maximum width' },
    { name: '--move-dialog-content-max-height', value: '85vh', description: 'Content maximum height' },
    { name: '--move-dialog-title-font-size', value: 'var(--move-size-lg)', description: 'Title font size' },
    { name: '--move-dialog-title-font-weight', value: 'var(--move-weight-semibold)', description: 'Title font weight' },
    { name: '--move-dialog-title-fg', value: 'var(--move-fg-base)', description: 'Title text color' },
    { name: '--move-dialog-title-margin-bottom', value: 'var(--move-spacing-sm)', description: 'Title bottom margin' },
    { name: '--move-dialog-description-font-size', value: 'var(--move-size-sm)', description: 'Description font size' },
    { name: '--move-dialog-description-fg', value: 'var(--move-fg-muted)', description: 'Description text color' },
    { name: '--move-dialog-description-margin-bottom', value: 'var(--move-spacing-lg)', description: 'Description bottom margin' },
    { name: '--move-dialog-close-size', value: 'var(--move-space-8)', description: 'Close button width and height' },
    { name: '--move-dialog-close-icon-size', value: 'var(--move-text-base)', description: 'Close button icon size' },
    { name: '--move-dialog-close-fg', value: 'var(--move-fg-muted)', description: 'Close button text color' },
    { name: '--move-dialog-close-fg-hover', value: 'var(--move-fg-base)', description: 'Close button text color on hover' },
    { name: '--move-dialog-close-bg-hover', value: 'var(--move-bg-muted)', description: 'Close button background on hover' },
    { name: '--move-dialog-close-radius', value: 'var(--move-rounded-sm)', description: 'Close button border radius' },
  ],

  variants: {},
  sizes: ['sm', 'md', 'lg', 'xl', 'full'] as string[],

  labels: [],

  radixPrimitive: 'Dialog',
  hasHook: false,
  engineImports: ['withMoveComponent', 'useMergedRef'] as string[],

  componentDeps: [] as string[],

  testing: {
    behaviors: [
      'Root manages open/close state with controlled and uncontrolled patterns',
      'Root keeps dialog mounted during exit animation (open || isClosing)',
      'Root ignores Radix onOpenChange(false) — closing is driven by close()',
      'Trigger opens the dialog on click',
      'Content renders with data-size attribute matching size prop',
      'Content defaults to size md (28rem width)',
      'Content size sm sets width to 24rem',
      'Content size lg sets width to 36rem',
      'Content size xl sets width to 48rem',
      'Content size full sets width to 90vw',
      'Content auto-focuses first form field in body on open',
      'Content falls back to first button in body or footer for auto-focus',
      'Content is centered with fixed positioning (top:50%, left:50%, translate:-50%)',
      'Close button triggers animated close via context instead of immediate unmount',
      'Overlay and Content are rendered inside Portal',
      'Header lays out title and close button with space-between',
      'Body is scrollable (overflow: auto)',
      'Footer provides flex layout for action buttons',
      'FooterEnd aligns content to the right with margin-left: auto',
      'Forwards className and style on all factory sub-components',
    ],
    keyboard: [
      'Escape key triggers animated close',
    ],
    aria: [
      'Content has role=dialog from Radix',
      'Content has aria-modal from Radix',
      'Title provides aria-labelledby association from Radix',
      'Description provides aria-describedby association from Radix',
      'Close button has focus-visible outline',
    ],
    animation: [
      'Content entrance uses spring scale 0.85->1 + opacity 0->1',
      'Content exit uses outQuart scale 1->0.95 + opacity 1->0 in 200ms',
      'Overlay entrance fades in with outQuart in 250ms',
      'Overlay exit fades out with outQuart in 200ms',
      'Content exit animation calls onCloseComplete to unmount dialog',
      'animations={false} disables all animations and immediately unmounts on close',
      'Reduced motion preference skips animations',
    ],
  },

  defaultReview: {
    status: 'approved' as const,
    decisionSource: 'user-confirmed' as const,
    overrides: {},
  },
};
