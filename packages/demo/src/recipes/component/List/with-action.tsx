import ListWithAction from '@recipes/component/List/with-action';
import code from '@recipes/component/List/with-action.tsx?raw';
import type { Recipe } from '../../types';

export const recipe: Recipe = {
  id: 'list:with-action',
  title: 'With Action Button',
  description: 'Trailing zone with badge, button, and chevron icon.',
  type: 'component',
  component: 'List',
  relatedComponents: ['Avatar', 'Button', 'Badge', 'Icon'],
  render: ListWithAction,
  code,
};
