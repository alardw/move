// apod-gallery.adapter.ts — the AdapterSpec: the BRIDGE between the ItemGallery pattern's fixed
// internal roles and NASA APOD's native fields. Mapping only — no fetch/auth (that's the api below),
// no AsyncResource/normalization (that's apod-gallery.ts, from adapter-create).
//
// Internal (fixed):  item-gallery ∘ media-tile → roles: media · title · meta · sortKey · filterKey.
// External (variable): the `apod` endpoint of the nasa-apod ApiSpec → native Apod fields.
//
// Coverage note — `stat`: APOD carries NO engagement metrics (likes/views), so the MediaTile `stat`
// role has no source field. That's a real gap, not an omission: the gallery's `stats` axis resolves
// to `none` and the tile renders no stat row. Every role APOD CAN fill is mapped below.

import type { AdapterSpec } from 'move';

export const spec = {
  name: 'apod-gallery',
  pattern: 'item-gallery',
  api: { kind: 'move', name: 'nasa-apod' },
  endpoint: 'apod',
  mapping: [
    {
      role: 'media',
      from: 'hdurl ?? url ?? thumbnail_url',
      transform: "media_type === 'video' ? (thumbnail_url ?? url) : (hdurl ?? url)",
      note: 'the lead visual — a hi-res still for images, the video thumbnail for videos',
    },
    { role: 'title', from: 'title' },
    {
      role: 'meta',
      from: '[date, copyright]',
      transform: 'date + author line (copyright omitted for public-domain)',
    },
    { role: 'sortKey', from: 'date', note: 'sortable YYYY-MM-DD key — drives order: time' },
    { role: 'filterKey', from: 'media_type', note: "image | video facet — drives the gallery Filter" },
  ],
} as const satisfies AdapterSpec;
