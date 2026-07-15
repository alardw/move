// ApodGallery.tsx — GENERATED from ApodGallery.spec.ts (item-gallery) × the resolved decisions × the
// apod-gallery adapter. The root composite: it owns the async spine (calls the adapter's items() and
// renders the pattern's Feedback lane) and composes the child ApodCard per item. Move components only.
//
// Resolved bindings (item-gallery):
//   arrangement=uniform-grid, density=tight → <Grid minChildWidth gap="xs">
//   filter=inline-chips                     → <ToggleGroup> of media_type facets (the adapter's filterKey)
//   order=time                              → items sorted by sortKey (date) descending
//   pagination=see-more                     → <Button>See more</Button> appends the next count batch
//   section=none, feature=none, sort=none, selection=none → no wrappers/controls beyond the above
// Feedback lane (verbatim from the pattern):
//   pending → <Grid>{<Skeleton> per cell}</Grid> · error → <Alert> + retry · empty → <EmptyState> ·
//   ready   → the grid of tiles

import * as React from 'react';
import { Grid, Stack, Text, Alert, Button, EmptyState, Skeleton, ToggleGroup, type AsyncResource } from 'move';
import { ApodCard, type ApodCardLabels } from './ApodCard';
import { apodGalleryAdapter, type GallerySource, type GalleryItem } from '../../adapters/apod-gallery';
import { nasaApodApi } from '../../apis/nasa-apod';

export interface ApodGalleryLabels {
  errorTitle: string;
  errorRetry: string;
  empty: string;
  filterAll: string;
  filterImage: string;
  filterVideo: string;
  seeMore: string;
}

export const DEFAULT_APOD_GALLERY_LABELS: ApodGalleryLabels = {
  errorTitle: 'Couldn’t load the gallery',
  errorRetry: 'Try again',
  empty: 'No pictures to show',
  filterAll: 'All',
  filterImage: 'Images',
  filterVideo: 'Videos',
  seeMore: 'See more',
};

/** How many random pictures each batch requests (APOD `count`). */
const PAGE_SIZE = 24;

type Facet = 'all' | GalleryItem['filterKey'];

export interface ApodGalleryProps {
  /** The data port — the adapter bound to an api. Defaults to the env-configured NASA api. */
  source?: GallerySource;
  labels?: Partial<ApodGalleryLabels>;
  cardLabels?: Partial<ApodCardLabels>;
  onSaveItem?: (item: GalleryItem) => void;
  onShareItem?: (item: GalleryItem) => void;
}

export function ApodGallery({ source, labels, cardLabels, onSaveItem, onShareItem }: ApodGalleryProps) {
  const l = { ...DEFAULT_APOD_GALLERY_LABELS, ...labels };
  const resolved = React.useMemo(() => source ?? apodGalleryAdapter(nasaApodApi), [source]);

  const [status, setStatus] = React.useState<AsyncResource<GalleryItem[]>['status']>('loading');
  const [error, setError] = React.useState<Error | null>(null);
  const [items, setItems] = React.useState<GalleryItem[]>([]);
  const [loadingMore, setLoadingMore] = React.useState(false);
  const [facet, setFacet] = React.useState<Facet>('all');

  const load = React.useCallback(
    async (append: boolean) => {
      if (append) setLoadingMore(true);
      else setStatus('loading');
      const res = await resolved.items({ count: PAGE_SIZE, thumbs: true });
      if (res.status === 'success') {
        // Dedupe on append: APOD `count` returns RANDOM pictures, so batches can repeat one.
        setItems((prev) => {
          if (!append) return res.data;
          const seen = new Set(prev.map((it) => it.sortKey + it.media));
          return [...prev, ...res.data.filter((it) => !seen.has(it.sortKey + it.media))];
        });
        setError(null);
        setStatus('success');
      } else if (res.status === 'error') {
        setError(res.error);
        if (!append) setStatus('error');
      }
      if (append) setLoadingMore(false);
    },
    [resolved],
  );

  React.useEffect(() => {
    void load(false);
  }, [load]);

  // order=time (date desc) + filter=inline-chips (by the media_type facet).
  const visible = React.useMemo(() => {
    const filtered = facet === 'all' ? items : items.filter((it) => it.filterKey === facet);
    return [...filtered].sort((a, b) => (a.sortKey < b.sortKey ? 1 : a.sortKey > b.sortKey ? -1 : 0));
  }, [items, facet]);

  // ── Feedback: pending ──
  if (status === 'loading') {
    return (
      <Grid minChildWidth="240px" gap="xs" aria-busy="true">
        {Array.from({ length: PAGE_SIZE }, (_, i) => (
          <Skeleton.Rectangle key={i} width="100%" height="200px" />
        ))}
      </Grid>
    );
  }

  // ── Feedback: error ── (the pattern's `variant: error` maps to Move's `danger`)
  if (status === 'error') {
    return (
      <Alert variant="danger" title={l.errorTitle}>
        <Stack gap="sm" align="start">
          {error?.message && (
            <Text size="sm" color="muted">
              {error.message}
            </Text>
          )}
          <Button variant="secondary" size="sm" onClick={() => void load(false)}>
            {l.errorRetry}
          </Button>
        </Stack>
      </Alert>
    );
  }

  // ── Feedback: empty ──
  if (visible.length === 0) {
    return <EmptyState icon="photo" title={l.empty} />;
  }

  // ── Feedback: ready ──
  return (
    <Stack gap="sm">
      <ToggleGroup.Root value={facet} onValueChange={(v) => setFacet((v as Facet) || 'all')}>
        <ToggleGroup.Item value="all">{l.filterAll}</ToggleGroup.Item>
        <ToggleGroup.Item value="image">{l.filterImage}</ToggleGroup.Item>
        <ToggleGroup.Item value="video">{l.filterVideo}</ToggleGroup.Item>
      </ToggleGroup.Root>

      <Grid minChildWidth="240px" gap="xs">
        {visible.map((item) => (
          <ApodCard
            key={item.sortKey + item.media}
            item={item}
            labels={cardLabels}
            onSave={onSaveItem}
            onShare={onShareItem}
          />
        ))}
      </Grid>

      <Stack align="center">
        <Button variant="secondary" onClick={() => void load(true)} disabled={loadingMore}>
          {l.seeMore}
        </Button>
      </Stack>
    </Stack>
  );
}
