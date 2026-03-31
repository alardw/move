import BasicTable from '@recipes/component/Table/basic';
import code from '@recipes/component/Table/basic.tsx?raw';
import type { Recipe } from '../../../types';

export const recipe: Recipe = {
  id: 'data/table:basic',
  title: 'Basic',
  description: 'A simple data table with hoverable rows.',
  type: 'component',
  component: 'Table',
  render: BasicTable,
  code,
};
