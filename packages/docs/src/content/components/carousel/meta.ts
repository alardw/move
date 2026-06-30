import type { ComponentDocument } from '../types';
import type { HighlightItem } from '../../../components/HighlightList';
import type { RelatedItem } from '../../../components/RelatedComponents';

const highlights: HighlightItem[] = [
  {
    icon: 'move-horizontal',
    text: 'Native scroll-snap on the viewport — touch flicks, mouse drag, and keyboard arrows all land on whole slides without a custom physics engine fighting the browser.',
  },
  {
    icon: 'mouse-pointer-click',
    text: 'Built-in `showTriggers` and `showIndicators` give you prev/next buttons and dots in one prop each — or compose your own with `Carousel.PrevTrigger`, `IndicatorGroup`, etc. for a custom UI.',
  },
  {
    icon: 'rabbit',
    text: 'Autoplay, loop, multi-slide views, vertical orientation — toggleable as plain props. The whole interaction stays one component.',
  },
];

const related: RelatedItem[] = [
  {
    to: '/components/scroll-area',
    name: 'ScrollArea',
    reason: 'For free-scroll regions without snap behaviour. Carousel is the disciplined, page-by-page sibling.',
  },
  {
    to: '/components/tabs',
    name: 'Tabs',
    reason: 'When you’re switching between independent panels rather than browsing a sequence.',
  },
];

export const meta: ComponentDocument = {
  slug: 'carousel',
  synonyms: ['slider', 'gallery', 'slideshow', 'image rotator', 'swiper'],
  name: 'Carousel',
  tagline: 'A scroll-snap carousel with drag, autoplay, loops, and built-in triggers — composable, but you can ship a working one with two props.',
  categories: ['media'],
  badges: [
    { icon: 'boxes', label: 'Compound' },
    { icon: 'rabbit', label: 'Animated' },
  ],
  highlights,
  related,
  importCode: `import { Carousel } from 'move';`,
  keyboard: [
    { key: 'Arrow Left / Right', action: 'Moves to the previous / next slide (horizontal orientation).' },
    { key: 'Arrow Up / Down', action: 'Moves to the previous / next slide (vertical orientation).' },
    { key: 'Home / End', action: 'Jumps to the first / last slide.' },
    { key: 'Tab', action: 'Cycles focus through interactive elements inside slides, then triggers, then indicators.' },
  ],
  accessibilityLede:
    'Root carries `role="region"` and `aria-roledescription="carousel"`. Indicator dots render as a `tablist`, slides as `tabpanel`s — so screen-reader users can browse with the same shortcuts as a Tabs widget.',
};
