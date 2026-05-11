import type { ComponentMeta } from '../types';
import type { HighlightItem } from '../../../components/HighlightList';
import type { RelatedItem } from '../../../components/RelatedComponents';

const highlights: HighlightItem[] = [
  {
    icon: 'image',
    text: 'Image with a Fallback that takes over when the URL is broken or still loading — initials, an icon, anything renderable. No half-loaded states bleeding through.',
  },
  {
    icon: 'rabbit',
    text: 'Springs in on mount; in a Group, each avatar staggers behind the previous so the row settles in instead of popping.',
  },
  {
    icon: 'palette',
    text: 'A `color` prop tints the fallback background and foreground using any Open Color palette — handy for hashing usernames to a stable colour.',
  },
];

const related: RelatedItem[] = [
  {
    to: '/components/badge',
    name: 'Badge',
    reason: 'For status pills next to an avatar — online dots, role labels, unread counts.',
  },
  {
    to: '/components/icon',
    name: 'Icon',
    reason: 'When the slot stands in for a person, but a glyph reads better than initials — a lock, a robot, a generic user silhouette.',
  },
];

export const meta: ComponentMeta = {
  slug: 'avatar',
  name: 'Avatar',
  tagline: 'A user portrait with a graceful fallback, five sizes, a tinted Group for stacks of teammates, and a tiny spring entrance to make it feel alive.',
  badges: [
    { icon: 'user', label: 'Display' },
    { icon: 'boxes', label: 'Compound' },
    { icon: 'rabbit', label: 'Animated' },
  ],
  highlights,
  related,
  importCode: `import { Avatar } from 'move';`,
  keyboard: [
    { key: '—', action: 'Avatar is a display element; activate-the-avatar behaviour belongs on whatever wraps it.' },
  ],
  accessibilityLede:
    'Image takes the alt text and the Fallback is announced as plain content. The component does not impose a role — wrap in a button or link if the avatar is interactive, and the right semantics flow from there.',
};
