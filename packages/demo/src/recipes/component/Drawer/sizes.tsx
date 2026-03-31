import DrawerSizes from '@recipes/component/Drawer/sizes';
import code from '@recipes/component/Drawer/sizes.tsx?raw';
import type { Recipe } from '../../types';

export const recipe: Recipe = {
  id: 'drawer:sizes',
  title: 'Sizes',
  description: 'Drawer width presets from xs to xl',
  type: 'component',
  component: 'Drawer',
  render: DrawerSizes,
  code,
};
