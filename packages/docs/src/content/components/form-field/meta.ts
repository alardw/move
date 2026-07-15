import type { ComponentDocument } from '../types';
import type { HighlightItem } from '../../../components/HighlightList';
import type { RelatedItem } from '../../../components/RelatedComponents';

const highlights: HighlightItem[] = [
  {
    icon: 'link',
    text: 'Ties the label to the control for you — a real `<label>` whose `htmlFor` matches the field, so clicking the label focuses it and a screen reader reads the name. You write the text; it wires the association.',
  },
  {
    icon: 'octagon-alert',
    text: 'Mark the field `invalid` and the Description becomes the error — announced to assistive tech and linked to the control via `aria-describedby`. No ids to manage; FormField generates and threads them.',
  },
  {
    icon: 'layout',
    text: 'Lays label, control, and description out responsively — label beside the field on wide containers, stacked on narrow ones, no media queries on your end.',
  },
];

const related: RelatedItem[] = [
  {
    to: '/components/label',
    name: 'Label',
    reason: 'A standalone `<label>` for form controls outside a FormField. Inside FormField, the Label slot ties itself to the control automatically.',
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
  tagline: 'The accessible container for a form field — ties the label to the control, wires the error, and generates the ids, so a labelled, screen-reader-friendly field is just a Label, a control, and a Description.',
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
    'FormField does the wiring: the Label becomes a real `<label>` tied to the control, `invalid` surfaces as `aria-invalid`, and the Description is linked as the control’s error and announced. Put the id on FormField.Root (or let it generate one) — never repeat it on the control.',
};
