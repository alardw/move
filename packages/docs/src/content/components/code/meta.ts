import type { ComponentMeta } from '../types';
import type { HighlightItem } from '../../../components/HighlightList';
import type { RelatedItem } from '../../../components/RelatedComponents';

const highlights: HighlightItem[] = [
  {
    icon: 'code',
    text: 'Inline by default — drop `<Code>foo</Code>` mid-sentence and it picks up tokens for type, weight, and a quiet background. Set `block` for fenced multi-line snippets.',
  },
  {
    icon: 'palette',
    text: 'Three variants — `subtle` (filled), `outline` (border), `ghost` (no chrome) — for the different surfaces a code chip sits on (cards, alerts, prose, tooltips).',
  },
  {
    icon: 'sparkles',
    text: 'Bring your own highlighter — wrap part of the tree in `CodeHighlighterProvider` with a function that returns highlighted ReactNode (or HTML), and every `<Code language="...">` inside it gets coloured.',
  },
];

const related: RelatedItem[] = [
  {
    to: '/components/prose',
    name: 'Prose',
    reason: 'For long-form documents that include inline `<Code>` and fenced blocks. Prose handles spacing and typography around them.',
  },
  {
    to: '/components/text',
    name: 'Text',
    reason: 'For non-code body copy with the same tokens for size, weight, and colour.',
  },
];

export const meta: ComponentMeta = {
  slug: 'code',
  synonyms: ['snippet', 'monospace', 'inline code', 'kbd', 'codeblock', 'syntax'],
  preview: { width: 'fit' },
  name: 'Code',
  tagline: 'Inline or block code with three variants and a pluggable syntax highlighter — no opinion on which library colours the tokens.',
  categories: ['typography'],
  badges: [
  ],
  highlights,
  related,
  importCode: `import { Code, CodeHighlighterProvider } from 'move';`,
  keyboard: [
    { key: '—', action: 'Code is presentational. If you need a copy button, wrap it in your own component.' },
  ],
  accessibilityLede:
    'Inline mode renders a `<code>`; block mode wraps a `<code>` in `<pre>` for native semantics. Screen readers will read the contents verbatim — keep snippets short, or pair with prose that explains what the snippet does.',
};
