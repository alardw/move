import FilterableDataTable from '@recipes/composite/data/FilterableDataTable';
import code from '@recipes/composite/data/FilterableDataTable.tsx?raw';
import type { Recipe } from '../../../types';

export const recipe: Recipe = {
  id: 'data/table:with-pagination',
  title: 'Filterable data table',
  description: 'Full-featured data table with search, filters, sorting, and pagination.',
  type: 'composite',
  component: 'Filterable data table',
  relatedComponents: ['Table', 'InputText', 'Button', 'Dialog', 'Checkbox', 'Pagination', 'Badge', 'Icon', 'Stack'],
  render: FilterableDataTable,
  code,
};
