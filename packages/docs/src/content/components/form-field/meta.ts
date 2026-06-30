import type { ComponentDocument } from '../types';
import type { HighlightItem } from '../../../components/HighlightList';
import type { RelatedItem } from '../../../components/RelatedComponents';

const highlights: HighlightItem[] = [
  {
    icon: 'layout',
    text: 'A responsive grid wrapper — Label sits beside the field on wide containers, stacks above on narrow ones, with no media queries on your end.',
  },
  {
    icon: 'list',
    text: 'Slots: Label, Field, Description. Drop the description into an inline error by passing `error` — the colour switches to error red and the text reads as a real form error to assistive tech.',
  },
  {
    icon: 'sliders-horizontal',
    text: 'Tune the label column width per-instance via `labelWidth` — useful when one form has long field labels and another doesn’t.',
  },
];

const related: RelatedItem[] = [
  {
    to: '/components/label',
    name: 'Label',
    reason: 'Use inside FormField.Label for accessible field labelling. FormField only handles layout — Label handles `htmlFor`.',
  },
  {
    to: '/components/input-text',
    name: 'InputText',
    reason: 'The most common control to drop inside FormField.Field. Pairs the same way with Textarea, Select, Checkbox, and friends.',
  },
];

export const meta: ComponentDocument = {
  slug: 'form-field',
  synonyms: ['form row', 'field group', 'label group', 'form control', 'input wrapper'],
  name: 'FormField',
  tagline: 'A compound layout wrapper for form fields — handles label / control / description placement so your forms align without manual flex tweaks.',
  categories: ['forms'],
  badges: [
    { icon: 'boxes', label: 'Compound' },
  ],
  highlights,
  related,
  importCode: `import { FormField } from 'move';`,
  keyboard: [
    { key: '—', action: 'FormField is a layout wrapper. Keyboard behaviour comes from the control inside Field.' },
  ],
  accessibilityLede:
    'FormField provides only layout. Use a real `<Label htmlFor="id">` inside FormField.Label, an `<input id="id">` inside FormField.Field, and the screen-reader association is already there.',
};
