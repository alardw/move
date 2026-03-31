import ListBasic from '@recipes/composite/page/ListBasic';
import code from '@recipes/composite/page/ListBasic.tsx?raw';
import type { Recipe } from '../../../types';

export const recipe: Recipe = {
  id: 'page/list:basic',
  title: 'Basic',
  description: 'Searchable data table with pagination and empty state.',
  type: 'composite',
  component: 'List page',
  relatedComponents: ['Stack', 'Card', 'Heading', 'Text', 'Table', 'Badge', 'Button', 'InputText', 'Pagination', 'EmptyState', 'Icon'],
  render: ListBasic,
  code,
};
