import type { ComponentDocument } from '../types';
import type { HighlightItem } from '../../../components/HighlightList';
import type { RelatedItem } from '../../../components/RelatedComponents';

const highlights: HighlightItem[] = [
  {
    icon: 'layout-dashboard',
    text: 'The end of a full-height layout: `Content` becomes the scrollport once every level above has passed a definite height down. See Systems → Layout.',
  },
  {
    icon: 'mouse',
    text: 'Custom-styled scrollbars on top of native overflow scrolling — scrollbars hide when idle, surface on hover, and respect each platform’s native scroll feel.',
  },
  {
    icon: 'sliders-horizontal',
    text: 'Built on Radix ScrollArea. Pass `type="auto"` for the default hide-when-idle, `type="always"` to keep them visible, `type="hover"` for hover-only.',
  },
];

const related: RelatedItem[] = [
  {
    to: '/components/carousel',
    name: 'Carousel',
    reason: 'For paginated horizontal scrolling. ScrollArea is for free-scroll regions.',
  },
];

export const meta: ComponentDocument = {
  slug: 'scroll-area',
  synonyms: ['scrollbar', 'overflow', 'scroll container', 'scrollable', 'scroller'],
  name: 'ScrollArea',
  tagline: 'A custom-scrollbar wrapper around native overflow — quiet by default, visible on hover, polished on every platform.',
  categories: ['layout'],
  badges: [
    { icon: 'boxes', label: 'Compound' },
  ],
  highlights,
  related,
  importCode: `import { ScrollArea } from 'move';`,
  keyboard: [
    { key: 'Tab / arrow keys / Page Up/Down', action: 'Standard scroll behaviour from the underlying native scroller.' },
  ],
  accessibilityLede:
    'ScrollArea uses native overflow scrolling underneath, so keyboard scrolling, screen-reader virtual cursor, and page-find behaviour all work as expected.',
};
