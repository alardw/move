// ColorInput.spec.ts — Component specification

import type { ComponentSpec } from '../../../spec-type';

export const spec = {
  schemaVersion: 1 as const,
  name: 'ColorInput',
  animationPatterns: ['popupSurface'],
  componentClass: 'input_popup' as const,
  category: 'forms',
  description:
    'Form input with color preview swatch that opens a ColorPicker popover, supporting multiple color formats and eye dropper',
  choreographies: ['popupSurface'],
  families: {
    behavior: ['popup-anchored'],
    state: ['controlled-value', 'controlled-open'],
    a11y: ['dialog'],
  },
  behavior: {
    popup: {
      // A text field anchoring a panel of real controls (sliders + a nested
      // select), so focus ENTERS the panel and Escape returns it to the field.
      // The mechanism FIXES that contract — focusOnOpen/focusOnClose are read
      // from POPUP_FOCUS_BY_MECHANISM and cannot be restated here.
      mechanism: 'field-dialog' as const,
      closeOnEscape: true,
      closeOnOutsideClick: true,
      closeOnScroll: true,
      closeOnResize: true,
      // Keyboard entry contract — enforced at RUNTIME by check:keyboard-entry,
      // which presses these keys and asserts where focus lands. Declaring it is
      // what stops a popup shipping unreachable by keyboard.
      // tabbableTrigger is false: the swatch is pointer/AT-click only, so
      // ArrowDown on the field is the keyboard way in.
      keyboard: {
        openKeys: ['ArrowDown'],
        tabbableTrigger: false,
      },
      // Scope of closeOnScroll. A scroll INSIDE the popup moves the content
      // along with its anchor, so it is not a viewport change and must not
      // dismiss. Only scrolls outside the popup close it.
      closeOnScrollScope: 'outside' as const,
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
      typeRef: 'Dimension',
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
      id: 'open-focuses-picker',
      description:
        'Focus enters the panel on EVERY open, pointer or keyboard alike — the `field-dialog` mechanism makes no distinction. It is placed by usePopupFocus through onOpenAutoFocus, the one point Radix guarantees runs after its own FocusScope, so it cannot race a mount effect; the handler always preventDefaults first, because Radix would otherwise focus the bare container. The panel is portaled away from the field in tab order, so an open that left focus behind put the next Tab on the following page control while the panel stayed open behind it.',
    },
    {
      id: 'close-on-scroll-outside-only',
      description:
        'Close-on-scroll ignores scroll events originating inside the popper content wrapper, so scrolling within the picker keeps it open',
    },
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
    {
      id: 'input-enter-commits',
      description:
        'Enter commits the typed draft in place and closes the panel, leaving focus on the field. It used to blur() to commit, which dropped focus on <body> and left the panel open behind it. preventDefault only fires while the panel is open, so with it closed Enter still reaches an enclosing form.',
    },
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
      id: 'close-returns-focus-to-field',
      description:
        'Closing returns focus to the text field, via usePopupFocus through onCloseAutoFocus. Radix restores to its Trigger, which this component does not render — it anchors with Anchor — so left alone Escape dropped focus on <body>. Focus is only reclaimed when the popup still holds it: a close caused by clicking elsewhere leaves focus where the user put it.',
    },
    {
      id: 'dismiss-on-focus-leave',
      description:
        'Focus reaching anything outside the panel and its anchor dismisses the panel, so an open dialog cannot trail behind the user. Focus moving into another floating layer does NOT count as leaving — a Select opened inside the panel portals its listbox to the end of <body>, so by DOM containment it looks outside while the user is still working inside.',
    },
    {
      id: 'field-is-a-combobox',
      description:
        'The field carries role="combobox", aria-haspopup="dialog", aria-expanded and aria-controls (APG combobox with dialog popup), and the panel is a role="dialog" named from labels.picker. Without them the panel opens silently for a screen reader.',
    },
    {
      id: 'typed-text-is-the-only-draft',
      description:
        'Commit model: interactions in the panel are LIVE — a slider drag fires onValueChange as it happens and survives close. Only the typed text is a draft: Enter commits it, Escape abandons it and restores the committed value. Escape never rolls back what the panel already applied, because the user watched those changes land on the field and the swatch.',
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
      value: 'var(--move-bg-base)',
      description: 'Root background color',
    },
    {
      name: '--move-colorinput-border',
      value: 'var(--move-border-interactive)',
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
    {
      key: 'picker',
      default: 'Color picker',
      description: 'Accessible name for the picker dialog — role="dialog" requires one',
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
  engineImports: ['withMoveComponent', 'usePopupFocus'] as string[],

  radixPrimitive: 'Popover',
  componentDeps: ['ColorPicker'] as string[],

  testing: {
    behaviors: [
      'Scrolling inside the picker popup keeps it open',
      'Scrolling outside the popup closes it',
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
      'Input Enter commits the typed draft without moving focus',
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
      // Commit model: panel interactions are LIVE (a slider drag fires
      // onValueChange as it happens and survives close). Only the typed text is
      // a draft — Enter commits it, Escape abandons it. Escape never rolls back
      // what the panel already applied.
      'Enter commits the typed draft, closes the panel, and keeps focus on the field',
      'Escape abandons the typed draft, reverting the field to the committed value',
      'Escape does not roll back a change the panel already applied',
      'Opening the format select inside the panel does not dismiss the panel',
      'ArrowDown on input opens the popover and moves focus to the first control in the picker',
      'A pointer open moves focus into the picker too — the mechanism makes no pointer/keyboard distinction',
      'Escape closes the popover and returns focus to the field, asserted after the exit unmounts',
      'Tab cycles within the panel rather than escaping to the page',
      'Focus reaching anything outside the panel and its anchor dismisses it',
    ],
    aria: [
      'Swatch has role="button" and tabIndex=-1',
      'Swatch has aria-label from labels.swatch',
      'Eye dropper has aria-label from labels.eyeDropper',
      'Input is a native input with name and label association',
      // APG combobox-with-dialog-popup. Without these the panel opens silently.
      'Input has role="combobox" and aria-haspopup="dialog"',
      'Input aria-expanded tracks the popup, and aria-controls points at it when open',
      'Picker dialog is named from labels.picker',
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
