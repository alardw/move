// ColorInput.spec.ts — Component specification
// specHash: PLACEHOLDER

import type { ComponentSpec } from '../../../spec-type';

export const spec = {
  schemaVersion: 7 as const,
  name: 'ColorInput',
  componentClass: 'input_popup' as const,
  category: 'forms',
  description:
    'Form input with color preview swatch that opens a ColorPicker popover, supporting multiple color formats and eye dropper',

  synonyms: ['color field', 'colour input', 'hex picker', 'swatch input'],
  animationPatterns: ['popupSurface'],
  families: {
    behavior: ['popup-anchored'],
    state: ['controlled-value', 'controlled-open'],
    a11y: ['dialog'],
  },
  behavior: {
    popup: {
      closeOnEscape: true,
      closeOnOutsideClick: true,
      closeOnScroll: true,
      closeOnResize: true,
    },
  },

  compound: false,
  rootElement: 'div',
  slots: [
    {
      name: 'root',
      element: 'div',
      description: 'InputText-style wrapper containing swatch, input, and optional eye dropper',
    },
    {
      name: 'swatch',
      element: 'div',
      description: 'Color preview square that toggles popover on click',
    },
    { name: 'input', element: 'input', description: 'Text input for typing/editing color values' },
    {
      name: 'content',
      element: 'div',
      description: 'Radix Popover.Content popup container with enter/exit animation',
    },
    {
      name: 'contentInner',
      element: 'div',
      description: 'Inner wrapper for the embedded ColorPicker',
    },
  ],

  subComponents: undefined,

  props: [
    // Appearance
    {
      name: 'variant',
      type: "'outlined' | 'filled'",
      default: "'outlined'",
      moveSpecific: true,
      description: 'Input variant',
    },
    {
      name: 'size',
      typeRef: 'Size',
      default: "'md'",
      moveSpecific: true,
      description: 'Input size',
    },
    {
      name: 'width',
      type: "React.CSSProperties['width']",
      moveSpecific: true,
      description: 'Explicit width override',
    },
    // Value
    {
      name: 'format',
      type: 'ColorFormat',
      default: "'hex'",
      moveSpecific: true,
      description: 'Active color format (hex, hexa, rgb, rgba, hsl, hsla)',
    },
    { name: 'value', type: 'string', moveSpecific: true, description: 'Controlled color value' },
    {
      name: 'defaultValue',
      type: 'string',
      moveSpecific: true,
      description: 'Default color value (uncontrolled)',
    },
    {
      name: 'onValueChange',
      type: '(value: string) => void',
      moveSpecific: true,
      description: 'Called on every color change (during drag)',
    },
    {
      name: 'onChangeEnd',
      type: '(value: string) => void',
      moveSpecific: true,
      description: 'Called when interaction ends (drag release, blur)',
    },
    {
      name: 'onFormatChange',
      type: '(format: ColorFormat) => void',
      moveSpecific: true,
      description: 'Called when format changes in picker',
    },
    {
      name: 'formatOptions',
      type: 'BaseColorFormat[]',
      moveSpecific: true,
      description: 'Available base formats in picker selector',
    },
    // Picker config
    {
      name: 'swatches',
      type: 'string[]',
      moveSpecific: true,
      description: 'Preset color swatches in picker',
    },
    {
      name: 'swatchesPerRow',
      type: 'number',
      default: '7',
      moveSpecific: true,
      description: 'Number of swatches per row',
    },
    {
      name: 'withPicker',
      type: 'boolean',
      default: 'true',
      moveSpecific: true,
      description: 'Show saturation/hue/alpha picker area',
    },
    {
      name: 'withEyeDropper',
      type: 'boolean',
      moveSpecific: true,
      description: 'Show eye dropper button (browser support required)',
    },
    {
      name: 'closeOnColorSwatchClick',
      type: 'boolean',
      default: 'true',
      moveSpecific: true,
      description: 'Close popover after swatch click in picker',
    },
    // State
    { name: 'invalid', type: 'boolean', moveSpecific: true, description: 'Invalid state' },
    { name: 'disabled', type: 'boolean', moveSpecific: false, description: 'Disabled state' },
    { name: 'readOnly', type: 'boolean', moveSpecific: true, description: 'Read-only state' },
    // Form
    {
      name: 'placeholder',
      type: 'string',
      moveSpecific: false,
      description: 'Input placeholder text',
    },
    { name: 'name', type: 'string', moveSpecific: false, description: 'Form field name' },
    { name: 'id', type: 'string', moveSpecific: false, description: 'Input element id' },
    { name: 'required', type: 'boolean', moveSpecific: false, description: 'Required state' },
    { name: 'autoFocus', type: 'boolean', moveSpecific: false, description: 'Auto-focus on mount' },
    {
      name: 'onFocus',
      type: 'React.FocusEventHandler<HTMLInputElement>',
      moveSpecific: false,
      description: 'Input focus handler',
    },
    {
      name: 'onBlur',
      type: 'React.FocusEventHandler<HTMLInputElement>',
      moveSpecific: false,
      description: 'Input blur handler',
    },
    // Labels
    {
      name: 'labels',
      type: 'Partial<ColorInputLabels>',
      moveSpecific: true,
      description: 'Accessible label overrides',
    },
    // Standard
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
    dataAttributes: [
      'data-variant',
      'data-size',
      'data-format',
      'data-invalid',
      'data-disabled',
      'data-readonly',
    ],
    children: [
      { slot: 'swatch' },
      { slot: 'input' },
      {
        slot: 'content',
        dataAttributes: ['data-side', 'data-align'],
        children: [{ slot: 'contentInner' }],
      },
    ],
  },

  controlled: 'value' as const,
  controlledProps: {
    valueProp: 'value',
    defaultValueProp: 'defaultValue',
    onChangeProp: 'onValueChange',
  },

  keyboard: null,
  focus: 'delegated' as const,
  formType: 'native-name' as const,
  asChild: false,

  dismissBehavior: 'unmountAfterExit' as const,

  renderContracts: [
    {
      id: 'root-wraps-radix-popover',
      description:
        'Root wraps in Radix Popover.Root with open state coordinated via isClosing for exit animation',
    },
    {
      id: 'root-renders-anchor',
      description: 'Root element renders as Radix Popover.Anchor with asChild',
    },
    {
      id: 'swatch-toggles-popover',
      description: 'Swatch click toggles popover open/close (close triggers exit animation)',
    },
    {
      id: 'swatch-bg-reflects-value',
      description: 'Swatch backgroundColor is set inline to currentValue',
    },
    {
      id: 'input-focus-snapshot',
      description:
        'Input snapshots current value on focus, edits locally, validates+commits on blur',
    },
    {
      id: 'input-blur-validates',
      description:
        'On blur, input validates text via isValidColor, parses, formats in active format, and calls handleValueChange+handleChangeEnd',
    },
    { id: 'input-arrowdown-opens', description: 'ArrowDown on input opens popover when closed' },
    { id: 'input-enter-blurs', description: 'Enter key on input triggers blur to commit value' },
    {
      id: 'content-fade-only',
      description:
        'Content only fades (opacity) on open/close — never a size-changing animation, so Radix cannot re-flip the popup below the trigger (the close flash)',
    },
    {
      id: 'content-embeds-colorpicker',
      description:
        'Content inner renders ColorPicker component with forwarded picker props (format, swatches, withPicker, size)',
    },
    {
      id: 'content-prevents-autofocus',
      description: 'Content prevents auto-focus on open to keep focus on input',
    },
    {
      id: 'dismiss-outside-root',
      description:
        'Pointer down outside root triggers animated close; inside root is ignored (swatch handles toggle)',
    },
    {
      id: 'format-aware-width',
      description:
        'Root width varies by format (hex, hexa, rgb, hsl, rgba, hsla) via CSS custom property per data-format',
    },
    {
      id: 'eyedropper-integration',
      description:
        'Eye dropper button uses EyeDropper API when available; parses result, formats in current format, calls value+changeEnd handlers',
    },
    {
      id: 'input-mono-font',
      description: 'Input uses monospace font family (font-mono with font-body fallback)',
    },
  ],

  animations: [
    {
      trigger: 'Content.enter',
      sequence: [{ target: 'Content', animation: { opacity: { from: 0, to: 1, duration: 150 } } }],
    },
    {
      trigger: 'Content.exit',
      sequence: [{ target: 'Content', animation: { opacity: { to: 0, duration: 150 } } }],
    },
  ],

  tokens: [
    // Root tokens
    {
      name: '--move-colorinput-bg',
      value: 'var(--move-bg-subtle)',
      description: 'Root background color',
    },
    {
      name: '--move-colorinput-border',
      value: 'var(--move-border-base)',
      description: 'Root border color',
    },
    {
      name: '--move-colorinput-border-hover',
      value: 'var(--move-border-emphasis)',
      description: 'Root border color on hover',
    },
    {
      name: '--move-colorinput-border-focus',
      value: 'var(--move-primary)',
      description: 'Root border color on focus-within',
    },
    {
      name: '--move-colorinput-radius',
      value: 'var(--move-rounded-md)',
      description: 'Root border radius',
    },
    {
      name: '--move-colorinput-padding-x',
      value: 'var(--move-spacing-sm)',
      description: 'Root horizontal padding',
    },
    {
      name: '--move-colorinput-padding-y',
      value: 'var(--move-spacing-xs)',
      description: 'Root vertical padding',
    },
    { name: '--move-colorinput-fg', value: 'var(--move-fg-base)', description: 'Input text color' },
    {
      name: '--move-colorinput-placeholder',
      value: 'var(--move-fg-muted)',
      description: 'Input placeholder color',
    },
    {
      name: '--move-colorinput-height',
      value: 'var(--move-control-height-md)',
      description: 'Root height',
    },
    {
      name: '--move-colorinput-swatch-size',
      value: '20px',
      description: 'Color swatch preview size',
    },
    {
      name: '--move-colorinput-width',
      value: '132px',
      description: 'Default root width (varies by format and size)',
    },
  ],

  variants: {
    variant: ['outlined', 'filled'] as string[],
  },
  sizes: ['sm', 'md', 'lg'] as string[],

  labels: [
    { key: 'swatch', default: 'Open color picker', description: 'Swatch button accessible label' },
    {
      key: 'eyeDropper',
      default: 'Pick color from screen',
      description: 'Eye dropper button accessible label',
    },
  ],

  childrenKind: undefined,
  propRoles: {
    value: 'behavior' as const,
    defaultValue: 'behavior' as const,
    format: 'data' as const,
    variant: 'displayText' as const,
    size: 'displayText' as const,
    swatches: 'data' as const,
    withPicker: 'behavior' as const,
    withEyeDropper: 'behavior' as const,
    invalid: 'behavior' as const,
    disabled: 'behavior' as const,
    readOnly: 'behavior' as const,
    placeholder: 'displayText' as const,
  },

  hasHook: false,
  engineImports: ['withMoveComponent'] as string[],

  radixPrimitive: 'Popover',
  componentDeps: ['ColorPicker'] as string[],

  testing: {
    behaviors: [
      'Root renders with Radix Popover.Root',
      'Root renders as Radix Popover.Anchor',
      'Swatch displays current color as backgroundColor',
      'Swatch click opens popover',
      'Swatch click closes popover with exit animation when already open',
      'Swatch has role="button" and aria-label',
      'Input displays current value when not focused',
      'Input snapshots value on focus for local editing',
      'Input validates and commits on blur via parseColor',
      'Input rejects invalid color strings on blur (no change)',
      'Input Enter key triggers blur',
      'Input ArrowDown opens popover when closed',
      'Content embeds ColorPicker with forwarded props',
      'ColorPicker value change propagates to parent value',
      'ColorPicker change end propagates to parent onChangeEnd',
      'Disabled state disables input and prevents swatch click',
      'ReadOnly state prevents editing and hover border change',
      'Invalid state applies error border styling',
      'Format-aware width: root width varies by data-format attribute',
      'Size data-attribute controls height, font size, swatch size, and padding',
      'Variant outlined is default, filled changes bg and border',
      'Forwards className and style on root',
      'Name, id, required, autoFocus pass through to native input',
      'Eye dropper button renders when withEyeDropper=true and EyeDropper API available',
      'Eye dropper picks color, formats in current format, calls both handlers',
      'Content prevents auto-focus on open',
      'Dismiss: clicking outside root triggers animated close',
      'Dismiss: clicking inside root (swatch/input) does not close',
      'Escape key closes popover',
    ],
    keyboard: [
      'Enter on input commits and blurs',
      'ArrowDown on input opens popover',
      'Escape closes popover',
    ],
    aria: [
      'Swatch has role="button" and tabIndex=-1',
      'Swatch has aria-label from labels.swatch',
      'Eye dropper has aria-label from labels.eyeDropper',
      'Input is a native input with name and label association',
    ],
    form: [
      'Native input with name participates in form submission',
      'Value is formatted in active color format',
      'Required attribute passes through to input',
    ],
    animation: [
      'Content fades (opacity); no size change, so the popup never re-flips on close',
      'Content enter/exit animation via popupPresence profile',
      'Exit animation coordinates with isClosing state before unmount',
      'Position-aware transform-origin set via data-side and data-align',
    ],
  },

  iconsUsed: ['pipette'],
} satisfies ComponentSpec;
