import type { ComponentMeta } from '../types';
import type { HighlightItem } from '../../../components/HighlightList';
import type { RelatedItem } from '../../../components/RelatedComponents';

const highlights: HighlightItem[] = [
  {
    icon: 'link',
    text: 'A real `<a>` with three variants (default / muted / subtle), three underline modes (always / hover / none), and optional size override.',
  },
  {
    icon: 'external-link',
    text: '`external` opens in a new tab with `rel="noopener noreferrer"` and adds an external-link affordance — the right thing without you remembering to do it.',
  },
  {
    icon: 'shapes',
    text: 'Pass `asChild` to wrap a router Link (Next.js, React Router) and the styling, semantics, and external behaviour follow.',
  },
];

const related: RelatedItem[] = [
  {
    to: '/components/button',
    name: 'Button',
    reason: 'For actions. Use Link for navigation, Button for submit / open / save / etc.',
  },
];

export const meta: ComponentMeta = {
  slug: 'link',
  preview: { layout: 'fit' },
  name: 'Link',
  tagline: 'An inline `<a>` with variants, underline control, and a real external-link contract — `asChild` lets you wrap your router’s Link without losing styling.',
  badges: [
    { icon: 'link', label: 'Navigation' },
  ],
  highlights,
  related,
  importCode: `import { Link } from 'move';`,
  keyboard: [
    { key: 'Tab', action: 'Moves focus to the link.' },
    { key: 'Enter', action: 'Activates the link.' },
  ],
  accessibilityLede:
    'A real `<a>` element. External links get `target="_blank" rel="noopener noreferrer"` automatically and a visible "opens in new window" affordance.',
};
