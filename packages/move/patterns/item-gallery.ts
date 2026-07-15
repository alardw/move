/**
 * DRAFT — `ItemGallery`: a parameterized design pattern.
 *
 * A gallery of items, each with a visual **lead** + metadata + actions. A *media
 * gallery*, *product gallery*, *people directory*, *file browser* are all the same
 * pattern — instances differentiated by axis values (useCase × arrangement × the tile),
 * NOT separate patterns. That's the payoff of "pattern = parameterized".
 *
 * ItemGallery = Gallery ∘ Item. The per-item tile is its OWN pattern, **MediaTile**:
 * the `item` slot delegates to it (`designPattern: 'media-tile'`), and MediaTile owns the
 * tile axes (lead / fit / surface / orientation / label / stats / primaryAction /
 * hoverMedia / hoverActions) + their bindings + heuristics — documented once, THERE.
 * ItemGallery keeps only the gallery-level axes and PINS a subset of MediaTile's axes as
 * per-useCase config (`PRESETS[useCase].item`). The `controls` slot likewise delegates to
 * the **Filter** pattern (its axes/bindings still inlined here pending the ports design).
 *
 * Synthesized from design research (`notes/media-gallery-pattern.md`, converged;
 * brand-free). Carries: gallery-level decision AXES — each tagged by HOW it's decided —
 * the SKELETON of slots (where coverage lives), per-value BINDINGS to Move nodes,
 * axis-scoped HEURISTICS, the action vocabulary, and the useCase presets. Wired to nothing.
 */

import type { DesignPatternSpec, DataField, StateEntry, Feedback } from './spec-type';

// ── Use case — the DRIVER (the coarse matchable key; presets most axes) ───────
export type UseCase = 'discover' | 'consume' | 'create' | 'shop' | 'archive' | 'showcase' | 'social';
// A gallery is instantiated with a PRIMARY use case (drives the preset) plus an optional
// BLEND of secondaries whose traits are grafted onto specific axes. NASA APOD = discover
// primary + consume blend: a visual browse whose items carry rich editorial content — the
// blend is precisely what pulls the tile's `label` off discover's `none` toward
// consume's `rich`, and `surface` toward `card`. The primary sets the baseline; the blend
// explains the overrides (they're not arbitrary — they're the secondary use case showing).
export interface UseCaseSelection {
  primary: UseCase;
  blend?: UseCase[];
}

// ── Tile config the gallery PINS on MediaTile ────────────────────────────────
// These value spaces are MediaTile's (its axes); the gallery only references them to pin a
// per-useCase default. MediaTile owns the axes, bindings, and coherence laws for the tile.
export type Surface = 'none' | 'card';
export type Label = 'none' | 'title' | 'rich' | 'transactional'; // media-forward ↔ metadata-forward
export type PrimaryAction = 'none' | 'open' | 'play' | 'select' | 'quick-view'; // the tile's default activation
export type HoverMedia = 'none' | 'preview' | 'expand' | 'reveal-info'; // what hover does to the media
export type Orientation = 'vertical' | 'horizontal'; // media above label (tile) vs beside it (list row)

// ── Item actions — vocabulary · categories · conventions ─────────────────────
// The gallery owns WHICH actions its domain offers (per useCase); MediaTile renders them.
export type ActionCategory = 'collect' | 'react' | 'consume' | 'transact' | 'create' | 'manage';
export type ActionKind =
  | 'like' | 'save' | 'share' | 'follow' | 'message'
  | 'play' | 'quick-view' | 'add-to-list' | 'add-to-cart'
  | 'download' | 'remix' | 'select' | 'more';

export type OverlayRegion =
  | 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end' // corners
  | 'center' // read-only info
  | 'top-bar' | 'bottom-bar'; // full-width edge bars (identity left / actions right)

