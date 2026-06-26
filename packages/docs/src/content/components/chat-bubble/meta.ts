import type { ComponentMeta } from '../types';
import type { HighlightItem } from '../../../components/HighlightList';
import type { RelatedItem } from '../../../components/RelatedComponents';

const highlights: HighlightItem[] = [
  {
    icon: 'message-square',
    text: 'Avatar, container, and tail flip together — `placement="start"` for incoming messages, `"end"` for outgoing. The corner radii adapt so consecutive bubbles read like a thread.',
  },
  {
    icon: 'palette',
    text: 'Five semantic variants — neutral, primary, success, warning, error — plus the full Open Color palette through the `color` prop, for category- or persona-tinted bubbles.',
  },
  {
    icon: 'rabbit',
    text: 'Springs in on mount with a small offset — incoming and outgoing slide from their own side, so a chat thread settles in instead of all popping at once.',
  },
];

const related: RelatedItem[] = [
  {
    to: '/components/avatar',
    name: 'Avatar',
    reason: 'For the portrait that lands on each bubble. ChatBubble.Avatar wraps it with the right size and slot styling.',
  },
  {
    to: '/components/badge',
    name: 'Badge',
    reason: 'For role pills, "AI", "you", and other inline labels in the bubble header.',
  },
];

export const meta: ComponentMeta = {
  slug: 'chat-bubble',
  name: 'ChatBubble',
  tagline: 'A conversation bubble with avatar, tail, and placement-aware corners — for chat UIs, AI assistants, and anything that wants to look like a message thread.',
  categories: ['data-display'],
  badges: [
    { icon: 'boxes', label: 'Compound' },
    { icon: 'rabbit', label: 'Animated' },
  ],
  highlights,
  related,
  importCode: `import { ChatBubble } from 'move';`,
  keyboard: [
    { key: '—', action: 'ChatBubble is presentational; activate links and buttons inside it like normal.' },
  ],
  accessibilityLede:
    'ChatBubble is a `<div>` group, not a list — wrap a thread in `<ol>` (or a custom container with `role="log"`) so screen readers know it’s a sequence. Headers and footers stay readable as plain text inside the bubble.',
};
