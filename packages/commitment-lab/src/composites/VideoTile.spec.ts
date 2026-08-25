// VideoTile.spec.ts — the FIRST real composite spec in the repo.
//
// A YouTube-style video thumbnail: the reusable child unit a home feed, search results, and
// a channel page all delegate to. It commits every axis of the live `media-tile` pattern to
// a value, and carries the ledger fields (`role` + `signature`). It has no adapter — a child
// tile receives its item as a prop from whatever gallery hosts it.

import type { LabComposite } from '../types';

export const videoTile = {
  name: 'VideoTile',
  scope: 'composite',
  fromPattern: 'media-tile',

  // ── ledger fields ──────────────────────────────────────────────────────────
  role: 'video-tile',
  signature: { verb: 'consume', object: 'video', scope: 'item' },

  // ── the closed decision set: every media-tile axis, resolved ────────────────
  decisions: {
    lead: 'video', // poster + a Video badge
    fit: 'cover', // editorial scenes, not products on neutral bg
    hoverMedia: 'preview', // muted autoplay on hover
    surface: 'none', // plain tile in a continuous feed, not a discrete card
    orientation: 'vertical', // media above the label
    label: 'rich', // title + channel + description line
    stats: 'always', // views · age, always visible
    primaryAction: 'open', // whole tile → the watch page
    hoverActions: ['save', 'share', 'more'], // Watch later · Share · ⋮
  },

  labels: [
    { key: 'save', default: 'Watch later' },
    { key: 'share', default: 'Share' },
    { key: 'more', default: 'More actions' },
  ],
} satisfies LabComposite;
