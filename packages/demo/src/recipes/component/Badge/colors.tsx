import BadgeColors from '@recipes/component/Badge/colors';
import code from '@recipes/component/Badge/colors.tsx?raw';
import type { Recipe } from '../../types';

export const recipe: Recipe = {
  id: 'badge:colors',
  title: 'Colors',
  description: 'All 13 palette colors across solid, soft, and outline variants.',
  type: 'component',
  component: 'Badge',
  render: BadgeColors,
  code,
};
