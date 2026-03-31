import BadgeDot from '@recipes/component/Badge/dot';
import code from '@recipes/component/Badge/dot.tsx?raw';
import type { Recipe } from '../../types';

export const recipe: Recipe = {
  id: 'badge:dot',
  title: 'Dot Indicator',
  description: 'Dot variant for status indicators with colored dot.',
  type: 'component',
  component: 'Badge',
  render: BadgeDot,
  code,
};
