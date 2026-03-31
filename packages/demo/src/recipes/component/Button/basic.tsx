import BasicButton from '@recipes/component/Button/basic';
import code from '@recipes/component/Button/basic.tsx?raw';
import type { Recipe } from '../../types';

export const recipe: Recipe = {
  id: 'button:basic',
  title: 'Basic',
  description: 'A simple button with default settings.',
  type: 'component',
  component: 'Button',
  render: BasicButton,
  code,
};
