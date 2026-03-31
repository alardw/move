import ListWithAvatar from '@recipes/component/List/with-avatar';
import code from '@recipes/component/List/with-avatar.tsx?raw';
import type { Recipe } from '../../types';

export const recipe: Recipe = {
  id: 'list:with-avatar',
  title: 'With Avatar and Trailing Stack',
  description: 'Trailing zone with two rows of data using Stack: badge on top, date below.',
  type: 'component',
  component: 'List',
  relatedComponents: ['Avatar', 'Badge', 'Stack', 'Text'],
  render: ListWithAvatar,
  code,
};
