import BadgeVariants from '@recipes/component/Badge/variants';
import code from '@recipes/component/Badge/variants.tsx?raw';
import type { Recipe } from '../../types';

export const recipe: Recipe = {
  id: 'badge:variants',
  title: 'Variants',
  description: 'All badge variants: solid, soft, surface, outline, and dot.',
  type: 'component',
  component: 'Badge',
  render: BadgeVariants,
  code,
};
