import type { ComponentMeta } from '../types';
import type { HighlightItem } from '../../../components/HighlightList';
import type { RelatedItem } from '../../../components/RelatedComponents';

const highlights: HighlightItem[] = [
  {
    icon: 'rectangle',
    text: 'Header, Body, Footer slots out of the box — plus FooterStart and FooterEnd for left/right action splits without nested flex wrappers.',
  },
  {
    icon: 'palette',
    text: 'Three variants — `default`, `elevated`, `ghost` — and three sizes that scale padding and the title-row type. All driven by component tokens you can override per-instance.',
  },
  {
    icon: 'columns-2',
    text: '`maxWidth` caps how wide the card can grow before its content wraps — useful inside flexible grids where you want a consistent, readable line length.',
  },
];

const related: RelatedItem[] = [
  {
    to: '/components/dialog',
    name: 'Dialog',
    reason: 'For modal cards that demand attention. Card is the in-page sibling.',
  },
  {
    to: '/components/list',
    name: 'List',
    reason: 'When the page is a sequence of similar items. List handles repetition; Card frames a single thing.',
  },
];

export const meta: ComponentMeta = {
  slug: 'card',
  preview: { bare: true },
  name: 'Card',
  tagline: 'A framed container for content that belongs together — with a Header for the title, a Body for the meat, and a Footer that already knows about start/end action splits.',
  badges: [
    { icon: 'rectangle', label: 'Layout' },
    { icon: 'boxes', label: 'Compound' },
  ],
  highlights,
  related,
  importCode: `import { Card } from 'move';`,
  keyboard: [
    { key: '—', action: 'Card is a presentational frame; interactivity belongs to the things you put inside it.' },
  ],
  accessibilityLede:
    'Card.Title renders as `<h3>` and Card.Description as `<p>` — they keep document structure even when the page is mostly cards. Make sure the heading hierarchy from the page wrapper still reads sensibly with these inside it.',
};
