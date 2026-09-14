import type { ComponentDocument } from '../types';
import type { HighlightItem } from '../../../components/HighlightList';
import type { RelatedItem } from '../../../components/RelatedComponents';

const highlights: HighlightItem[] = [
  {
    icon: 'shapes',
    text: 'The `<form>` element, with `preventDefault` applied and the submitted values handed to you — collected by the browser from the `name` on each control, so the form never inspects its own children.',
  },
  {
    icon: 'shield',
    text: '`noValidate` keeps the browser’s validation popups away, and `required` still works: the form asks `checkValidity()` before calling `onSubmit`, so native constraints hold while your own messages do the talking.',
  },
  {
    icon: 'eye',
    text: 'Errors go in keyed by field name and each `FormField` takes its own. Nothing to thread through the tree, and a field that sets `invalid` itself is never overruled.',
  },
];

const related: RelatedItem[] = [
  {
    to: '/components/form-field',
    name: 'FormField',
    reason:
      'One row: a label, a control and a message. Give it a `name` and it picks its error out of the form’s map.',
  },
  {
    to: '/components/button',
    name: 'Button',
    reason: 'What goes in `Form.Actions` — a submit, and usually a way out.',
  },
  {
    to: '/systems/forms',
    name: 'Forms',
    reason: 'How labels, controls and messages fit together across the library.',
  },
];

export const meta: ComponentDocument = {
  slug: 'form',
  synonyms: ['submit', 'validation', 'fields', 'errors'],
  name: 'Form',
  tagline:
    'The form element, with submission handled and errors handed down — it distributes, it does not validate.',
  categories: ['forms'],
  badges: [{ icon: 'boxes', label: 'Compound' }],
  highlights,
  related,
  importCode: `import { Form } from 'move';`,
  keyboard: [
    {
      key: 'Enter',
      action: 'Submits from inside a text field, as a native form does.',
    },
  ],
  accessibilityLede:
    'Each `FormField` already wires its own label, `aria-invalid` and `aria-describedby`; the form adds no ARIA of its own. Native constraints keep working — `noValidate` suppresses the browser’s popups, not its validation, and the form checks validity before it submits. An error summary and focus management on a failed submit are deliberately left to you: both need to know every field, and this component is built not to.',
};
