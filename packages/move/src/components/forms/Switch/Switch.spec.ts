// Switch.spec.ts — Component specification
// specHash: PLACEHOLDER

import type { ComponentSpec } from '../../../spec-type';

export const spec = {
  schemaVersion: 7 as const,
  name: 'Switch',
  componentClass: 'input_toggle' as const,
  category: 'forms',
  description: 'Toggle switch built on Radix Switch with animated thumb, size variants, and optional inline label',

  synonyms: ['toggle', 'on off', 'toggle switch'],
  animationPatterns: ['toggle'],
  families: {
    behavior:  ["form-input"],
    state:     ["controlled-value"],
    a11y:      ["none"],
  },

  compound: true,
  rootElement: 'button',
  slots: [
    { name: 'root', element: 'button', description: 'Radix Switch.Root button element that manages checked state and ARIA' },
    { name: 'thumb', element: 'span', description: 'Radix Switch.Thumb sliding indicator element, animated via useAnimations state triggers' },
  ],

  subComponents: [
    {
      name: 'Root',
      slots: [{ name: 'root', element: 'button', description: 'Switch track button element' }],
      props: [
        { name: 'className', type: 'string', moveSpecific: false, description: 'CSS class name' },
        { name: 'style', type: 'React.CSSProperties', moveSpecific: false, description: 'Inline styles' },
        { name: 'children', type: 'React.ReactNode', moveSpecific: false, description: 'Switch.Thumb element' },
        { name: 'checked', type: 'boolean', moveSpecific: true, description: 'Controlled checked state' },
        { name: 'defaultChecked', type: 'boolean', moveSpecific: true, description: 'Default checked state for uncontrolled mode' },
        { name: 'onCheckedChange', type: '(checked: boolean) => void', moveSpecific: true, description: 'Called when checked state changes' },
        { name: 'disabled', type: 'boolean', moveSpecific: true, description: 'Whether the switch is disabled' },
        { name: 'invalid', type: 'boolean', moveSpecific: true, description: 'Whether the switch is in an invalid state' },
        { name: 'label', type: 'React.ReactNode', moveSpecific: true, description: 'Optional label text rendered beside the switch' },
        { name: 'size', typeRef: 'Size', default: "'md'", moveSpecific: true, description: 'Size of the switch' },
        { name: 'animations', type: 'AnimationTrigger[] | false', moveSpecific: true, description: 'Toggle animation config or false to disable' },
        { name: 'required', type: 'boolean', moveSpecific: false, description: 'Required for form validation' },
        { name: 'name', type: 'string', moveSpecific: false, description: 'Form submission name' },
        { name: 'value', type: 'string', moveSpecific: false, description: 'Form submission value' },
      ],
      usesFactory: true,
      radixPrimitive: 'Switch.Root',
      description: 'Switch track that manages checked state via Radix Switch.Root, with optional wrapper label',
    },
    {
      name: 'Thumb',
      slots: [{ name: 'thumb', element: 'span', description: 'Sliding thumb indicator' }],
      props: [
        { name: 'className', type: 'string', moveSpecific: false, description: 'CSS class name' },
        { name: 'style', type: 'React.CSSProperties', moveSpecific: false, description: 'Inline styles' },
      ],
      usesFactory: true,
      radixPrimitive: 'Switch.Thumb',
      description: 'Sliding thumb that translates horizontally on toggle, animated via shared context',
    },
  ],

  props: [
    { name: 'checked', type: 'boolean', moveSpecific: true, description: 'Controlled checked state' },
    { name: 'defaultChecked', type: 'boolean', moveSpecific: true, description: 'Default checked state for uncontrolled mode' },
    { name: 'onCheckedChange', type: '(checked: boolean) => void', moveSpecific: true, description: 'Called when checked state changes' },
    { name: 'disabled', type: 'boolean', moveSpecific: true, description: 'Whether the switch is disabled' },
    { name: 'invalid', type: 'boolean', moveSpecific: true, description: 'Whether the switch is in an invalid state' },
    { name: 'label', type: 'React.ReactNode', moveSpecific: true, description: 'Optional label displayed beside the switch' },
    { name: 'size', typeRef: 'Size', default: "'md'", moveSpecific: true, description: 'Size of the switch' },
    { name: 'animations', type: 'AnimationTrigger[] | false', moveSpecific: true, description: 'Toggle animation config or false to disable' },
    { name: 'required', type: 'boolean', moveSpecific: false, description: 'Required for form validation' },
    { name: 'name', type: 'string', moveSpecific: false, description: 'Form submission name' },
    { name: 'value', type: 'string', moveSpecific: false, description: 'Form submission value' },
  ],

  anatomy: {
    slot: 'root',
    dataAttributes: ['data-state', 'data-size', 'data-invalid', 'data-disabled'],
    ariaAttributes: ['role'],
    children: [
      { slot: 'thumb' },
    ],
  },

  controlled: 'checked' as const,
  controlledProps: {
    valueProp: 'checked',
    defaultValueProp: 'defaultChecked',
    onChangeProp: 'onCheckedChange',
  },
  keyboard: 'toggle' as const,
  focus: 'self' as const,
  formType: 'hidden-input' as const,
  asChild: false,

  states: [
    { name: 'checked', slot: 'Root', source: 'data-state', value: 'checked' },
    { name: 'unchecked', slot: 'Root', source: 'data-state', value: 'unchecked' },
  ],

  animations: [
    { trigger: 'checked', sequence: [{ target: 'thumb', animation: { x: { to: 'calc($track.width - $thumb.width)', ease: 'poppy' } } }] },
    { trigger: 'unchecked', sequence: [{ target: 'thumb', animation: { x: { to: 0, ease: 'snappy' } } }] },
    { trigger: 'Root.press', sequence: [{ animation: { scale: { to: 0.96, ease: 'snappy' } } }] },
  ],

  tokens: [
    { name: '--move-switch-width', value: '3.25rem', description: 'Switch track width' },
    { name: '--move-switch-height', value: '1.75rem', description: 'Switch track height' },
    { name: '--move-switch-bg', value: 'var(--move-bg-emphasis)', description: 'Unchecked track background color' },
    { name: '--move-switch-bg-checked', value: 'var(--move-primary)', description: 'Checked track background color' },
    { name: '--move-switch-radius', value: 'var(--move-rounded-full)', description: 'Track border radius (pill shape)' },
    { name: '--move-switch-padding', value: '3px', description: 'Inner padding between track edge and thumb' },
    { name: '--move-switch-transition', value: 'var(--move-transition-fast)', description: 'Background color transition duration' },
    { name: '--move-switch-thumb-bg', value: 'var(--move-white, #fff)', description: 'Thumb background color' },
    { name: '--move-switch-thumb-shadow', value: 'var(--move-shadow-subtle)', description: 'Thumb box shadow' },
  ],

  variants: {},
  sizes: ['sm', 'md', 'lg'] as string[],

  labels: [],
  childrenKind: 'composition' as const,

  radixPrimitive: 'Switch',

  renderContracts: [
    { id: 'radix-switch-root', description: 'Root renders as Radix Switch.Root which provides built-in role="switch", aria-checked, and keyboard toggle' },
    { id: 'radix-switch-thumb', description: 'Thumb renders as Radix Switch.Thumb with data-state="checked"/"unchecked" from Radix' },
    { id: 'context-shares-animation', description: 'SwitchContext shares animation state between Root and Thumb sub-components' },
    { id: 'thumb-dual-ref', description: 'Thumb merges forwarded ref with both rootRef and indicatorRef from toggle animation for press and translate animation' },
    { id: 'onsetup-dynamic-translate', description: 'Thumb translateX distance computed dynamically based on measured track/thumb widths' },
    { id: 'label-wrapper', description: 'When label prop is provided, Root is wrapped in a <label> element with the label text beside the switch' },
    { id: 'press-handlers-on-root', description: 'Press animation handlers (onMouseDown, onMouseUp, onMouseLeave) are attached to the Radix Switch.Root via Root.press trigger' },
    { id: 'invalid-inset-shadow', description: 'Invalid state uses inset box-shadow with --move-error instead of border to avoid layout shift' },
    { id: 'radix-handles-form', description: 'Radix Switch handles hidden input for form submission internally via name/value props' },
  ],

  hasHook: false,
  engineImports: ['withMoveComponent'] as string[],
  componentDeps: [] as string[],

  testing: {
    behaviors: [
      'Root renders as Radix Switch.Root with role="switch"',
      'Thumb renders as Radix Switch.Thumb',
      'Toggles checked state on click',
      'data-state is "checked" when checked',
      'data-state is "unchecked" when not checked',
      'Applies size via data-size attribute (sm, md, lg)',
      'Size sm uses reduced width and height',
      'Size lg uses increased width and height',
      'Sets data-invalid when invalid=true',
      'Invalid state shows inset error box-shadow',
      'Disabled switch cannot be toggled',
      'Disabled switch has reduced opacity',
      'Renders label wrapper when label prop is provided',
      'Label wrapper has data-disabled when switch is disabled',
      'No label wrapper when label prop is not provided',
      'Thumb slides from left to right on check',
      'Forwards className and style on Root',
      'Forwards className and style on Thumb',
      'Forwards ref on Root',
      'Forwards ref on Thumb',
    ],
    aria: [
      'role="switch" is set via Radix Switch.Root',
      'aria-checked reflects checked state via Radix',
      'Focus ring visible on focus-visible',
    ],
    keyboard: [
      'Space key toggles checked state (via Radix)',
      'Enter key toggles checked state (via Radix)',
    ],
    form: [
      'Form submission via Radix hidden input when name prop is provided',
      'Value prop is passed through to Radix for form submission',
    ],
    animation: [
      'Toggle animation translates thumb on checked/unchecked state change',
      'onSetup dynamically computes translateX distance from measured widths',
      'Press animation on root via Root.press trigger',
      'animations={false} disables toggle animation',
    ],
  },

  defaultReview: {
    status: 'approved' as const,
    decisionSource: 'accept-all' as const,
    overrides: {},
  },
} satisfies ComponentSpec;