export interface ActionConvention {
  category: ActionCategory;
  icon: string;
  defaultRegion: OverlayRegion;
  weight: 'primary' | 'secondary';
  note?: string;
}
// The action SET is derived from useCase × media (play only for playable media,
// add-to-cart only for products); each kind's placement/weight is conventional.
export const ACTIONS: Record<ActionKind, ActionConvention> = {
  save: { category: 'collect', icon: 'bookmark', defaultRegion: 'top-end', weight: 'secondary', note: 'near-universal' },
  'add-to-list': { category: 'collect', icon: 'plus', defaultRegion: 'bottom-bar', weight: 'secondary' },
  download: { category: 'collect', icon: 'download', defaultRegion: 'bottom-bar', weight: 'secondary' },
  like: { category: 'react', icon: 'heart', defaultRegion: 'bottom-bar', weight: 'secondary', note: 'near-universal' },
  share: { category: 'react', icon: 'share', defaultRegion: 'bottom-end', weight: 'secondary' },
  follow: { category: 'react', icon: 'user-plus', defaultRegion: 'bottom-bar', weight: 'secondary' },
  message: { category: 'react', icon: 'message-circle', defaultRegion: 'bottom-bar', weight: 'secondary' },
  play: { category: 'consume', icon: 'play', defaultRegion: 'bottom-end', weight: 'primary', note: 'playable media; brand circle' },
  'quick-view': { category: 'consume', icon: 'eye', defaultRegion: 'bottom-bar', weight: 'secondary' },
  'add-to-cart': { category: 'transact', icon: 'shopping-cart', defaultRegion: 'bottom-bar', weight: 'primary', note: 'commerce' },
  remix: { category: 'create', icon: 'wand-sparkles', defaultRegion: 'bottom-bar', weight: 'secondary', note: 'generative (edit-prompt/vary)' },
  select: { category: 'manage', icon: 'check', defaultRegion: 'top-start', weight: 'secondary', note: 'selection mode' },
  more: { category: 'manage', icon: 'more-vertical', defaultRegion: 'top-end', weight: 'secondary', note: 'the ⋮ menu holding the less-common actions (the long tail — H4)' },
};

// ── Gallery organization ──────────────────────────────────────────────────────
export type Arrangement = 'uniform-grid' | 'masonry' | 'justified-rows' | 'dense-grid' | 'carousel';
export type Section = 'none' | 'themed-shelves' | 'grouped';
// Sort/filter keys are DATA-DERIVED, not a fixed enum. A small universal set recurs
// in any collection; everything else is a `field` — any orderable/filterable item
// field (price, rating, size, duration, distance…), read from the item's declared data.
export type Order = 'relevance' | 'time' | 'alphabetical' | 'popularity' | 'curated' | 'field';
export type Sort = 'none' | 'dropdown';
// Filter is a LAYOUT choice; the facets themselves derive from filterable fields by
// type. (Both filter + sort are the Filter pattern's concern — inlined here
// until the ports design wires controls → Filter.)
export type Filter = 'none' | 'inline-chips' | 'sidebar';
export type Density = 'generous' | 'moderate' | 'tight';
export type Pagination = 'infinite' | 'see-more' | 'pagination';
export type Feature = 'none' | 'hero' | 'ranked';
export type SelectionMode = 'none' | 'multi-select';
// NB: page CHROME (nav-rail · top-menu · app-shell · profile-header · search) is the
// hosting page, NOT the gallery — it lives at feature scope.

