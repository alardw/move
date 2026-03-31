import SearchFilter from '@recipes/composite/data/SearchFilter';
import code from '@recipes/composite/data/SearchFilter.tsx?raw';
import type { Recipe } from '../../../types';

export const recipe: Recipe = {
  id: 'data/search-filter:basic',
  title: 'Basic',
  description: 'Search input with filter dialog and active filter chips.',
  type: 'composite',
  component: 'Search & filter',
  relatedComponents: ['InputText', 'Button', 'Dialog', 'Checkbox', 'Badge', 'Icon', 'Stack'],
  render: SearchFilter,
  code,
};
