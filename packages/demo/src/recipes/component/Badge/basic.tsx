import BasicBadge from '@recipes/component/Badge/basic';
import code from '@recipes/component/Badge/basic.tsx?raw';
import type { Recipe } from '../../types';

export const recipe: Recipe = {
  id: 'badge:basic',
  title: 'Basic',
  description: 'A simple badge with default settings.',
  type: 'component',
  component: 'Badge',
  render: BasicBadge,
  code,
};
