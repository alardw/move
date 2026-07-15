// Carousel.spec.ts — Component specification

import type { ComponentSpec } from '../../../spec-type';

export const spec = {
  schemaVersion: 1 as const,
  name: 'Carousel',
  componentClass: 'interactive' as const,
  category: 'media',
  description:
    'Compound scroll-snap carousel with configurable orientation, slides-per-view, autoplay, drag/swipe, and built-in trigger/indicator controls',
  families: {
    behavior: ['media', 'data-row'],
    state: ['controlled-index'],
    a11y: ['tablist'],
  },

  compound: true,
  rootElement: 'div',
  slots: [
    {
      name: 'root',
      element: 'div',
      description: 'Outermost wrapper with region role and carousel roledescription',
    },
    { name: 'viewport', element: 'div', description: 'Scroll-snap flex container holding slides' },
    { name: 'slide', element: 'div', description: 'Individual slide item with snap alignment' },
    { name: 'prevTrigger', element: 'button', description: 'Previous page navigation button' },
    { name: 'nextTrigger', element: 'button', description: 'Next page navigation button' },
    {
      name: 'indicatorGroup',
      element: 'div',
      description: 'Container for page indicator buttons with tablist role',
    },
    {
      name: 'indicator',
      element: 'button',
      description: 'Individual page indicator button with tab role',
    },
  ],

  subComponents: [
    {
      name: 'Root',
      slots: [
        {
          name: 'root',
          element: 'div',
          description: 'Outermost wrapper with carousel region role',
        },
      ],
      props: [
        {
          name: 'orientation',
          type: "'horizontal' | 'vertical'",
          default: "'horizontal'",
          moveSpecific: true,
          description: 'Scroll orientation',
        },
        {
          name: 'align',
          type: "'start' | 'center' | 'end'",
          default: "'start'",
          moveSpecific: true,
          description: 'Snap alignment for slides',
        },
        {
          name: 'slidesPerView',
          type: 'number',
          default: '1',
          moveSpecific: true,
          description: 'Number of slides visible at once',
        },
        {
          name: 'loop',
          type: 'boolean',
          default: 'false',
          moveSpecific: true,
          description: 'Loop back to start after last slide',
        },
        {
          name: 'autoplay',
          type: 'number',
          default: '0',
          moveSpecific: true,
          description: 'Auto-advance interval in ms (0 = off)',
        },
        {
          name: 'draggable',
          type: 'boolean',
          default: 'true',
          moveSpecific: true,
          description: 'Allow drag/swipe navigation',
        },
        {
          name: 'animations',
          type: 'AnimationTrigger[] | false',
          moveSpecific: true,
          description: 'Slide transition animation config',
        },
        {
          name: 'page',
          type: 'number',
          moveSpecific: true,
          description: 'Controlled active page (0-indexed)',
        },
        {
          name: 'defaultPage',
          type: 'number',
          moveSpecific: true,
          description: 'Initial page when uncontrolled',
        },
        {
          name: 'onPageChange',
          type: '(page: number) => void',
          moveSpecific: true,
          description: 'Called when active page changes',
        },
        {
          name: 'showTriggers',
          type: 'boolean',
          default: 'false',
          moveSpecific: true,
          description: 'Render built-in prev/next trigger buttons',
        },
        {
          name: 'showIndicators',
          type: 'boolean',
          default: 'false',
          moveSpecific: true,
          description: 'Render built-in page indicator dots',
        },
        {
          name: 'triggerPlacement',
          type: "'none' | 'top' | 'bottom' | 'overlay' | 'indicator-sides'",
          default: "'top'",
          moveSpecific: true,
          description: 'Placement strategy for built-in triggers',
        },
        {
          name: 'triggerAlign',
          type: "'start' | 'center' | 'end'",
          default: "'end'",
          moveSpecific: true,
          description: 'Alignment for trigger row and indicator-sides layout',
        },
        {
          name: 'triggerSize',
          type: "'sm' | 'md' | 'lg'",
          default: "'md'",
          moveSpecific: true,
          description: 'Size of built-in trigger buttons',
        },
        {
          name: 'triggerVariant',
          type: "'surface' | 'ghost' | 'solid'",
          default: "'surface'",
          moveSpecific: true,
          description: 'Visual variant for built-in trigger buttons',
        },
        {
          name: 'overlayInset',
          type: 'string | number',
          default: "'var(--move-spacing-sm)'",
          moveSpecific: true,
          description: 'Horizontal inset for overlay trigger placement',
        },
        {
          name: 'overlayOffsetY',
          type: 'string | number',
          default: "'50%'",
          moveSpecific: true,
          description: 'Vertical offset for overlay trigger placement',
        },
        {
          name: 'overlayHideUntilHover',
          type: 'boolean',
          default: 'false',
          moveSpecific: true,
          description: 'Hide overlay triggers until hover/focus',
        },
        {
          name: 'indicatorPlacement',
          type: "'inside-bottom' | 'below'",
          default: "'below'",
          moveSpecific: true,
          description: 'Placement for built-in indicators',
        },
        {
          name: 'indicatorGap',
          type: 'string | number',
          moveSpecific: true,
          description: 'Override indicator gap token',
        },
        {
          name: 'indicatorInset',
          type: 'string | number',
          default: "'var(--move-spacing-sm)'",
          moveSpecific: true,
          description: 'Horizontal inset for inside-bottom indicators',
        },
        {
          name: 'children',
          type: 'React.ReactNode',
          moveSpecific: false,
          description: 'Carousel sub-components (Viewport, IndicatorGroup, etc.)',
        },
      ],
      usesFactory: false,
      description:
        'Stateful root that provides carousel context to sub-components and manages page state via useCarousel hook',
    },
    {
      name: 'Viewport',
      slots: [{ name: 'viewport', element: 'div', description: 'Scroll-snap flex container' }],
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
          description: 'Slide components',
        },
      ],
      usesFactory: true,
      description: 'Scroll container with scroll-snap, hidden scrollbar, and drag cursor support',
    },
    {
      name: 'Slide',
      slots: [{ name: 'slide', element: 'div', description: 'Individual slide item' }],
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
          description: 'Slide content',
        },
      ],
      usesFactory: true,
      description:
        'Single slide with flex sizing based on slidesPerView, snap alignment, and slide registration',
    },
    {
      name: 'PrevTrigger',
      slots: [{ name: 'prevTrigger', element: 'button', description: 'Previous page button' }],
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
          description: 'Custom trigger content (default: chevron icon)',
        },
        { name: 'size', typeRef: 'Size', moveSpecific: true, description: 'Button size' },
        {
          name: 'variant',
          type: "'surface' | 'ghost' | 'solid'",
          moveSpecific: true,
          description: 'Button visual variant',
        },
      ],
      usesFactory: true,
      description: 'Previous navigation button; disabled when cannot scroll backward (unless loop)',
    },
    {
      name: 'NextTrigger',
      slots: [{ name: 'nextTrigger', element: 'button', description: 'Next page button' }],
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
          description: 'Custom trigger content (default: chevron icon)',
        },
        { name: 'size', typeRef: 'Size', moveSpecific: true, description: 'Button size' },
        {
          name: 'variant',
          type: "'surface' | 'ghost' | 'solid'",
          moveSpecific: true,
          description: 'Button visual variant',
        },
      ],
      usesFactory: true,
      description: 'Next navigation button; disabled when cannot scroll forward (unless loop)',
    },
    {
      name: 'IndicatorGroup',
      slots: [
        {
          name: 'indicatorGroup',
          element: 'div',
          description: 'Indicator container with tablist role',
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
          description: 'Custom indicators (auto-generated if omitted)',
        },
      ],
      usesFactory: true,
      description:
        'Container for page indicators; auto-generates indicator buttons when no children provided',
    },
    {
      name: 'Indicator',
      slots: [{ name: 'indicator', element: 'button', description: 'Individual indicator button' }],
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
          description: 'Custom indicator content',
        },
        {
          name: 'index',
          type: 'number',
          moveSpecific: true,
          description: 'The page index this indicator targets',
        },
      ],
      usesFactory: true,
      description: 'Single page indicator with tab role, aria-selected, and data-active state',
    },
  ],

  props: [
    {
      name: 'orientation',
      type: "'horizontal' | 'vertical'",
      default: "'horizontal'",
      moveSpecific: true,
      description: 'Scroll orientation',
    },
    {
      name: 'align',
      type: "'start' | 'center' | 'end'",
      default: "'start'",
      moveSpecific: true,
      description: 'Snap alignment',
    },
    {
      name: 'slidesPerView',
      type: 'number',
      default: '1',
      moveSpecific: true,
      description: 'Slides visible at once',
    },
    {
      name: 'loop',
      type: 'boolean',
      default: 'false',
      moveSpecific: true,
      description: 'Loop back to start',
    },
    {
      name: 'autoplay',
      type: 'number',
      default: '0',
      moveSpecific: true,
      description: 'Auto-advance interval in ms',
    },
    {
      name: 'draggable',
      type: 'boolean',
      default: 'true',
      moveSpecific: true,
      description: 'Enable drag/swipe',
    },
    {
      name: 'animations',
      type: 'AnimationTrigger[] | false',
      moveSpecific: true,
      description: 'Scroll animation config',
    },
    { name: 'page', type: 'number', moveSpecific: true, description: 'Controlled active page' },
    {
      name: 'defaultPage',
      type: 'number',
      moveSpecific: true,
      description: 'Initial page (uncontrolled)',
    },
    {
      name: 'onPageChange',
      type: '(page: number) => void',
      moveSpecific: true,
      description: 'Page change callback',
    },
    {
      name: 'children',
      type: 'React.ReactNode',
      moveSpecific: false,
      description: 'Carousel content',
    },
  ],

  anatomy: {
    slot: 'root',
    dataAttributes: ['data-orientation', 'data-overlay-hide'],
    ariaAttributes: ['role', 'aria-roledescription'],
    children: [
      {
        slot: 'viewport',
        dataAttributes: ['data-orientation', 'data-align', 'data-draggable'],
        ariaAttributes: ['aria-live'],
        children: [
          {
            slot: 'slide',
            dataAttributes: ['data-orientation'],
            ariaAttributes: ['role', 'aria-roledescription'],
          },
        ],
      },
      {
        slot: 'indicatorGroup',
        ariaAttributes: ['role', 'aria-label'],
        children: [
          {
            slot: 'indicator',
            dataAttributes: ['data-active'],
            ariaAttributes: ['role', 'aria-selected', 'aria-label'],
          },
        ],
      },
      {
        slot: 'prevTrigger',
        dataAttributes: ['data-orientation', 'data-size', 'data-variant'],
        ariaAttributes: ['aria-label'],
      },
      {
        slot: 'nextTrigger',
        dataAttributes: ['data-orientation', 'data-size', 'data-variant'],
        ariaAttributes: ['aria-label'],
      },
    ],
  },

  controlled: 'value' as const,
  controlledProps: {
    valueProp: 'page',
    defaultValueProp: 'defaultPage',
    onChangeProp: 'onPageChange',
  },
  keyboard: null,
  focus: 'roving' as const,
  formType: null,
  asChild: false,

  animationCapabilities: ['scrollApi'],
  animations: [
    { trigger: 'Viewport.enter', sequence: [{ animation: { opacity: { from: 0, to: 1 } } }] },
  ],

  tokens: [
    {
      name: '--move-carousel-gap',
      value: 'var(--move-spacing-md)',
      description: 'Gap between slides in the viewport',
    },
    {
      name: '--move-carousel-trigger-size',
      value: '36px',
      description: 'Width and height of trigger buttons (md size)',
    },
    {
      name: '--move-carousel-trigger-radius',
      value: 'var(--move-rounded-full)',
      description: 'Border radius of trigger buttons',
    },
    {
      name: '--move-carousel-trigger-bg',
      value: 'var(--move-surface-bg)',
      description: 'Trigger button background color',
    },
    {
      name: '--move-carousel-trigger-bg-hover',
      value: 'var(--move-surface-hover)',
      description: 'Trigger button hover background',
    },
    {
      name: '--move-carousel-trigger-fg',
      value: 'var(--move-fg-base)',
      description: 'Trigger button icon/text color',
    },
    {
      name: '--move-carousel-trigger-border',
      value: 'var(--move-surface-border)',
      description: 'Trigger button border color',
    },
    {
      name: '--move-carousel-trigger-shadow',
      value: 'var(--move-shadow-sm)',
      description: 'Trigger button box shadow',
    },
    {
      name: '--move-carousel-indicator-size',
      value: '9px',
      description: 'Visual size of indicator dots (::before pseudo)',
    },
    {
      name: '--move-carousel-indicator-hit-size',
      value: '20px',
      description: 'Hit area size of indicator buttons',
    },
    {
      name: '--move-carousel-indicator-bg',
      value: 'var(--move-fg-muted)',
      description: 'Inactive indicator dot background',
    },
    {
      name: '--move-carousel-indicator-bg-active',
      value: 'var(--move-primary)',
      description: 'Active indicator dot background',
    },
    {
      name: '--move-carousel-indicator-gap',
      value: '6px',
      description: 'Gap between indicator dots',
    },
    {
      name: '--move-carousel-indicator-inset',
      value: 'var(--move-spacing-sm)',
      description: 'Horizontal inset for inside-bottom indicators',
    },
    {
      name: '--move-carousel-overlay-inset',
      value: 'var(--move-spacing-sm)',
      description: 'Horizontal inset for overlay trigger buttons',
    },
    {
      name: '--move-carousel-overlay-offset-y',
      value: '50%',
      description: 'Vertical offset for overlay trigger buttons',
    },
  ],

  variants: {
    triggerVariant: ['surface', 'ghost', 'solid'] as string[],
    triggerSize: ['sm', 'md', 'lg'] as string[],
    orientation: ['horizontal', 'vertical'] as string[],
    align: ['start', 'center', 'end'] as string[],
    triggerPlacement: ['none', 'top', 'bottom', 'overlay', 'indicator-sides'] as string[],
    indicatorPlacement: ['inside-bottom', 'below'] as string[],
  },
  sizes: [] as string[],

  labels: [
    {
      key: 'previousSlide',
      default: 'Previous slide',
      description: 'Aria label for the previous trigger button',
    },
    {
      key: 'nextSlide',
      default: 'Next slide',
      description: 'Aria label for the next trigger button',
    },
    {
      key: 'slideIndicators',
      default: 'Slide indicators',
      description: 'Aria label for the indicator group',
    },
    {
      key: 'goToSlide',
      default: 'Go to slide {n}',
      description: 'Aria label template for individual indicator buttons',
    },
  ],

  renderContracts: [
    {
      id: 'context-provider',
      description:
        'Root renders a CarouselContext.Provider; all sub-components must be descendants of Root',
    },
    {
      id: 'scroll-snap-viewport',
      description:
        'Viewport uses CSS scroll-snap-type: x mandatory (or y mandatory for vertical) and hides scrollbar',
    },
    {
      id: 'slide-flex-sizing',
      description:
        'Slide width is calculated as (100% - (slidesPerView - 1) * gap) / slidesPerView using CSS calc and --move-carousel-slides-per-view custom property',
    },
    {
      id: 'slide-registration',
      description:
        'Each Slide registers/unregisters itself via registerSlide for dynamic page count calculation',
    },
    {
      id: 'page-detection',
      description:
        'Page is detected from scroll position via debounced scroll listener (150ms) when not programmatically scrolling',
    },
    {
      id: 'animated-scroll',
      description:
        'Programmatic page changes use useCarouselAnimation hook for smooth scroll; snap type is temporarily disabled during animation',
    },
    {
      id: 'drag-swipe',
      description:
        'When draggable, viewport handles pointer events for drag navigation; sets grab/grabbing cursor',
    },
    {
      id: 'autoplay-pause',
      description: 'Autoplay pauses on viewport mouseenter and focusin events',
    },
    {
      id: 'loop-wrapping',
      description:
        'When loop is true, page index wraps using modulo arithmetic; prev/next triggers are never disabled',
    },
    {
      id: 'built-in-controls',
      description:
        'showTriggers and showIndicators render built-in controls at positions determined by triggerPlacement and indicatorPlacement',
    },
    {
      id: 'indicator-auto-generation',
      description:
        'IndicatorGroup auto-generates indicator buttons when no children are provided, based on pageCount',
    },
    {
      id: 'indicator-sides-layout',
      description:
        'triggerPlacement="indicator-sides" renders a 3-column grid with PrevTrigger | IndicatorGroup | NextTrigger',
    },
    {
      id: 'overlay-hide-hover',
      description:
        'overlayHideUntilHover hides overlay triggers with opacity:0 and reveals them on root hover/focus-within',
    },
    {
      id: 'css-custom-props',
      description:
        'indicatorGap, indicatorInset, overlayInset, overlayOffsetY are passed as CSS custom properties on root inline style',
    },
  ],

  hasHook: true,
  engineImports: ['withMoveComponent', 'useControlledState'] as string[],

  componentDeps: [] as string[],

  testing: {
    behaviors: [
      'Root renders with role="region" and aria-roledescription="carousel"',
      'Viewport renders as flex scroll-snap container',
      'Viewport sets data-orientation based on orientation prop',
      'Viewport sets data-align based on align prop',
      'Viewport sets data-draggable when draggable is true',
      'Slide renders with role="group" and aria-roledescription="slide"',
      'Slide registers itself on mount and unregisters on unmount',
      'Slide flex sizing adjusts based on slidesPerView',
      'PrevTrigger scrolls to previous page on click',
      'PrevTrigger is disabled when canScrollPrev is false (non-loop)',
      'PrevTrigger defaults aria-label to "Previous slide"',
      'NextTrigger scrolls to next page on click',
      'NextTrigger is disabled when canScrollNext is false (non-loop)',
      'NextTrigger defaults aria-label to "Next slide"',
      'IndicatorGroup renders with role="tablist"',
      'IndicatorGroup auto-generates indicators based on pageCount',
      'Indicator renders with role="tab" and aria-selected matching active state',
      'Indicator sets data-active when its index matches current page',
      'Indicator scrollToPage on click',
      'Controlled page prop drives the active page',
      'onPageChange fires when page changes',
      'Loop mode enables wrapping and keeps triggers enabled',
      'Autoplay advances page at specified interval',
      'Autoplay pauses on hover/focus',
      'Drag/swipe navigation works on viewport',
      'showTriggers renders built-in prev/next triggers',
      'showIndicators renders built-in indicator dots',
      'triggerPlacement positions triggers at top/bottom/overlay/indicator-sides',
      'Forwards className and style on Root',
      'Forwards className and style on Viewport',
      'Forwards className and style on Slide',
      'Forwards ref on Viewport',
      'Forwards ref on Slide',
    ],
    aria: [
      'Root has role="region" and aria-roledescription="carousel"',
      'Viewport has aria-live="polite"',
      'Slide has role="group" and aria-roledescription="slide"',
      'PrevTrigger has aria-label',
      'NextTrigger has aria-label',
      'IndicatorGroup has role="tablist" and aria-label',
      'Indicator has role="tab" and aria-selected',
      'Trigger buttons are disabled when cannot navigate further (non-loop)',
    ],
    animation: [
      'Programmatic page changes animate the scroll position',
      'animations={false} disables scroll animation',
    ],
  },

  iconsUsed: ['chevron-left', 'chevron-right'],
} satisfies ComponentSpec;
