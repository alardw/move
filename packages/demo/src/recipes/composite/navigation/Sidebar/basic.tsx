import AppSidebar from '@recipes/composite/navigation/AppSidebar';
import code from '@recipes/composite/navigation/AppSidebar.tsx?raw';
import type { Recipe } from '../../../types';

export const recipe: Recipe = {
  id: 'navigation/sidebar:basic',
  title: 'App Sidebar',
  description: 'Collapsible sidebar with mobile overlay, account dropdown, and i18n support.',
  type: 'composite',
  component: 'App sidebar',
  relatedComponents: ['Sidebar', 'Avatar', 'Icon', 'Text', 'Stack', 'Tooltip', 'Dropdown', 'Button', 'Badge'],
  render: AppSidebar,
  code,
};
