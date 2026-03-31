import DrawerWithTrigger from '@recipes/component/Drawer/with-trigger';
import code from '@recipes/component/Drawer/with-trigger.tsx?raw';
import type { Recipe } from '../../types';

export const recipe: Recipe = {
  id: 'drawer:with-trigger',
  title: 'With Trigger',
  description: 'Uncontrolled drawer using the built-in Trigger sub-component',
  type: 'component',
  component: 'Drawer',
  render: DrawerWithTrigger,
  code,
};
