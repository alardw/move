import ListSizes from '@recipes/component/List/sizes';
import code from '@recipes/component/List/sizes.tsx?raw';
import type { Recipe } from '../../types';

export const recipe: Recipe = {
  id: 'list:sizes',
  title: 'Sizes',
  description: 'List sizes: small, medium, and large.',
  type: 'component',
  component: 'List',
  render: ListSizes,
  code,
};
