import ButtonDisabled from '@recipes/component/Button/disabled';
import code from '@recipes/component/Button/disabled.tsx?raw';
import type { Recipe } from '../../types';

export const recipe: Recipe = {
  id: 'button:disabled',
  title: 'Disabled',
  description: 'Buttons in disabled state across variants.',
  type: 'component',
  component: 'Button',
  render: ButtonDisabled,
  code,
};
