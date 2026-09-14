import type { ComponentDocument } from '../types';
import type { HighlightItem } from '../../../components/HighlightList';
import type { RelatedItem } from '../../../components/RelatedComponents';

const highlights: HighlightItem[] = [
  {
    icon: 'shapes',
    text: 'You write the `<svg>`; Illustration is the frame around it. An export or an SVGR import drops in whole — nothing unwraps it, and nothing rewrites the artwork.',
  },
  {
    icon: 'palette',
    text: 'Shapes take their colour from `illustration-*` classes, so a drawing follows the theme. Grounds are surface-relative: the same diagram reads correctly on a page, inside a Card and inside a Dialog.',
  },
  {
    icon: 'crop',
    text: '`size="auto"` renders the drawing at its own size and scales it down in a narrow parent. The named steps cap the width — the container can always overrule them.',
  },
];

const related: RelatedItem[] = [
  {
    to: '/components/image',
    name: 'Image',
    reason:
      'For artwork that should keep its own colours — logos, photos, screenshots. An SVG behind `<img>` is a separate document, so the theme cannot reach into it. Illustration is for drawings that must change with the theme.',
  },
  {
    to: '/components/empty-state',
    name: 'EmptyState',
    reason: 'Pairs a drawing with a heading and an action for an empty list or a zero result.',
  },
  {
    to: '/animation/motions-and-sequences',
    name: 'Motions & sequences',
    reason: 'The trigger and stagger vocabulary the `animations` prop takes.',
  },
];

export const meta: ComponentDocument = {
  slug: 'illustration',
  synonyms: ['svg', 'diagram', 'drawing', 'figure', 'graphic', 'artwork'],
  name: 'Illustration',
  tagline:
    'A themeable drawing: one SVG, named for assistive tech, painted from tokens, and sized to its container.',
  categories: ['media'],
  badges: [{ icon: 'rabbit', label: 'Animated' }],
  highlights,
  related,
  importCode: `import { Illustration } from 'move';`,
  keyboard: [{ key: '—', action: 'Illustration is presentational.' }],
  accessibilityLede:
    '`title` is required and becomes the accessible name. It sits on a wrapper carrying `role="img"`, which collapses the drawing into a single node so a screen reader says the name instead of walking every path — and which stays off the `<figure>`, so a caption is still announced. `desc` adds a longer description through `aria-describedby`, rendered for screen readers only.',
};
