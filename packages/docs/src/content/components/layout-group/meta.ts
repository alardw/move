import type { ComponentMeta } from '../types';
import type { HighlightItem } from '../../../components/HighlightList';
import type { RelatedItem } from '../../../components/RelatedComponents';

const highlights: HighlightItem[] = [
  {
    icon: 'wand-sparkles',
    text: 'Drop it around any list or grid and its children automatically FLIP to their new positions when the data changes — no per-item wiring, no keys beyond the React keys you already have.',
  },
  {
    icon: 'arrow-left-right',
    text: 'Move, enter, and exit in one: remaining items glide to their new spot, added items animate in, and removed items animate out — configurable per `enter`/`exit` (`fade`, `scale`, `fade-scale`, `none`).',
  },
  {
    icon: 'accessibility',
    text: 'Purely visual — transforms only, never moves focus or changes reading/tab order. Honours prefers-reduced-motion, with a `disabled` opt-out.',
  },
];

const related: RelatedItem[] = [
  {
    to: '/components/stack',
    name: 'Stack',
    reason: 'Compose with `asChild` to give the group its row/column layout and gap.',
  },
  {
    to: '/components/grid',
    name: 'Grid',
    reason: 'Wrap a Grid with `asChild` to animate a filtered or reordered card grid.',
  },
];

export const meta: ComponentMeta = {
  slug: 'layout-group',
  synonyms: [ 'flip', 'animated list', 'auto animate', 'reorder', 'layout transition', 'filter group', ],
  name: 'LayoutGroup',
  tagline:
    'Animate a list or grid as it changes — children glide to their new positions when you filter, sort, or reorder, and fade in or out as they are added or removed.',
  categories: ['layout'],
  badges: [
    { icon: 'sparkles', label: 'Animated' },
  ],
  highlights,
  related,
  importCode: `import { LayoutGroup } from 'move';`,
  keyboard: [
    { key: '—', action: 'LayoutGroup is presentational; keyboard semantics belong to the items you put inside.' },
  ],
  accessibilityLede:
    'LayoutGroup animates with CSS transforms only — it adds no roles or ARIA and never moves focus. Source order and tab order follow the real DOM. Under prefers-reduced-motion it applies the final layout instantly.',
};
