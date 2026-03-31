import ButtonWithIcon from '@recipes/component/Button/with-icon';
import code from '@recipes/component/Button/with-icon.tsx?raw';
import type { Recipe } from '../../types';

export const recipe: Recipe = {
  id: 'button:with-icon',
  title: 'With Icon',
  description: 'Buttons with icons in various positions.',
  type: 'component',
  component: 'Button',
  relatedComponents: ['Icon'],
  render: ButtonWithIcon,
  code,
};
