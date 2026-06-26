import type { ComponentMeta } from '../types';
import type { HighlightItem } from '../../../components/HighlightList';
import type { RelatedItem } from '../../../components/RelatedComponents';

const highlights: HighlightItem[] = [
  {
    icon: 'pen-line',
    text: 'Common formatting — bold, italic, headings, lists, links, code blocks, blockquotes — through a tokenised toolbar that matches the rest of Move.',
  },
  {
    icon: 'shapes',
    text: 'Toolbar is configurable per-instance: pass `toolbar` an array of action ids (or `false` to hide it entirely) to scope the editor to a subset of actions.',
  },
];

const related: RelatedItem[] = [
  {
    to: '/components/textarea',
    name: 'Textarea',
    reason: 'For plain multi-line input. RichTextEditor is the formatted-text sibling.',
  },
];

export const meta: ComponentMeta = {
  slug: 'rich-text-editor',
  name: 'RichTextEditor',
  tagline: 'A rich-text editing surface with a configurable, tokenised toolbar and a plain-text paste fallback.',
  categories: ['forms'],
  badges: [
  ],
  highlights,
  related,
  importCode: `import { RichTextEditor } from 'move';`,
  keyboard: [
    { key: 'Cmd/Ctrl + B', action: 'Bold.' },
    { key: 'Cmd/Ctrl + I', action: 'Italic.' },
    { key: 'Cmd/Ctrl + K', action: 'Insert link.' },
    { key: 'Tab', action: 'Indent (in lists).' },
    { key: 'Shift + Tab', action: 'Outdent (in lists).' },
  ],
  accessibilityLede:
    'Editing surface uses native contenteditable plumbing. Toolbar buttons have `aria-pressed` for active formats. Pair with a labelled wrapper (FormField or Label) to give the editor an accessible name.',
};
