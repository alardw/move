// Accordion.spec.ts — Component specification
// specHash: PLACEHOLDER

import type { ComponentSpec } from '../../../spec-type';

export const spec = {
  schemaVersion: 7 as const,
  name: 'Accordion',
  componentClass: 'disclosure' as const,
  category: 'disclosure',
  description: 'Vertically stacked disclosure panels with single or multiple expand mode, keyboard navigation, and animated content reveal',

  synonyms: ['expander', 'collapsible group', 'faq', 'disclosure list', 'collapse'],
  animationPatterns: ['disclosure'],
  families: {
    behavior:  ['disclosure'],
    state:     ['controlled-value'],  // value identifies which item(s) are open
    a11y:      ['disclosure'],
  },
  behavior: {
    disclosure: {
      animatesOpen: true,
      animatesClose: true,
      keyboardToggle: true,            // Enter/Space toggles a focused trigger
      multipleOpen: true,              // type="multiple" supports many open
    },
  },

  compound: true,
  rootElement: 'div',
  slots: [
    { name: 'root', element: 'div', description: 'Outer accordion container scoping component tokens' },
    { name: 'item', element: 'div', description: 'Individual disclosure section with open/closed state' },
    { name: 'header', element: 'div', description: 'Wrapper around the trigger for structural flexibility' },
    { name: 'trigger', element: 'button', description: 'Clickable header button that toggles the item open/closed' },
    { name: 'icon', element: 'span', description: 'Chevron indicator that rotates to reflect open/closed state' },
    { name: 'content', element: 'div', description: 'Collapsible content region with height animation' },
    { name: 'contentInner', element: 'div', description: 'Inner content wrapper for opacity animation' },
  ],

  subComponents: [
    {
      name: 'Root',
      slots: [{ name: 'root', element: 'div', description: 'Outer accordion container' }],
      props: [
        { name: 'type', type: "'single' | 'multiple'", default: "'single'", moveSpecific: true, description: 'Whether one or many items can be open at once' },
        { name: 'value', type: 'string | string[]', moveSpecific: true, description: 'Controlled value (string for single, string[] for multiple)' },
        { name: 'defaultValue', type: 'string | string[]', moveSpecific: true, description: 'Default value for uncontrolled mode' },
        { name: 'onValueChange', type: '(value: string | string[]) => void', moveSpecific: true, description: 'Called when value changes' },
        { name: 'collapsible', type: 'boolean', default: 'true', moveSpecific: true, description: 'Allow closing all items in single mode' },
        { name: 'size', typeRef: 'Size', default: "'md'", moveSpecific: true, description: 'Size affecting padding and font sizes' },
        { name: 'variant', type: "'default' | 'contained' | 'ghost'", default: "'default'", moveSpecific: true, description: 'Visual style variant' },
        { name: 'animations', type: 'AnimationTrigger[] | false', moveSpecific: true, description: 'Animation config for enter stagger and content expand/collapse, or false to disable' },
        { name: 'children', type: 'React.ReactNode', moveSpecific: false, description: 'Accordion items' },
      ],
      usesFactory: true,
      description: 'Root container providing accordion context (value state, animation config) to child items',
    },
    {
      name: 'Item',
      slots: [{ name: 'item', element: 'div', description: 'Item container' }],
      props: [
        { name: 'value', type: 'string', moveSpecific: true, description: 'Unique identifier for this item' },
        { name: 'children', type: 'React.ReactNode', moveSpecific: false, description: 'Header and content elements' },
      ],
      usesFactory: true,
      description: 'Individual disclosure panel with stagger enter animation and data-state tracking',
    },
    {
      name: 'Header',
      slots: [{ name: 'header', element: 'div', description: 'Header wrapper' }],
      props: [
        { name: 'children', type: 'React.ReactNode', moveSpecific: false, description: 'Trigger element' },
      ],
      usesFactory: true,
      description: 'Structural wrapper for the trigger button',
    },
    {
      name: 'Trigger',
      slots: [
        { name: 'trigger', element: 'button', description: 'Trigger button' },
        { name: 'icon', element: 'span', description: 'Chevron icon' },
      ],
      props: [
        { name: 'icon', type: 'React.ReactNode', moveSpecific: true, description: 'Custom icon replacing the default chevron' },
        { name: 'animations', type: 'AnimationTrigger[] | false', moveSpecific: true, description: 'Hover animation config for the trigger or false to disable' },
        { name: 'children', type: 'React.ReactNode', moveSpecific: false, description: 'Trigger label text' },
      ],
      usesFactory: true,
      description: 'Button that toggles the parent item, with hover animation and rotating chevron icon',
    },
    {
      name: 'Content',
      slots: [
        { name: 'content', element: 'div', description: 'Collapsible content outer (height animation)' },
        { name: 'contentInner', element: 'div', description: 'Content inner (opacity animation)' },
      ],
      props: [
        { name: 'children', type: 'React.ReactNode', moveSpecific: false, description: 'Expandable content' },
      ],
      usesFactory: true,
      description: 'Animated collapsible region with coordinated height and opacity transitions',
    },
  ],

  props: [
    { name: 'type', type: "'single' | 'multiple'", default: "'single'", moveSpecific: true, description: 'Whether one or many items can be open at once' },
    { name: 'value', type: 'string | string[]', moveSpecific: true, description: 'Controlled value' },
    { name: 'defaultValue', type: 'string | string[]', moveSpecific: true, description: 'Default value for uncontrolled mode' },
    { name: 'onValueChange', type: '(value: string | string[]) => void', moveSpecific: true, description: 'Called when value changes' },
    { name: 'collapsible', type: 'boolean', default: 'true', moveSpecific: true, description: 'Allow closing all items in single mode' },
    { name: 'size', typeRef: 'Size', default: "'md'", moveSpecific: true, description: 'Size affecting padding and font sizes' },
    { name: 'variant', type: "'default' | 'contained' | 'ghost'", default: "'default'", moveSpecific: true, description: 'Visual style variant' },
    { name: 'animations', type: 'AnimationTrigger[] | false', moveSpecific: true, description: 'Animation config or false to disable' },
    { name: 'children', type: 'React.ReactNode', moveSpecific: false, description: 'Accordion items' },
  ],

  anatomy: {
    slot: 'root',
    dataAttributes: ['data-size', 'data-variant', 'data-move-accordion-root'],
    children: [
      {
        slot: 'item',
        dataAttributes: ['data-state'],
        children: [
          {
            slot: 'header',
            children: [
              {
                slot: 'trigger',
                dataAttributes: ['data-state', 'data-value', 'data-move-accordion-trigger'],
                ariaAttributes: ['aria-expanded'],
                children: [
                  { slot: 'icon' },
                ],
              },
            ],
          },
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
    ],
  },

  controlled: 'value' as const,
  controlledProps: {
    valueProp: 'value',
    defaultValueProp: 'defaultValue',
    onChangeProp: 'onValueChange',
  },
  keyboard: 'roving' as const,
  focus: 'roving' as const,
  formType: null,
  asChild: false,

  states: [
    { name: 'open', slot: 'Item', source: 'data-state', value: 'open' },
    { name: 'close', slot: 'Item', source: 'data-state', value: 'closed' },
  ],

  animations: [
    { trigger: 'open', sequence: [[
      { target: 'icon', animation: { rotate: { to: 180, ease: 'snappy' } } },
      { target: 'content', fn: 'animateDimension', animation: { height: { ease: 'poppy' } } },
    ]] },
    { trigger: 'close', sequence: [[
      { target: 'icon', animation: { rotate: { to: 0, ease: 'snappy' } } },
      { target: 'content', fn: 'animateDimension', animation: { height: { ease: 'snappy' } } },
    ]] },
  ],

  renderContracts: [
    { id: 'context-provider', description: 'Root wraps children in AccordionContext.Provider to share state and animation config with items' },
    { id: 'item-context', description: 'Item wraps children in AccordionItemContext.Provider to share value and active state with trigger/content' },
    { id: 'stagger-enter', description: 'Items play a stagger entrance animation on mount based on their DOM index and stagger.delay config' },
    { id: 'icon-rotation-sync', description: 'Trigger icon rotation is synchronized with the content expand/collapse animation duration' },
    { id: 'content-conditional-render', description: 'Content only renders when item is active or animating out (unmounts when fully closed)' },
    { id: 'content-height-opacity', description: 'Content expand animates height from 0 to scrollHeight with delayed opacity fade-in; collapse reverses with early opacity fade-out' },
    { id: 'trigger-hover-animation', description: 'Trigger has a subtle scale-up on hover via anime.js, configurable or disableable' },
    { id: 'keyboard-navigation', description: 'Arrow Up/Down cycles focus among triggers; Home/End jump to first/last; Enter/Space toggles the focused item' },
    { id: 'single-multiple-mode', description: 'In single mode, only one item can be open at a time; in multiple mode, any combination of items can be open' },
    { id: 'collapsible-single', description: 'When collapsible=true (default) in single mode, clicking the open item closes it; when false, one item must always remain open' },
    { id: 'resolved-icon-chevron', description: 'Trigger uses useResolvedIcon to render a default chevron-down icon when no custom icon is provided' },
  ],

  tokens: [
    { name: '--move-accordion-radius', value: 'var(--move-rounded-lg)', description: 'Root border radius' },
    { name: '--move-accordion-border', value: 'var(--move-border-base)', description: 'Container border color (used by contained variant)' },
    { name: '--move-accordion-item-border', value: 'var(--move-border-base)', description: 'Border between items' },
    { name: '--move-accordion-header-height', value: 'var(--move-space-12)', description: 'Minimum header height' },
    { name: '--move-accordion-trigger-padding-x', value: 'var(--move-spacing-md)', description: 'Trigger horizontal padding' },
    { name: '--move-accordion-trigger-padding-y', value: 'var(--move-spacing-md)', description: 'Trigger vertical padding' },
    { name: '--move-accordion-trigger-bg', value: 'var(--move-surface-alt-hover)', description: 'Trigger background' },
    { name: '--move-accordion-trigger-bg-hover', value: 'var(--move-surface-hover)', description: 'Trigger hover background' },
    { name: '--move-accordion-trigger-fg', value: 'var(--move-fg-base)', description: 'Trigger foreground' },
    { name: '--move-accordion-trigger-border', value: 'var(--move-border-base)', description: 'Trigger border color' },
    { name: '--move-accordion-trigger-font-size', value: 'var(--move-size-sm)', description: 'Trigger font size' },
    { name: '--move-accordion-trigger-font-weight', value: 'var(--move-weight-medium)', description: 'Trigger font weight' },
    { name: '--move-accordion-content-padding', value: 'var(--move-spacing-md)', description: 'Content inner padding' },
    { name: '--move-accordion-content-bg', value: 'inherit', description: 'Content background' },
    { name: '--move-accordion-content-fg', value: 'var(--move-fg-muted)', description: 'Content foreground' },
    { name: '--move-accordion-content-font-size', value: 'var(--move-size-sm)', description: 'Content font size' },
    { name: '--move-accordion-icon-size', value: 'var(--move-text-xl)', description: 'Icon dimensions' },
    { name: '--move-accordion-icon-color', value: 'var(--move-fg-muted)', description: 'Icon color' },
    { name: '--move-accordion-transition-duration', value: 'var(--move-transition-normal)', description: 'CSS transition duration for background hover' },
    { name: '--move-accordion-transition-easing', value: 'var(--move-ease-default)', description: 'CSS transition easing for background hover' },
  ],

  variants: {
    variant: ['default', 'contained', 'ghost'] as string[],
  },
  sizes: ['sm', 'md', 'lg'] as string[],

  labels: [],
  childrenKind: 'composition' as const,

  hasHook: true,
  engineImports: ['withMoveComponent', 'useMergedRef'] as string[],

  componentDeps: [] as string[],

  testing: {
    behaviors: [
      'Root renders as div with data-move-accordion-root attribute',
      'Root applies variant via data-variant attribute',
      'Root applies size via data-size attribute',
      'Root defaults to type=single, collapsible=true, size=md, variant=default',
      'Item renders with data-state=open when active',
      'Item renders with data-state=closed when inactive',
      'Trigger renders as button with type=button',
      'Trigger sets aria-expanded matching item active state',
      'Trigger sets data-value with item value',
      'Clicking trigger toggles item open/closed',
      'In single mode, opening one item closes previously open item',
      'In multiple mode, multiple items can be open simultaneously',
      'Collapsible=false prevents closing the last open item in single mode',
      'Content renders role=region',
      'Content only renders when item is open or animating out',
      'Icon renders default chevron-down when no custom icon provided',
      'Icon renders custom icon when icon prop is provided',
      'Contained variant adds border to root',
      'Ghost variant removes trigger background and item borders',
      'Size sm reduces padding and font sizes',
      'Size lg increases padding and font sizes',
      'Each sub-component forwards className and style',
      'Each sub-component forwards ref',
      'Controlled value prop controls which items are open',
      'onValueChange fires when items are toggled',
    ],
    keyboard: [
      'ArrowDown moves focus to next trigger (wraps around)',
      'ArrowUp moves focus to previous trigger (wraps around)',
      'Home moves focus to first trigger',
      'End moves focus to last trigger',
      'Enter toggles the focused item',
      'Space toggles the focused item',
    ] as string[],
    aria: [
      'Trigger has aria-expanded=true when item is open',
      'Trigger has aria-expanded=false when item is closed',
      'Content has role=region',
    ] as string[],
    animation: [
      'Items animate in with stagger on mount (opacity + scale)',
      'Content animates height from 0 to auto on open',
      'Content inner fades in with delayed opacity on open',
      'Content animates height to 0 on close',
      'Content inner fades out before height collapse',
      'Icon rotates to 180deg when item opens',
      'Icon rotates to 0deg when item closes',
      'Trigger scales on hover',
      'animations={false} disables all animations',
      'Reduced motion preference skips all animations',
    ] as string[],
  },

  defaultReview: {
    status: 'approved' as const,
    decisionSource: 'accept-all' as const,
    overrides: {},
  },
} satisfies ComponentSpec;
