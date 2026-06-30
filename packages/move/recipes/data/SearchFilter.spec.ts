// SearchFilter.spec.ts — Recipe specification
//
// NOTE: the current source hardcodes its user-facing strings (no `labels`
// prop). The labels below are the INTENDED i18n contract; `recipe-validate`
// will flag the source until it is retrofitted to use them.

import type { RecipeSpec } from '../spec-type';

export const spec = {
  schemaVersion: 1,
  name: 'SearchFilter',
  slug: 'search-filter',
  group: 'Data',
  groupSlug: 'data',
  title: 'Search & filter',
  description: 'Search input with a filter dialog and active filter chips over a live list.',
  synonyms: ['search', 'filter', 'chips', 'facets', 'query'],
  composition: [
    'Stack',
    'InputText',
    'Button',
    'Badge',
    'Dialog',
    'Checkbox',
    'FormField',
    'Icon',
    'List',
  ],
  behaviors: [
    'Search input filters the list live by name and email.',
    'A Filters dialog presents grouped checkboxes (Status, Department). Filters combine AND across groups and OR within a group.',
    'Pending filter selections apply only on "Apply"; cancelling or closing discards them.',
    'Active filters render as removable chips, with a "clear all" action.',
    'The Filters button shows a count badge of active filters.',
    'An empty state is shown when no items match.',
    'The list re-animates on search/filter change (animateKey).',
    'All user-facing copy is supplied through the labels prop (i18n).',
  ],
  integrationPoints: [
    {
      id: 'data',
      kind: 'data',
      description: 'Provide the real records to search/filter (replaces SAMPLE_DATA).',
    },
    {
      id: 'filterOptions',
      kind: 'data',
      description: 'Provide the available filter facets (replaces SAMPLE_FILTER_OPTIONS).',
    },
  ],
  labels: [
    { key: 'searchPlaceholder', default: 'Search...', description: 'Search input placeholder.' },
    { key: 'filtersButton', default: 'Filters', description: 'Open-filters button text.' },
    { key: 'clearAll', default: 'Clear all', description: 'Clear-filters action text.' },
    { key: 'filtersTitle', default: 'Filters', description: 'Filter dialog title.' },
    { key: 'cancel', default: 'Cancel', description: 'Dialog cancel button.' },
    { key: 'apply', default: 'Apply', description: 'Dialog apply button.' },
    { key: 'noResultsTitle', default: 'No results', description: 'Empty-state title.' },
    {
      key: 'noResultsDescription',
      default: 'Try adjusting your search or filters.',
      description: 'Empty-state description.',
    },
  ],
  preview: { width: 'lg' },
} satisfies RecipeSpec;
