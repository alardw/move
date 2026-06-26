// Checkbox.spec.ts — Component specification
// specHash: PLACEHOLDER

import type { ComponentSpec } from '../../../spec-type';

export const spec = {
  schemaVersion: 7 as const,
  name: 'Checkbox',
  componentClass: 'input_toggle' as const,
  category: 'form',
  description: 'Toggle checkbox with checked/indeterminate states, animated indicator, optional icon, and form submission via hidden input',

  synonyms: ['tickbox', 'toggle', 'option', 'check'],
  families: {
    behavior:  ["form-input"],
    state:     ["controlled-value"],
    animation: ["hover-press"],
    a11y:      ["none"],
  },

  compound: false,
  rootElement: 'button',
  slots: [
    { name: 'root', element: 'button', description: 'Native button element with role="checkbox" that handles click and keyboard interaction' },
    { name: 'indicator', element: 'span', description: 'Container for the check/indeterminate icon, target of toggle animation' },
    { name: 'icon', element: 'span', description: 'Inner icon element that renders the check SVG or resolved icon' },
  ],

  subComponents: [
    {
      name: 'Group',
      slots: [],
      props: [
        { name: 'children', type: 'React.ReactNode', moveSpecific: false, description: 'Checkbox items' },
      ],
      usesFactory: false,
      description: 'Layout container for grouping multiple checkboxes with role="group" and vertical flex layout',
    },
  ],

  props: [
    { name: 'checked', type: 'boolean', moveSpecific: true, description: 'Controlled checked state' },
    { name: 'defaultChecked', type: 'boolean', moveSpecific: true, description: 'Default checked state for uncontrolled mode' },
    { name: 'indeterminate', type: 'boolean', moveSpecific: true, description: 'Indeterminate (mixed) state' },
    { name: 'onCheckedChange', type: '(checked: boolean) => void', moveSpecific: true, description: 'Called when checked state changes' },
    { name: 'icon', type: 'string', default: "'check'", moveSpecific: true, description: 'Icon name for the check indicator (resolved via useResolvedIcon)' },
    { name: 'animations', type: 'AnimationTrigger[] | false', moveSpecific: true, description: 'Toggle animation config or false to disable' },
    { name: 'size', typeRef: 'Size', default: "'md'", moveSpecific: true, description: 'Size of the checkbox' },
    { name: 'disabled', type: 'boolean', default: 'false', moveSpecific: true, description: 'Whether the checkbox is disabled' },
    { name: 'invalid', type: 'boolean', moveSpecific: true, description: 'Whether the checkbox is in an invalid state' },
    { name: 'name', type: 'string', moveSpecific: true, description: 'Name for form submission (renders hidden input)' },
    { name: 'value', type: 'string', moveSpecific: true, description: 'Value for form submission' },
    { name: 'required', type: 'boolean', moveSpecific: true, description: 'Required for form validation' },
    { name: 'children', type: 'React.ReactNode', moveSpecific: false, description: 'Label content rendered beside the checkbox' },
  ],

  anatomy: {
    slot: 'root',
    dataAttributes: ['data-state', 'data-size', 'data-invalid'],
    ariaAttributes: ['role', 'aria-checked'],
    children: [
      {
        slot: 'indicator',
        children: [
          { slot: 'icon' },
        ],
      },
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
    { trigger: 'checked', sequence: [{ target: 'indicator', animation: { opacity: { to: 1 }, scale: { to: 1, ease: 'poppy' } } }] },
    { trigger: 'unchecked', sequence: [{ target: 'indicator', animation: { opacity: { to: 0 }, scale: { to: 0.5, ease: 'snappy' } } }] },
    { trigger: 'Root.press', sequence: [{ preset: 'scaleDown' }] },
  ],

  tokens: [
    { name: '--move-checkbox-size', value: '1.5rem', description: 'Overall checkbox box size' },
    { name: '--move-checkbox-icon-size', value: '1.0625rem', description: 'Check icon size' },
    { name: '--move-checkbox-radius', value: '0.25rem', description: 'Checkbox border radius' },
    { name: '--move-checkbox-bg', value: 'var(--move-bg-muted)', description: 'Unchecked background color' },
    { name: '--move-checkbox-bg-hover', value: 'var(--move-bg-emphasis)', description: 'Unchecked hover background color' },
    { name: '--move-checkbox-bg-checked', value: 'var(--move-primary)', description: 'Checked background color' },
    { name: '--move-checkbox-bg-checked-hover', value: 'var(--move-primary-hover)', description: 'Checked hover background color' },
    { name: '--move-checkbox-border', value: 'var(--move-border-base)', description: 'Border color' },
    { name: '--move-checkbox-border-hover', value: 'var(--move-border-emphasis)', description: 'Hover border color' },
    { name: '--move-checkbox-fg', value: 'var(--move-primary-fg)', description: 'Check icon color (foreground on checked bg)' },
  ],

  variants: {},
  sizes: ['sm', 'md', 'lg'] as string[],

  labels: [],
  childrenKind: 'text' as const,

  renderContracts: [
    { id: 'wrapper-label', description: 'Root button is wrapped in a <label> element that includes the checkbox and children text' },
    { id: 'press-handlers-on-wrapper', description: 'Press animation handlers (onMouseDown, onMouseUp, onMouseLeave) are attached to the wrapper label via useAnimations' },
    { id: 'hidden-input-form', description: 'When name prop is provided, a hidden input is rendered for form submission with value "on" when checked' },
    { id: 'data-state-tristate', description: 'data-state is one of "checked", "unchecked", or "indeterminate"' },
    { id: 'aria-checked-mixed', description: 'aria-checked is "mixed" when indeterminate, otherwise boolean checked value' },
    { id: 'size-data-attr-skip-md', description: 'data-size is only rendered for sm and lg; md is the default and omitted' },
    { id: 'useCheckbox-hook', description: 'Uses useCheckbox headless hook for controlled/uncontrolled checked state management' },
    { id: 'toggle-animation-wiring', description: 'useAnimations observes data-state on Root; fires checked/unchecked state triggers to animate indicator slot' },
    { id: 'icon-resolution', description: 'icon prop is resolved via useResolvedIcon; falls back to built-in SVG checkmark when icon provider is not available' },
    { id: 'keyboard-toggle', description: 'Space and Enter keys trigger toggle via handleKeyDown' },
  ],

  hasHook: true,
  engineImports: ['withMoveComponent', 'useMergedRef'] as string[],
  componentDeps: [] as string[],

  testing: {
    behaviors: [
      'Renders as a button with role="checkbox"',
      'Toggles checked state on click',
      'Renders children as label text beside the checkbox',
      'Wrapper label element wraps the checkbox and children',
      'data-state is "checked" when checked',
      'data-state is "unchecked" when not checked',
      'data-state is "indeterminate" when indeterminate=true',
      'Defaults to unchecked state',
      'Defaults icon to "check"',
      'Defaults disabled to false',
      'Applies size via data-size for sm and lg',
      'Omits data-size for default md',
      'Sets data-invalid when invalid=true',
      'Disabled checkbox cannot be toggled',
      'Disabled wrapper has cursor: not-allowed',
      'Renders hidden input when name prop is provided',
      'Hidden input value is "on" when checked, empty when unchecked',
      'Falls back to built-in SVG checkmark when icon provider not available',
      'Forwards ref to the button element',
      'Forwards className and style on root',
    ],
    aria: [
      'role="checkbox" is set on the button',
      'aria-checked reflects boolean checked state',
      'aria-checked is "mixed" when indeterminate',
      'Focus ring visible on focus-visible',
    ],
    keyboard: [
      'Space key toggles checked state',
      'Enter key toggles checked state',
    ],
    form: [
      'Hidden input participates in form submission via name attribute',
      'Hidden input value reflects checked state',
    ],
    animation: [
      'State trigger fires checked animation on indicator',
      'State trigger fires unchecked animation on indicator',
      'Press animation on wrapper via Root.press trigger',
      'animations={false} disables toggle animation',
    ],
  },

  defaultReview: {
    status: 'approved' as const,
    decisionSource: 'accept-all' as const,
    overrides: {},
  },
} satisfies ComponentSpec;
