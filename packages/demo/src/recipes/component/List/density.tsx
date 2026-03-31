import ListDensity from '@recipes/component/List/density';
import code from '@recipes/component/List/density.tsx?raw';
import type { Recipe } from '../../types';

export const recipe: Recipe = {
  id: 'list:density',
  title: 'Density',
  description: 'Compact, default, and comfortable density for different contexts.',
  type: 'component',
  component: 'List',
  relatedComponents: ['Avatar'],
  render: ListDensity,
  code,
};
