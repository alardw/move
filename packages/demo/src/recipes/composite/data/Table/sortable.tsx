import SortableTable from '@recipes/component/Table/sortable';
import code from '@recipes/component/Table/sortable.tsx?raw';
import type { Recipe } from '../../../types';

export const recipe: Recipe = {
  id: 'data/table:sortable',
  title: 'Sortable',
  description: 'Sortable column headers with ascending/descending toggle.',
  type: 'component',
  component: 'Table',
  render: SortableTable,
  code,
};
