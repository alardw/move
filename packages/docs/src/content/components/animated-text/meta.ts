import type { ComponentMeta } from '../types';
import type { HighlightItem } from '../../../components/HighlightList';
import type { RelatedItem } from '../../../components/RelatedComponents';

const highlights: HighlightItem[] = [
  {
    icon: 'rabbit',
    text: 'Staggered entrance by `character`, `word`, or `line` — `fade`, `slideUp`, `blurUp`, or `scale`.',
  },
  {
    icon: 'type',
    text: 'Polymorphic `as` (`span`, `p`, `h1`–`h6`) and inherited typography — drop it into any heading or copy.',
  },
  {
    icon: 'eye',
    text: 'Accessible by default: screen readers get the whole sentence, and `prefers-reduced-motion` shows the text instantly with no animation.',
  },
];

const related: RelatedItem[] = [
  {
    to: '/components/text',
    name: 'Text',
    reason: 'The static body-copy primitive — reach for it when you don’t need motion.',
  },
  {
    to: '/components/heading',
    name: 'Heading',
    reason: 'Pair AnimatedText’s `as="h1"` with Heading’s scale for animated titles.',
  },
  {
    to: '/animation/patterns',
    name: 'Animation patterns',
    reason: 'How motion is composed across Move.',
  },
];

export const meta: ComponentMeta = {
  slug: 'animated-text',
  synonyms: ['split text', 'text reveal', 'animated heading', 'stagger text', 'text animation'],
  name: 'AnimatedText',
  tagline:
    'Reveal text with a staggered per-character, per-word, or per-line entrance — on mount, on scroll, or on hover.',
  categories: ['typography'],
  badges: [{ icon: 'rabbit', label: 'Animated' }],
  highlights,
  related,
  importCode: `import { AnimatedText } from 'move';`,
  keyboard: [{ key: '—', action: 'AnimatedText is presentational.' }],
  accessibilityLede:
    'Splitting runs with anime.js `splitText({ accessible: true })`: a visually-hidden copy of the full string is injected for assistive tech and every visible segment is `aria-hidden`, so screen readers read the sentence once rather than letter-by-letter. Under `prefers-reduced-motion: reduce` the text is never split or animated — it renders immediately in its final state.',
};
