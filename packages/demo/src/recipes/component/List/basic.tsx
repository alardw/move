import BasicList from '@recipes/component/List/basic';
import code from '@recipes/component/List/basic.tsx?raw';
import type { Recipe } from '../../types';

export const recipe: Recipe = {
  id: 'list:basic',
  title: 'Basic',
  description: 'A simple stacked list with title and description.',
  type: 'component',
  component: 'List',
  render: BasicList,
  code,
};
