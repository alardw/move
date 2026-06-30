// FilterableDataTable.spec.ts — Recipe specification

import type { CompositionSpec } from '../spec-type';

export const spec = {
  schemaVersion: 1,
  name: 'FilterableDataTable',
  composition: [
    'Table',
    'Stack',
    'InputText',
    'Button',
    'Text',
    'Badge',
    'Pagination',
    'Icon',
    'Dialog',
    'Checkbox',
    'FormField',
  ],
  behaviors: [
    'Search filters rows live by name and email.',
    'Columns render in shape order and are sortable; the table loads unsorted, the first click on a header sorts ascending, and further clicks toggle ascending/descending.',
    'A Filters dialog presents grouped checkboxes (Status, Role); pending selections apply only on "Apply". Filters combine AND across groups and OR within a group.',
    'Active filters render as removable chips, with a "clear all" action and a count badge.',
    'Pagination shows 5 rows per page; the page resets to 1 on search, filter, or sort change.',
    'A "showing X–Y of N" summary reflects the filtered result set.',
    'An empty row is shown when no rows match.',
    'All user-facing copy is supplied through the labels prop (i18n).',
  ],
  integrationPoints: [
    {
      id: 'data',
      kind: 'data',
      description: 'Provide the real rows to display (replaces SAMPLE_DATA).',
      shape: [
        { name: 'name', type: 'string', note: 'Name column.', searchable: true, sortable: true },
        {
          name: 'role',
          type: 'enum',
          note: 'Role column / filter facet.',
          sortable: true,
          filterable: true,
        },
        { name: 'email', type: 'string', note: 'Email column.', searchable: true, sortable: true },
        {
          name: 'status',
          type: 'enum',
          note: 'Status badge column / filter facet.',
          sortable: true,
          filterable: true,
          render: 'badge',
        },
      ],
    },
    {
      id: 'filterOptions',
      kind: 'data',
      description: 'Provide the available filter facets (replaces SAMPLE_FILTER_OPTIONS).',
      shape: [
        { name: 'label', type: 'string', note: 'Facet display label.' },
        { name: 'value', type: 'string', note: 'Matches a row field value (status/role).' },
        { name: 'group', type: 'enum', note: 'Facet group heading (Status / Role).' },
      ],
    },
  ],
  labels: [
    { key: 'searchPlaceholder', default: 'Search...', description: 'Search input placeholder.' },
    { key: 'filtersButton', default: 'Filters', description: 'Open-filters button text.' },
    { key: 'clearAll', default: 'Clear all', description: 'Clear-filters action text.' },
    { key: 'cancel', default: 'Cancel', description: 'Dialog cancel button.' },
    { key: 'apply', default: 'Apply', description: 'Dialog apply button.' },
    { key: 'filtersTitle', default: 'Filters', description: 'Filter dialog title.' },
    { key: 'statusGroup', default: 'Status', description: 'Status filter group label.' },
    { key: 'roleGroup', default: 'Role', description: 'Role filter group label.' },
    { key: 'name', default: 'Name', description: 'Name column header.' },
    { key: 'role', default: 'Role', description: 'Role column header.' },
    { key: 'email', default: 'Email', description: 'Email column header.' },
    { key: 'status', default: 'Status', description: 'Status column header.' },
    { key: 'noResults', default: 'No results found.', description: 'Empty-table message.' },
    {
      key: 'showing',
      default: 'Showing {from}–{to} of {total}',
      description: 'Result-count summary.',
      params: ['from', 'to', 'total'],
    },
  ],
} satisfies CompositionSpec;
