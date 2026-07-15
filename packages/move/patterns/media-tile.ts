/**
 * DRAFT — `MediaTile`: a child design pattern of ItemGallery (and of any collection).
 *
 * A single item tile: a visual **lead** (image/video/audio/avatar/icon) + metadata +
 * actions. This is the reusable unit galleries, carousels, search results, related
 * strips, and kanban cards all compose. Extracted from ItemGallery's `item` subtree —
 * the parent delegates its `item` slot to this pattern (`as: 'pattern' → media-tile`) and
 * pins a few of these axes as config; the rest fall to MediaTile's own defaults.
 *
 * Its axes are documented HERE (once). A host pattern references MediaTile and documents
 * only the config it pins — never re-listing these axes.
 */

import type {
  DesignPatternSpec,
  AxisSpec,
  SlotSpec,
  Binding,
  Heuristic,
  DataField,
  StateEntry,
} from './spec-type';

// ── Axes (the tile's decision space) ─────────────────────────────────────────
export const AXES: AxisSpec[] = [
  { axis: 'lead', level: 'media', decidedBy: 'data-rule', options: ['image', 'video', 'audio', '3d', 'avatar', 'icon'], gloss: 'The item’s lead visual — follows the app’s content, not taste.' },
  { axis: 'fit', level: 'media', decidedBy: 'data-rule', options: ['cover', 'contain'], gloss: 'cover for scenes/photos; contain for products/assets on a neutral bg.' },
  { axis: 'hoverMedia', level: 'media', decidedBy: 'use-case-preset', options: ['none', 'preview', 'expand', 'reveal-info'], gloss: 'What hover does to the media (static, muted-autoplay preview, zoom, or caption reveal).' },
  { axis: 'surface', level: 'item', decidedBy: 'use-case-preset', options: ['none', 'card'], gloss: 'A plain (none) tile in a continuous field, or a discrete tappable card.' },
  { axis: 'orientation', level: 'item', decidedBy: 'use-case-preset', options: ['vertical', 'horizontal'], gloss: 'Media above label (a tile) or beside it (a list row).' },
  { axis: 'label', level: 'label', decidedBy: 'use-case-preset', options: ['none', 'title', 'rich', 'transactional'], gloss: 'How much metadata sits with the media — none, a title+meta block, rich, or commerce.' },
  { axis: 'stats', level: 'label', decidedBy: 'data-rule', options: ['none', 'hover', 'always'], gloss: 'Engagement stats visibility — hidden, on hover, or always.' },
  { axis: 'primaryAction', level: 'overlay', decidedBy: 'use-case-preset', options: ['none', 'open', 'play', 'select', 'quick-view'], gloss: 'The tile’s default activation (usually the whole tile).' },
  { axis: 'hoverActions', level: 'overlay', decidedBy: 'use-case-preset', options: ['*'], gloss: 'The on-media action set (save/share/…), derived from the host’s useCase × media.' },
];

// ── Skeleton (item is the root of the tile) ──────────────────────────────────
export const SKELETON: SlotSpec[] = [
  { slot: 'item', parent: null, drivenBy: ['surface', 'orientation'], role: 'The tile wrapper (plain or card; column or list-row).' },
  { slot: 'media', parent: 'item', drivenBy: ['lead', 'fit', 'hoverMedia'], role: 'The lead visual.' },
  { slot: 'overlay', parent: 'media', drivenBy: ['primaryAction', 'hoverActions'], role: 'On-media indicators & actions.', optional: true },
  { slot: 'label', parent: 'item', drivenBy: ['label', 'stats'], role: 'The metadata block.', optional: true },
];