// ── Decision sources — HOW each axis is decided (the authoring contract) ──────
// PRINCIPLE: the system always DECIDES, with a stated rationale, and leaves the value
// OVERRIDABLE. It proposes; it does NOT block-and-ask. Most "should I ask the human?"
// axes are editor choices with no right answer (masonry vs grid, hero vs flat) — those
// are a preset/heuristic default + rationale, never a required input.
// data-rule      = computed from the app's data (misreading it is checkable)
// use-case-preset= the useCase (primary + blend) sets a default + rationale, overridable
// consumer       = genuinely underivable ONLY — the data shape, domain-specific actions
// ai-heuristic   = AI decides under heuristics + oracle (the drift zone; hard rails)
export type DecidedBy = 'data-rule' | 'use-case-preset' | 'consumer' | 'ai-heuristic';
export interface AxisSpec {
  axis: string;
  level: 'gallery' | 'item' | 'cross-cutting';
  decidedBy: DecidedBy;
  options?: readonly string[];
  gloss: string;
}
// Gallery-level axes only. The tile axes (lead/fit/surface/orientation/label/stats/
// primaryAction/hoverMedia/hoverActions) live in the MediaTile pattern — see item slot.
export const AXES: AxisSpec[] = [
  { axis: 'useCase', level: 'gallery', decidedBy: 'consumer', options: ['discover', 'consume', 'create', 'shop', 'archive', 'showcase', 'social'], gloss: 'The gallery’s purpose — the driver. Presets most other axes (its own and the tile’s) and is the matchable key.' },

  // gallery — organization
  { axis: 'arrangement', level: 'gallery', decidedBy: 'use-case-preset', options: ['uniform-grid', 'masonry', 'justified-rows', 'dense-grid', 'carousel'], gloss: 'How items lay out (per-section when sectioned). Masonry is unlocked only when the tiles’ lead aspects vary AND label is minimal (H28); uniform aspects → uniform-grid; varied aspects + metadata → justified-rows.' },
  { axis: 'section', level: 'gallery', decidedBy: 'use-case-preset', options: ['none', 'themed-shelves', 'grouped'], gloss: 'One continuous field, curated themed sections, or grouped by data (date/category).' },
  { axis: 'order', level: 'gallery', decidedBy: 'data-rule', options: ['relevance', 'time', 'alphabetical', 'popularity', 'curated', 'field'], gloss: 'The sort DIMENSION (which field orders the collection). A small universal set + `field` = any sortable data field. Derived from the item’s fields; grouped/themed already imply an order. (The sort CONTROL — how it’s exposed — is `sort`, a Filter concern.)' },
  { axis: 'sort', level: 'gallery', decidedBy: 'use-case-preset', options: ['none', 'dropdown'], gloss: 'How the user changes the order — fixed, or a sort dropdown. (Feed-tabs like Hot/New/Top are query presets, not a sort control — deferred to the data model.) A Filter concern, inlined until ports.' },
  { axis: 'filter', level: 'gallery', decidedBy: 'use-case-preset', options: ['none', 'inline-chips', 'sidebar'], gloss: 'The filter LAYOUT (few facets inline; many → a faceted sidebar). A Filter concern, inlined until ports.' },
  { axis: 'density', level: 'gallery', decidedBy: 'use-case-preset', options: ['generous', 'moderate', 'tight'], gloss: 'Spacing + column count — generous (library) to tight/gapless (photo wall).' },
  { axis: 'pagination', level: 'gallery', decidedBy: 'use-case-preset', options: ['infinite', 'see-more', 'pagination'], gloss: 'Infinite scroll, see-more-per-section, or classic pagination.' },
  { axis: 'feature', level: 'gallery', decidedBy: 'use-case-preset', options: ['none', 'hero', 'ranked'], gloss: 'A hero/billboard, ranked emphasis (Top-N), or none.' },
  { axis: 'selection', level: 'gallery', decidedBy: 'data-rule', options: ['none', 'multi-select'], gloss: 'Gallery-wide multi-select mode + bulk bar — when the app needs bulk operations on the user’s own items.' },
];

// ── The SKELETON — a tree of nested SLOTS. COVERAGE lives here: every gallery axis binds
//    to a slot, each slot defines a variation per axis value, so coverage is a finite
//    SLOT × axis-value matrix (checkable), NOT the 2^N config space. The `gallery` slot IS
//    the root container. The `item` slot DELEGATES to MediaTile; the `controls` slot to
//    Filter — a delegating slot has no axes of its own (the child owns them).
export type Slot =
  | 'gallery'      // root container / region
  | 'controls'     // filter + sort chrome → Filter pattern
  | 'section'      // grouping wrapper (shelves / groups / hero)
  | 'arrangement'  // the item container — how tiles lay out
  | 'item';        // the per-item tile → MediaTile pattern
export interface SlotSpec {
  slot: Slot;
  parent: Slot | null;   // null = root container
  drivenBy: string[];    // the axes that vary this slot ([] for a slot that delegates)
  role: string;
  optional?: boolean;    // the slot can be omitted entirely (no filter, …)
  // If set, the slot DELEGATES to a nested design pattern (by registry slug). The child
  // owns that subtree's axes/bindings/heuristics — documented THERE, once. The host pins a
  // subset of the child's axes as config (see PRESETS). Earned only with (a) the child's
  // own non-trivial axes AND (b) cross-host reuse (Filter, MediaTile: yes).
  designPattern?: string;
}
export const SKELETON: SlotSpec[] = [
  { slot: 'gallery', parent: null, drivenBy: ['useCase', 'selection'], role: 'The outer region — the container everything sits in.' },
  { slot: 'controls', parent: 'gallery', drivenBy: ['filter', 'sort'], role: 'Filter & sort chrome above the items.', optional: true, designPattern: 'filter' },
  { slot: 'section', parent: 'gallery', drivenBy: ['section', 'feature'], role: 'Grouping wrapper — shelves, groups, or a hero.', optional: true },
  { slot: 'arrangement', parent: 'section', drivenBy: ['arrangement', 'density', 'pagination', 'order'], role: 'The item container — how tiles lay out.' },
  { slot: 'item', parent: 'arrangement', drivenBy: [], role: 'The per-item tile — delegates entirely to the MediaTile pattern.', designPattern: 'media-tile' },
];

