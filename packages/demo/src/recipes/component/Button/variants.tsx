import ButtonVariants from '@recipes/component/Button/variants';
import code from '@recipes/component/Button/variants.tsx?raw';
import type { Recipe } from '../../types';

export const recipe: Recipe = {
  id: 'button:variants',
  title: 'Variants',
  description: 'All available button variants: primary, secondary, ghost, and danger.',
  type: 'component',
  component: 'Button',
  render: ButtonVariants,
  code,
};
