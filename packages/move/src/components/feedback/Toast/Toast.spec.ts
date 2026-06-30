// Toast.spec.ts — Component specification
// specHash: PLACEHOLDER

import type { ComponentSpec } from '../../../spec-type';

export const spec = {
  schemaVersion: 7 as const,
  name: 'Toast',
  componentClass: 'overlay_popup' as const,
  category: 'feedback',
  preview: { mock: true, bare: true, width: 'md' as const },
  description:
    'Notification toast system with imperative API, variant icons, auto-dismiss progress bar, position grouping, and enter/exit animations',

  synonyms: ['notification', 'snackbar', 'flash message', 'alert toast'],
  families: {
    behavior: ['notification'],
    state: ['controlled-open'],
    a11y: ['none'],
  },

  compound: true,
  rootElement: 'div',
  slots: [
    {
      name: 'viewport',
      element: 'div',
      description: 'Fixed full-screen container portaled to document.body',
    },
    {
      name: 'positionContainer',
      element: 'div',
      description: 'Position-specific container (top-right, bottom-left, etc.)',
    },
    {
      name: 'itemWrapper',
      element: 'div',
      description: 'Wrapper for height animation during enter/exit',
    },
    { name: 'item', element: 'div', description: 'Individual toast card with variant styling' },
    { name: 'icon', element: 'span', description: 'Variant icon (info, success, warning, error)' },
    {
      name: 'content',
      element: 'div',
      description: 'Content area containing message and description',
    },
    { name: 'message', element: 'div', description: 'Primary toast message text' },
    { name: 'description', element: 'div', description: 'Optional secondary description text' },
    { name: 'closeButton', element: 'button', description: 'Close/dismiss button with X icon' },
    { name: 'progressBar', element: 'div', description: 'Auto-dismiss countdown progress bar' },
  ],

  subComponents: [
    {
      name: 'Viewport',
      slots: [{ name: 'viewport', element: 'div', description: 'Viewport container' }],
      props: [
        { name: 'className', type: 'string', moveSpecific: false, description: 'CSS class name' },
        {
          name: 'style',
          type: 'React.CSSProperties',
          moveSpecific: false,
          description: 'Inline styles',
        },
        {
          name: 'position',
          type: 'ToastPosition',
          moveSpecific: true,
          description: 'Default position for toasts (overridden per-toast by store)',
        },
        {
          name: 'animations',
          type: 'AnimationTrigger[] | false',
          moveSpecific: true,
          description: 'Animation config or false to disable all toast animations',
        },
        {
          name: 'labels',
          type: 'Partial<ToastLabels>',
          moveSpecific: true,
          description: 'i18n labels object for accessible strings (close)',
        },
      ],
      usesFactory: true,
      description:
        'Portaled viewport that renders all active toasts grouped by position, provides animation and label context',
    },
  ],

  props: [],

  anatomy: {
    slot: 'viewport',
    children: [
      {
        slot: 'positionContainer',
        dataAttributes: ['data-position'],
        children: [
          {
            slot: 'itemWrapper',
            children: [
              {
                slot: 'item',
                dataAttributes: ['data-variant', 'data-position'],
                ariaAttributes: ['role=status', 'aria-live=polite'],
                children: [
                  { slot: 'icon', dataAttributes: ['data-variant'] },
                  {
                    slot: 'content',
                    children: [{ slot: 'message' }, { slot: 'description' }],
                  },
                  { slot: 'closeButton' },
                  { slot: 'progressBar' },
                ],
              },
            ],
          },
        ],
      },
    ],
  },

  controlled: null,
  keyboard: null,
  focus: null,
  formType: null,
  asChild: false,

  dismissBehavior: 'unmountAfterExit' as const,

  surface: null,

  animations: [
    {
      trigger: 'Root.enter',
      sequence: [
        { animation: { opacity: { from: 0, to: 1 }, y: { from: -20, to: 0, ease: 'poppy' } } },
      ],
    },
    {
      trigger: 'Root.exit',
      sequence: [{ animation: { opacity: { to: 0 }, y: { to: -20, ease: 'snappy' } } }],
    },
  ],

  renderContracts: [
    {
      id: 'imperative-store',
      description:
        'Toasts are created via imperative toast() function from store.ts, not via React props; Viewport subscribes to store via useSyncExternalStore',
    },
    {
      id: 'position-grouping',
      description:
        'Viewport renders 6 position containers (top-right, top-left, top-center, bottom-right, bottom-left, bottom-center); toasts are grouped by their position',
    },
    {
      id: 'presence-animation',
      description:
        'Each position container wraps toasts in Presence component; ToastItem uses usePresence for enter/exit lifecycle',
    },
    {
      id: 'dual-element-animation',
      description:
        'Enter animation runs on both itemWrapper (height expand) and item (slide+fade) in parallel; exit runs both in parallel then calls safeToRemove',
    },
    {
      id: 'auto-dismiss-progress',
      description:
        'Progress bar animates scaleX from 1 to 0 over toast.duration; completion triggers removeToast; pauses on hover/focusin and resumes on leave/focusout',
    },
    {
      id: 'max-per-position',
      description:
        'Store enforces max toasts per position (default 5); excess oldest toasts are auto-removed on add',
    },
    { id: 'viewport-portaled', description: 'Viewport renders via createPortal to document.body' },
    {
      id: 'viewport-portaled-font',
      description:
        'Toast items declare font-family: var(--move-font-body) for portal font isolation',
    },
    {
      id: 'variant-icons',
      description:
        'Non-default variants render an icon via useResolvedIcon: info=info, success=circle-check, warning=triangle-alert, error=circle-x',
    },
    {
      id: 'animate-context',
      description:
        'Viewport provides LayerAnimate config (or null for disabled) via ToastAnimateContext; ToastItem reads it to control animations',
    },
    {
      id: 'close-label-context',
      description:
        'Viewport provides closeLabel string via ToastCloseLabelContext for accessible close button labels',
    },
    {
      id: 'bottom-positions-reversed',
      description:
        'Bottom position containers use flex-direction: column-reverse so newest toasts appear at the bottom edge',
    },
  ],

  tokens: [
    {
      name: '--move-toast-viewport-spacing',
      value: 'var(--move-spacing-lg)',
      description: 'Viewport edge spacing (padding)',
    },
    {
      name: '--move-toast-viewport-z',
      value: 'var(--move-layer-toast)',
      description: 'Viewport z-index',
    },
    {
      name: '--move-toast-bg',
      value: 'var(--move-bg-subtle)',
      description: 'Toast item background',
    },
    { name: '--move-toast-fg', value: 'var(--move-fg-base)', description: 'Toast item text color' },
    {
      name: '--move-toast-border',
      value: 'var(--move-border-base)',
      description: 'Toast item border color',
    },
    {
      name: '--move-toast-radius',
      value: 'var(--move-rounded-lg)',
      description: 'Toast item border radius',
    },
    {
      name: '--move-toast-shadow',
      value: 'var(--move-shadow-elevated)',
      description: 'Toast item box shadow',
    },
    {
      name: '--move-toast-padding-x',
      value: 'var(--move-spacing-md)',
      description: 'Toast item horizontal padding',
    },
    {
      name: '--move-toast-padding-y',
      value: 'var(--move-spacing-sm)',
      description: 'Toast item vertical padding',
    },
    {
      name: '--move-toast-accent',
      value: 'var(--move-border-muted)',
      description: 'Toast accent color (progress bar, set per variant)',
    },
    { name: '--move-toast-width', value: '360px', description: 'Toast item width' },
  ],

  variants: {
    variant: ['default', 'info', 'success', 'warning', 'error'] as string[],
  },
  sizes: [] as string[],

  labels: [
    {
      key: 'close',
      default: 'Close notification',
      description: 'Accessible label for toast close buttons',
    },
  ],

  hasHook: true,
  engineImports: ['withMoveComponent'] as string[],

  componentDeps: [] as string[],

  testing: {
    behaviors: [
      'toast() function creates a new toast with default variant and position',
      'toast.info/success/warning/error create variant-specific toasts',
      'toast.dismiss(id) removes a specific toast',
      'toast.configure({ max }) sets max toasts per position',
      'Viewport renders via createPortal to document.body',
      'Viewport groups toasts by position across 6 position containers',
      'Viewport provides animation config via context',
      'Viewport provides closeLabel via context',
      'ToastItem renders message text',
      'ToastItem renders optional description text',
      'ToastItem renders variant icon for non-default variants (info, success, warning, error)',
      'ToastItem does not render icon for default variant',
      'Close button removes toast from store',
      'Close button has accessible aria-label from context',
      'Auto-dismiss timer removes toast after duration (default 5000ms)',
      'Auto-dismiss pauses on mouse enter and resumes on mouse leave',
      'Auto-dismiss pauses on focus in and resumes on focus out',
      'Progress bar scaleX animates from 1 to 0 over duration',
      'Progress bar is hidden when duration <= 0',
      'Store enforces max per position (default 5), removing oldest',
      'Bottom position containers use column-reverse for stack direction',
      'Toast has pointer-events: auto while viewport has pointer-events: none',
    ],
    aria: [
      'Toast item has role=status',
      'Toast item has aria-live=polite',
      'Close button has aria-label from closeLabel context',
    ],
    animation: [
      'Enter: item slides up 24px with opacity 0->1 and scale 0.95->1',
      'Enter: itemWrapper expands height from 0 to natural height',
      'Exit: item slides down 24px with opacity 1->0 and scale 1->0.95 in 300ms',
      'Exit: itemWrapper collapses height and paddingBottom to 0 in 300ms',
      'Exit animations run in parallel; safeToRemove called after both complete',
      'animations={false} disables all toast animations',
      'Reduced motion preference skips animations and hides progress bar',
    ],
  },

  iconsUsed: ['circle-check', 'circle-x', 'info', 'triangle-alert', 'x'],
  defaultReview: {
    status: 'approved' as const,
    decisionSource: 'user-confirmed' as const,
    overrides: {},
  },
} satisfies ComponentSpec;
