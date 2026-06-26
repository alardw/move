import type { ComponentMeta } from '../types';
import type { HighlightItem } from '../../../components/HighlightList';
import type { RelatedItem } from '../../../components/RelatedComponents';

const highlights: HighlightItem[] = [
  {
    icon: 'info',
    text: 'Four variants — info, success, warning, danger — each with the right colour and the right default icon, so a one-prop alert reads correctly without you picking glyphs.',
  },
  {
    icon: 'rabbit',
    text: 'Slides down on mount and slides back up on dismiss — with the close action waiting for the exit animation before it actually unmounts.',
  },
  {
    icon: 'eye',
    text: 'Renders with `role="alert"` so screen readers announce it as soon as it appears. The close button gets a real `aria-label` and a focusable hit target.',
  },
];

const related: RelatedItem[] = [
  {
    to: '/components/toast',
    name: 'Toast',
    reason: 'For transient notifications that auto-dismiss. Alert is for status that lives in the page until the user acknowledges it.',
  },
  {
    to: '/components/dialog',
    name: 'Dialog',
    reason: 'When the message blocks the flow and demands a choice. Alert is the lighter, in-page sibling.',
  },
];

export const meta: ComponentMeta = {
  slug: 'alert',
  preview: { width: 'md' },
  name: 'Alert',
  tagline: 'A status banner with a sensible default icon, a real ARIA contract, and an exit animation that doesn’t leave a hole in the layout.',
  badges: [
    { icon: 'info', label: 'Display' },
    { icon: 'rabbit', label: 'Animated' },
  ],
  highlights,
  related,
  importCode: `import { Alert } from 'move';`,
  keyboard: [
    { key: 'Tab', action: 'Moves focus to the close button (when `closable`).' },
    { key: 'Enter / Space', action: 'Activates the close button — fires the exit animation, then `onClose`.' },
  ],
  accessibilityLede:
    'Root carries `role="alert"`, so assistive tech announces the message the moment it mounts. The icon is `aria-hidden`, the close button is a real button with an `aria-label`, and exit happens after the animation — not in the middle of an SR announcement.',
};
