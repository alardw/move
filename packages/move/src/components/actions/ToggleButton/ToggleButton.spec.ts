// ToggleButton.spec.ts — Component specification

import type { ComponentSpec } from '../../../spec-type';

export const spec = {
  schemaVersion: 1 as const,
  name: 'ToggleButton',
  componentClass: 'interactive' as const,
  category: 'actions',
  description:
    'Toggle button that switches between pressed and unpressed states, composing Button base styles with Radix Toggle primitive',
  choreographies: ['press'],
  families: {
    behavior: ['form-input'],
    state: ['controlled-value'],
    a11y: ['none'],
  },

  compound: false,
  rootElement: 'RadixToggle.Root',
  slots: [
    { name: 'root', element: 'button', description: 'Toggle button element via Radix Toggle.Root' },
  ],

  props: [
    {
      name: 'pressed',
      type: 'boolean',
      moveSpecific: true,
      description: 'Controlled pressed state',
    },
    {
      name: 'defaultPressed',
      type: 'boolean',
      moveSpecific: true,
      description: 'Initial pressed state (uncontrolled)',
    },
    {
      name: 'onPressedChange',
      type: '(pressed: boolean) => void',
      moveSpecific: true,
      description: 'Called when pressed state changes',
    },
    {
      name: 'disabled',
      type: 'boolean',
      default: 'false',
      moveSpecific: true,
      description: 'Disabled state',
    },
    {
      name: 'variant',
      type: "'primary' | 'secondary' | 'ghost' | 'danger'",
      default: "'secondary'",
      moveSpecific: true,
      description: 'Visual style variant (inherits Button variants)',
    },
    {
      name: 'size',
      typeRef: 'Size',
      default: "'md'",
      moveSpecific: true,
      description: 'Button size',
    },
    {
      name: 'animations',
      type: 'AnimationTrigger[] | false',
      moveSpecific: true,
      description: 'Animation config for hover/press interactions, or false to disable',
    },
    {
      name: 'children',
      type: 'React.ReactNode',
      moveSpecific: false,
      description: 'Button content',
    },
  ],

  anatomy: {
    slot: 'root',
    dataAttributes: ['data-state', 'data-variant', 'data-size'],
  },

  controlled: 'checked' as const,
  controlledProps: {
    valueProp: 'pressed',
    defaultValueProp: 'defaultPressed',
    onChangeProp: 'onPressedChange',
  },

  keyboard: 'toggle' as const,
  focus: 'self' as const,
  formType: null,
  asChild: false,

  animations: [
    { trigger: 'Root.hover', sequence: [{ animation: { scale: { to: 1.04, ease: 'snappy' } } }] },
    { trigger: 'Root.press', sequence: [{ animation: { scale: { to: 0.96, ease: 'snappy' } } }] },
  ],

  renderContracts: [
    {
      id: 'composes-button-styles',
      description:
        'Root slot composes Button.module.css root class for shared sizing, typography, border-radius, and variant styling',
    },
    {
      id: 'radix-toggle-controlled',
      description:
        'Forwards pressed, defaultPressed, onPressedChange to Radix Toggle.Root only when defined (avoids uncontrolled->controlled warnings)',
    },
    {
      id: 'on-state-primary',
      description:
        'When data-state="on", background overrides to --move-primary with --move-primary-fg text, regardless of variant',
    },
    {
      id: 'animations-false-disables',
      description: 'When animations={false}, all animation triggers are disabled',
    },
  ],

  tokens: [
    // ToggleButton inherits all Button tokens via composes.
    // The "on" state styles reference shared tokens (--move-primary, --move-shadow-*) directly,
    // so ToggleButton defines no custom properties of its own.
  ],

  variants: {
    variant: ['primary', 'secondary', 'ghost', 'danger'] as string[],
  },
  sizes: ['sm', 'md', 'lg'] as string[],

  labels: [],

  radixPrimitive: 'Toggle',
  hasHook: false,
  engineImports: ['withMoveComponent', 'useMergedRef'] as string[],
  componentDeps: ['Button'] as string[],

  childrenKind: 'text' as const,

  testing: {
    behaviors: [
      'Renders as button element via Radix Toggle.Root',
      'Renders children content',
      'Applies variant via data-variant attribute',
      'Applies size via data-size attribute',
      'Defaults to variant=secondary',
      'Defaults to size=md',
      'Forwards className and style',
      'Forwards ref to root element',
      'Spreads HTML attributes',
      'Supports disabled state via disabled prop',
      'Sets data-state="on" when pressed',
      'Sets data-state="off" when not pressed',
      'Toggles pressed state on click (uncontrolled)',
      'Respects controlled pressed prop',
      'Calls onPressedChange when toggled',
      'On state applies primary background regardless of variant',
    ],
    keyboard: ['Space toggles pressed state', 'Enter toggles pressed state'],
    aria: [
      'aria-pressed reflects pressed state via Radix Toggle',
      'aria-disabled set when disabled',
    ],
    animation: [
      'Uses Root.hover and Root.press event triggers for interactive animation',
      'Disables animation when animations={false}',
      'Disables animation when disabled',
    ],
  },
} satisfies ComponentSpec;
