import type { ComponentDocument } from '../types';
import type { HighlightItem } from '../../../components/HighlightList';
import type { RelatedItem } from '../../../components/RelatedComponents';

const highlights: HighlightItem[] = [
  {
    icon: 'target',
    text: 'A drop target for anything a reorder cannot express: a position that stays visible while empty, a second list, a place to file something away.',
  },
  {
    icon: 'filter',
    text: 'A zone can refuse what it should not take, and shows the refusal while the pointer is still over it — so the answer comes before the release, not after.',
  },
  {
    icon: 'volume-2',
    text: 'One live region for the whole tree. Every move is announced by position, and the region is in the DOM before the first drag, so nothing is spoken into an element nobody is watching yet.',
  },
];

const related: RelatedItem[] = [
  {
    to: '/components/sortable',
    name: 'Sortable',
    reason: 'For rearranging a list, which is the common case and needs no zones of its own.',
  },
  {
    to: '/components/file-upload',
    name: 'FileUpload',
    reason:
      'For files arriving from outside the page, which is the browser’s own drop, not this one.',
  },
];

export const meta: ComponentDocument = {
  slug: 'drag',
  synonyms: ['drop zone', 'drop target', 'drag and drop', 'dnd', 'droppable'],
  preview: { width: 'full' },
  name: 'Drag',
  tagline:
    'Shared context and drop targets — the layer beneath Sortable, for moving a thing somewhere that is not a reorder.',
  categories: ['data-display'],
  badges: [],
  highlights,
  related,
  importCode: `import { Drag } from 'move';`,
  keyboard: [
    { key: 'Esc', action: 'Abandon a drag in progress' },
    {
      key: '—',
      action:
        'A zone has no keyboard interaction of its own. Where a drop is the only way to do something, give it a button or a menu that does the same thing.',
    },
  ],
  accessibilityLede:
    'Drag.Root renders one ARIA live region for everything below it, always present rather than mounted when a drag starts — an aria-live element added at the moment its text arrives has not been observed yet. Dragging is never the only path to an outcome: pair a zone with a control that achieves the same thing, the way Sortable pairs its handle with a menu.',
};