// ── Bindings — each gallery axis VALUE → its concrete slot representation. Structure is a
//    LOOKUP, not a guess: a value not listed can't be built. COVERAGE = every axis value
//    has a row. `repr: null` = a declared Move gap; `value: '*'` = all values of the axis.
//    `as`: node = a Move component subtree · prop = a prop on the slot's node · behavior =
//    data/interaction with no distinct DOM · pattern = the slot delegates to a nested
//    pattern. (The delegating `item`/`controls` slots carry no bindings — the child owns
//    them; delegation is declared via each slot's `designPattern`.)
export interface Binding {
  slot: Slot;
  axis: string;
  value: string;
  as: 'node' | 'prop' | 'behavior' | 'pattern';
  repr: string | null;   // Move composite / prop / behavior / nested pattern name (null = a gap)
  note?: string;
}
export const BINDINGS: Binding[] = [
  // gallery (useCase driver, selection)
  { slot: 'gallery', axis: 'useCase', value: '*', as: 'behavior', repr: 'the driver — presets every other axis, gallery + tile (not a slot node)' },
  { slot: 'gallery', axis: 'selection', value: 'none', as: 'behavior', repr: 'no selection mode' },
  { slot: 'gallery', axis: 'selection', value: 'multi-select', as: 'node', repr: null, note: 'G11 — no Move selection mode / bulk bar yet' },
  // controls (filter, sort) — delegates to Filter; inlined until ports
  { slot: 'controls', axis: 'filter', value: 'none', as: 'node', repr: '— (slot omitted)' },
  { slot: 'controls', axis: 'filter', value: 'inline-chips', as: 'node', repr: '<Stack direction="row" wrap>{<ToggleGroup> per facet}</Stack>' },
  { slot: 'controls', axis: 'filter', value: 'sidebar', as: 'node', repr: '<Sidebar>{<Accordion> of facet groups}</Sidebar>' },
  { slot: 'controls', axis: 'sort', value: 'none', as: 'behavior', repr: 'fixed order — no control' },
  { slot: 'controls', axis: 'sort', value: 'dropdown', as: 'node', repr: '<Select>{sort options}</Select>' },
  // section (section, feature)
  { slot: 'section', axis: 'section', value: 'none', as: 'node', repr: '— (single arrangement, no wrapper)' },
  { slot: 'section', axis: 'section', value: 'themed-shelves', as: 'node', repr: '<Stack gap="lg">{<Heading> + <Carousel> per shelf}</Stack>' },
  { slot: 'section', axis: 'section', value: 'grouped', as: 'node', repr: '<Stack gap="lg">{<Heading> + arrangement per group}</Stack>' },
  { slot: 'section', axis: 'feature', value: 'none', as: 'node', repr: '— (no feature item)' },
  { slot: 'section', axis: 'feature', value: 'hero', as: 'node', repr: '<Card variant="elevated"> leading full-bleed item' },
  { slot: 'section', axis: 'feature', value: 'ranked', as: 'node', repr: '<Badge> rank + larger tile on top-N' },
  // arrangement (arrangement, density, pagination, order)
  { slot: 'arrangement', axis: 'arrangement', value: 'uniform-grid', as: 'node', repr: '<Grid minChildWidth>' },
  { slot: 'arrangement', axis: 'arrangement', value: 'dense-grid', as: 'node', repr: '<Grid minChildWidth gap="none">' },
  { slot: 'arrangement', axis: 'arrangement', value: 'carousel', as: 'node', repr: '<Carousel>' },
  { slot: 'arrangement', axis: 'arrangement', value: 'masonry', as: 'node', repr: null, note: 'C3 — no Move masonry' },
  { slot: 'arrangement', axis: 'arrangement', value: 'justified-rows', as: 'node', repr: null, note: 'C3 — no justified-by-aspect layout' },
  { slot: 'arrangement', axis: 'density', value: 'generous', as: 'prop', repr: 'gap="lg" + wider minChildWidth' },
  { slot: 'arrangement', axis: 'density', value: 'moderate', as: 'prop', repr: 'gap="md"' },
  { slot: 'arrangement', axis: 'density', value: 'tight', as: 'prop', repr: 'gap="xs"' },
  { slot: 'arrangement', axis: 'pagination', value: 'infinite', as: 'behavior', repr: 'IntersectionObserver → append next page' },
  { slot: 'arrangement', axis: 'pagination', value: 'see-more', as: 'node', repr: '<Button variant="secondary">See more</Button> per section' },
  { slot: 'arrangement', axis: 'pagination', value: 'pagination', as: 'node', repr: '<Pagination>' },
  { slot: 'arrangement', axis: 'order', value: '*', as: 'behavior', repr: 'sorts the item data feeding the arrangement (no DOM)' },
];

