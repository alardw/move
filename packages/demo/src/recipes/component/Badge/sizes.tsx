import BadgeSizes from '@recipes/component/Badge/sizes';
import code from '@recipes/component/Badge/sizes.tsx?raw';
import type { Recipe } from '../../types';

export const recipe: Recipe = {
  id: 'badge:sizes',
  title: 'Sizes',
  description: 'Badge sizes: small, medium, and large.',
  type: 'component',
  component: 'Badge',
  render: BadgeSizes,
  code,
};
