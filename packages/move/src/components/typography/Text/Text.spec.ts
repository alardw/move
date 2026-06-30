// Text.spec.ts — Component specification
// specHash: PLACEHOLDER

import type { ComponentSpec } from '../../../spec-type';

export const spec = {
  schemaVersion: 7 as const,
  name: 'Text',
  componentClass: 'presentational' as const,
  category: 'typography',
  description:
    'Typography primitive with configurable element, size, weight, color, alignment, and truncation',
  families: {
    behavior: ['typography'],
    state: ['stateless'],
    a11y: ['none'],
  },

  compound: false,
  rootElement: 'p',
  slots: [
    {
      name: 'root',
      element: 'p',
      description: 'Text element (renders as configurable HTML element via `as` prop)',
    },
  ],

  props: [
    {
      name: 'as',
      type: "'p' | 'span' | 'div' | 'em' | 'strong' | 'small' | 'del'",
      default: "'p'",
      moveSpecific: true,
      description: 'HTML element to render as',
    },
    {
      name: 'size',
      typeRef: 'TypographySize',
      default: "'base'",
      moveSpecific: true,
      description: 'Font size',
    },
    {
      name: 'weight',
      type: "'normal' | 'medium' | 'semibold' | 'bold'",
      default: "'normal'",
      moveSpecific: true,
      description: 'Font weight',
    },
    {
      name: 'color',
      type: "'base' | 'muted' | 'subtle' | 'primary' | 'success' | 'warning' | 'error'",
      default: "'base'",
      moveSpecific: true,
      description: 'Text color',
    },
    {
      name: 'align',
      type: "'left' | 'center' | 'right'",
      moveSpecific: true,
      description: 'Text alignment (optional)',
    },
    {
      name: 'truncate',
      type: 'boolean',
      moveSpecific: true,
      description: 'Truncate text with ellipsis',
    },
    { name: 'children', type: 'React.ReactNode', moveSpecific: false, description: 'Text content' },
  ],

  anatomy: {
    slot: 'root',
    dataAttributes: ['data-size', 'data-weight', 'data-color', 'data-align', 'data-truncate'],
  },

  controlled: null,
  keyboard: null,
  focus: null,
  formType: null,
  asChild: false,

  animations: [],

  tokens: [
    {
      name: '--move-text-color-base',
      value: 'var(--move-fg-base)',
      description: 'Base text color',
    },
    {
      name: '--move-text-color-muted',
      value: 'var(--move-fg-muted)',
      description: 'Muted text color',
    },
    {
      name: '--move-text-color-subtle',
      value: 'var(--move-fg-subtle)',
      description: 'Subtle text color',
    },
    {
      name: '--move-text-color-primary',
      value: 'var(--move-primary)',
      description: 'Primary text color',
    },
    {
      name: '--move-text-color-success',
      value: 'var(--move-success)',
      description: 'Success text color',
    },
    {
      name: '--move-text-color-warning',
      value: 'var(--move-warning)',
      description: 'Warning text color',
    },
    {
      name: '--move-text-color-error',
      value: 'var(--move-error)',
      description: 'Error text color',
    },
  ],

  variants: {
    color: ['base', 'muted', 'subtle', 'primary', 'success', 'warning', 'error'],
  },
  sizes: ['xs', 'sm', 'base', 'lg', 'xl'],

  labels: [],
  childrenKind: 'text' as const,

  renderContracts: [
    {
      id: 'dynamic-element',
      description:
        'Renders as the HTML element specified by the `as` prop (p, span, div, em, strong, small, del)',
    },
    {
      id: 'align-conditional',
      description: 'data-align is only rendered when align prop is provided',
    },
    {
      id: 'truncate-conditional',
      description: 'data-truncate is only rendered as a boolean attribute when truncate=true',
    },
  ],

  hasHook: false,
  engineImports: ['withMoveComponent'],

  componentDeps: [],

  testing: {
    behaviors: [
      'Renders as p element by default',
      'Renders as specified element via as prop (span, div, em, strong, small, del)',
      'Renders children content',
      'Applies size via data-size attribute',
      'Applies weight via data-weight attribute',
      'Applies color via data-color attribute',
      'Defaults to as=p',
      'Defaults to size=base',
      'Defaults to weight=normal',
      'Defaults to color=base',
      'Applies align via data-align attribute when provided',
      'Omits data-align when align prop is not provided',
      'Applies data-truncate attribute when truncate=true',
      'Omits data-truncate when truncate is not provided',
      'Forwards className and style',
      'Forwards ref to root element',
      'Spreads HTML attributes',
    ],
  },
} satisfies ComponentSpec;
