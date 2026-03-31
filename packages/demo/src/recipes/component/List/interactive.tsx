import ListInteractive from '@recipes/component/List/interactive';
import code from '@recipes/component/List/interactive.tsx?raw';
import type { Recipe } from '../../types';

export const recipe: Recipe = {
  id: 'list:interactive',
  title: 'Interactive Items',
  description: 'Clickable list items with active, disabled, and hover states.',
  type: 'component',
  component: 'List',
  relatedComponents: ['Avatar', 'Badge'],
  render: ListInteractive,
  code,
};
