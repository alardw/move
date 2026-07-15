// Prose.spec.ts — Component specification

import type { ComponentSpec } from '../../../spec-type';

export const spec = {
  schemaVersion: 1 as const,
  name: 'Prose',
  componentClass: 'presentational' as const,
  category: 'typography',
  description:
    'Rich-text container that styles child HTML elements (headings, paragraphs, lists, code, tables) with consistent typography',
  families: {
    behavior: ['typography'],
    state: ['stateless'],
    a11y: ['none'],
  },

  compound: false,
  rootElement: 'div',
  slots: [
    {
      name: 'root',
      element: 'div',
      description: 'Prose container that styles nested HTML content',
    },
  ],

  props: [
    {
      name: 'size',
      type: "'sm' | 'base' | 'lg'",
      default: "'base'",
      moveSpecific: true,
      description: 'Base font size for prose content',
    },
    {
      name: 'children',
      type: 'React.ReactNode',
      moveSpecific: false,
      description: 'HTML content to style',
    },
  ],

  anatomy: {
    slot: 'root',
    dataAttributes: ['data-size'],
  },

  controlled: null,
  keyboard: null,
  focus: null,
  formType: null,
  asChild: false,

  animations: [],

  tokens: [
    { name: '--move-prose-fg', value: 'var(--move-fg-base)', description: 'Base text color' },
    {
      name: '--move-prose-fg-muted',
      value: 'var(--move-fg-muted)',
      description: 'Muted text color (blockquotes)',
    },
    {
      name: '--move-prose-fg-subtle',
      value: 'var(--move-fg-subtle)',
      description: 'Subtle text color',
    },
    { name: '--move-prose-link', value: 'var(--move-link)', description: 'Link color' },
    {
      name: '--move-prose-link-hover',
      value: 'var(--move-link-hover)',
      description: 'Link hover color',
    },
    {
      name: '--move-prose-border',
      value: 'var(--move-border-base)',
      description: 'Border color (hr, table, blockquote)',
    },
    {
      name: '--move-prose-bg-code',
      value: 'var(--move-bg-muted)',
      description: 'Inline code and pre background',
    },
    {
      name: '--move-prose-bg-blockquote',
      value: 'var(--move-bg-subtle)',
      description: 'Blockquote background',
    },
    { name: '--move-prose-heading-gap', value: '1em', description: 'Top margin before headings' },
    {
      name: '--move-prose-measure',
      value: '68ch',
      description: 'Max text-column width — WCAG 1.4.8 readable measure (~66 chars)',
    },
    { name: '--move-prose-paragraph-gap', value: '1.6em', description: 'Space between paragraphs' },
  ],

  variants: {},
  sizes: ['sm', 'base', 'lg'],

  labels: [],
  childrenKind: 'text' as const,

  renderContracts: [
    {
      id: 'styles-child-elements',
      description:
        'Styles nested h1-h6, p, a, ul, ol, li, blockquote, code, pre, hr, table, th, td, strong, img elements via descendant selectors',
    },
  ],

  hasHook: false,
  engineImports: ['withMoveComponent'],

  componentDeps: [],

  testing: {
    behaviors: [
      'Renders as div element',
      'Renders children content',
      'Applies size via data-size attribute',
      'Defaults to size=base',
      'Styles heading elements (h1-h6) with correct typography',
      'Styles paragraph elements with correct spacing',
      'Styles anchor elements with link color',
      'Styles unordered and ordered lists',
      'Styles blockquote with left border and background',
      'Styles inline code with background',
      'Styles pre blocks with background and overflow',
      'Styles horizontal rules with border color',
      'Styles tables with border-collapse',
      'Forwards className and style',
      'Forwards ref to root element',
      'Spreads HTML attributes',
    ],
  },
} satisfies ComponentSpec;
