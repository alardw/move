import ListLineClamp from '@recipes/component/List/line-clamp';
import code from '@recipes/component/List/line-clamp.tsx?raw';
import type { Recipe } from '../../types';

export const recipe: Recipe = {
  id: 'list:line-clamp',
  title: 'Line Clamping',
  description: 'Description truncation with 1, 2, 3 lines, or no limit.',
  type: 'component',
  component: 'List',
  relatedComponents: ['Avatar'],
  render: ListLineClamp,
  code,
};
