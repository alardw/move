// InputRange.spec.ts — Component specification

import type { ComponentSpec } from '../../../spec-type';

export const spec = {
  schemaVersion: 1 as const,
  name: 'InputRange',
  animationPatterns: ['press'],
  componentClass: 'input_plain' as const,
  category: 'forms',
  description:
    'Slider/range input built on Radix Slider with single or dual thumb, optional value display, and thumb interaction animation',
  choreographies: ['press'],
  families: {
    behavior: ['form-input'],
    state: ['controlled-value'],
    a11y: ['none'],
  },

  compound: false,
  rootElement: 'span',
  slots: [
    {
      name: 'root',
      element: 'span',
      description: 'Radix Slider.Root element with track and thumbs',
    },
    { name: 'track', element: 'span', description: 'Radix Slider.Track — the full slider rail' },
    {
      name: 'range',
      element: 'span',
      description: 'Radix Slider.Range — filled portion of the track',
    },
    { name: 'thumb', element: 'span', description: 'Radix Slider.Thumb — draggable handle(s)' },
    {
      name: 'value',
      element: 'span',
      description: 'Optional value display label(s) alongside slider',
    },
  ],

  subComponents: [],

  props: [
    {
      name: 'min',
      type: 'number',
      default: '0',
      moveSpecific: true,
      description: 'Minimum slider value',
    },
    {
      name: 'max',
      type: 'number',
      default: '100',
      moveSpecific: true,
      description: 'Maximum slider value',
    },
    {
      name: 'step',
      type: 'number',
      default: '1',
      moveSpecific: true,
      description: 'Step increment',
    },
    {
      name: 'value',
      type: 'number | number[]',
      moveSpecific: true,
      description: 'Controlled value (single number or array for range)',
    },
    {
      name: 'defaultValue',
      type: 'number | number[]',
      moveSpecific: true,
      description: 'Default value (uncontrolled)',
    },
    {
      name: 'onValueChange',
      type: '(value: number[]) => void',
      moveSpecific: true,
      description: 'Called when value changes (always number[])',
    },
    {
      name: 'size',
      typeRef: 'Size',
      default: "'md'",
      moveSpecific: true,
      description: 'Slider size (affects track height and thumb size)',
    },
    { name: 'disabled', type: 'boolean', moveSpecific: false, description: 'Disabled state' },
    {
      name: 'invalid',
      type: 'boolean',
      moveSpecific: true,
      description: 'Invalid state — changes range/thumb to error color',
    },
    {
      name: 'orientation',
      type: "'horizontal' | 'vertical'",
      default: "'horizontal'",
      moveSpecific: true,
      description: 'Slider orientation',
    },
    {
      name: 'width',
      typeRef: 'Dimension',
      moveSpecific: true,
      description: 'Custom width override',
    },
    { name: 'name', type: 'string', moveSpecific: false, description: 'Form input name' },
    {
      name: 'showValue',
      type: 'boolean',
      moveSpecific: true,
      description: 'Show value label(s) alongside slider',
    },
    {
      name: 'formatValue',
      type: '(value: number) => string',
      moveSpecific: true,
      description: 'Custom value formatter for display labels',
    },
    {
      name: 'animations',
      type: 'AnimationTrigger[] | false',
      moveSpecific: true,
      description: 'Thumb interaction animation config or false to disable',
    },
    { name: 'className', type: 'string', moveSpecific: false, description: 'CSS class name' },
    {
      name: 'style',
      type: 'React.CSSProperties',
      moveSpecific: false,
      description: 'Inline styles',
    },
  ],

  anatomy: {
    slot: 'root',
    dataAttributes: ['data-size', 'data-invalid', 'data-disabled', 'data-orientation'],
    children: [
      {
        slot: 'track',
        children: [{ slot: 'range' }],
      },
      { slot: 'thumb' },
    ],
  },

  controlled: 'value' as const,
  controlledProps: {
    valueProp: 'value',
    defaultValueProp: 'defaultValue',
    onChangeProp: 'onValueChange',
  },
  keyboard: 'linear' as const,
  focus: 'self' as const,
  formType: 'hidden-input' as const,
  asChild: false,

  animations: [
    { trigger: 'Thumb.hover', sequence: [{ animation: { scale: { to: 1.04, ease: 'snappy' } } }] },
    { trigger: 'Thumb.press', sequence: [{ animation: { scale: { to: 0.96, ease: 'snappy' } } }] },
  ],

  renderContracts: [
    {
      id: 'hook-normalizes-value',
      description:
        'useInputRange hook normalizes single number to number[] internally; onValueChange always returns number[]',
    },
    {
      id: 'show-value-wrapper',
      description:
        'When showValue=true, slider is wrapped in a div.wrapper with flex layout and value label span(s)',
    },
    {
      id: 'range-dual-value-labels',
      description:
        'When value is array (range mode) and showValue=true, two value labels are rendered (start and end)',
    },
    {
      id: 'single-value-label',
      description: 'When single value and showValue=true, only one value label is rendered (end)',
    },
    {
      id: 'format-value-default',
      description: 'Default formatValue is String(v); custom formatValue overrides display',
    },
    {
      id: 'animate-on-first-thumb',
      description: 'Interaction animation ref is applied to the first thumb only',
    },
    {
      id: 'handlers-on-all-thumbs',
      description: 'Interaction animation handlers (hover/press) spread to all thumbs',
    },
    {
      id: 'vertical-orientation',
      description:
        'Vertical orientation rotates layout; wrapper uses flex-column; track uses width instead of height',
    },
    {
      id: 'className-on-wrapper-when-showValue',
      description:
        'When showValue=true, className/style go on the wrapper div, not the Slider.Root',
    },
    {
      id: 'ref-forwards-to-slider-root',
      description: 'Component ref forwards to the Radix Slider.Root span element',
    },
  ],

  tokens: [
    {
      name: '--move-range-track-height',
      value: '6px',
      description: 'Track rail height (or width in vertical)',
    },
    {
      name: '--move-range-track-bg',
      value: 'var(--move-bg-muted)',
      description: 'Track background color',
    },
    {
      name: '--move-range-track-radius',
      value: 'var(--move-rounded-full)',
      description: 'Track border radius',
    },
    {
      name: '--move-range-range-bg',
      value: 'var(--move-primary)',
      description: 'Filled range background color',
    },
    { name: '--move-range-thumb-size', value: '20px', description: 'Thumb width and height' },
    {
      name: '--move-range-thumb-bg',
      value: 'var(--move-primary-fg)',
      description: 'Thumb background color',
    },
    {
      name: '--move-range-thumb-border',
      value: '2px solid var(--move-primary)',
      description: 'Thumb border',
    },
    {
      name: '--move-range-thumb-shadow',
      value: 'var(--move-shadow-subtle)',
      description: 'Thumb box shadow',
    },
    {
      name: '--move-range-thumb-focus-ring',
      value: '0 0 0 var(--move-focus-ring-width) var(--move-focus-ring-color)',
      description: 'Thumb focus ring box-shadow',
    },
    {
      name: '--move-range-value-color',
      value: 'var(--move-fg-muted)',
      description: 'Value label text color',
    },
    {
      name: '--move-range-value-size',
      value: 'var(--move-size-sm)',
      description: 'Value label font size',
    },
    {
      name: '--move-range-value-min-width',
      value: '2ch',
      description: 'Value label minimum width',
    },
  ],

  variants: {},
  sizes: ['sm', 'md', 'lg'] as string[],

  labels: [],

  radixPrimitive: 'Slider',
  hasHook: true,
  engineImports: ['withMoveComponent', 'useMergedRef'] as string[],
  componentDeps: [] as string[],

  testing: {
    behaviors: [
      'Renders Radix Slider.Root with Track, Range, and Thumb',
      'Defaults to min=0, max=100, step=1, size=md, orientation=horizontal',
      'Single value: one Thumb rendered',
      'Array value: multiple Thumbs rendered (range slider)',
      'Controlled value via value prop (normalizes number to number[])',
      'Uncontrolled value via defaultValue prop',
      'onValueChange fires with number[] on drag',
      'showValue=true wraps slider in div.wrapper with value labels',
      'showValue with single value shows one label (end)',
      'showValue with range value shows two labels (start + end)',
      'formatValue customizes value label display',
      'Default formatValue is String(v)',
      'Applies data-size, data-invalid, data-disabled, data-orientation',
      'Invalid state changes range and thumb border to error color',
      'Disabled state reduces opacity and disables interaction',
      'Vertical orientation changes layout direction',
      'Custom width prop applied to root or wrapper',
      'Size sm: track=4px, thumb=16px',
      'Size md: track=6px, thumb=20px (default)',
      'Size lg: track=8px, thumb=24px',
      'Thumb has focus-visible outline',
      'Forwards className and style (to wrapper when showValue, else to root)',
      'Forwards ref to Slider.Root span element',
      'Thumb has will-change:transform for animation',
    ],
    keyboard: [
      'ArrowRight/ArrowUp increases value by step',
      'ArrowLeft/ArrowDown decreases value by step',
      'Home sets value to min',
      'End sets value to max',
      'Tab focuses thumb',
    ] as string[],
    aria: [
      'Radix Slider provides role=slider on Thumb',
      'Thumb has aria-valuemin, aria-valuemax, aria-valuenow from Radix',
      'Disabled thumb has aria-disabled',
    ] as string[],
    form: ['Radix Slider renders hidden input with name prop for form submission'] as string[],
    animation: [
      'Uses Thumb.hover and Thumb.press event triggers for interactive animation',
      'Interaction animation handlers spread to all thumbs',
      'animations={false} disables thumb interaction animation',
      'Animation disabled when component is disabled',
    ] as string[],
  },
} satisfies ComponentSpec;
