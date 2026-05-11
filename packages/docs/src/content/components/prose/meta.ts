import type { ComponentMeta } from '../types';
import type { HighlightItem } from '../../../components/HighlightList';
import type { RelatedItem } from '../../../components/RelatedComponents';

const highlights: HighlightItem[] = [
  {
    icon: 'book-open',
    text: 'A typography wrapper for long-form content — headings, paragraphs, lists, links, code, blockquotes all get sensible spacing and line-length out of the box.',
  },
  {
    icon: 'sliders-horizontal',
    text: 'Three sizes scale font size and line-height proportionally. `maxWidth` clamps the line length for readability.',
  },
];

const related: RelatedItem[] = [
  {
    to: '/components/heading',
    name: 'Heading',
    reason: 'For one-off headings outside long-form content.',
  },
  {
    to: '/components/text',
    name: 'Text',
    reason: 'For short body copy without the reading-page chrome.',
  },
];

export const meta: ComponentMeta = {
  slug: 'prose',
  name: 'Prose',
  tagline: 'Wrap long-form content for readable defaults — headings, paragraphs, lists, code, blockquotes, all spaced and styled with no extra typography work.',
  badges: [
    { icon: 'book-open', label: 'Typography' },
  ],
  highlights,
  related,
  importCode: `import { Prose } from 'move';`,
  keyboard: [
    { key: '—', action: 'Prose is presentational; keyboard semantics belong to the elements you put inside.' },
  ],
  accessibilityLede:
    'Prose styles native HTML — `<h2>`, `<p>`, `<ul>`, `<a>`, `<code>` — so the document outline and screen-reader semantics come from your markup. The wrapper just adds spacing and line-length.',
};
