// Pagination.spec.ts — Component specification

import type { ComponentSpec } from '../../../spec-type';

export const spec = {
  schemaVersion: 1 as const,
  name: 'Pagination',
  animationPatterns: ['press'],
  componentClass: 'interactive' as const,
  category: 'navigation',
  description:
    'Page navigation control with numbered buttons, prev/next triggers, sliding active indicator, and staggered spring entrance animation',
  choreographies: ['press'],
  families: {
    behavior: ['navigation'],
    state: ['controlled-index'],
    a11y: ['none'],
  },

  compound: true,
  rootElement: 'nav',
  slots: [
    { name: 'root', element: 'nav', description: 'Root nav element with aria-label="Pagination"' },
    { name: 'prev', element: 'button', description: 'Previous page trigger button' },
    { name: 'next', element: 'button', description: 'Next page trigger button' },
    { name: 'items', element: 'ul', description: 'List of page buttons and ellipsis indicators' },
    { name: 'item', element: 'button', description: 'Individual page number button' },
    { name: 'ellipsis', element: 'span', description: 'Ellipsis indicator between page ranges' },
    {
      name: 'indicator',
      element: 'div',
      description: 'Sliding background indicator that follows the active page button',
    },
  ],

  subComponents: [
    {
      name: 'Root',
      slots: [{ name: 'root', element: 'nav', description: 'Root nav element' }],
      props: [
        { name: 'total', type: 'number', moveSpecific: true, description: 'Total number of pages' },
        {
          name: 'page',
          type: 'number',
          moveSpecific: true,
          description: 'Controlled active page (1-based)',
        },
        {
          name: 'defaultPage',
          type: 'number',
          moveSpecific: true,
          description: 'Initial page for uncontrolled mode (1-based)',
        },
        {
          name: 'onChange',
          type: '(page: number) => void',
          moveSpecific: true,
          description: 'Called when active page changes',
        },
        {
          name: 'siblings',
          type: 'number',
          default: '1',
          moveSpecific: true,
          description: 'Pages shown on each side of the active page',
        },
        {
          name: 'boundaries',
          type: 'number',
          default: '1',
          moveSpecific: true,
          description: 'Pages pinned at start and end of range',
        },
        {
          name: 'size',
          typeRef: 'Size',
          default: "'md'",
          moveSpecific: true,
          description: 'Size of pagination controls',
        },
        {
          name: 'variant',
          type: "'default' | 'outline'",
          default: "'default'",
          moveSpecific: true,
          description: 'Visual variant',
        },
        {
          name: 'labels',
          type: 'Partial<PaginationLabels>',
          moveSpecific: true,
          description: 'Overridable user-facing strings',
        },
        {
          name: 'children',
          type: 'React.ReactNode',
          moveSpecific: false,
          description: 'PrevTrigger, Items, NextTrigger',
        },
      ],
      usesFactory: true,
      description:
        'Root container that provides pagination state (via usePagination hook) and visual config to children via context',
    },
    {
      name: 'PrevTrigger',
      slots: [{ name: 'prev', element: 'button', description: 'Previous page button' }],
      props: [
        {
          name: 'animations',
          type: 'AnimationTrigger[] | false',
          moveSpecific: true,
          description: 'Interactive animation config or false to disable',
        },
        {
          name: 'children',
          type: 'React.ReactNode',
          moveSpecific: false,
          description: 'Button content (defaults to left chevron SVG)',
        },
      ],
      usesFactory: true,
      description:
        'Previous page button that disables when on first page; uses interactive animation hook',
    },
    {
      name: 'NextTrigger',
      slots: [{ name: 'next', element: 'button', description: 'Next page button' }],
      props: [
        {
          name: 'animations',
          type: 'AnimationTrigger[] | false',
          moveSpecific: true,
          description: 'Interactive animation config or false to disable',
        },
        {
          name: 'children',
          type: 'React.ReactNode',
          moveSpecific: false,
          description: 'Button content (defaults to right chevron SVG)',
        },
      ],
      usesFactory: true,
      description:
        'Next page button that disables when on last page; uses interactive animation hook',
    },
    {
      name: 'Items',
      slots: [
        { name: 'items', element: 'ul', description: 'Page list container' },
        { name: 'item', element: 'button', description: 'Page number button' },
        { name: 'ellipsis', element: 'span', description: 'Ellipsis between ranges' },
        { name: 'indicator', element: 'div', description: 'Sliding active indicator' },
      ],
      props: [
        {
          name: 'animations',
          type: 'AnimationTrigger[] | false',
          moveSpecific: true,
          description: 'Interactive animation config or false to disable',
        },
      ],
      usesFactory: true,
      description:
        'Renders page number buttons and ellipsis indicators based on computed range from usePagination; includes sliding indicator and staggered entrance animation',
    },
  ],

  props: [
    { name: 'total', type: 'number', moveSpecific: true, description: 'Total number of pages' },
    {
      name: 'page',
      type: 'number',
      moveSpecific: true,
      description: 'Controlled active page (1-based)',
    },
    {
      name: 'defaultPage',
      type: 'number',
      moveSpecific: true,
      description: 'Initial page for uncontrolled mode',
    },
    {
      name: 'onChange',
      type: '(page: number) => void',
      moveSpecific: true,
      description: 'Called when active page changes',
    },
    {
      name: 'siblings',
      type: 'number',
      default: '1',
      moveSpecific: true,
      description: 'Pages shown on each side of active',
    },
    {
      name: 'boundaries',
      type: 'number',
      default: '1',
      moveSpecific: true,
      description: 'Pages pinned at start and end',
    },
    {
      name: 'size',
      typeRef: 'Size',
      default: "'md'",
      moveSpecific: true,
      description: 'Size of pagination controls',
    },
    {
      name: 'variant',
      type: "'default' | 'outline'",
      default: "'default'",
      moveSpecific: true,
      description: 'Visual variant',
    },
    {
      name: 'children',
      type: 'React.ReactNode',
      moveSpecific: false,
      description: 'PrevTrigger, Items, NextTrigger',
    },
  ],

  anatomy: {
    slot: 'root',
    dataAttributes: ['data-size', 'data-variant'],
    ariaAttributes: ['aria-label'],
    children: [
      {
        slot: 'prev',
        ariaAttributes: ['aria-label'],
      },
      {
        slot: 'items',
        children: [
          {
            slot: 'item',
            dataAttributes: ['data-state'],
            ariaAttributes: ['aria-label', 'aria-current'],
          },
          { slot: 'ellipsis' },
          {
            slot: 'indicator',
            ariaAttributes: ['aria-hidden'],
          },
        ],
      },
      {
        slot: 'next',
        ariaAttributes: ['aria-label'],
      },
    ],
  },

  controlled: 'value' as const,
  controlledProps: {
    valueProp: 'page',
    defaultValueProp: 'defaultPage',
    onChangeProp: 'onChange',
  },
  keyboard: null,
  focus: 'self' as const,
  formType: null,
  asChild: false,

  animationCapabilities: ['slidingIndicator'],
  animations: [
    {
      trigger: 'PrevTrigger.hover',
      sequence: [{ animation: { scale: { to: 1.04, ease: 'snappy' } } }],
    },
    {
      trigger: 'PrevTrigger.press',
      sequence: [{ animation: { scale: { to: 0.96, ease: 'snappy' } } }],
    },
    {
      trigger: 'NextTrigger.hover',
      sequence: [{ animation: { scale: { to: 1.04, ease: 'snappy' } } }],
    },
    {
      trigger: 'NextTrigger.press',
      sequence: [{ animation: { scale: { to: 0.96, ease: 'snappy' } } }],
    },
    {
      trigger: 'PageButton.hover',
      sequence: [{ animation: { scale: { to: 1.04, ease: 'snappy' } } }],
    },
    {
      trigger: 'PageButton.press',
      sequence: [{ animation: { scale: { to: 0.96, ease: 'snappy' } } }],
    },
  ],

  tokens: [
    {
      name: '--move-pagination-item-bg',
      value: 'transparent',
      description: 'Item default background',
    },
    {
      name: '--move-pagination-item-bg-hover',
      value: 'var(--move-bg-muted)',
      description: 'Item hover background',
    },
    {
      name: '--move-pagination-item-bg-active',
      value: 'var(--move-primary)',
      description: 'Active item/indicator background',
    },
    {
      name: '--move-pagination-item-fg',
      value: 'var(--move-fg-muted)',
      description: 'Item default text color',
    },
    {
      name: '--move-pagination-item-fg-hover',
      value: 'var(--move-fg-base)',
      description: 'Item hover text color',
    },
    {
      name: '--move-pagination-item-fg-active',
      value: 'var(--move-primary-fg)',
      description: 'Active item text color',
    },
    {
      name: '--move-pagination-item-border',
      value: 'var(--move-border-base)',
      description: 'Item border color',
    },
    {
      name: '--move-pagination-item-radius',
      value: 'var(--move-rounded-md)',
      description: 'Item border radius',
    },
    {
      name: '--move-pagination-gap',
      value: 'var(--move-spacing-xs)',
      description: 'Gap between pagination elements',
    },
  ],

  variants: {
    variant: ['default', 'outline'] as string[],
  },
  sizes: ['sm', 'md', 'lg'] as string[],

  labels: [
    { key: 'label', default: 'Pagination', description: 'Aria-label for the root nav element' },
    {
      key: 'previous',
      default: 'Go to previous page',
      description: 'Aria-label for previous trigger button',
    },
    { key: 'next', default: 'Go to next page', description: 'Aria-label for next trigger button' },
    {
      key: 'page',
      default: 'Go to page {page}',
      description: 'Aria-label template for page buttons; {page} is replaced with the page number',
    },
  ],
  childrenKind: 'composition' as const,

  renderContracts: [
    {
      id: 'use-pagination-hook',
      description:
        'Root uses the usePagination hook to compute page range, navigation functions, and controlled/uncontrolled state',
    },
    {
      id: 'range-with-dots',
      description:
        'Items renders page buttons and ellipsis based on the range array from usePagination (numbers and "dots" entries)',
    },
    {
      id: 'sliding-indicator',
      description:
        'Items uses the slidingIndicator capability (usePositionTracker hook) to position the absolute indicator behind the active page button',
    },
    {
      id: 'stagger-entrance',
      description:
        'Items renders a staggered spring scale entrance animation on mount (left to right, 30ms per item)',
    },
    {
      id: 'slide-transition',
      description:
        'When range changes, newly appearing page numbers slide in from the navigation direction with spring animation',
    },
    {
      id: 'indicator-hidden-during-stagger',
      description:
        'Sliding indicator is hidden during stagger entrance and revealed after items reach full size',
    },
    {
      id: 'prev-default-icon',
      description: 'PrevTrigger defaults to a left chevron SVG when no children provided',
    },
    {
      id: 'next-default-icon',
      description: 'NextTrigger defaults to a right chevron SVG when no children provided',
    },
    { id: 'prev-disabled-at-first', description: 'PrevTrigger is disabled when on first page' },
    { id: 'next-disabled-at-last', description: 'NextTrigger is disabled when on last page' },
    {
      id: 'outline-variant-indicator',
      description: 'In outline variant, indicator shows a border instead of filled background',
    },
    {
      id: 'page-button-interactive',
      description:
        'Each page button uses useAnimations with hover/press event triggers for interactive effects',
    },
  ],

  hasHook: true,
  engineImports: ['withMoveComponent', 'useMergedRef', 'useControlledState'] as string[],
  componentDeps: [] as string[],

  testing: {
    behaviors: [
      'Root renders as nav with aria-label="Pagination"',
      'Root defaults to size=md, variant=default, siblings=1, boundaries=1',
      'Root applies data-size and data-variant attributes',
      'Items renders correct page range based on total, siblings, and boundaries',
      'Items renders ellipsis for collapsed page ranges',
      'Active page button has data-state="active" and aria-current="page"',
      'Page buttons have aria-label="Go to page {n}"',
      'Clicking a page button calls onChange with that page number',
      'PrevTrigger calls previous navigation when clicked',
      'PrevTrigger is disabled when on page 1',
      'PrevTrigger has aria-label="Go to previous page"',
      'NextTrigger calls next navigation when clicked',
      'NextTrigger is disabled when on last page',
      'NextTrigger has aria-label="Go to next page"',
      'PrevTrigger renders default left chevron SVG',
      'NextTrigger renders default right chevron SVG',
      'Supports controlled mode via page prop',
      'Supports uncontrolled mode via defaultPage prop',
      'Outline variant shows border on indicator instead of filled bg',
      'Forwards className and style on all sub-components',
      'Forwards ref on all sub-components',
    ],
    keyboard: [
      'Page buttons are focusable',
      'Focus-visible shows focus ring on items, prev, and next',
    ],
    aria: [
      'Root nav has aria-label="Pagination"',
      'PrevTrigger has aria-label="Go to previous page"',
      'NextTrigger has aria-label="Go to next page"',
      'Page buttons have aria-label with page number',
      'Active page has aria-current="page"',
      'Ellipsis li elements have aria-hidden="true"',
      'Indicator has aria-hidden="true"',
      'Disabled triggers have native disabled attribute',
    ],
    animation: [
      'Items stagger entrance with spring scale animation on mount (30ms delay per item)',
      'Sliding indicator tracks active page button position',
      'Indicator is hidden during stagger entrance and revealed after',
      'Newly appearing page numbers slide in with spring from navigation direction',
      'PrevTrigger and NextTrigger have interactive hover/press animations',
      'Page buttons have interactive hover/press animations',
      'animations={false} on triggers disables interactive animations',
      'Reduced motion preference disables all animations',
    ],
  },

  iconsUsed: ['chevron-left', 'chevron-right'],
} satisfies ComponentSpec;
