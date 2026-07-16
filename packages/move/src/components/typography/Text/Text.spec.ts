// Text.spec.ts — Component specification

import type { ComponentSpec } from '../../../spec-type';

export const spec = {
  schemaVersion: 1 as const,
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
      typeRef: 'Truncate',
      moveSpecific: true,
      description: "Truncate overflowing text: true/'end', 'start', or 'clamp'",
    },
    {
      name: 'lines',
      type: 'number',
      moveSpecific: true,
      description: "Max lines for truncate='clamp' (default 2)",
    },
    {
      name: 'tooltip',
      type: 'boolean',
      moveSpecific: true,
      description: 'With truncate, show full text in a Move Tooltip when actually cut off',
    },
    {
      name: 'readableWidth',
      type: 'boolean',
      moveSpecific: true,
      description:
        'Cap the line length to a comfortable reading measure (WCAG 1.4.8) for a standalone paragraph — use Prose for real long-form content',
    },
    { name: 'children', type: 'React.ReactNode', moveSpecific: false, description: 'Text content' },
  ],

  anatomy: {
    slot: 'root',
    dataAttributes: [
      'data-size',
      'data-weight',
      'data-color',
      'data-align',
      'data-truncate',
      'data-readable-width',
    ],
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
      value: 'var(--move-indigo-text)',
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
      description:
        "data-truncate carries the normalized mode ('end'/'start'/'clamp', with true→'end') and is omitted when truncate is falsy; the global [data-truncate] utility styles it. clamp sets an inline --move-line-clamp from lines.",
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
      "Applies data-truncate='end' when truncate=true or 'end'",
      "Applies data-truncate='start'/'clamp' for those modes",
      "Sets --move-line-clamp from lines when truncate='clamp'",
      'Omits data-truncate when truncate is not provided',
      'Applies data-readable-width when readableWidth is set; omits it otherwise',
      'Forwards className and style',
      'Forwards ref to root element',
      'Spreads HTML attributes',
    ],
  },
} satisfies ComponentSpec;
