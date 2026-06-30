import type { ComponentMeta } from '../types';
import type { HighlightItem } from '../../../components/HighlightList';
import type { RelatedItem } from '../../../components/RelatedComponents';

const highlights: HighlightItem[] = [
  {
    icon: 'image',
    text: 'A native `<img>` wrapped in a container that handles object-fit, aspect ratio, radius, and a fallback when the image errors out.',
  },
  {
    icon: 'crop',
    text: '`aspectRatio` clamps the box (think `16/9`, `1`, `4/3`) so layouts don’t reflow when the image arrives. `objectFit` and `objectPosition` control how the image fills it.',
  },
  {
    icon: 'shield',
    text: 'On error: shows `fallbackSrc` if provided, else a tokenised placeholder slot. Pass children to overlay actions on hover (favourite, share, delete).',
  },
];

const related: RelatedItem[] = [
  {
    to: '/components/avatar',
    name: 'Avatar',
    reason: 'For profile pictures with a circular crop and fallback initials. Image is the rectangular general-purpose version.',
  },
  {
    to: '/components/grid',
    name: 'Grid',
    reason: 'For galleries: `<Grid stagger>` with `Image` children (use `backdrop` to fill mixed aspect ratios).',
  },
];

export const meta: ComponentMeta = {
  slug: 'image',
  synonyms: ['picture', 'photo', 'media', 'img'],
  name: 'Image',
  tagline: 'A wrapped image with aspect ratio, object-fit, radius, fallback, a blurred backdrop fill, and an overlay slot.',
  categories: ['media'],
  badges: [
  ],
  highlights,
  related,
  importCode: `import { Image } from 'move';`,
  keyboard: [
    { key: 'Tab', action: 'Moves focus to the image when `interactive` (or `onClick`) is set.' },
    { key: 'Enter / Space', action: 'Activates the image — same as a click. Only when `interactive` is set.' },
  ],
  accessibilityLede:
    'Always pass `alt` — empty string for decorative, descriptive otherwise. With `interactive` set, the wrapper becomes `role="button"` with `tabIndex={0}` and full keyboard activation. The fallback slot inherits `aria-hidden` since it’s a visual stand-in.',
};
