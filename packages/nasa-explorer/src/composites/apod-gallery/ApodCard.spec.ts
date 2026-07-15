// ApodCard.spec.ts — the SLIM CompositeSpec for the per-item tile: MediaTile resolved for one APOD
// entry. The child of ApodGallery's `item` slot — it receives one Item as a prop, so it carries NO
// adapter (only the root collection composite talks to a data source).
//
// Its axes are the config ApodGallery PINS on MediaTile (discover.item + the consume blend), plus the
// data-rule axes resolved from the item shape:
//   • lead  = image  — the adapter's `media` role is a still image URL
//   • fit   = cover  — H26: editorial/scene photography fills the frame
//   • stats = none   — data-rule: APOD carries no engagement metric (no `stat` role)
//   • surface = card, label = rich — the consume blend (discrete, editorial tiles)

import type { CompositeSpec } from 'move';

export const spec = {
  name: 'ApodCard',
  fromPattern: 'media-tile',
  decisions: {
    lead: 'image',
    fit: 'cover',
    hoverMedia: 'none',
    surface: 'card',
    orientation: 'vertical',
    label: 'rich',
    stats: 'none',
    primaryAction: 'open',
    hoverActions: ['save', 'share'],
  },
  labels: [
    { key: 'open', default: 'View picture', description: 'Accessible name for the whole-tile link to the detail view (primaryAction=open).' },
    { key: 'save', default: 'Save', description: 'Tooltip/label for the save hover action.' },
    { key: 'share', default: 'Share', description: 'Tooltip/label for the share hover action.' },
  ],
} as const satisfies CompositeSpec;
