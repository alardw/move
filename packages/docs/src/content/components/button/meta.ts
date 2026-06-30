import type { ComponentMeta } from '../types';
import type { HighlightItem } from '../../../components/HighlightList';
import type { RelatedItem } from '../../../components/RelatedComponents';

const highlights: HighlightItem[] = [
  {
    icon: 'rabbit',
    text: 'Hover swells the surface a touch, press squeezes it back — a width-relative spring so a tiny icon button and a wide hero CTA feel the same in the hand.',
  },
  {
    icon: 'palette',
    text: 'Four variants out of the box — primary, secondary, ghost, danger — each driven by tokens, so a theme tweak is one CSS variable away from a redesign.',
  },
  {
    icon: 'shapes',
    text: 'Pass `asChild` and Button forgets it’s a button — wrap a Next.js `Link`, an anchor, or any custom element and keep all the styling and animation.',
  },
];

const related: RelatedItem[] = [
  {
    to: '/components/dropdown',
    name: 'Dropdown',
    reason: 'When the click should reveal a menu of choices instead of firing a single action.',
  },
  {
    to: '/components/icon-button',
    name: 'IconButton',
    reason: 'Square, label-less variant for toolbars and dense controls — same animation feel, less padding.',
  },
];

export const meta: ComponentMeta = {
  slug: 'button',
  synonyms: ['cta', 'action', 'submit', 'icon button', 'btn'],
  preview: { width: 'fit' },
  name: 'Button',
  tagline: 'The workhorse click target — variants, sizes, and a snappy hover/press animation that respects how wide the button actually is.',
  categories: ['actions', 'forms'],
  badges: [
    { icon: 'rabbit', label: 'Animated' },
  ],
  highlights,
  related,
  importCode: `import { Button } from 'move';`,
  keyboard: [
    { key: 'Tab', action: 'Moves focus to the button.' },
    { key: 'Enter / Space', action: 'Activates the button — same as a click.' },
  ],
  accessibilityLede:
    'It’s a real `<button>` until you opt out with `asChild`. That gets you the right semantics, the right keyboard, and the right disabled handling for free — we just bring the styling and the spring.',
};
