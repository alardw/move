// Code.spec.ts — Component specification
// specHash: PLACEHOLDER

export const spec = {
  schemaVersion: 6 as const,
  name: 'Code',
  componentClass: 'presentational' as const,
  category: 'core',
  description: 'Inline or block code element with variant styling and optional syntax highlighting via CodeHighlighterProvider',

  compound: false,
  rootElement: 'code',
  slots: [
    { name: 'root', element: 'code', description: 'Code element (inline <code> or block <pre> based on block prop)' },
  ],

  props: [
    { name: 'variant', type: "'subtle' | 'outline' | 'ghost'", default: "'subtle'", moveSpecific: true, description: 'Visual style variant' },
    { name: 'size', type: "'xs' | 'sm' | 'base' | 'lg'", default: "'sm'", moveSpecific: true, description: 'Font size' },
    { name: 'block', type: 'boolean', default: 'false', moveSpecific: true, description: 'Render as block <pre> instead of inline <code>' },
    { name: 'language', type: 'string', moveSpecific: true, description: 'Language for syntax highlighting (requires CodeHighlighterProvider)' },
    { name: 'className', type: 'string', moveSpecific: false, description: 'Additional CSS class' },
    { name: 'style', type: 'React.CSSProperties', moveSpecific: false, description: 'Inline styles' },
    { name: 'children', type: 'React.ReactNode', moveSpecific: false, description: 'Code text content' },
  ],

  anatomy: {
    slot: 'root',
    dataAttributes: ['data-variant', 'data-size', 'data-block', 'data-language'],
  },

  controlled: null,
  keyboard: null,
  focus: null,
  formType: null,
  asChild: false,

  animations: [],

  tokens: [
    { name: '--move-code-bg-subtle', value: 'var(--move-bg-muted)', description: 'Background for subtle variant' },
    { name: '--move-code-fg', value: 'var(--move-fg-base)', description: 'Code text color' },
    { name: '--move-code-border', value: 'var(--move-border-base)', description: 'Border color for outline variant' },
    { name: '--move-code-radius', value: 'var(--move-rounded-md)', description: 'Border radius' },
  ],

  variants: {
    variant: ['subtle', 'outline', 'ghost'],
  },
  sizes: ['xs', 'sm', 'base', 'lg'],

  labels: [],
  childrenKind: 'text' as const,

  renderContracts: [
    { id: 'block-element-switch', description: 'When block=true renders as <pre> wrapping a <code>; when block=false renders as inline <code>' },
    { id: 'syntax-highlighting', description: 'When CodeHighlighterProvider is present and language is set, highlights code via context-provided highlighter function (supports sync and async)' },
    { id: 'data-block-boolean', description: 'data-block is set as empty string attribute when block=true, omitted when false' },
    { id: 'data-language-conditional', description: 'data-language is only set when language prop is provided' },
  ],

  companions: [
    {
      name: 'CodeHighlighterProvider',
      kind: 'provider' as const,
      description: 'Context provider that supplies a syntax highlighter function to all Code components in the tree',
      props: [
        { name: 'highlighter', type: '(code: string, language: string) => ReactNode | string | Promise<ReactNode | string>', description: 'Highlighter function (user-supplied, library-agnostic)' },
        { name: 'children', type: 'React.ReactNode', description: 'Children' },
      ],
    },
  ],

  hasHook: false,
  engineImports: ['withMoveComponent'],
  animationImports: [],
  componentDeps: [],

  testing: {
    behaviors: [
      'Renders as inline <code> element by default',
      'Renders as <pre> wrapping <code> when block=true',
      'Renders children as text content',
      'Applies variant via data-variant attribute',
      'Applies size via data-size attribute',
      'Defaults to variant=subtle',
      'Defaults to size=sm',
      'Sets data-block attribute when block=true',
      'Sets data-language attribute when language is provided',
      'Omits data-block when block=false',
      'Omits data-language when language is not provided',
      'Forwards className and style',
      'Forwards ref to root element',
      'Spreads HTML attributes',
    ],
    highlighting: [
      'Renders plain text when no CodeHighlighterProvider is present',
      'Highlights code when CodeHighlighterProvider and language are set',
      'Handles async highlighter functions',
      'Falls back to plain children when highlighter returns null',
    ],
  },

  notes: [
    'Uses monospace font via var(--move-font-code)',
    'Block mode uses overflow-x: auto and white-space: pre for horizontal scrolling',
    'Outline variant renders transparent background with 1px solid border',
    'Ghost variant renders fully transparent (no background, no border)',
  ],

  defaultReview: {
    status: 'approved' as const,
    decisionSource: 'rule-based' as const,
    overrides: {},
  },
};
