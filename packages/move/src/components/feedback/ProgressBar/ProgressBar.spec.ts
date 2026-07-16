// ProgressBar.spec.ts — Component specification

import type { ComponentSpec } from '../../../spec-type';

export const spec = {
  schemaVersion: 1 as const,
  name: 'ProgressBar',
  componentClass: 'presentational' as const,
  category: 'feedback',
  description:
    'Determinate or indeterminate progress indicator built on Radix Progress with CSS transition for smooth value changes',
  families: {
    behavior: ['loading'],
    state: ['stateless'],
    a11y: ['progressbar'],
  },

  compound: false,
  rootElement: 'Progress.Root',
  slots: [
    {
      name: 'root',
      element: 'Progress.Root',
      description: 'Radix Progress root with track background and overflow hidden',
    },
    {
      name: 'indicator',
      element: 'Progress.Indicator',
      description: 'Fill bar that translates via transform to show progress percentage',
    },
  ],

  props: [
    {
      name: 'value',
      type: 'number | null',
      moveSpecific: true,
      description: 'Current progress value; null for indeterminate state',
    },
    {
      name: 'max',
      type: 'number',
      default: '100',
      moveSpecific: true,
      description: 'Maximum value for progress calculation',
    },
    {
      name: 'size',
      typeRef: 'Size',
      default: "'md'",
      moveSpecific: true,
      description: 'Bar height',
    },
    {
      name: 'variant',
      type: "'default' | 'success' | 'warning' | 'error'",
      default: "'default'",
      moveSpecific: true,
      description: 'Indicator color variant',
    },
    {
      name: 'getValueLabel',
      type: '(value: number, max: number) => string',
      moveSpecific: true,
      description: 'Custom accessible value label function passed to Radix',
    },
    {
      name: 'children',
      type: 'React.ReactNode',
      moveSpecific: false,
      description: 'Optional children content',
    },
  ],

  anatomy: {
    slot: 'root',
    dataAttributes: ['data-size', 'data-variant', 'data-state'],
    ariaAttributes: [
      'role',
      'aria-valuenow',
      'aria-valuemin',
      'aria-valuemax',
      'aria-valuetext',
      'aria-busy',
    ],
    children: [{ slot: 'indicator' }],
  },

  controlled: null,
  keyboard: null,
  focus: null,
  formType: null,
  asChild: false,

  animationCapabilities: ['cssAnimation'],
  animations: [],

  renderContracts: [
    {
      id: 'radix-progress',
      description:
        'Root renders as Radix Progress.Root which provides role="progressbar" and aria-value* attributes automatically',
    },
    {
      id: 'indicator-transform',
      description:
        'Indicator translateX is set imperatively via useEffect: translateX(-(100 - percentage)%)',
    },
    {
      id: 'indeterminate-css',
      description:
        'When value is null, Radix sets data-state="indeterminate" and CSS @keyframes handles the sliding animation',
    },
    {
      id: 'indeterminate-reset',
      description:
        'When value is null, indicator transform is cleared to allow CSS animation to take over',
    },
    {
      id: 'css-transition',
      description:
        'Indicator uses CSS transition (300ms cubic-bezier) for smooth value changes; transition is disabled during indeterminate',
    },
    {
      id: 'reduced-motion',
      description: 'CSS @media (prefers-reduced-motion: reduce) disables indeterminate animation',
    },
  ],

  tokens: [
    {
      name: '--move-progress-height',
      value: 'var(--move-space-2)',
      description: 'Track and indicator height (varies by size)',
    },
    {
      name: '--move-progress-bg',
      value: 'var(--move-bg-muted)',
      description: 'Track background color',
    },
    {
      name: '--move-progress-indicator-bg',
      value: 'var(--move-primary)',
      description: 'Indicator fill color (varies by variant)',
    },
    {
      name: '--move-progress-radius',
      value: 'var(--move-rounded-full)',
      description: 'Border radius for track and indicator',
    },
  ],

  variants: {
    variant: ['default', 'success', 'warning', 'error'] as string[],
  },
  sizes: ['sm', 'md', 'lg'] as string[],

  labels: [
    {
      key: 'label',
      default: 'Progress',
      description: 'Accessible name for the progress bar, applied as aria-label',
    },
  ],

  radixPrimitive: 'Progress',

  hasHook: false,
  engineImports: ['withMoveComponent'],

  componentDeps: [],

  testing: {
    behaviors: [
      'Renders with role="progressbar" (provided by Radix)',
      'Passes value to Radix Progress.Root',
      'Passes max to Radix Progress.Root',
      'Passes getValueLabel to Radix Progress.Root',
      'Defaults to max=100',
      'Defaults to size=md',
      'Defaults to variant=default',
      'Applies size via data-size attribute',
      'Applies variant via data-variant attribute',
      'Indicator translateX reflects percentage: translateX(-(100 - pct)%)',
      'Indeterminate state when value is null (data-state="indeterminate")',
      'Indicator transform is cleared when value is null',
      'Clamps percentage between 0 and 100',
      'Forwards className and style',
      'Forwards ref to root element',
      'Spreads HTML attributes',
    ],
    aria: [
      'Radix provides aria-valuenow, aria-valuemin, aria-valuemax automatically',
      'getValueLabel callback produces aria-valuetext',
      'Indeterminate state omits aria-valuenow',
    ],
    animation: [
      'CSS transition on indicator transform (300ms cubic-bezier) for smooth value changes',
      'CSS @keyframes indeterminate animation (1.5s infinite) when data-state="indeterminate"',
      'Indeterminate animation disabled via prefers-reduced-motion media query',
    ],
  },
} satisfies ComponentSpec;
