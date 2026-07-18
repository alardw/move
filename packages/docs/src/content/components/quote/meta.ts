import type { ComponentDocument } from '../types';
import type { HighlightItem } from '../../../components/HighlightList';
import type { RelatedItem } from '../../../components/RelatedComponents';

const highlights: HighlightItem[] = [
  {
    icon: 'shapes',
    text: 'Semantic by construction — renders `<figure><blockquote><figcaption>` when you pass `attribution`, and a bare `<blockquote>` when you do not. The attribution sits in the `<figcaption>`, outside the quotation.',
  },
  {
    icon: 'type',
    text: 'Two registers — `block` for a quotation set in the reading flow, `pull` for a larger pull-quote that lifts a line out as a highlight.',
  },
  {
    icon: 'palette',
    text: 'Source-aware and themed — `cite` threads a URL onto the blockquote, and the left rule picks up the app accent (`--move-primary`) so quotations match the theme.',
  },
];

const related: RelatedItem[] = [
  {
    to: '/components/text',
    name: 'Text',
    reason: 'For the body copy around a quotation — the same tokens for size, weight, and colour.',
  },
  {
    to: '/components/prose',
    name: 'Prose',
    reason: 'For long-form documents; Prose styles the `<blockquote>` inside rendered markdown.',
  },
];

export const meta: ComponentDocument = {
  slug: 'quote',
  synonyms: ['blockquote', 'pullquote', 'quotation', 'cite', 'testimonial', 'epigraph'],
  preview: { width: 'md' },
  name: 'Quote',
  tagline:
    'An attributed quotation — a semantic figure / blockquote / figcaption with an optional cite, in a block or pull register.',
  categories: ['typography'],
  badges: [],
  highlights,
  related,
  importCode: `import { Quote } from 'move';`,
  keyboard: [{ key: '—', action: 'Quote is presentational.' }],
  accessibilityLede:
    'Renders native quotation semantics: a `<blockquote>` (carrying a `cite` URL when provided), wrapped in a `<figure>` with the attribution in a `<figcaption>` outside the quotation. The decorative quote-mark is `aria-hidden`, so a screen reader announces the quotation and its source without the ornament.',
};
