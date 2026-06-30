// Tabs.spec.ts — Component specification
// specHash: PLACEHOLDER

import type { ComponentSpec } from '../../../spec-type';

export const spec = {
  schemaVersion: 7 as const,
  name: 'Tabs',
  componentClass: 'disclosure' as const,
  category: 'navigation',
  description:
    'Tabbed interface with underline/pills/outline variants, sliding indicator animation, and Radix Tabs primitive',

  synonyms: ['tabbed', 'segmented', 'tab bar', 'tab list', 'tabbar', 'sections'],
  animationPatterns: ['slidingIndicator'],
  families: {
    behavior: ['navigation'],
    state: ['controlled-value'],
    a11y: ['tablist'],
  },

  compound: true,
  rootElement: 'RadixTabs.Root',
  slots: [
    {
      name: 'root',
      element: 'RadixTabs.Root',
      description: 'Root container managing tab state via Radix Tabs.Root',
    },
    {
      name: 'list',
      element: 'RadixTabs.List',
      description: 'Tab trigger list container with variant and size styling',
    },
    {
      name: 'indicator',
      element: 'div',
      description:
        'Sliding underline indicator positioned by the slidingIndicator capability (shared usePositionTracker hook), tracking the active trigger',
    },
    {
      name: 'trigger',
      element: 'RadixTabs.Trigger',
      description: 'Individual tab button that activates its panel',
    },
    {
      name: 'content',
      element: 'RadixTabs.Content',
      description: 'Tab panel content associated with a trigger value',
    },
  ],

  subComponents: [
    {
      name: 'Root',
      slots: [{ name: 'root', element: 'RadixTabs.Root', description: 'Root container' }],
      props: [
        {
          name: 'children',
          type: 'React.ReactNode',
          moveSpecific: false,
          description: 'Tab list and content elements',
        },
        { name: 'className', type: 'string', moveSpecific: false, description: 'CSS class name' },
        {
          name: 'style',
          type: 'React.CSSProperties',
          moveSpecific: false,
          description: 'Inline styles',
        },
        {
          name: 'defaultValue',
          type: 'string',
          moveSpecific: true,
          description: 'Initial active tab value (uncontrolled)',
        },
        {
          name: 'value',
          type: 'string',
          moveSpecific: true,
          description: 'Controlled active tab value',
        },
        {
          name: 'onValueChange',
          type: '(value: string) => void',
          moveSpecific: true,
          description: 'Called when active tab changes',
        },
        {
          name: 'orientation',
          type: "'horizontal' | 'vertical'",
          moveSpecific: true,
          description: 'Orientation of tab list',
        },
        {
          name: 'dir',
          type: "'ltr' | 'rtl'",
          moveSpecific: true,
          description: 'Text direction for keyboard navigation',
        },
        {
          name: 'activationMode',
          type: "'automatic' | 'manual'",
          moveSpecific: true,
          description: 'Whether tabs activate on focus (automatic) or on click (manual)',
        },
      ],
      usesFactory: true,
      radixPrimitive: 'Tabs.Root',
      description: 'Stateless root wrapping Radix Tabs.Root to manage active tab state',
    },
    {
      name: 'List',
      slots: [
        { name: 'list', element: 'RadixTabs.List', description: 'Tab list container' },
        { name: 'indicator', element: 'div', description: 'Sliding underline indicator' },
      ],
      props: [
        {
          name: 'children',
          type: 'React.ReactNode',
          moveSpecific: false,
          description: 'Tab trigger elements',
        },
        { name: 'className', type: 'string', moveSpecific: false, description: 'CSS class name' },
        {
          name: 'style',
          type: 'React.CSSProperties',
          moveSpecific: false,
          description: 'Inline styles',
        },
        {
          name: 'loop',
          type: 'boolean',
          moveSpecific: true,
          description: 'Whether keyboard navigation loops around',
        },
        {
          name: 'size',
          typeRef: 'Size',
          default: "'md'",
          moveSpecific: true,
          description: 'Tab size affecting padding and font size',
        },
        {
          name: 'variant',
          type: "'underline' | 'pills' | 'outline'",
          default: "'underline'",
          moveSpecific: true,
          description: 'Visual style variant',
        },
        {
          name: 'animations',
          type: 'AnimationTrigger[] | false',
          moveSpecific: true,
          description: 'Pass false to disable sliding indicator animation',
        },
      ],
      usesFactory: true,
      radixPrimitive: 'Tabs.List',
      description: 'Horizontal tab list with variant styling and optional sliding indicator',
    },
    {
      name: 'Trigger',
      slots: [
        { name: 'trigger', element: 'RadixTabs.Trigger', description: 'Individual tab button' },
      ],
      props: [
        {
          name: 'children',
          type: 'React.ReactNode',
          moveSpecific: false,
          description: 'Tab label content',
        },
        { name: 'className', type: 'string', moveSpecific: false, description: 'CSS class name' },
        {
          name: 'style',
          type: 'React.CSSProperties',
          moveSpecific: false,
          description: 'Inline styles',
        },
        {
          name: 'value',
          type: 'string',
          moveSpecific: true,
          description: 'Unique value associating trigger with content',
        },
        {
          name: 'disabled',
          type: 'boolean',
          moveSpecific: false,
          description: 'Disable the tab trigger',
        },
      ],
      usesFactory: true,
      radixPrimitive: 'Tabs.Trigger',
      description: 'Individual tab button that activates its corresponding content panel',
    },
    {
      name: 'Content',
      slots: [{ name: 'content', element: 'RadixTabs.Content', description: 'Tab content panel' }],
      props: [
        {
          name: 'children',
          type: 'React.ReactNode',
          moveSpecific: false,
          description: 'Panel content',
        },
        { name: 'className', type: 'string', moveSpecific: false, description: 'CSS class name' },
        {
          name: 'style',
          type: 'React.CSSProperties',
          moveSpecific: false,
          description: 'Inline styles',
        },
        {
          name: 'value',
          type: 'string',
          moveSpecific: true,
          description: 'Value matching the trigger to show this content',
        },
        {
          name: 'forceMount',
          type: 'true',
          moveSpecific: true,
          description: 'Force mount content even when inactive',
        },
      ],
      usesFactory: true,
      radixPrimitive: 'Tabs.Content',
      description: 'Panel content area that shows when its matching trigger is active',
    },
  ],

  props: [],

  anatomy: {
    slot: 'root',
    children: [
      {
        slot: 'list',
        dataAttributes: ['data-size', 'data-variant'],
        children: [
          {
            slot: 'trigger',
            dataAttributes: ['data-state', 'data-disabled'],
          },
          { slot: 'indicator' },
        ],
      },
      {
        slot: 'content',
        dataAttributes: ['data-state'],
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

  states: [],

  // The underline indicator is driven by the shared usePositionTracker hook
  // (the slidingIndicator capability), not a declarative animatePosition trigger.
  animationCapabilities: ['slidingIndicator'],
  animations: [],

  renderContracts: [
    {
      id: 'indicator-underline-only',
      description:
        'Sliding indicator is only rendered when variant is underline (default). Pills and outline variants do not render the indicator element.',
    },
    {
      id: 'indicator-tracks-width',
      description:
        'The usePositionTracker hook runs with track: "width" — it matches the underline to the active trigger horizontally (offsetLeft + offsetWidth), re-measuring on resize and font load.',
    },
    {
      id: 'content-tabindex-minus-one',
      description:
        'Content panel sets tabIndex={-1} to prevent it from being a tab stop while allowing programmatic focus.',
    },
    {
      id: 'size-via-data-attr',
      description:
        'Size is set as data-size on List, and triggers inherit sizing via CSS descendant selectors (.list[data-size] .trigger).',
    },
    {
      id: 'variant-via-data-attr',
      description:
        'Variant is set as data-variant on List, and triggers inherit variant styling via CSS descendant selectors.',
    },
  ],

  tokens: [
    {
      name: '--move-tabs-border',
      value: 'var(--move-border-base)',
      description: 'Border color for underline and outline variants',
    },
    {
      name: '--move-tabs-trigger-fg',
      value: 'var(--move-fg-muted)',
      description: 'Inactive trigger text color',
    },
    {
      name: '--move-tabs-trigger-fg-active',
      value: 'var(--move-fg-base)',
      description: 'Active trigger text color',
    },
    {
      name: '--move-tabs-trigger-bg-hover',
      value: 'var(--move-surface-hover)',
      description: 'Trigger hover background color',
    },
    {
      name: '--move-tabs-indicator',
      value: 'var(--move-primary)',
      description: 'Sliding indicator color for underline variant',
    },
  ],

  variants: {
    variant: ['underline', 'pills', 'outline'] as string[],
  },

  sizes: ['sm', 'md', 'lg'] as string[],

  labels: [],

  radixPrimitive: 'Tabs',

  hasHook: false,
  engineImports: ['withMoveComponent'] as string[],

  componentDeps: [] as string[],

  testing: {
    behaviors: [
      'Root renders Radix Tabs.Root with correct props',
      'List renders Radix Tabs.List with data-size and data-variant',
      'Trigger renders Radix Tabs.Trigger with value prop',
      'Content renders Radix Tabs.Content with value prop',
      'Content sets tabIndex={-1}',
      'Inactive content is hidden via data-state=inactive display:none',
      'Default variant is underline',
      'Default size is md',
      'Sliding indicator renders only for underline variant',
      'Sliding indicator is hidden for pills variant',
      'Sliding indicator is hidden for outline variant',
      'Pills variant applies border-radius and active background',
      'Outline variant applies borders and active background',
      'Size sm applies smaller padding and font',
      'Size lg applies larger padding and font',
      'Disabled triggers have data-disabled and reduced opacity',
      'forceMount keeps content in DOM when inactive',
      'Forwards className and style on all sub-components',
      'Controlled value/onValueChange works correctly',
      'Uncontrolled defaultValue works correctly',
    ],
    keyboard: [
      'Arrow keys navigate between triggers (roving tabindex)',
      'Enter/Space activates a trigger in manual activation mode',
      'Home/End move focus to first/last trigger',
      'Loop prop wraps focus from last to first trigger',
    ],
    aria: [
      'Tabs.Root sets role=tablist on List via Radix',
      'Triggers have role=tab from Radix',
      'Content panels have role=tabpanel from Radix',
      'Active trigger has aria-selected=true',
      'Content is associated with trigger via aria-labelledby',
      'Disabled trigger has aria-disabled',
    ],
    animation: [
      'Sliding indicator animates position on tab change',
      'animations={false} disables sliding indicator',
      'Indicator snaps on first render without animation',
    ],
  },
} satisfies ComponentSpec;