// ── Heuristics (design laws; `checkable` → oracle rule; else guidance) ────────
// The gallery-level laws. The TILE'S coherence laws (surface/label/hover/action
// placement) live in the MediaTile pattern — not restated here. H28 is a gallery↔tile
// COUPLING: it constrains `arrangement` (gallery) by the tiles' aspect variation +
// label (MediaTile). Cross-pattern, so not checkable at this level alone — the oracle
// spanning both patterns lands with the cross-pattern layer.
export type HeuristicKind = 'coupling' | 'placement' | 'contrast' | 'layout' | 'label' | 'action';
export interface Heuristic {
  id: string;
  law: string;
  kind: HeuristicKind;
  axes: string[];        // the axes this law constrains (why it lives at the axis level)
  checkable: boolean;
}
export const HEURISTICS: Heuristic[] = [
  { id: 'H28', law: 'Masonry / justified-rows are unlocked only when the tiles’ lead aspects vary AND label is minimal (a coupling with MediaTile’s fit + label); uniform aspects → uniform-grid.', kind: 'coupling', axes: ['arrangement'], checkable: false },
];

// ── Use-case PRESETS — the concrete default axis values per use case ─────────
// The actual `useCase → defaults` mapping behind `decidedBy:'use-case-preset'`. Gallery
// axes sit at the top; `item` is the config the gallery PINS on MediaTile (a subset of
// MediaTile's axes — the rest fall to MediaTile's own defaults). The consumer overrides
// any value; data-rules (order, selection, and the tile's lead/fit/stats) still override
// where the data demands.
export interface TilePins {
  surface: Surface;
  orientation: Orientation;
  label: Label;
  primaryAction: PrimaryAction;
  hoverMedia: HoverMedia;
  hoverActions: ActionKind[];
}
export interface UseCasePreset {
  arrangement: Arrangement;
  section: Section;
  sort: Sort;
  filter: Filter;
  density: Density;
  pagination: Pagination;
  feature: Feature;
  order: Order;
  /** Pinned MediaTile config for this use case. */
  item: TilePins;
}
export const PRESETS: Record<UseCase, UseCasePreset> = {
  discover: { arrangement: 'masonry', section: 'none', sort: 'none', filter: 'inline-chips', density: 'tight', pagination: 'infinite', feature: 'none', order: 'relevance', item: { surface: 'none', orientation: 'vertical', label: 'none', primaryAction: 'open', hoverMedia: 'none', hoverActions: ['save', 'share'] } },
  consume: { arrangement: 'carousel', section: 'themed-shelves', sort: 'none', filter: 'inline-chips', density: 'generous', pagination: 'see-more', feature: 'hero', order: 'relevance', item: { surface: 'none', orientation: 'vertical', label: 'rich', primaryAction: 'play', hoverMedia: 'preview', hoverActions: ['add-to-list', 'like'] } },
  create: { arrangement: 'masonry', section: 'none', sort: 'dropdown', filter: 'inline-chips', density: 'tight', pagination: 'infinite', feature: 'none', order: 'popularity', item: { surface: 'none', orientation: 'vertical', label: 'title', primaryAction: 'open', hoverMedia: 'none', hoverActions: ['remix', 'like', 'download'] } },
  shop: { arrangement: 'uniform-grid', section: 'themed-shelves', sort: 'dropdown', filter: 'sidebar', density: 'moderate', pagination: 'pagination', feature: 'none', order: 'relevance', item: { surface: 'none', orientation: 'vertical', label: 'transactional', primaryAction: 'quick-view', hoverMedia: 'none', hoverActions: ['add-to-cart', 'save'] } },
  archive: { arrangement: 'justified-rows', section: 'grouped', sort: 'none', filter: 'none', density: 'tight', pagination: 'infinite', feature: 'none', order: 'time', item: { surface: 'none', orientation: 'vertical', label: 'none', primaryAction: 'open', hoverMedia: 'none', hoverActions: ['select', 'download'] } },
  showcase: { arrangement: 'uniform-grid', section: 'none', sort: 'dropdown', filter: 'inline-chips', density: 'moderate', pagination: 'infinite', feature: 'none', order: 'popularity', item: { surface: 'none', orientation: 'vertical', label: 'rich', primaryAction: 'open', hoverMedia: 'preview', hoverActions: ['save', 'like', 'message'] } },
  social: { arrangement: 'dense-grid', section: 'none', sort: 'none', filter: 'none', density: 'tight', pagination: 'infinite', feature: 'none', order: 'time', item: { surface: 'none', orientation: 'vertical', label: 'none', primaryAction: 'open', hoverMedia: 'reveal-info', hoverActions: [] } },
};

