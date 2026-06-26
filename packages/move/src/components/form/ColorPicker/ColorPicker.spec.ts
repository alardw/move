// ColorPicker.spec.ts — Component specification
// specHash: PLACEHOLDER

export const spec = {
  schemaVersion: 7 as const,
  name: 'ColorPicker',
  componentClass: 'display' as const,
  category: 'form',
  description: 'Standalone color picker with saturation/brightness area, hue and alpha sliders, color swatches, format selector, and per-channel inputs',

  synonyms: ['color', 'colour', 'hsl', 'rgb', 'hex', 'eyedropper'],
  families: {
    behavior:  ["form-input"],
    state:     ["controlled-value"],
    animation: ["none"],
    a11y:      ["none"],
  },

  compound: false,
  rootElement: 'div',
  slots: [
    { name: 'root', element: 'div', description: 'Vertical flex container for all picker sections' },
    { name: 'saturation', element: 'div', description: '2D saturation/brightness area with crosshair cursor and draggable indicator' },
    { name: 'hue', element: 'div', description: 'Horizontal hue slider (0-360 rainbow gradient) with draggable thumb' },
    { name: 'alpha', element: 'div', description: 'Horizontal alpha slider (checkerboard + color gradient) with draggable thumb' },
    { name: 'swatches', element: 'div', description: 'Grid of preset color swatch buttons' },
    { name: 'inputRow', element: 'div', description: 'Row containing format selector and channel inputs' },
    { name: 'formatSelect', element: 'select', description: 'Native select for switching color format (hex/rgb/hsl)' },
    { name: 'channelInput', element: 'input', description: 'Individual channel input (R/G/B, H/S/L, or hex)' },
    { name: 'alphaInput', element: 'input', description: 'Alpha percentage input (0-100)' },
  ],

  subComponents: undefined,

  props: [
    // Appearance
    { name: 'size', typeRef: 'Size', default: "'md'", moveSpecific: true, description: 'Picker size' },
    { name: 'fullWidth', type: 'boolean', moveSpecific: true, description: 'Stretch to full container width' },
    // Value
    { name: 'format', type: 'ColorFormat', default: "'hex'", moveSpecific: true, description: 'Initial color format' },
    { name: 'value', type: 'string', moveSpecific: true, description: 'Controlled color value' },
    { name: 'defaultValue', type: 'string', moveSpecific: true, description: 'Default color value (uncontrolled)' },
    { name: 'onValueChange', type: '(value: string) => void', moveSpecific: true, description: 'Called on every color change (during drag)' },
    { name: 'onChangeEnd', type: '(value: string) => void', moveSpecific: true, description: 'Called when interaction ends (drag release, blur)' },
    { name: 'onFormatChange', type: '(format: ColorFormat) => void', moveSpecific: true, description: 'Called when format changes via selector' },
    { name: 'formatOptions', type: 'BaseColorFormat[]', moveSpecific: true, description: 'Available base formats in selector (defaults to [hex, rgb, hsl])' },
    // Swatches
    { name: 'swatches', type: 'string[]', moveSpecific: true, description: 'Preset color swatch values' },
    { name: 'swatchesPerRow', type: 'number', default: '7', moveSpecific: true, description: 'Number of swatches per grid row' },
    // Sections
    { name: 'withPicker', type: 'boolean', default: 'true', moveSpecific: true, description: 'Show saturation/hue/alpha picker area' },
    // Labels
    { name: 'labels', type: 'Partial<ColorPickerLabels>', moveSpecific: true, description: 'Accessible label overrides for picker controls' },
    // State
    { name: 'disabled', type: 'boolean', moveSpecific: false, description: 'Disabled state' },
    { name: 'readOnly', type: 'boolean', moveSpecific: true, description: 'Read-only state (pointer-events: none)' },
    // Standard
    { name: 'className', type: 'string', moveSpecific: false, description: 'CSS class name' },
    { name: 'style', type: 'React.CSSProperties', moveSpecific: false, description: 'Inline styles' },
  ],

  anatomy: {
    slot: 'root',
    dataAttributes: ['data-size', 'data-format', 'data-disabled', 'data-readonly', 'data-fullwidth'],
    children: [
      { slot: 'saturation' },
      { slot: 'hue' },
      { slot: 'alpha' },
      { slot: 'swatches' },
      {
        slot: 'inputRow',
        children: [
          { slot: 'formatSelect' },
          { slot: 'channelInput', dataAttributes: ['data-channel'] },
          { slot: 'alphaInput' },
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

  keyboard: 'grid' as const,
  focus: 'roving' as const,
  formType: null,
  asChild: false,

  renderContracts: [
    { id: 'uses-color-picker-hook', description: 'Component uses useColorPicker hook for all color state management (HSV internal, format conversion, channel computation)' },
    { id: 'saturation-pointer-drag', description: 'Saturation area uses pointer capture drag for continuous S/V updates; X maps to saturation (0-100%), Y maps to brightness (inverted 0-100%)' },
    { id: 'saturation-bg-pure-hue', description: 'Saturation area background-color is set to pure hue hex (S=100, V=100) with CSS gradients for white-to-transparent and black-to-transparent overlays' },
    { id: 'hue-pointer-drag', description: 'Hue slider uses pointer capture drag; X position maps to hue 0-360' },
    { id: 'alpha-pointer-drag', description: 'Alpha slider uses pointer capture drag; X position maps to alpha 0-1; only visible when format has alpha channel' },
    { id: 'alpha-checkerboard-bg', description: 'Alpha slider has checkerboard pattern background with gradient overlay from transparent to current color' },
    { id: 'drag-commit-on-end', description: 'All drag interactions call commitChange on pointer up (onChangeEnd callback)' },
    { id: 'format-select-changes-format', description: 'Format select changes active format via setActiveFormat, which re-emits value in new format and calls onFormatChange' },
    { id: 'alpha-format-awareness', description: 'Alpha slider and alpha input only show when format has alpha channel (hexa, rgba, hsla)' },
    { id: 'hex-input-mode', description: 'When base format is hex, a single text input replaces channel inputs; focus/blur for local editing with validation' },
    { id: 'channel-inputs-mode', description: 'When base format is rgb/hsl, individual numeric inputs for each channel with focus/blur commit and ArrowUp/Down nudge (Shift=10)' },
    { id: 'swatch-click-sets-color', description: 'Swatch button click calls setFromString + commitChange to set the color and fire onChangeEnd' },
    { id: 'with-picker-toggle', description: 'When withPicker=false, saturation area, hue slider, and alpha slider are hidden' },
    { id: 'input-row-always-shown', description: 'Input row with format selector and channel inputs is always rendered regardless of withPicker' },
    { id: 'cursor-position-tracks-hsv', description: 'Saturation cursor positioned at (S%, 100-V%) reflecting current color' },
    { id: 'thumb-position-tracks-value', description: 'Hue thumb at (H/360*100)%, alpha thumb at (A*100)%' },
  ],

  animations: [],

  tokens: [
    { name: '--move-colorpicker-width', value: '260px', description: 'Root width (varies by size)' },
    { name: '--move-colorpicker-saturation-height', value: '160px', description: 'Saturation area height' },
    { name: '--move-colorpicker-slider-height', value: '14px', description: 'Hue and alpha slider height' },
    { name: '--move-colorpicker-thumb-size', value: '14px', description: 'Slider thumb diameter' },
    { name: '--move-colorpicker-radius', value: 'var(--move-rounded-md)', description: 'Saturation area border radius' },
    { name: '--move-colorpicker-swatch-size', value: '28px', description: 'Individual swatch button size' },
    { name: '--move-colorpicker-gap', value: 'var(--move-spacing-sm)', description: 'Gap between picker sections' },
    { name: '--move-colorpicker-cursor-size', value: '14px', description: 'Saturation crosshair cursor diameter' },
    { name: '--move-colorpicker-input-height', value: '28px', description: 'Channel input and format select height' },
    { name: '--move-colorpicker-input-font', value: 'var(--move-size-xs)', description: 'Channel input font size' },
  ],

  variants: {},
  sizes: ['sm', 'md', 'lg'] as string[],

  labels: [
    { key: 'saturation', default: 'Color saturation and brightness', description: 'Saturation area accessible label' },
    { key: 'hue', default: 'Hue', description: 'Hue slider accessible label' },
    { key: 'alpha', default: 'Opacity', description: 'Alpha slider accessible label' },
    { key: 'format', default: 'Color format', description: 'Format selector accessible label' },
    { key: 'hex', default: 'Hex color value', description: 'Hex input accessible label' },
    { key: 'alphaInput', default: 'Alpha', description: 'Alpha input accessible label' },
    { key: 'red', default: 'Red', description: 'Red channel input accessible label' },
    { key: 'green', default: 'Green', description: 'Green channel input accessible label' },
    { key: 'blue', default: 'Blue', description: 'Blue channel input accessible label' },
    { key: 'hueChannel', default: 'Hue', description: 'Hue channel input accessible label' },
    { key: 'saturationChannel', default: 'Saturation', description: 'Saturation channel input accessible label' },
    { key: 'lightness', default: 'Lightness', description: 'Lightness channel input accessible label' },
  ],

  childrenKind: undefined,
  propRoles: {
    value: 'behavior' as const,
    defaultValue: 'behavior' as const,
    format: 'data' as const,
    size: 'displayText' as const,
    swatches: 'data' as const,
    swatchesPerRow: 'data' as const,
    withPicker: 'behavior' as const,
    fullWidth: 'displayText' as const,
    disabled: 'behavior' as const,
    readOnly: 'behavior' as const,
  },

  hasHook: true,
  engineImports: ['withMoveComponent'] as string[],

  radixPrimitive: undefined,
  componentDeps: [] as string[],

  testing: {
    behaviors: [
      'Root renders with data-size, data-format, data-disabled, data-readonly attributes',
      'Root uses useColorPicker hook for state management',
      'Saturation area renders when withPicker=true',
      'Saturation area hidden when withPicker=false',
      'Saturation background-color set to pure hue hex',
      'Saturation cursor positioned at (S%, 100-V%)',
      'Saturation drag updates saturation and brightness values continuously',
      'Saturation drag end calls commitChange/onChangeEnd',
      'Hue slider renders rainbow gradient',
      'Hue thumb positioned at (H/360*100)%',
      'Hue drag updates hue value continuously',
      'Hue drag end calls commitChange/onChangeEnd',
      'Alpha slider renders when format has alpha channel',
      'Alpha slider hidden when format has no alpha channel',
      'Alpha slider has checkerboard pattern with color gradient overlay',
      'Alpha thumb positioned at (A*100)%',
      'Alpha drag updates alpha value continuously',
      'Alpha drag end calls commitChange/onChangeEnd',
      'Swatches grid renders when swatches prop provided',
      'Swatch click sets color from string and commits',
      'Swatches grid uses gridTemplateColumns from swatchesPerRow',
      'Format selector renders with format options',
      'Format selector changes active format and re-emits value',
      'Hex mode: single text input for hex value',
      'Hex input focus snapshots value, blur validates and commits',
      'RGB mode: three numeric inputs for R, G, B',
      'HSL mode: three numeric inputs for H, S, L',
      'Channel input focus snapshots value, blur validates and commits',
      'Channel input ArrowUp/Down nudges value by 1 (Shift=10)',
      'Channel input Enter blurs to commit',
      'Alpha input renders when format has alpha channel',
      'Alpha input shows percentage (0-100) of alpha',
      'Disabled state sets data-disabled and disables all inputs',
      'ReadOnly state sets data-readonly and disables pointer-events',
      'fullWidth sets data-fullwidth for 100% width',
      'Size variations adjust dimensions via CSS custom properties',
      'Forwards className and style on root',
    ],
    keyboard: [
      'Enter on any input triggers blur to commit value',
      'ArrowUp on channel input increments value by 1',
      'ArrowDown on channel input decrements value by 1',
      'Shift+ArrowUp increments by 10',
      'Shift+ArrowDown decrements by 10',
    ],
    aria: [
      'Saturation area has role="slider" and aria-label',
      'Saturation area has aria-valuetext with saturation and brightness percentages',
      'Hue slider has role="slider", aria-label, aria-valuemin=0, aria-valuemax=360, aria-valuenow',
      'Alpha slider has role="slider", aria-label, aria-valuemin=0, aria-valuemax=100, aria-valuenow',
      'Format selector has aria-label "Color format"',
      'Hex input has aria-label "Hex color value"',
      'Channel inputs have aria-label (Red, Green, Blue, Hue, Saturation, Lightness)',
      'Alpha input has aria-label "Alpha"',
      'Swatch buttons have aria-label with color value',
    ],
  },

  defaultReview: {
    status: 'approved' as const,
    decisionSource: 'accept-all' as const,
    overrides: {},
  },
};
