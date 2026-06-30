import type { ComponentDocument } from '../types';
import type { HighlightItem } from '../../../components/HighlightList';
import type { RelatedItem } from '../../../components/RelatedComponents';

const highlights: HighlightItem[] = [
  {
    icon: 'minus',
    text: 'Plain horizontal or vertical line by default — solid, dashed, or dotted, in three sizes that map to token-driven thickness.',
  },
  {
    icon: 'type',
    text: 'Drop a string (or any node) as children and the line becomes a labelled separator — useful for "Or sign in with…" rows and section headings inside a card.',
  },
  {
    icon: 'eye',
    text: 'Renders as `role="separator"` with `aria-orientation`, so screen-reader users hear a real section break instead of an unannounced visual line.',
  },
];

const related: RelatedItem[] = [
  {
    to: '/components/stack',
    name: 'Stack',
    reason: 'For laying out items with consistent gap. A Divider often sits inside a Stack to mark a stronger break between sections.',
  },
  {
    to: '/components/heading',
    name: 'Heading',
    reason: 'When the section break needs a real heading rather than just a labelled line.',
  },
];

export const meta: ComponentDocument = {
  slug: 'divider',
  synonyms: ['separator', 'rule', 'hr', 'line'],
  name: 'Divider',
  tagline: 'A simple separator with optional inline content — horizontal or vertical, solid, dashed, or dotted, with the line drawn entirely from CSS pseudo-elements.',
  categories: ['layout'],
  badges: [
  ],
  highlights,
  related,
  importCode: `import { Divider } from 'move';`,
  keyboard: [
    { key: '—', action: 'Divider is presentational; nothing to focus or activate.' },
  ],
  accessibilityLede:
    'Renders with `role="separator"` and `aria-orientation` matching the prop. The label, when present, is regular inline content — readable by assistive tech without any extra ARIA wrangling.',
};