// ── Data (the collection IN; sort/filter fields drive the data-rule axes) ────
export const DATA: DataField[] = [
  { slot: 'gallery', field: 'items', type: 'Item[]', direction: 'in', cardinality: 'many', note: 'the collection — each Item feeds one tile (the item slot → MediaTile)' },
  { slot: 'arrangement', field: 'sortKey', type: 'string | number | date', direction: 'in', cardinality: 'many', drives: ['order'], note: 'the sortable fields of an Item' },
  { slot: 'controls', field: 'filterKey', type: 'enum | number | date | string', direction: 'in', cardinality: 'many', drives: ['filter'], note: 'the filterable fields → the Filter pattern' },
];

// ── State (selection set + paging cursor + the async resource) ────────────────
export const STATE: StateEntry[] = [
  { slot: 'gallery', name: 'resource', of: 'AsyncResource<Item[]>', control: 'local', note: 'the adapter’s items(query) status — pending / error / empty / ready; drives the feedback below' },
  { slot: 'gallery', name: 'selection', of: 'Set<ItemId>', control: 'controllable', note: 'the selected set (mode gated by the selection axis); controllable when the app owns it (store/URL)' },
  { slot: 'arrangement', name: 'page', of: 'cursor | pageIndex', control: 'controllable', note: 'local for infinite scroll; controllable for URL-synced pagination' },
];

// ── Feedback (the resource STATUS rendered — ready IS the content; the rest are UI) ──
export const FEEDBACK: Feedback[] = [
  { slot: 'arrangement', status: 'pending', repr: '<Grid>{<Skeleton> per cell}</Grid>', note: 'a skeleton of the arrangement while items load' },
  { slot: 'gallery', status: 'error', repr: '<Alert variant="error"> + retry <Button>', note: 'the fetch failed' },
  { slot: 'arrangement', status: 'empty', repr: '<EmptyState>', note: 'the query returned nothing' },
  { slot: 'arrangement', status: 'ready', repr: '— the resolved content (section → arrangement → tiles)' },
];

// ── The pattern, as a matchable record ───────────────────────────────────────
export const itemGallery = {
  name: 'ItemGallery',
  intent:
    'A grid or feed of items you scan and open — each a thumbnail with a title and quick actions. It’s the shape behind photo galleries, product grids, people directories, and file browsers.',
  synonyms: ['gallery', 'grid', 'feed', 'catalog', 'directory', 'browse', 'masonry', 'thumbnails', 'card grid', 'product grid', 'media wall'],
  appliesWhen: [
    'your data is a collection of similar items',
    'each item has a lead image, video, or avatar',
    'the user scans many items and opens one',
    'a photo gallery, product catalog, people directory, or file browser',
  ],
  useCases: ['discover', 'consume', 'create', 'shop', 'archive', 'showcase', 'social'] as const,
  axes: AXES,
  skeleton: SKELETON,
  bindings: BINDINGS,
  actions: ACTIONS,
  presets: PRESETS,
  heuristics: HEURISTICS,
  data: DATA,
  state: STATE,
  feedback: FEEDBACK,
} as const satisfies DesignPatternSpec;

// ── SCHEMA read off this (→ DesignPatternSpec) ───────────────────────────────
// A *design pattern* (parameterized) =
//   { name, intent, synonyms, appliesWhen, useCases, // matchable; useCase is the driver
//     axes: AxisSpec[],                      // each tagged decidedBy + gloss
//     skeleton: SlotSpec[],                  // structure — COVERAGE lives here; slots may delegate (designPattern)
//     bindings: Binding[],                   // axis VALUE → Move node per slot (a value not listed can't be built)
//     actions, presets,                      // action vocabulary; useCase defaults (incl. pinned tile config)
//     heuristics: Heuristic[] }              // axis-scoped; checkable → oracle
// Composition: ItemGallery = Gallery ∘ Item — the item/controls slots delegate to the
// MediaTile / Filter patterns; the host pins a subset of each child's axes as config.
