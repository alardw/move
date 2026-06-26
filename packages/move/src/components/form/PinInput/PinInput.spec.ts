// PinInput.spec.ts — Component specification
// specHash: PLACEHOLDER

import type { ComponentSpec } from '../../../spec-type';

export const spec = {
  schemaVersion: 7 as const,
  name: 'PinInput',
  componentClass: 'input_plain' as const,
  category: 'form',
  description: 'Multi-slot PIN/OTP code input with single hidden input, visual slot rendering, grouping, mask support, and caret animation',

  synonyms: ['otp', '2fa', 'verification code', 'one-time code', 'pin code'],
  families: {
    behavior:  ["form-input"],
    state:     ["controlled-value"],
    animation: ["none"],
    a11y:      ["none"],
  },

  compound: false,
  rootElement: 'div',
  slots: [
    { name: 'root', element: 'div', description: 'Root container with inline-flex layout for slot groups' },
    { name: 'slot', element: 'div', description: 'Individual character display slot with border and active caret' },
  ],

  subComponents: [],

  props: [
    { name: 'length', type: 'number', default: '4', moveSpecific: true, description: 'Number of input slots' },
    { name: 'value', type: 'string', moveSpecific: true, description: 'Controlled value string' },
    { name: 'defaultValue', type: 'string', moveSpecific: true, description: 'Default value (uncontrolled)' },
    { name: 'onChange', type: '(value: string) => void', moveSpecific: true, description: 'Called when value changes' },
    { name: 'onComplete', type: '(value: string) => void', moveSpecific: true, description: 'Called when all slots are filled' },
    { name: 'type', type: "'number' | 'alphanumeric' | RegExp", default: "'number'", moveSpecific: true, description: 'Character validation type' },
    { name: 'mask', type: 'boolean', moveSpecific: true, description: 'Mask input like a password (shows bullet characters)' },
    { name: 'placeholder', type: 'string', moveSpecific: true, description: 'Placeholder character per slot' },
    { name: 'oneTimeCode', type: 'boolean', default: 'true', moveSpecific: true, description: 'Enable autocomplete="one-time-code" for SMS autofill' },
    { name: 'grouping', type: 'number[]', moveSpecific: true, description: 'Grouping pattern (e.g. [3,3] splits 6 into two groups with separator)' },
    { name: 'invalid', type: 'boolean', moveSpecific: true, description: 'Invalid state with error border styling' },
    { name: 'size', typeRef: 'Size', default: "'md'", moveSpecific: true, description: 'Slot size' },
    { name: 'labels', type: 'Partial<PinInputLabels>', moveSpecific: true, description: 'Accessible label overrides' },
    { name: 'disabled', type: 'boolean', moveSpecific: false, description: 'Disabled state' },
    { name: 'name', type: 'string', moveSpecific: false, description: 'Hidden input name for form submission' },
    { name: 'autoFocus', type: 'boolean', moveSpecific: false, description: 'Auto-focus the input on mount' },
    { name: 'className', type: 'string', moveSpecific: false, description: 'CSS class name' },
    { name: 'style', type: 'React.CSSProperties', moveSpecific: false, description: 'Inline styles' },
  ],

  anatomy: {
    slot: 'root',
    dataAttributes: ['data-size', 'data-invalid', 'data-disabled'],
    children: [
      { slot: 'slot', dataAttributes: ['data-active', 'data-placeholder'] },
    ],
  },

  controlled: 'value' as const,
  controlledProps: {
    valueProp: 'value',
    defaultValueProp: 'defaultValue',
    onChangeProp: 'onChange',
  },
  keyboard: null,
  focus: 'delegated' as const,
  formType: 'hidden-input' as const,
  asChild: false,

  animations: [],

  renderContracts: [
    { id: 'single-hidden-input', description: 'A single hidden input element captures all keyboard/paste input, positioned absolutely over the root with opacity:0' },
    { id: 'visual-slots-only', description: 'Slot elements are purely visual divs — they display characters from the hook value but are not interactive inputs' },
    { id: 'root-click-focuses-input', description: 'Clicking the root focuses the hidden input, allowing typing' },
    { id: 'caret-in-active-slot', description: 'Active slot (focused and not filled) shows a blinking caret div instead of a character' },
    { id: 'grouping-with-separators', description: 'When grouping is set, slots are split into visual groups with en-dash separators between them' },
    { id: 'groups-sum-must-equal-length', description: 'If grouping array sum does not equal length, fallback to single group of length' },
    { id: 'mask-shows-bullets', description: 'When mask=true, filled slots show bullet character instead of actual characters' },
    { id: 'on-complete-fires-when-full', description: 'onComplete callback fires when value length equals configured length' },
    { id: 'type-filters-characters', description: 'Character validation via type prop: "number" allows digits only, "alphanumeric" allows [a-zA-Z0-9], RegExp allows custom pattern' },
    { id: 'paste-support', description: 'Paste event is intercepted and filtered through character validation before setting value' },
    { id: 'autofocus-on-mount', description: 'When autoFocus=true, pin.focus() is called on mount via useEffect' },
    { id: 'one-time-code-autocomplete', description: 'When oneTimeCode=true, hidden input has autocomplete="one-time-code" for SMS autofill' },
  ],

  tokens: [
    { name: '--move-pininput-slot-size', value: 'var(--move-control-height-md)', description: 'Slot width and height (square)' },
    { name: '--move-pininput-slot-radius', value: 'var(--move-rounded-md)', description: 'Slot border radius' },
    { name: '--move-pininput-slot-border', value: 'var(--move-border-base)', description: 'Slot border color' },
    { name: '--move-pininput-slot-border-hover', value: 'var(--move-border-emphasis)', description: 'Slot hover border color' },
    { name: '--move-pininput-slot-border-focus', value: 'var(--move-primary)', description: 'Active slot border/focus ring color' },
    { name: '--move-pininput-slot-bg', value: 'var(--move-bg-subtle)', description: 'Slot background color' },
    { name: '--move-pininput-slot-fg', value: 'var(--move-fg-base)', description: 'Slot text color' },
    { name: '--move-pininput-slot-font-size', value: 'var(--move-size-lg)', description: 'Slot character font size' },
    { name: '--move-pininput-slot-gap', value: 'var(--move-spacing-sm)', description: 'Gap between slots within a group' },
    { name: '--move-pininput-group-gap', value: 'var(--move-spacing-md)', description: 'Gap between groups' },
    { name: '--move-pininput-placeholder-fg', value: 'var(--move-fg-muted)', description: 'Placeholder character color' },
    { name: '--move-pininput-caret-color', value: 'var(--move-primary)', description: 'Blinking caret color' },
  ],

  variants: {},
  sizes: ['sm', 'md', 'lg'] as string[],

  labels: [
    { key: 'pinInput', default: 'PIN input', description: 'Default aria-label for the hidden input element' },
  ],

  hasHook: true,
  engineImports: ['withMoveComponent'] as string[],

  componentDeps: [] as string[],

  testing: {
    behaviors: [
      'Renders root with visual slot elements and a hidden input',
      'Hidden input is absolutely positioned with opacity:0',
      'Hidden input captures keyboard input for all slots',
      'Defaults to 4 slots, type=number, size=md, oneTimeCode=true',
      'Slot count matches length prop',
      'Controlled value via value prop',
      'Uncontrolled value via defaultValue prop',
      'onChange fires when value changes',
      'onComplete fires when all slots are filled',
      'Type "number" only allows digit characters',
      'Type "alphanumeric" allows letters and digits',
      'Type RegExp allows custom character patterns',
      'Mask=true shows bullet characters instead of actual value',
      'Placeholder character shown in empty unfocused slots',
      'Active slot shows blinking caret animation',
      'data-active attribute set on focused slot',
      'data-placeholder attribute set on placeholder slots',
      'Grouping splits slots into visual groups',
      'Grouping adds en-dash separators between groups',
      'Grouping fallback to single group when sum != length',
      'oneTimeCode=true sets autocomplete="one-time-code"',
      'Paste event filters and sets value',
      'Backspace removes last character',
      'AutoFocus focuses input on mount',
      'Root click focuses hidden input',
      'Applies data-size, data-invalid, data-disabled',
      'Invalid state shows error border on slots',
      'Disabled state reduces opacity and disables input',
      'Hidden input maxLength equals length',
      'Size sm: smaller slot size, font, radius, gap',
      'Size lg: larger slot size, font, radius',
      'Forwards className and style on root',
      'Forwards ref to root div',
    ],
    keyboard: [
      'Typing valid characters fills slots left to right',
      'Backspace removes last filled character',
      'ArrowLeft/ArrowRight navigate (handled by native input)',
      'Ctrl/Cmd+V paste fills slots',
      'Invalid characters are blocked (preventDefault)',
    ] as string[],
    aria: [
      'Hidden input has aria-label from labels.pinInput',
      'Hidden input has appropriate inputMode (numeric or text)',
      'Separator has aria-hidden=true',
    ] as string[],
    form: [
      'Hidden input with name prop participates in form submission',
      'Input disabled attribute forwarded when disabled',
    ] as string[],
  },

  defaultReview: {
    status: 'approved' as const,
    decisionSource: 'accept-all' as const,
    overrides: {},
  },
} satisfies ComponentSpec;
