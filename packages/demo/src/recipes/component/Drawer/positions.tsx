import DrawerPositions from '@recipes/component/Drawer/positions';
import code from '@recipes/component/Drawer/positions.tsx?raw';
import type { Recipe } from '../../types';

export const recipe: Recipe = {
  id: 'drawer:positions',
  title: 'Positions',
  description: 'Drawer can slide in from any edge: left, right, top, or bottom',
  type: 'component',
  component: 'Drawer',
  render: DrawerPositions,
  code,
};
