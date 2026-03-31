import ButtonSizes from '@recipes/component/Button/sizes';
import code from '@recipes/component/Button/sizes.tsx?raw';
import type { Recipe } from '../../types';

export const recipe: Recipe = {
  id: 'button:sizes',
  title: 'Sizes',
  description: 'Button sizes: small, medium, and large.',
  type: 'component',
  component: 'Button',
  render: ButtonSizes,
  code,
};
