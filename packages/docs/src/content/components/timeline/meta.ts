import type { ComponentMeta } from '../types';
import type { HighlightItem } from '../../../components/HighlightList';
import type { RelatedItem } from '../../../components/RelatedComponents';

const highlights: HighlightItem[] = [
  {
    icon: 'git-commit-vertical',
    text: 'Vertical timeline with bullets, connector lines, and per-item title + content. Drives chronological views: changelogs, activity feeds, audit logs.',
  },
  {
    icon: 'palette',
    text: '`color` per item tints the bullet from the Open Color palette — useful for category-coded events. Pass children inside the bullet for icons or numbers.',
  },
  {
    icon: 'rabbit',
    text: 'Items stagger in on mount, so a long timeline reads as a sequence rather than appearing all at once.',
  },
];

const related: RelatedItem[] = [
  {
    to: '/components/stepper',
    name: 'Stepper',
    reason: 'For sequential progress in a flow. Timeline is for chronological history.',
  },
];

export const meta: ComponentMeta = {
  slug: 'timeline',
  synonyms: ['log', 'history', 'feed', 'activity feed', 'steps'],
  preview: { sample: 'steps' },
  name: 'Timeline',
  tagline: 'A vertical timeline for chronological history — bullets, connector lines, per-item colour, and a staggered entrance.',
  categories: ['data-display'],
  badges: [
    { icon: 'boxes', label: 'Compound' },
    { icon: 'rabbit', label: 'Animated' },
  ],
  highlights,
  related,
  importCode: `import { Timeline } from 'move';`,
  keyboard: [
    { key: '—', action: 'Timeline is presentational. Wrap items in Link or Button for keyboard access.' },
  ],
  accessibilityLede:
    'Timeline renders a `<div>` group; the bullets are decorative. Wrap items in heading elements (Heading inside Timeline.Title) so document outline stays correct.',
};
