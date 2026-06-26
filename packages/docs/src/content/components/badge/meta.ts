import type { ComponentMeta } from '../types';
import type { HighlightItem } from '../../../components/HighlightList';
import type { RelatedItem } from '../../../components/RelatedComponents';

const highlights: HighlightItem[] = [
  {
    icon: 'palette',
    text: 'Five visual treatments — solid, soft, surface, outline, dot — paired with a full Open Color palette so a Badge can be loud, quiet, or just a coloured dot, in any hue.',
  },
  {
    icon: 'sliders-horizontal',
    text: 'Semantic shortcuts — `success`, `warning`, `danger`, `info`, `primary`, `default` — map to sensible palettes, but you can drop in any palette name when the meaning is "just colour, please."',
  },
  {
    icon: 'maximize-2',
    text: 'Three sizes that fit the typography around them — `sm` for inline tags, `md` for cards and rows, `lg` for hero placement next to titles.',
  },
];

const related: RelatedItem[] = [
  {
    to: '/components/alert',
    name: 'Alert',
    reason: 'When the message wants its own row and a real icon. Badge is the inline, glanceable cousin.',
  },
  {
    to: '/components/avatar',
    name: 'Avatar',
    reason: 'For the person attached to the status — Avatar carries the face, Badge the label next to it.',
  },
];

export const meta: ComponentMeta = {
  slug: 'badge',
  preview: { width: 'fit' },
  name: 'Badge',
  tagline: 'A small, glanceable label — pill-shaped, opinionated about colour, and quiet enough to live next to text without shouting over it.',
  badges: [
    { icon: 'tag', label: 'Display' },
  ],
  highlights,
  related,
  importCode: `import { Badge } from 'move';`,
  keyboard: [
    { key: '—', action: 'Badge is a display element. Wrap in a button or link if it needs to be interactive.' },
  ],
  accessibilityLede:
    'Badge is rendered as a `<span>` and inherits its semantics from context. When it carries meaning (e.g. "3 unread"), make sure the count is in the visible text — colour alone is never the only signal.',
};