// ── Bindings (axis value → concrete Move representation) ──────────────────────
export const BINDINGS: Binding[] = [
  { slot: 'item', axis: 'surface', value: 'none', as: 'node', repr: '<Stack> (no chrome)' },
  { slot: 'item', axis: 'surface', value: 'card', as: 'node', repr: '<Card.Root variant="default">' },
  { slot: 'item', axis: 'orientation', value: 'vertical', as: 'prop', repr: 'the item Stack is a column — media above, label below' },
  { slot: 'item', axis: 'orientation', value: 'horizontal', as: 'prop', repr: 'the item Stack is a row (direction="row") — media beside label' },
  { slot: 'media', axis: 'lead', value: 'image', as: 'node', repr: '<Image radius="md">' },
  { slot: 'media', axis: 'lead', value: 'video', as: 'node', repr: '<Image> poster + <Badge>Video</Badge>', note: 'a feed shows the poster + a Video badge; muted autoplay is hoverMedia:preview; the full VideoPlayer is the detail view' },
  { slot: 'media', axis: 'lead', value: 'audio', as: 'node', repr: '<Image> square cover + <Button><Icon name="play"/></Button>' },
  { slot: 'media', axis: 'lead', value: 'avatar', as: 'node', repr: '<Avatar size="xl">' },
  { slot: 'media', axis: 'lead', value: 'icon', as: 'node', repr: '<Icon size={48}>' },
  { slot: 'media', axis: 'lead', value: '3d', as: 'node', repr: null, note: 'no interactive/manipulable media' },
  { slot: 'media', axis: 'fit', value: 'cover', as: 'prop', repr: 'fit="cover" on the media node' },
  { slot: 'media', axis: 'fit', value: 'contain', as: 'prop', repr: 'fit="contain" on the media node' },
  { slot: 'media', axis: 'hoverMedia', value: 'none', as: 'behavior', repr: 'static poster' },
  { slot: 'media', axis: 'hoverMedia', value: 'preview', as: 'behavior', repr: 'swap poster → muted autoplay on hover' },
  { slot: 'media', axis: 'hoverMedia', value: 'expand', as: 'behavior', repr: 'scale/zoom the media on hover' },
  { slot: 'media', axis: 'hoverMedia', value: 'reveal-info', as: 'behavior', repr: 'slide a caption over the media on hover' },
  { slot: 'overlay', axis: 'primaryAction', value: 'none', as: 'behavior', repr: 'inert — the tile doesn’t activate' },
  { slot: 'overlay', axis: 'primaryAction', value: 'open', as: 'behavior', repr: 'whole tile is the link → detail (Card/Link asChild)' },
  { slot: 'overlay', axis: 'primaryAction', value: 'play', as: 'node', repr: 'centered <Button><Icon name="play"/></Button>' },
  { slot: 'overlay', axis: 'primaryAction', value: 'select', as: 'node', repr: '<Checkbox> top-start (selection mode)' },
  { slot: 'overlay', axis: 'primaryAction', value: 'quick-view', as: 'node', repr: 'hover <Button>Quick view</Button>' },
  { slot: 'overlay', axis: 'hoverActions', value: '*', as: 'node', repr: '<Image.Overlay>{<Tooltip><Button><Icon/></Button> stack}</Image.Overlay>', note: 'G9/C5 — the Image overlay slot system' },
  { slot: 'label', axis: 'label', value: 'none', as: 'node', repr: '— (slot omitted)' },
  { slot: 'label', axis: 'label', value: 'title', as: 'node', repr: '<Stack gap="xs">{<Heading size="sm">}{<Text size="sm" color="muted">}</Stack>' },
  { slot: 'label', axis: 'label', value: 'rich', as: 'node', repr: '<Stack gap="xs">{<Heading>}{<Text meta>}{<Text clamp>desc</Text>}</Stack>', note: 'clamp needs C1' },
  { slot: 'label', axis: 'label', value: 'transactional', as: 'node', repr: '<Stack>{<Text price>}{<Text strike>}{<Badge>}</Stack>', note: 'G13 — no Rating component for stars (would sit here)' },
  { slot: 'label', axis: 'stats', value: 'none', as: 'behavior', repr: 'hidden' },
  { slot: 'label', axis: 'stats', value: 'hover', as: 'behavior', repr: 'reveal a stat row on hover' },
  { slot: 'label', axis: 'stats', value: 'always', as: 'node', repr: '<Stack direction="row">{<Icon>+<Text> per stat}</Stack>' },
];

