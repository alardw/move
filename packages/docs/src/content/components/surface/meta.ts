import type { ComponentDocument } from '../types';
import type { HighlightItem } from '../../../components/HighlightList';
import type { RelatedItem } from '../../../components/RelatedComponents';

const highlights: HighlightItem[] = [
  {
    icon: 'layers',
    text: 'Takes the opposite shade of whatever it lands on, so nested panels stay visible against each other with nobody setting a colour. Four deep works the same as one.',
  },
  {
    icon: 'square',
    text: 'A ground and nothing else — no radius, no padding, no width or height. Put a `Stack` inside for spacing, or reach for `Card` when you want the conventions that come with it.',
  },
  {
    icon: 'maximize-2',
    text: 'Takes `fill="remaining"` and `flex`, so the ground reaches the edges of the region it is filling. A background that stops short of the edges is not a background.',
  },
  {
    icon: 'combine',
    text: '`asChild` paints an element that already exists instead of adding one — how Card, Dialog, Drawer, Popover, Sidebar, Select and Accordion take a ground onto their own root.',
  },
];

const related: RelatedItem[] = [
  {
    to: '/components/card',
    name: 'Card',
    reason:
      'A Surface with conventions on top — radius, padding, and Header/Title/Description/Footer. Reach for Card unless you specifically want the ground on its own.',
  },
  {
    to: '/systems/surfaces',
    name: 'Surfaces',
    reason:
      'How the alternation works, which components own a ground, and what the five relative tokens resolve to.',
  },
];

export const meta: ComponentDocument = {
  slug: 'surface',
  synonyms: ['ground', 'background', 'panel', 'region', 'sheet', 'elevation', 'tone', 'shade'],
  preview: { width: 'full' },
  name: 'Surface',
  tagline:
    'A ground that shades itself against whatever it sits on — the raw surface mechanism, with no other opinions attached.',
  categories: ['layout'],
  badges: [{ icon: 'layers', label: 'Owns a surface' }],
  highlights,
  related,
  importCode: `import { Surface } from 'move';`,
  keyboard: [
    { key: '—', action: 'Surface is a layout primitive with no interactive behavior of its own.' },
  ],
  accessibilityLede:
    'Surface is purely presentational — it adds no role, focus behaviour or ARIA. It paints a background and hands its tone to the components inside, which is a visual contract rather than a semantic one. Give the region its own semantics where it needs them: a `<section>` with a heading via `asChild`, for instance.',
};
