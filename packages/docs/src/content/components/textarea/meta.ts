import type { ComponentDocument } from '../types';
import type { HighlightItem } from '../../../components/HighlightList';
import type { RelatedItem } from '../../../components/RelatedComponents';

const highlights: HighlightItem[] = [
  {
    icon: 'pen-line',
    text: 'A native `<textarea>` with the same variants and sizes as InputText, plus auto-resize for content-driven height.',
  },
  {
    icon: 'sliders-horizontal',
    text: 'Pass `autoResize` and the textarea grows with content up to a `maxRows` cap. Without it, classic `rows`-based fixed height.',
  },
];

const related: RelatedItem[] = [
  {
    to: '/components/input-text',
    name: 'InputText',
    reason: 'Single-line. Same look and tokens.',
  },
  {
    to: '/components/rich-text-editor',
    name: 'RichTextEditor',
    reason: 'For formatted text. Textarea is plain-text only.',
  },
  {
    to: '/systems/forms',
    name: 'Forms',
    reason:
      'How this joins a form — the name it submits under, and how validation and error text reach it.',
  },
];

export const meta: ComponentDocument = {
  slug: 'textarea',
  synonyms: ['multi-line input', 'comment box', 'text area', 'long text', 'multiline'],
  name: 'Textarea',
  tagline:
    'A native multi-line text field with variants, auto-resize, and the same tokens as InputText.',
  categories: ['forms'],
  badges: [],
  highlights,
  related,
  importCode: `import { Textarea } from 'move';`,
  keyboard: [
    { key: 'Tab', action: 'Moves focus to the textarea.' },
    { key: 'Type', action: 'Standard text input.' },
  ],
  accessibilityLede:
    'A real `<textarea>` — pair with `<Label htmlFor="…">` for accessible labelling.',
};