// ── Heuristics (the tile's coherence laws) ───────────────────────────────────
export const HEURISTICS: Heuristic[] = [
  { id: 'H26', law: 'fit=cover for scenes/editorial; fit=contain for products/assets on a neutral bg.', kind: 'layout', axes: ['fit', 'lead'], checkable: true },
  { id: 'H17', law: 'Surface (card) for discrete objects to pick; none (plain) for a continuous field to browse.', kind: 'layout', axes: ['surface'], checkable: false },
  { id: 'H1', law: 'Rich metadata lives beneath the media; only compact status sits on it.', kind: 'label', axes: ['label', 'stats'], checkable: false },
  { id: 'H21', law: 'Hover modes combine; they are not exclusive.', kind: 'coupling', axes: ['hoverMedia', 'stats', 'hoverActions'], checkable: false },
  { id: 'H20', law: 'Action kinds are use-case × media driven; placement & contrast are universal.', kind: 'action', axes: ['hoverActions', 'lead'], checkable: false },
  { id: 'H4', law: 'The action long-tail hides behind one “more” (⋮) menu, out of the resting state.', kind: 'action', axes: ['hoverActions'], checkable: false },
  { id: 'H13', law: 'Indicators & actions hug edges/corners, off-center; solid background for contrast (no ghost over photos).', kind: 'placement', axes: ['hoverActions', 'primaryAction'], checkable: true },
  { id: 'H3', law: 'Persistent indicators and hover-controls occupy different corners.', kind: 'placement', axes: ['stats', 'hoverActions'], checkable: true },
  { id: 'H14', law: 'Interactivity decides placement: interactive/persistent → edges; read-only info → may center over a scrim.', kind: 'placement', axes: ['hoverActions', 'primaryAction', 'stats'], checkable: true },
  { id: 'H19', law: 'Contrast technique scales with need: chip → scrim → gradient → drop-shadow (lightest that stays legible).', kind: 'contrast', axes: ['hoverActions'], checkable: false },
];

// ── Data (the content each slot reads — resolves the data-rule axes) ──────────
export const DATA: DataField[] = [
  { slot: 'media', field: 'media', type: 'image | video | audio | avatar | icon', direction: 'in', cardinality: 'one', drives: ['lead', 'fit'], note: 'the item’s lead visual' },
  { slot: 'label', field: 'title', type: 'string', direction: 'in', cardinality: 'one', drives: ['label'] },
  { slot: 'label', field: 'meta', type: 'string | number | date', direction: 'in', cardinality: 'many', drives: ['label'], note: 'secondary metadata — date, author, price' },
  { slot: 'label', field: 'stat', type: 'number', direction: 'in', cardinality: 'many', drives: ['stats'], note: 'engagement counts (likes/views)' },
];

// ── State (mutable runtime state each slot owns) ──────────────────────────────
export const STATE: StateEntry[] = [
  { slot: 'media', name: 'hovered', of: 'boolean', control: 'local', note: 'gates hoverMedia / hoverActions reveal' },
  { slot: 'overlay', name: 'selected', of: 'boolean', control: 'controllable', note: 'reflects the host gallery’s selection set; controllable when the app owns selection' },
];

// ── The pattern ──────────────────────────────────────────────────────────────
export const mediaTile = {
  name: 'MediaTile',
  intent:
    'A single item tile — a visual lead (image/video/audio/avatar/icon) + metadata + actions — that galleries, carousels, search results, and boards compose.',
  synonyms: ['tile', 'card', 'item', 'thumbnail', 'media card', 'result', 'cell'],
  appliesWhen: [
    'a single item shown as a tile or card',
    'the item has a lead image/video/avatar + a title + actions',
    'composed into a gallery, carousel, board, or search results',
  ],
  axes: AXES,
  skeleton: SKELETON,
  bindings: BINDINGS,
  heuristics: HEURISTICS,
  data: DATA,
  state: STATE,
} as const satisfies DesignPatternSpec;
