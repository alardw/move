// Quote.spec.ts — Component specification

import type { ComponentSpec } from '../../../spec-type';

export const spec = {
  schemaVersion: 1 as const,
  name: 'Quote',
  componentClass: 'presentational' as const,
  category: 'typography',
  description:
    'An attributed quotation — a semantic figure/blockquote/figcaption with optional cite URL, a left accent rule, and a decorative quote-mark; block (inline) or pull (emphasis) variant',
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
        'Container — <figure> (wrapping <blockquote> + <figcaption>) when attributed, otherwise a bare <blockquote>. Inner structure (blockquote / figcaption / quote-mark) is described in renderContracts.',
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
      name: 'icon',
      type: 'boolean',
      default: 'true',
      moveSpecific: true,
      description:
        "Show the decorative quote-mark (the 'quote' icon role); false to hide it. Consumers re-theme the glyph per-role on MoveRoot",
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
    dataAttributes: ['data-variant'],
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
      name: '--move-quote-fg',
      value: 'var(--move-fg-base)',
      description: 'Quote text color',
    },
    {
      name: '--move-quote-attribution-fg',
      value: 'var(--move-fg-muted)',
      description: 'Attribution (figcaption) text color',
    },
    {
      name: '--move-quote-icon-color',
      value: 'var(--move-fg-subtle)',
      description: 'Decorative quote-mark color',
    },
    {
      name: '--move-quote-padding',
      value: 'var(--move-spacing-md)',
      description: 'Inline padding between the accent rule and the quote text',
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
      id: 'icon-decorative',
      description:
        "When icon=true, render the 'quote' icon role via useIcon('quote', size) with aria-hidden; omit the mark when icon=false",
    },
  ],

  hasHook: false,
  engineImports: ['withMoveComponent'],

  componentDeps: [],
  iconsUsed: ['quote'],

  testing: {
    behaviors: [
      'Renders a bare <blockquote> when no attribution is provided',
      'Wraps <blockquote> in a <figure> with a <figcaption> when attribution is provided',
      'Renders attribution in <figcaption> outside the <blockquote>',
      'Renders children as the quote text inside <blockquote>',
      'Sets the cite attribute on <blockquote> when cite is provided; omits it otherwise',
      'Applies variant via data-variant attribute',
      'Defaults to variant=block',
      'Renders the decorative quote-mark (quote role) when icon=true (default)',
      'Omits the quote-mark when icon=false',
      'Renders the quote-mark with aria-hidden',
      'Forwards className and style',
      'Forwards ref to root element',
      'Spreads HTML attributes',
    ],
  },
} satisfies ComponentSpec;
