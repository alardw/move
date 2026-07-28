// Quote.spec.ts — Component specification

import type { ComponentSpec } from '../../../spec-type';

export const spec = {
  schemaVersion: 1 as const,
  name: 'Quote',
  componentClass: 'presentational' as const,
  category: 'typography',
  description:
    'An attributed quotation — a semantic figure/blockquote/figcaption with optional cite URL, a left accent rule on a subtle panel, and italic (overridable) quote text; block (inline) or pull (emphasis) variant',
  families: {
    behavior: ['typography'],
    state: ['stateless'],
    a11y: ['none'],
  },

  compound: false,
  rootElement: 'figure',
  slots: [
    {
      name: 'root',
      element: 'figure | blockquote',
      description:
        'Container — <figure> (wrapping <blockquote> + <figcaption>) when attributed, otherwise a bare <blockquote>. Inner structure (blockquote / figcaption) is described in renderContracts.',
    },
  ],

  props: [
    {
      name: 'variant',
      type: "'block' | 'pull'",
      default: "'block'",
      moveSpecific: true,
      description:
        'block = inline indented blockquote with a left accent rule; pull = larger pull-quote emphasis',
    },
    {
      name: 'italic',
      type: 'boolean',
      default: 'true',
      moveSpecific: true,
      description: 'Italic quote text (default); false renders it upright',
    },
    {
      name: 'attribution',
      type: 'React.ReactNode',
      moveSpecific: true,
      description: 'Attribution content (name + optional source); rendered in <figcaption>',
    },
    {
      name: 'cite',
      type: 'string',
      moveSpecific: false,
      description: 'Source URL → the <blockquote cite> HTML attribute',
    },
    { name: 'className', type: 'string', moveSpecific: false, description: 'Additional CSS class' },
    {
      name: 'style',
      type: 'React.CSSProperties',
      moveSpecific: false,
      description: 'Inline styles',
    },
    {
      name: 'children',
      type: 'React.ReactNode',
      moveSpecific: false,
      description: 'The quoted text content',
    },
  ],

  anatomy: {
    slot: 'root',
    dataAttributes: ['data-variant', 'data-italic'],
  },

  controlled: null,
  keyboard: null,
  focus: null,
  formType: null,
  asChild: false,

  animations: [],

  tokens: [
    {
      name: '--move-quote-rule',
      value: 'var(--move-primary)',
      description: 'Left accent rule color — the app primary/accent (theme-aware)',
    },
    {
      name: '--move-quote-bg',
      value: 'var(--move-bg-subtle)',
      description: 'Subtle panel background behind the quote',
    },
    {
      name: '--move-quote-fg',
      value: 'var(--move-fg-base)',
      description: 'Quote text color',
    },
    {
      name: '--move-quote-attribution-fg',
      value: 'var(--move-fg-muted)',
      description: 'Attribution (figcaption) text color',
    },
  ],

  variants: {
    variant: ['block', 'pull'],
  },
  sizes: [],

  labels: [],
  childrenKind: 'text' as const,

  renderContracts: [
    {
      id: 'conditional-figure',
      description:
        'When attribution is provided, render <figure> wrapping <blockquote> + <figcaption>; when absent, render a bare <blockquote> as the root (no figure, no figcaption)',
    },
    {
      id: 'attribution-outside-quote',
      description:
        'Attribution renders in <figcaption>, OUTSIDE the <blockquote> — per the HTML spec the attribution is not part of the quoted text',
    },
    {
      id: 'cite-attribute',
      description: 'The cite prop maps to the cite attribute on the <blockquote> element',
    },
    {
      id: 'italic-default',
      description:
        'The quote text is italic by default; data-italic="false" (from italic={false}) renders it upright',
    },
  ],

  hasHook: false,
  engineImports: ['withMoveComponent'],

  componentDeps: [],

  testing: {
    behaviors: [
      'Renders a bare <blockquote> when no attribution is provided',
      'Wraps <blockquote> in a <figure> with a <figcaption> when attribution is provided',
      'Renders attribution in <figcaption> outside the <blockquote>',
      'Renders children as the quote text inside <blockquote>',
      'Sets the cite attribute on <blockquote> when cite is provided; omits it otherwise',
      'Applies variant via data-variant attribute',
      'Defaults to variant=block',
      'Renders italic quote text by default',
      'Sets data-italic="false" and upright text when italic={false}',
      'Forwards className and style',
      'Forwards ref to root element',
      'Spreads HTML attributes',
    ],
  },
} satisfies ComponentSpec;
