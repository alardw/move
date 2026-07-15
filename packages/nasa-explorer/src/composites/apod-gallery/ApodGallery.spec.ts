// ApodGallery.spec.ts — the SLIM CompositeSpec: ItemGallery resolved for NASA APOD.
//
// Holds only the SOURCE — fromPattern + adapter + EVERY axis (explicit) + labels. Composition,
// behaviors, itemShape, the .tsx and tests are all DERIVED (resolve/generate) from this × the
// item-gallery pattern × the apod-gallery adapter — never stored here.
//
// useCase: discover (primary) + consume (blend). The blend surfaces at the TILE (ApodCard):
// label → rich, surface → card. Gallery axes stay at the discover preset except where a data-rule
// or a coherence law overrides:
//   • order    = time      — data-rule: the adapter's sortKey is a date
//   • selection = none     — data-rule: APOD is read-only public data, no bulk ops
//   • pagination = see-more — discover's `infinite` reconciled to see-more: APOD paginates by random
//     `count` batches, and see-more's explicit append is deterministic + testable (infinite's
//     IntersectionObserver is a no-op under jsdom). A legal value; no heuristic constrains pagination.
//   • arrangement = uniform-grid — discover's `masonry` is reconciled away: H28 unlocks masonry only
//     when the tile label is minimal, but the consume blend makes it `rich`; masonry is also an
//     unbuilt binding (repr: null). uniform-grid is the coherent, buildable resolution.
//
// Accepted resolution — the `controls` slot: the item-gallery skeleton marks controls as delegating
// to the Filter pattern, but the pattern INLINES its filter bindings (Stack + ToggleGroup per facet)
// "pending the ports design", and Filter is only a `planned` pattern. So `filter: inline-chips` is
// built INLINE from those bindings — there is deliberately no `children.controls` composite. The one
// facet is the adapter's `filterKey` (media_type → image | video).

import type { CompositeSpec } from 'move';

export const spec = {
  name: 'ApodGallery',
  fromPattern: 'item-gallery',
  adapter: 'apod-gallery',
  decisions: {
    useCase: 'discover',
    arrangement: 'uniform-grid',
    section: 'none',
    order: 'time',
    sort: 'none',
    filter: 'inline-chips',
    density: 'tight',
    pagination: 'see-more',
    feature: 'none',
    selection: 'none',
  },
  children: { item: 'ApodCard' },
  labels: [
    { key: 'errorTitle', default: 'Couldn’t load the gallery', description: 'Heading of the error Alert when the APOD fetch fails.' },
    { key: 'errorRetry', default: 'Try again', description: 'Retry button in the error state.' },
    { key: 'empty', default: 'No pictures to show', description: 'EmptyState message when the query returns nothing.' },
    { key: 'filterAll', default: 'All', description: 'Filter chip selecting every media type.' },
    { key: 'filterImage', default: 'Images', description: 'Filter chip for image entries (media_type=image).' },
    { key: 'filterVideo', default: 'Videos', description: 'Filter chip for video entries (media_type=video).' },
    { key: 'seeMore', default: 'See more', description: 'Button that loads and appends the next batch (pagination=see-more).' },
  ],
} as const satisfies CompositeSpec;
