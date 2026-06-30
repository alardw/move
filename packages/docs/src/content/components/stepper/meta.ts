import type { ComponentDocument } from '../types';
import type { HighlightItem } from '../../../components/HighlightList';
import type { RelatedItem } from '../../../components/RelatedComponents';

const highlights: HighlightItem[] = [
  {
    icon: 'list-ordered',
    text: 'Numbered or icon-based step indicators with completion state, optional click-to-jump, and connector lines that fill as you progress.',
  },
  {
    icon: 'columns-2',
    text: 'Horizontal or vertical orientation — same data, two layouts. Vertical reads as a checklist, horizontal as a wizard header.',
  },
];

const related: RelatedItem[] = [
  {
    to: '/components/timeline',
    name: 'Timeline',
    reason: 'For chronological events with timestamps. Stepper is for sequential progress in a flow.',
  },
];

export const meta: ComponentDocument = {
  slug: 'stepper',
  synonyms: ['wizard', 'steps', 'progress steps', 'step indicator'],
  name: 'Stepper',
  tagline: 'A progress indicator for multi-step flows — numbered steps, completion state, optional click-to-jump, horizontal or vertical.',
  categories: ['navigation'],
  badges: [
    { icon: 'boxes', label: 'Compound' },
  ],
  highlights,
  related,
  importCode: `import { Stepper } from 'move';`,
  keyboard: [
    { key: 'Tab', action: 'Moves focus between clickable steps.' },
    { key: 'Enter / Space', action: 'Activates a clickable step.' },
  ],
  accessibilityLede:
    'Root carries `role="list"`. Each step is a `role="listitem"`. The current step exposes `aria-current="step"`. Completed and disabled states are reflected on `data-` attributes for styling.',
};
