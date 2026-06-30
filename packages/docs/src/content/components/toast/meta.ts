import type { ComponentDocument } from '../types';
import type { HighlightItem } from '../../../components/HighlightList';
import type { RelatedItem } from '../../../components/RelatedComponents';

const highlights: HighlightItem[] = [
  {
    icon: 'message-circle',
    text: 'Imperative API — call `toast.success("Saved")` from anywhere; the viewport finds itself. Variants for info, success, warning, error.',
  },
  {
    icon: 'rabbit',
    text: 'Auto-dismiss with a progress bar; pause on hover; group by position (top-right by default). Enter and exit animations choreographed by the toast manager.',
  },
];

const related: RelatedItem[] = [
  {
    to: '/components/alert',
    name: 'Alert',
    reason: 'For in-page status banners that stay until dismissed.',
  },
];

export const meta: ComponentDocument = {
  slug: 'toast',
  synonyms: ['notification', 'snackbar', 'flash message', 'alert toast'],
  name: 'Toast',
  tagline: 'A notification toast system with an imperative API, variant icons, auto-dismiss progress, and grouped positioning.',
  categories: ['feedback'],
  badges: [
    { icon: 'rabbit', label: 'Animated' },
  ],
  highlights,
  related,
  importCode: `import { Toast, toast } from 'move';`,
  keyboard: [
    { key: 'Tab', action: 'Moves focus through the toast stack — each toast is reachable.' },
    { key: 'Escape', action: 'Dismisses the focused toast.' },
  ],
  accessibilityLede:
    'Toast viewport renders with `role="region"` and an accessible name. Each toast is `role="status"` (info/success) or `role="alert"` (warning/error) so urgency is announced correctly.',
};
