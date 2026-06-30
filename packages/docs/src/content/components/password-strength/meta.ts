import type { ComponentDocument } from '../types';
import type { HighlightItem } from '../../../components/HighlightList';
import type { RelatedItem } from '../../../components/RelatedComponents';

const highlights: HighlightItem[] = [
  {
    icon: 'shield-check',
    text: 'A segmented strength meter + label that reacts as the user types — pair it with `Password` (or any input) by feeding it the `value`.',
  },
  {
    icon: 'sliders-horizontal',
    text: 'Scoring-agnostic: a controlled `score`, your own `estimate(value)` (wrap zxcvbn, a server check…), or the built-in length + character-class heuristic. Nothing heavy is bundled.',
  },
  {
    icon: 'list-checks',
    text: '`PasswordStrength.Requirements` renders a check/x checklist you drive with `{ label, met }` — you own the rules. `levels` is configurable (default 4; set 5 for a zxcvbn 0–4 score).',
  },
];

const related: RelatedItem[] = [
  {
    to: '/components/password',
    name: 'Password',
    reason: 'The input this pairs with — feed its value to the meter.',
  },
  {
    to: '/components/progress-bar',
    name: 'ProgressBar',
    reason: 'For generic determinate progress, not password quality.',
  },
];

export const meta: ComponentDocument = {
  slug: 'password-strength',
  synonyms: [ 'password meter', 'strength meter', 'password strength bar', 'strength indicator', 'password quality', ],
  preview: { width: 'fit' },
  name: 'PasswordStrength',
  tagline:
    'A segmented password-strength meter — scoring-agnostic, configurable levels, with an optional requirements checklist.',
  categories: ['forms'],
  badges: [],
  highlights,
  related,
  importCode: `import { PasswordStrength, estimatePasswordStrength } from 'move';`,
  keyboard: [],
  accessibilityLede:
    'The strength label is an `aria-live="polite"` region, so a change is announced as “Password strength: Strong”. The segments are decorative — give the component an `id` and point your password field’s `aria-describedby` at it.',
};
