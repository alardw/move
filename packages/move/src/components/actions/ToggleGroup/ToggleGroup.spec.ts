// ToggleGroup.spec.ts — Component specification

import type { ComponentSpec } from '../../../spec-type';

export const spec = {
  schemaVersion: 1 as const,
  name: 'ToggleGroup',
  componentClass: 'interactive' as const,
  category: 'actions',
  description:
    'Segmented control with sliding indicator that allows single selection among a set of toggle items, using Radix ToggleGroup primitive',
  choreographies: ['slidingIndicator'],
  families: {
    behavior: ['form-input'],
    state: ['controlled-value'],
    a11y: ['tablist'],
  },

  compound: true,
  rootElement: 'RadixToggleGroup.Root',
  slots: [
    {
      name: 'root',
      element: 'RadixToggleGroup.Root',
      description: 'Segmented control container managing selection state',
    },
    {
      name: 'indicator',
      element: 'div',
      description: 'Decorative sliding indicator behind the active item',
    },
    { name: 'item', element: 'RadixToggleGroup.Item', description: 'Selectable item button' },
  ],

  subComponents: [
    {
      name: 'Root',
      slots: [
        {
          name: 'root',
          element: 'RadixToggleGroup.Root',
          description: 'Segmented control container',
        },
        { name: 'indicator', element: 'div', description: 'Sliding indicator' },
      ],
      props: [
        {
          name: 'children',
          type: 'React.ReactNode',
          moveSpecific: false,
          description: 'ToggleGroup.Item elements',
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
          description: 'Controlled selected item value',
        },
        {
          name: 'defaultValue',
          type: 'string',
          moveSpecific: true,
          description: 'Initial selected item value (uncontrolled)',
        },
        {
          name: 'onValueChange',
          type: '(value: string) => void',
          moveSpecific: true,
          description: 'Called when selection changes',
        },
        {
          name: 'orientation',
          type: "'horizontal' | 'vertical'",
          default: "'horizontal'",
          moveSpecific: true,
          description: 'Layout orientation',
        },
        {
          name: 'disabled',
          type: 'boolean',
          moveSpecific: false,
          description: 'Disable the entire group',
        },
        {
          name: 'loop',
          type: 'boolean',
          default: 'true',
          moveSpecific: true,
          description: 'Whether keyboard navigation loops around',
        },
        {
          name: 'size',
          typeRef: 'Size',
          default: "'md'",
          moveSpecific: true,
          description: 'Item size affecting padding and font size',
        },
        {
          name: 'variant',
          type: "'pills' | 'underline'",
          default: "'pills'",
          moveSpecific: true,
          description:
            'Visual appearance, shared with Tabs: a filled sliding pill, or a Pinterest-style underline filter bar. Inherited by items.',
        },
        {
          name: 'animations',
          type: 'AnimationTrigger[] | false',
          moveSpecific: true,
          description: 'Pass false to disable indicator animation',
        },
      ],
      usesFactory: true,
      radixPrimitive: 'ToggleGroup.Root',
      description:
        'Single-selection root that blocks deselection and provides size/variant via context to items',
    },
    {
      name: 'Item',
      slots: [
        { name: 'item', element: 'RadixToggleGroup.Item', description: 'Selectable item button' },
      ],
      props: [
        {
          name: 'children',
          type: 'React.ReactNode',
          moveSpecific: false,
          description: 'Item label content',
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
          description: 'Unique value for this item',
        },
        {
          name: 'disabled',
          type: 'boolean',
          moveSpecific: false,
          description: 'Disable this specific item',
        },
        {
          name: 'animations',
          type: 'AnimationTrigger[] | false',
          moveSpecific: true,
          description:
            'Per-item animation overrides; defaults to no animation to avoid scale artifacts on connected items',
        },
      ],
      usesFactory: true,
      radixPrimitive: 'ToggleGroup.Item',
      description: 'Selectable item that reads size and variant from ToggleGroupContext',
    },
  ],

  props: [],

  anatomy: {
    slot: 'root',
    dataAttributes: ['data-orientation', 'data-size', 'data-variant'],
    children: [
      {
        slot: 'item',
        dataAttributes: ['data-state', 'data-disabled', 'data-size', 'data-variant'],
      },
      { slot: 'indicator' },
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

  animationCapabilities: ['slidingIndicator'],
  animations: [
    {
      trigger: 'Root.press',
      sequence: [{ target: 'Indicator', animation: { scale: { to: 0.92 } } }],
    },
  ],

  renderContracts: [
    {
      id: 'context-provides-size-variant',
      description:
        'Root provides ToggleGroupContext with size and variant; Item reads from context to set data-variant and data-size',
    },
    {
      id: 'single-mode-no-deselect',
      description:
        'Root is always type="single" and blocks deselection by ignoring empty-string onValueChange from Radix',
    },
    {
      id: 'indicator-absolutely-positioned',
      description:
        'Indicator element is position:absolute inside Root, positioned by the slidingIndicator capability (usePositionTracker hook) tracking the [data-state="on"] item',
    },
    {
      id: 'indicator-aria-hidden',
      description: 'Indicator is decorative and carries aria-hidden="true"',
    },
    {
      id: 'item-composes-button',
      description:
        'Item slot composes Button.module.css root class for shared sizing and typography',
    },
    {
      id: 'item-transparent-bg',
      description:
        'Items have transparent background; the sliding indicator provides the active-item background',
    },
    {
      id: 'item-on-text-color',
      description:
        'Selected item (data-state="on") uses --move-toggle-group-selected-fg (segment indicator fg for pills, base fg for underline); unselected uses --move-segment-item-fg',
    },
    {
      id: 'item-animate-disabled-default',
      description:
        'Item hover/press animations are disabled by default to avoid scale artifacts on connected items',
    },
    {
      id: 'indicator-border-radius-calc',
      description:
        'Indicator border-radius is calc(--move-toggle-group-radius - --move-toggle-group-padding) to create inset appearance',
    },
  ],

  tokens: [
    {
      name: '--move-toggle-group-radius',
      value: 'var(--move-rounded-md)',
      description: 'Root container border radius',
    },
    {
      name: '--move-toggle-group-padding',
      value: 'var(--move-segment-padding)',
      description: 'Root inner padding (gap between edge and items)',
    },
    {
      name: '--move-toggle-group-indicator-bg',
      value: 'var(--move-segment-indicator-bg)',
      description: 'Sliding indicator background',
    },
  ],

  variants: {
    variant: ['pills', 'underline'] as string[],
  },
  sizes: ['sm', 'md', 'lg'] as string[],

  labels: [],

  radixPrimitive: 'ToggleGroup',
  hasHook: false,
  engineImports: ['withMoveComponent', 'useMergedRef'] as string[],

  componentDeps: ['Button'] as string[],

  childrenKind: 'composition' as const,

  testing: {
    behaviors: [
      'Root renders as Radix ToggleGroup.Root with type="single"',
      'Root renders children',
      'Root forwards className and style',
      'Root forwards ref to root element',
      'Root defaults to variant=pills',
      'Root defaults to size=md',
      'Root applies data-orientation attribute',
      'Root applies data-size attribute',
      'Root blocks deselection (ignores empty value)',
      'Root provides size and variant to Items via context',
      'Indicator renders with aria-hidden="true"',
      'Indicator is positioned by the slidingIndicator hook',
      'Indicator receives press animation on mouseDown',
      'Item renders as Radix ToggleGroup.Item',
      'Item receives data-variant and data-size from context',
      'Item supports disabled prop',
      'Item has data-state="on" when selected',
      'Item has data-state="off" when not selected',
      'Item text color changes: --move-segment-item-fg when off, --move-toggle-group-selected-fg when on',
      'Item hover/press animations are disabled by default',
      'Item animations can be re-enabled via animations prop',
      'Controlled value prop selects the matching item',
      'onValueChange fires when selection changes',
      'Uncontrolled defaultValue sets initial selection',
      'Vertical orientation uses flex-direction: column',
      'Size sm uses --move-rounded-md radius, size lg uses --move-rounded-lg radius',
    ],
    keyboard: [
      'Arrow keys navigate between items (roving tabindex)',
      'Loop prop wraps focus from last to first item',
    ],
    aria: [
      'Root sets role=group from Radix',
      'Items have role=button with aria-pressed',
      'Disabled item has aria-disabled',
    ],
  },
} satisfies ComponentSpec;
