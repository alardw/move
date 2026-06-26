import type { ComponentMeta } from '../types';
import type { HighlightItem } from '../../../components/HighlightList';
import type { RelatedItem } from '../../../components/RelatedComponents';

const highlights: HighlightItem[] = [
  {
    icon: 'images',
    text: 'CSS Grid wrapper that arranges Images into a responsive column grid — pass `cols` for explicit count or `minColWidth` for auto-fit.',
  },
  {
    icon: 'rabbit',
    text: 'Children stagger in on mount — gallery feels alive without you wiring per-image animations.',
  },
  {
    icon: 'maximize-2',
    text: 'Token-driven `gap` and shared `radius` so you don’t set them per image. Drop in `<Image>` children, ImageGroup handles the layout.',
  },
];

const related: RelatedItem[] = [
  {
    to: '/components/image',
    name: 'Image',
    reason: 'For a single image with aspect ratio + fallback. ImageGroup is the gallery wrapper.',
  },
  {
    to: '/components/grid',
    name: 'Grid',
    reason: 'For non-image grids with span control. ImageGroup is the image-specific subset.',
  },
];

export const meta: ComponentMeta = {
  slug: 'image-group',
  name: 'ImageGroup',
  tagline: 'A responsive image grid with shared gap, radius, and a staggered entrance — drop Images in, get a tidy gallery out.',
  categories: ['media'],
  badges: [
    { icon: 'rabbit', label: 'Animated' },
  ],
  highlights,
  related,
  importCode: `import { ImageGroup, Image } from 'move';`,
  keyboard: [
    { key: '—', action: 'ImageGroup is presentational. Wrap children in interactive elements (Link, button) for keyboard access.' },
  ],
  accessibilityLede:
    'ImageGroup is a layout wrapper. Make sure each child Image has a real `alt` (or `alt=""` for decorative). The group itself adds no roles.',
};
