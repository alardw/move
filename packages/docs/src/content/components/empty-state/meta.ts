import type { ComponentMeta } from '../types';
import type { HighlightItem } from '../../../components/HighlightList';
import type { RelatedItem } from '../../../components/RelatedComponents';

const highlights: HighlightItem[] = [
  {
    icon: 'inbox',
    text: 'A centered placeholder for "nothing here yet" states — icon, title, description, optional action button. All slots are optional.',
  },
  {
    icon: 'maximize-2',
    text: 'Three sizes — sm for table cells, md for empty page sections, lg for full-page nudges.',
  },
  {
    icon: 'eye',
    text: 'Useful for encouraging the next action — pair the description with a Button or Link via the `action` prop.',
  },
];

const related: RelatedItem[] = [
  {
    to: '/components/skeleton',
    name: 'Skeleton',
    reason: 'For "loading" placeholders. EmptyState is for "loaded but empty."',
  },
  {
    to: '/components/alert',
    name: 'Alert',
    reason: 'When the empty state needs to communicate a real status (failed query, permission denied) rather than just emptiness.',
  },
];

export const meta: ComponentMeta = {
  slug: 'empty-state',
  preview: { width: 'sm' },
  name: 'EmptyState',
  tagline: 'A friendly "nothing here yet" placeholder — icon, title, description, optional call-to-action, all centered and tokenised.',
  badges: [
    { icon: 'inbox', label: 'Display' },
  ],
  highlights,
  related,
  importCode: `import { EmptyState } from 'move';`,
  keyboard: [
    { key: '—', action: 'EmptyState is presentational; the `action` slot carries any interactivity.' },
  ],
  accessibilityLede:
    'EmptyState is a structured `<div>` group. Headings inside the title slot stay in document outline if you choose a heading element — pass `<Heading level={3}>…</Heading>` in the title for proper screen-reader semantics on a section-level empty state.',
};
