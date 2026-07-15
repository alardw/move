// apod-gallery.ts — the BRIDGE code, generated from apod-gallery.adapter.ts (the AdapterSpec).
// Deliberately tiny: it calls ONE api endpoint (nasa-apod → `apod`), applies the field→role mapping,
// and wraps the result in Move's `AsyncResource` to expose the ItemGallery pattern's fixed internal
// port — `items(query): Promise<AsyncResource<GalleryItem[]>>`. All transport/auth/retries live in
// the api below; all design lives in the pattern above. Swapping sources is an isolated change here.

import { asyncResource, type AsyncResource } from 'move';
import type { Apod, ApodParams, NasaApodApi } from '../apis/nasa-apod';

// ── Item — the pattern's itemShape roles this adapter fills ───────────────────
// media · title · meta · sortKey · filterKey (item-gallery ∘ media-tile). No `stat`: APOD carries no
// engagement metrics, so the gallery's `stats` axis resolves to `none` (documented in the AdapterSpec).
export interface GalleryItem {
  /** The lead visual — a still image URL (hi-res for images, the thumbnail for videos). */
  media: string;
  title: string;
  /** Secondary metadata line — [date, copyright]; copyright dropped when the image is public-domain. */
  meta: string[];
  /** Sortable YYYY-MM-DD key — drives `order: time`. */
  sortKey: string;
  /** Facet for the gallery Filter. */
  filterKey: Apod['media_type'];
}

// ── The internal port ─────────────────────────────────────────────────────────
// `items` resolves to a `success` (incl. empty → `data: []`) or an `error` AsyncResource, feeding the
// composite's Feedback lane. `loading` is the resource the composite shows while this promise is in
// flight (there is no `empty` variant — an empty result is `success([])`, which the composite renders
// as its EmptyState).
export interface GallerySource {
  items(query?: ApodParams): Promise<AsyncResource<GalleryItem[]>>;
}

// ── The mapping (row → Item), straight from the AdapterSpec ───────────────────
function toGalleryItem(r: Apod): GalleryItem {
  return {
    media: r.media_type === 'video' ? (r.thumbnail_url ?? r.url) : (r.hdurl ?? r.url),
    title: r.title,
    meta: [r.date, r.copyright].filter((v): v is string => Boolean(v)),
    sortKey: r.date,
    filterKey: r.media_type,
  };
}

/** The adapter: `(api) => GallerySource`. The composite injects the api instance (real or fixture). */
export const apodGalleryAdapter = (api: NasaApodApi): GallerySource => ({
  items: async (query) => {
    try {
      const rows = await api.apod(query);
      return asyncResource.success(rows.map(toGalleryItem));
    } catch (err) {
      return asyncResource.error(err instanceof Error ? err : new Error(String(err)));
    }
  },
});

// Re-exported so tests/fixtures can map native rows without duplicating the mapping.
export { toGalleryItem };
