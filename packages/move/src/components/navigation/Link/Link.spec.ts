// Link.spec.ts — Component specification

import type { ComponentSpec } from '../../../spec-type';

export const spec = {
  schemaVersion: 1 as const,
  name: 'Link',
  componentClass: 'interactive' as const,
  category: 'navigation',
  description:
    'Inline anchor element with variant colors, underline modes, optional size, and external link support',
  families: {
    behavior: ['typography'],
    state: ['stateless'],
    a11y: ['none'],
  },

  compound: false,
  rootElement: 'a',
  slots: [
    { name: 'root', element: 'a', description: 'Anchor element (or Slot.Root when asChild)' },
  ],

  props: [
    {
      name: 'variant',
      type: "'default' | 'muted' | 'subtle'",
      default: "'default'",
      moveSpecific: true,
      description: 'Color variant',
    },
    {
      name: 'underline',
      type: "'always' | 'hover' | 'none'",
      default: "'always'",
      moveSpecific: true,
      description: 'Underline behavior',
    },
    {
      name: 'size',
      typeRef: 'TypographySize',
      moveSpecific: true,
      description: 'Font size (optional, inherits when unset)',
    },
    {
      name: 'external',
      type: 'boolean',
      moveSpecific: true,
      description: 'Opens in new tab with noopener noreferrer',
    },
    {
      name: 'asChild',
      type: 'boolean',
      default: 'false',
      moveSpecific: true,
      description: 'Render as child element via Radix Slot',
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
      description: 'With truncate, show full text in a tooltip when actually cut off',
    },
    { name: 'children', type: 'React.ReactNode', moveSpecific: false, description: 'Link content' },
  ],

  anatomy: {
    slot: 'root',
    dataAttributes: ['data-variant', 'data-underline', 'data-size'],
  },

  controlled: null,
  keyboard: null,
  focus: 'self' as const,
  formType: null,
  asChild: true,

  animations: [],

  tokens: [
    {
      name: '--move-link-color-default',
      value: 'var(--move-link)',
      description: 'Default variant color',
    },
    {
      name: '--move-link-color-default-hover',
      value: 'var(--move-link-hover)',
      description: 'Default variant hover color',
    },
    {
      name: '--move-link-color-muted',
      value: 'var(--move-fg-muted)',
      description: 'Muted variant color',
    },
    {
      name: '--move-link-color-muted-hover',
      value: 'var(--move-fg-base)',
      description: 'Muted variant hover color',
    },
    {
      name: '--move-link-color-subtle',
      value: 'var(--move-fg-subtle)',
      description: 'Subtle variant color',
    },
    {
      name: '--move-link-color-subtle-hover',
      value: 'var(--move-fg-muted)',
      description: 'Subtle variant hover color',
    },
  ],

  variants: {
    variant: ['default', 'muted', 'subtle'],
  },
  sizes: ['xs', 'sm', 'base', 'lg', 'xl'],

  labels: [],
  childrenKind: 'text' as const,

  renderContracts: [
    {
      id: 'external-attrs',
      description:
        'When external=true, adds target="_blank" and rel="noopener noreferrer" to the anchor',
    },
    {
      id: 'size-conditional',
      description:
        'data-size is only rendered when size prop is provided; otherwise the link inherits surrounding font size',
    },
  ],

  hasHook: false,
  engineImports: ['withMoveComponent', 'useMergedRef'],

  componentDeps: [],

  testing: {
    behaviors: [
      'Renders as anchor element',
      'Renders children content',
      'Applies variant via data-variant attribute',
      'Applies underline via data-underline attribute',
      'Defaults to variant=default',
      'Defaults to underline=always',
      'Applies size via data-size attribute when provided',
      'Omits data-size when size prop is not provided',
      'Adds target=_blank and rel=noopener noreferrer when external=true',
      'Renders as child via asChild using Radix Slot',
      'Forwards className and style',
      'Forwards ref to root element',
      'Spreads HTML attributes',
    ],
  },
} satisfies ComponentSpec;
