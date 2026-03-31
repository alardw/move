import BasicDrawer from '@recipes/component/Drawer/basic';
import code from '@recipes/component/Drawer/basic.tsx?raw';
import type { Recipe } from '../../types';

export const recipe: Recipe = {
  id: 'drawer:basic',
  title: 'Basic',
  description: 'Minimal drawer with header, body, and footer actions',
  type: 'component',
  component: 'Drawer',
  render: BasicDrawer,
  code,
};
