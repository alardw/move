// Sidebar.spec.ts — Component specification

import type { ComponentSpec } from '../../../spec-type';

export const spec = {
  schemaVersion: 1 as const,
  name: 'Sidebar',
  animationPatterns: ['sidePanel'],
  componentClass: 'disclosure' as const,
  category: 'navigation',
  description:
    'Collapsible navigation sidebar with icon-only mode, a mobile Radix Dialog modal sheet, item tooltips, and staggered entrance animations',
  choreographies: ['sidePanel'],
  families: {
    // Sidebar collapses in place on desktop and overlays on mobile —
    // disclosure is the dominant pattern; the mobile overlay is a
    // responsive mode rather than a different a11y pattern.
    behavior: ['disclosure', 'navigation'],
    state: ['controlled-open'], // collapsed/expanded state
    a11y: ['disclosure'],
  },
  behavior: {
    disclosure: {
      animatesOpen: true,
      animatesClose: true,
      keyboardToggle: true,
      multipleOpen: false, // sidebar is one piece
    },
  },

  compound: true,
  rootElement: 'aside',
  slots: [
    {
      name: 'root',
      element: 'aside',
      description: 'Main sidebar container with animated width collapse',
    },
    {
      name: 'overlay',
      element: 'div',
      description: 'Mobile backdrop overlay that dismisses the sidebar on click',
    },
    { name: 'header', element: 'div', description: 'Sticky header area at top of sidebar' },
    {
      name: 'content',
      element: 'div',
      description: 'Scrollable middle content area with staggered item entrance',
    },
    { name: 'footer', element: 'div', description: 'Sticky footer area at bottom of sidebar' },
    { name: 'group', element: 'div', description: 'Section grouping container for nav items' },
    {
      name: 'groupLabel',
      element: 'div',
      description: 'Section heading label that hides when collapsed',
    },
    {
      name: 'item',
      element: 'button',
      description: 'Interactive nav item with icon, label, and badge',
    },
    { name: 'itemIcon', element: 'span', description: 'Icon container within an item' },
    {
      name: 'itemLabel',
      element: 'span',
      description: 'Label text within an item, hidden when collapsed',
    },
    {
      name: 'itemBadge',
      element: 'span',
      description: 'Badge container within an item, hidden when collapsed',
    },
    {
      name: 'trigger',
      element: 'button',
      description: 'Toggle button for collapse/expand or mobile open/close',
    },
  ],

  subComponents: [
    {
      name: 'Provider',
      slots: [],
      props: [
        {
          name: 'children',
          type: 'React.ReactNode',
          moveSpecific: false,
          description: 'App content including sidebar and main area',
        },
        {
          name: 'collapsed',
          type: 'boolean',
          moveSpecific: false,
          description: 'Controlled collapsed state',
        },
        {
          name: 'defaultCollapsed',
          type: 'boolean',
          default: 'false',
          moveSpecific: false,
          description: 'Initial collapsed state (uncontrolled)',
        },
        {
          name: 'onCollapsedChange',
          type: '(collapsed: boolean) => void',
          moveSpecific: false,
          description: 'Called when collapsed state changes',
        },
        {
          name: 'mobileOpen',
          type: 'boolean',
          moveSpecific: false,
          description: 'Controlled mobile open state',
        },
        {
          name: 'defaultMobileOpen',
          type: 'boolean',
          default: 'false',
          moveSpecific: false,
          description: 'Initial mobile open state (uncontrolled)',
        },
        {
          name: 'onMobileOpenChange',
          type: '(open: boolean) => void',
          moveSpecific: false,
          description: 'Called when mobile open state changes',
        },
        {
          name: 'breakpoint',
          type: 'number',
          default: '768',
          moveSpecific: false,
          description: 'Viewport width breakpoint for mobile mode',
        },
        {
          name: 'animations',
          type: 'AnimationTrigger[] | false',
          moveSpecific: true,
          description: 'Animation config or false to disable all sidebar animations',
        },
      ],
      usesFactory: false,
      description:
        'Context provider wrapping useSidebar hook, shares collapsed/mobile state and animation config',
    },
    {
      name: 'Root',
      slots: [{ name: 'root', element: 'aside', description: 'Sidebar aside container' }],
      props: [
        {
          name: 'children',
          type: 'React.ReactNode',
          moveSpecific: false,
          description: 'Sidebar sections (Header, Content, Footer)',
        },
        { name: 'className', type: 'string', moveSpecific: false, description: 'CSS class name' },
        {
          name: 'style',
          type: 'React.CSSProperties',
          moveSpecific: false,
          description: 'Inline styles',
        },
        {
          name: 'side',
          type: "'left' | 'right'",
          default: "'left'",
          moveSpecific: true,
          description: 'Which side the sidebar appears on',
        },
        {
          name: 'labels',
          type: 'Partial<SidebarLabels>',
          moveSpecific: true,
          description: 'Overridable user-facing strings (mobile sheet accessible name)',
        },
      ],
      usesFactory: true,
      description:
        'Aside container with animated width transitions on collapse; on mobile it becomes a Radix Dialog modal sheet (focus trap, Escape, focus restore, aria-modal, scroll-lock)',
    },
    {
      name: 'Overlay',
      slots: [{ name: 'overlay', element: 'div', description: 'Mobile backdrop' }],
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
        'Fixed backdrop overlay for mobile mode, closes sidebar on click, animated opacity entrance',
    },
    {
      name: 'Header',
      slots: [
        { name: 'header', element: 'div', description: 'Sticky header' },
        { name: 'mobileClose', element: 'button', description: 'Mobile close button' },
      ],
      props: [
        {
          name: 'children',
          type: 'React.ReactNode',
          moveSpecific: false,
          description: 'Header content',
        },
        {
          name: 'labels',
          type: 'Partial<SidebarLabels>',
          moveSpecific: true,
          description: 'Overridable user-facing strings',
        },
        { name: 'className', type: 'string', moveSpecific: false, description: 'CSS class name' },
        {
          name: 'style',
          type: 'React.CSSProperties',
          moveSpecific: false,
          description: 'Inline styles',
        },
        {
          name: 'collapsedChildren',
          type: 'React.ReactNode',
          moveSpecific: true,
          description: 'Alternative content shown when sidebar is collapsed (desktop only)',
        },
      ],
      usesFactory: true,
      description: 'Sticky header with border-bottom, supports collapsed content swap',
    },
    {
      name: 'Content',
      slots: [{ name: 'content', element: 'div', description: 'Scrollable content area' }],
      props: [
        {
          name: 'children',
          type: 'React.ReactNode',
          moveSpecific: false,
          description: 'Navigation items and groups',
        },
        { name: 'className', type: 'string', moveSpecific: false, description: 'CSS class name' },
        {
          name: 'style',
          type: 'React.CSSProperties',
          moveSpecific: false,
          description: 'Inline styles',
        },
      ],
      usesFactory: true,
      description: 'Scrollable middle area with staggered entrance animation on items',
    },
    {
      name: 'Footer',
      slots: [{ name: 'footer', element: 'div', description: 'Sticky footer' }],
      props: [
        {
          name: 'children',
          type: 'React.ReactNode',
          moveSpecific: false,
          description: 'Footer content',
        },
        { name: 'className', type: 'string', moveSpecific: false, description: 'CSS class name' },
        {
          name: 'style',
          type: 'React.CSSProperties',
          moveSpecific: false,
          description: 'Inline styles',
        },
      ],
      usesFactory: true,
      description: 'Sticky footer with border-top, centers items when collapsed',
    },
    {
      name: 'Group',
      slots: [{ name: 'group', element: 'div', description: 'Group container' }],
      props: [
        {
          name: 'children',
          type: 'React.ReactNode',
          moveSpecific: false,
          description: 'GroupLabel and Item children',
        },
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
        'Section grouping container with role=group, separated by borders when collapsed',
    },
    {
      name: 'GroupLabel',
      slots: [{ name: 'groupLabel', element: 'div', description: 'Section heading' }],
      props: [
        {
          name: 'children',
          type: 'React.ReactNode',
          moveSpecific: false,
          description: 'Label text',
        },
        { name: 'className', type: 'string', moveSpecific: false, description: 'CSS class name' },
        {
          name: 'style',
          type: 'React.CSSProperties',
          moveSpecific: false,
          description: 'Inline styles',
        },
      ],
      usesFactory: true,
      description: 'Uppercase section label hidden when sidebar is collapsed',
    },
    {
      name: 'Item',
      slots: [
        { name: 'item', element: 'button', description: 'Nav item container' },
        { name: 'itemIcon', element: 'span', description: 'Item icon wrapper' },
        { name: 'itemLabel', element: 'span', description: 'Item label text' },
        { name: 'itemBadge', element: 'span', description: 'Item badge wrapper' },
      ],
      props: [
        {
          name: 'children',
          type: 'React.ReactNode',
          moveSpecific: false,
          description: 'Item label text content',
        },
        { name: 'className', type: 'string', moveSpecific: false, description: 'CSS class name' },
        {
          name: 'style',
          type: 'React.CSSProperties',
          moveSpecific: false,
          description: 'Inline styles',
        },
        {
          name: 'icon',
          type: 'React.ReactNode',
          moveSpecific: true,
          description: 'Icon element rendered before label',
        },
        {
          name: 'badge',
          type: 'React.ReactNode',
          moveSpecific: true,
          description: 'Badge element rendered after label',
        },
        {
          name: 'active',
          type: 'boolean',
          moveSpecific: true,
          description: 'Whether this item is the active/selected item',
        },
        {
          name: 'disabled',
          type: 'boolean',
          moveSpecific: true,
          description: 'Disable interaction',
        },
        {
          name: 'asChild',
          type: 'boolean',
          moveSpecific: true,
          description:
            'Merge props onto child element (e.g. an anchor tag) instead of rendering a button',
        },
        {
          name: 'tooltip',
          type: 'React.ReactNode',
          moveSpecific: true,
          description: 'Tooltip content shown when sidebar is collapsed on desktop',
        },
      ],
      usesFactory: true,
      description:
        'Interactive nav item with icon, label, badge slots; shows tooltip when collapsed; supports asChild for custom elements',
    },
    {
      name: 'Trigger',
      slots: [
        { name: 'trigger', element: 'button', description: 'Toggle button' },
        { name: 'triggerIcon', element: 'span', description: 'Trigger icon' },
        { name: 'triggerLabel', element: 'span', description: 'Trigger label' },
      ],
      props: [
        {
          name: 'children',
          type: 'React.ReactNode',
          moveSpecific: false,
          description: 'Trigger content (typically a hamburger/collapse icon)',
        },
        { name: 'className', type: 'string', moveSpecific: false, description: 'CSS class name' },
        {
          name: 'style',
          type: 'React.CSSProperties',
          moveSpecific: false,
          description: 'Inline styles',
        },
        {
          name: 'asChild',
          type: 'boolean',
          moveSpecific: true,
          description: 'Merge props onto child element instead of wrapping in button',
        },
        {
          name: 'icon',
          type: 'string | React.ReactNode',
          moveSpecific: true,
          description:
            'Icon to render — either a Lucide name (resolved via the icon resolver) or any ReactNode.',
        },
        {
          name: 'tooltip',
          type: 'string',
          moveSpecific: true,
          description: 'Tooltip label shown on hover when the sidebar is collapsed.',
        },
        {
          name: 'visibility',
          type: "'desktop' | 'mobile' | 'always'",
          default: "'always'",
          moveSpecific: true,
          description:
            'When to render the trigger — desktop-only collapse handle, mobile-only menu, or always.',
        },
      ],
      usesFactory: true,
      description: 'Toggle button that collapses/expands on desktop or opens/closes on mobile.',
    },
  ],

  props: [],

  anatomy: {
    slot: 'root',
    dataAttributes: ['data-collapsed', 'data-side', 'data-mobile'],
    children: [
      {
        slot: 'header',
        children: [],
      },
      {
        slot: 'content',
        children: [
          {
            slot: 'group',
            ariaAttributes: ['role=group'],
            children: [
              { slot: 'groupLabel' },
              {
                slot: 'item',
                dataAttributes: ['data-active', 'data-disabled'],
                children: [{ slot: 'itemIcon' }, { slot: 'itemLabel' }, { slot: 'itemBadge' }],
              },
            ],
          },
        ],
      },
      {
        slot: 'footer',
        children: [],
      },
    ],
  },

  controlled: 'open' as const,
  controlledProps: {
    valueProp: 'collapsed',
    defaultValueProp: 'defaultCollapsed',
    onChangeProp: 'onCollapsedChange',
  },
  keyboard: null,
  focus: null,
  formType: null,
  asChild: true,

  // Mobile sheet enter/exit — the aside (Root) slides in/out from its side edge
  // and the Overlay fades, coordinated with the Radix Dialog via useDismissable
  // so the panel stays mounted through the exit. All via the Move anime.js
  // system (useAnimations); Root confirms the close.
  animations: [
    {
      trigger: 'Overlay.enter',
      sequence: [{ animation: { opacity: { from: 0, to: 1, duration: 200 } } }],
    },
    {
      trigger: 'Overlay.exit',
      sequence: [{ animation: { opacity: { from: 1, to: 0, duration: 150 } } }],
    },
    {
      trigger: 'Root.enter',
      sequence: [
        { target: 'Root', animation: { translateX: { from: '-100%', to: '0%', ease: 'snappy' } } },
      ],
    },
    {
      trigger: 'Root.exit',
      sequence: [
        {
          target: 'Root',
          animation: { translateX: { to: '-100%', ease: 'snappy', duration: 200 } },
        },
      ],
    },
  ],

  renderContracts: [
    {
      id: 'rail-shared-inset',
      description:
        'Header, Item and Trigger align on one left inset. Content and Footer wrap their children in --move-spacing-sm, so Header — which has no such wrapper — insets itself by that amount plus --move-sidebar-item-padding-x. Trigger uses --move-sidebar-item-padding-y so the collapse row is the same height as a nav row.',
    },
    {
      id: 'mobile-modal-sheet',
      description:
        'On mobile (viewport < breakpoint), Root renders as a Radix Dialog modal sheet portaled to body (open driven by mobileOpen): focus trap, Escape-to-close, focus restore to the trigger, aria-modal, and scroll-lock. A visually-hidden Dialog.Title (labels.title) gives the sheet its accessible name.',
    },
    {
      id: 'overlay-dismisses',
      description:
        'Pressing Escape or clicking the overlay closes the sheet via onOpenChange → setMobileOpen(false).',
    },
    {
      id: 'overlay-aria-hidden',
      description: 'Overlay element has aria-hidden="true" since it is purely decorative.',
    },
    {
      id: 'rail-aria-hidden',
      description: 'Rail element has aria-hidden="true" since it is a convenience click target.',
    },
    {
      id: 'collapsed-width-spring',
      description:
        'Desktop width animation uses anime.js spring from expanded to collapsed width, reading CSS variables --move-sidebar-width and --move-sidebar-width-collapsed.',
    },
    {
      id: 'collapsed-skip-first-render',
      description:
        'Width animation skips the first render so CSS handles initial state without a flash.',
    },
    {
      id: 'collapsed-hides-labels',
      description:
        'When collapsed (desktop), itemLabel and itemBadge are hidden via CSS (opacity: 0, width: 0). GroupLabel is also hidden.',
    },
    {
      id: 'item-tooltip-collapsed',
      description:
        'When collapsed on desktop, Item wraps its element in a Tooltip (side="right", sideOffset=8) if tooltip prop is provided.',
    },
    {
      id: 'item-as-child',
      description:
        'When asChild=true, Item clones the single child element and injects icon/label/badge as its content instead of rendering a button.',
    },
    {
      id: 'header-collapsed-content',
      description:
        'Header shows collapsedChildren when collapsed on desktop, falls back to children if collapsedChildren is not provided.',
    },
    {
      id: 'trigger-mobile-toggle',
      description: 'Trigger calls toggleMobileOpen on mobile and toggleCollapsed on desktop.',
    },
    {
      id: 'content-stagger-items',
      description:
        'Content entrance animation staggers .item elements with translateX(-8) to 0 and opacity 0 to 1.',
    },
    {
      id: 'group-role',
      description: 'Group renders with role="group" for accessibility grouping.',
    },
    {
      id: 'provider-context',
      description:
        'Provider wraps useSidebar hook and exposes state via SidebarContext. All sub-components consume context via useSidebarContext().',
    },
    {
      id: 'animate-false-disables-all',
      description:
        'When Provider receives animations={false}, all animations are disabled across Root, Overlay, and Content.',
    },
  ],

  tokens: [
    { name: '--move-sidebar-width', value: '15rem', description: 'Expanded sidebar width' },
    {
      name: '--move-sidebar-width-collapsed',
      value: '4rem',
      description: 'Collapsed sidebar width (icon-only mode)',
    },
    { name: '--move-sidebar-width-mobile', value: '18rem', description: 'Mobile sidebar width' },
    {
      name: '--move-sidebar-mobile-bleed',
      value: '3rem',
      description:
        'How far the mobile sheet extends past its anchored edge (covers slide overshoot)',
    },
    {
      name: '--move-sidebar-bg',
      value: 'var(--move-surface-bg)',
      description: 'Sidebar background color',
    },
    {
      name: '--move-sidebar-border',
      value: 'var(--move-border-base)',
      description: 'Sidebar border color',
    },
    { name: '--move-sidebar-fg', value: 'var(--move-fg-base)', description: 'Sidebar text color' },
    {
      name: '--move-sidebar-item-radius',
      value: 'var(--move-rounded-md)',
      description: 'Item border radius',
    },
    {
      name: '--move-sidebar-item-padding-x',
      value: 'var(--move-spacing-md)',
      description: 'Item horizontal padding',
    },
    {
      name: '--move-sidebar-item-padding-y',
      value: 'var(--move-spacing-sm)',
      description: 'Item vertical padding',
    },
    {
      name: '--move-sidebar-item-fg',
      value: 'var(--move-fg-muted)',
      description: 'Item text color',
    },
    {
      name: '--move-sidebar-item-fg-hover',
      value: 'var(--move-fg-base)',
      description: 'Item text color on hover',
    },
    {
      name: '--move-sidebar-item-fg-active',
      value: 'var(--move-primary-fg)',
      description: 'Active item text color',
    },
    {
      name: '--move-sidebar-item-bg-hover',
      value: 'var(--move-surface-hover)',
      description: 'Item background on hover',
    },
    {
      name: '--move-sidebar-item-bg-active',
      value: 'var(--move-primary)',
      description: 'Active item background',
    },
    {
      name: '--move-sidebar-group-label-fg',
      value: 'var(--move-fg-subtle)',
      description: 'Group label text color',
    },
    {
      name: '--move-sidebar-group-label-size',
      value: 'var(--move-size-xs)',
      description: 'Group label font size',
    },
  ],

  variants: {},
  sizes: [] as string[],

  labels: [
    {
      key: 'close',
      default: 'Close sidebar',
      description: 'aria-label for the mobile close button in the header',
    },
    {
      key: 'title',
      default: 'Navigation',
      description: 'Accessible name for the mobile navigation sheet (Radix Dialog title)',
    },
  ],

  radixPrimitive: 'Slot',

  hasHook: true,
  engineImports: [
    'withMoveComponent',
    'useMergedRef',
    'useControlledState',
    'composeHandlers',
  ] as string[],

  componentDeps: ['Tooltip'] as string[],

  testing: {
    behaviors: [
      'Provider renders children with sidebar context',
      'Provider useSidebar hook manages collapsed and mobileOpen state',
      'Root renders aside element with data-collapsed, data-side, data-mobile',
      'Root defaults side to left',
      'Root side=right sets border-left instead of border-right',
      'Root is portaled to body on mobile when mobileOpen is true',
      'Root returns null on mobile when mobileOpen is false',
      'Overlay renders on mobile with fixed backdrop',
      'Overlay click closes mobile sidebar',
      'Header renders with border-bottom',
      'Header shows collapsedChildren when collapsed on desktop',
      'Header falls back to children when collapsedChildren is undefined',
      'Content renders scrollable area',
      'Footer renders with border-top',
      'Footer centers items when collapsed',
      'Group renders with role=group',
      'GroupLabel hidden when collapsed (opacity: 0, height: 0)',
      'Item renders button with icon, label, badge slots',
      'Item asChild clones child element with injected slots',
      'Item active state sets data-active and primary background',
      'Item disabled state sets data-disabled and reduced opacity',
      'Item shows tooltip when collapsed on desktop with tooltip prop',
      'Item does not show tooltip when expanded',
      'Item does not show tooltip on mobile even when collapsed',
      'Collapsed items center icons and hide labels/badges',
      'Trigger calls toggleCollapsed on desktop click',
      'Trigger calls toggleMobileOpen on mobile click',
      'Trigger supports asChild via Slot.Root',
      'Rail click calls toggleCollapsed',
      'Rail has aria-hidden=true',
      'Forwards className and style on all sub-components',
      'Controlled collapsed/onCollapsedChange works correctly',
      'Uncontrolled defaultCollapsed works correctly',
      'Breakpoint prop controls mobile mode threshold',
      'Auto-closes mobile sheet when viewport crosses to desktop',
    ],
    keyboard: ['Items are focusable via tab', 'Trigger is keyboard accessible'],
    aria: [
      'Root renders as aside element for landmark navigation',
      'Mobile sheet is a Radix Dialog (role=dialog, aria-modal) with a visually-hidden title and focus trap',
      'Overlay has aria-hidden=true',
      'Rail has aria-hidden=true',
      'Group has role=group',
      'Disabled items have data-disabled',
    ],
    animation: [
      'Root width animates with spring on collapse/expand',
      'Root width animation skips first render',
      'Root width animation disabled when animations=false',
      'Mobile sheet slides the aside in on open and out on close (Root.enter/exit)',
      'Mobile close keeps the sheet mounted for the exit animation (useDismissable) then unmounts',
      'Overlay opacity fades in on open and out on close',
      'Overlay + sheet animations disabled when animations=false (instant)',
      'Content staggers item entrance with translateX and opacity',
      'Content stagger animation disabled when animations=false',
      'All animations respect prefersReducedMotion',
    ],
  },

  iconsUsed: ['x'],
} satisfies ComponentSpec;
