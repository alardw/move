/**
 * DRAFT — `Filter`: a child design pattern of ItemGallery (and of any collection).
 *
 * The refine chrome a collection shares — data-derived facets, a sort control, and a
 * readback of what's active. Extracted from ItemGallery's `controls` subtree: the parent
 * delegates its `controls` slot to this pattern (`as: 'pattern' → filter`) and pins a few
 * of these axes as config; the rest fall to Filter's own defaults. DataTable, search
 * results, and map views compose the same pattern.
 *
 * Its axes are documented HERE (once). A host pattern references Filter and documents only
 * the config it pins — never re-listing these axes.
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

// ── Axes (the control's decision space) ──────────────────────────────────────
export const AXES: AxisSpec[] = [
  { axis: 'source', level: 'filter', decidedBy: 'data-rule', options: ['data-driven', 'manual'], gloss: 'Facets + their kinds derived from the item fields, or an author-supplied set — the reason Filter earns its own pattern.' },
  { axis: 'layout', level: 'filter', decidedBy: 'use-case-preset', options: ['inline-chips', 'toolbar', 'sidebar', 'drawer'], gloss: 'Where the controls sit — a chip row, a compact toolbar, a persistent sidebar, or an on-demand drawer.' },
  { axis: 'applyModel', level: 'filter', decidedBy: 'use-case-preset', options: ['live', 'apply-button'], gloss: 'When a change takes effect — immediately (live) or batched behind an Apply button.' },
  { axis: 'facetKind', level: 'facets', decidedBy: 'data-rule', options: ['toggle', 'multi-select', 'single-select', 'range', 'search', 'date-range'], gloss: 'The control per facet — chosen by the field’s data type, not taste.' },
  { axis: 'facetOverflow', level: 'facets', decidedBy: 'use-case-preset', options: ['none', 'show-more', 'search-in-facet', 'collapse'], gloss: 'How a facet with many values is tamed — never a wall of checkboxes.' },
  { axis: 'sort', level: 'sort', decidedBy: 'use-case-preset', options: ['none', 'dropdown', 'menu'], gloss: 'How order is exposed (none = fixed order) — a dropdown or a menu with direction. A control distinct from the facets. (Feed-tabs are query presets, not sorting.)' },
  { axis: 'activeDisplay', level: 'active', decidedBy: 'use-case-preset', options: ['none', 'chips', 'summary', 'count'], gloss: 'How the active filters are read back — removable chips, a text summary, or just a result count.' },
];

// ── Skeleton (filter is the root of the control) ─────────────────────────────
export const SKELETON: SlotSpec[] = [
  { slot: 'filter', parent: null, drivenBy: ['source', 'layout', 'applyModel'], role: 'The control region — where facets, sort, and the active readback sit.' },
  { slot: 'facets', parent: 'filter', drivenBy: ['facetKind', 'facetOverflow'], role: 'The set of facet controls, one per filterable field.' },
  { slot: 'sort', parent: 'filter', drivenBy: ['sort'], role: 'The order control.', optional: true },
  { slot: 'active', parent: 'filter', drivenBy: ['activeDisplay'], role: 'The readback of what’s currently filtered, with clear.', optional: true },
];

// ── Bindings (axis value → concrete Move representation) ──────────────────────
export const BINDINGS: Binding[] = [
  { slot: 'filter', axis: 'source', value: 'data-driven', as: 'behavior', repr: 'facets + kinds derived from item fields (field type → facetKind)' },
  { slot: 'filter', axis: 'source', value: 'manual', as: 'behavior', repr: 'the author supplies the facet set explicitly' },
  { slot: 'filter', axis: 'layout', value: 'inline-chips', as: 'node', repr: '<Stack direction="row" wrap>{<ToggleGroup> per facet}</Stack>' },
  { slot: 'filter', axis: 'layout', value: 'toolbar', as: 'node', repr: '<Stack direction="row">{compact facet controls + <Select> sort}</Stack>' },
  { slot: 'filter', axis: 'layout', value: 'sidebar', as: 'node', repr: '<Sidebar>{<Accordion> of facet groups}</Sidebar>' },
  { slot: 'filter', axis: 'layout', value: 'drawer', as: 'node', repr: '<Drawer>{facet groups}</Drawer>', note: 'on-demand / small screens' },
  { slot: 'filter', axis: 'applyModel', value: 'live', as: 'behavior', repr: 'each change re-queries immediately' },
  { slot: 'filter', axis: 'applyModel', value: 'apply-button', as: 'node', repr: '<Button>Apply</Button> — changes batch until submitted' },

  { slot: 'facets', axis: 'facetKind', value: 'toggle', as: 'node', repr: '<Switch> (a boolean facet — in stock, on sale)' },
  { slot: 'facets', axis: 'facetKind', value: 'multi-select', as: 'node', repr: '<Stack>{<Checkbox> per value}</Stack> (categories, tags)' },
  { slot: 'facets', axis: 'facetKind', value: 'single-select', as: 'node', repr: '<RadioGroup> or <Select> (one-of — rating, condition)' },
  { slot: 'facets', axis: 'facetKind', value: 'range', as: 'node', repr: '<InputRange> (min–max dual thumb; or a min/max <NumberInput> pair)' },
  { slot: 'facets', axis: 'facetKind', value: 'search', as: 'node', repr: '<InputText> with a search icon (free-text within a field)' },
  { slot: 'facets', axis: 'facetKind', value: 'date-range', as: 'node', repr: '<DatePicker> range (or two <DatePicker>)' },
  { slot: 'facets', axis: 'facetOverflow', value: 'none', as: 'behavior', repr: 'all values shown' },
  { slot: 'facets', axis: 'facetOverflow', value: 'show-more', as: 'node', repr: '<Button variant="ghost">Show more</Button> after top-N values' },
  { slot: 'facets', axis: 'facetOverflow', value: 'search-in-facet', as: 'node', repr: '<Autocomplete> filters the facet’s own values' },
  { slot: 'facets', axis: 'facetOverflow', value: 'collapse', as: 'node', repr: '<Accordion> per facet group' },

  { slot: 'sort', axis: 'sort', value: 'none', as: 'behavior', repr: 'fixed order — no control' },
  { slot: 'sort', axis: 'sort', value: 'dropdown', as: 'node', repr: '<Select>{sort options}</Select>' },
  { slot: 'sort', axis: 'sort', value: 'menu', as: 'node', repr: '<Dropdown>{sort field + direction}</Dropdown>' },

  { slot: 'active', axis: 'activeDisplay', value: 'none', as: 'behavior', repr: 'no active-filter readback' },
  { slot: 'active', axis: 'activeDisplay', value: 'chips', as: 'node', repr: '<Stack direction="row" wrap>{<Badge> + remove <Button><Icon/></Button> per active}</Stack>', note: 'Badge is Move’s chip (synonyms: tag/pill/chip); removable via a trailing Button+Icon' },
  { slot: 'active', axis: 'activeDisplay', value: 'summary', as: 'node', repr: '<Text>“3 filters · Electronics, <$50”</Text> + <Button variant="ghost">Clear</Button>' },
  { slot: 'active', axis: 'activeDisplay', value: 'count', as: 'behavior', repr: 'just the result count reflects the active filters' },
];

// ── Heuristics (the control's coherence laws) ────────────────────────────────
export const HEURISTICS: Heuristic[] = [
  { id: 'F30', law: 'Facet control follows the field’s data type — categories→multi-select, one-of→single-select, numeric→range, free-text→search, dates→date-range.', kind: 'coupling', axes: ['facetKind', 'source'], checkable: true },
  { id: 'F31', law: 'Layout scales with facet count & screen: a few facets → inline-chips/toolbar; many → sidebar; small screens → drawer.', kind: 'layout', axes: ['layout', 'facetOverflow'], checkable: false },
  { id: 'F32', law: 'Apply live for cheap/local result sets; batch behind an apply-button when each query is expensive or paged.', kind: 'behavior', axes: ['applyModel'], checkable: false },
  { id: 'F33', law: 'Active filters are always read back and individually removable, with one clear-all.', kind: 'feedback', axes: ['activeDisplay'], checkable: false },
  { id: 'F34', law: 'Sort and filter are distinct controls — never fold sort options into the facet list.', kind: 'placement', axes: ['sort', 'facetKind'], checkable: false },
  { id: 'F35', law: 'A facet with many values gets tamed (show-more / search-in-facet / collapse) — never a wall of checkboxes.', kind: 'overflow', axes: ['facetOverflow'], checkable: true },
  { id: 'F36', law: 'Don’t facet a dimension the adapter already scopes — a fetched date/page range lives in the query (items(query)), not a control. Add a facet only to narrow WITHIN the fetched set.', kind: 'coupling', axes: ['facetKind', 'source'], checkable: false },
];

// ── Data (facet fields IN → the query OUT — Filter is a transducer) ──────────
export const DATA: DataField[] = [
  { slot: 'facets', field: 'filterKey', type: 'enum | number | date | string', direction: 'in', cardinality: 'many', drives: ['facetKind'], note: 'each filterable field → a facet; its type picks the facetKind' },
  { slot: 'filter', field: 'query', type: 'Query { filters, sort }', direction: 'out', cardinality: 'one', note: 'what Filter produces → feeds the collection’s items(query)' },
];

// ── State (the working draft, expansions, and the committed query) ────────────
export const STATE: StateEntry[] = [
  { slot: 'filter', name: 'draft', of: 'Query', control: 'local', note: 'the working filter+sort; committed live or on Apply (applyModel)' },
  { slot: 'facets', name: 'expanded', of: 'Set<field>', control: 'local', note: 'which facet groups are open (facetOverflow: collapse)' },
  { slot: 'active', name: 'query', of: 'Query', control: 'controllable', note: 'the committed query; controllable when the app URL-syncs filters' },
];

// ── The pattern ──────────────────────────────────────────────────────────────
export const filter = {
  name: 'Filter',
  intent:
    'The refine chrome a collection shares — data-derived facets, a sort control, and a readback of what’s active — that galleries, tables, and search results compose to narrow and order their results.',
  synonyms: ['facets', 'filters', 'refine', 'faceted search', 'filter bar', 'sort', 'facet panel'],
  appliesWhen: [
    'a collection the user needs to narrow or reorder',
    'items share fields worth filtering on (category, price, date, tags)',
    'search or catalogue results that need refinement',
  ],
  axes: AXES,
  skeleton: SKELETON,
  bindings: BINDINGS,
  heuristics: HEURISTICS,
  data: DATA,
  state: STATE,
} as const satisfies DesignPatternSpec;
