import DetailWithTabs from '@recipes/composite/page/DetailWithTabs';
import code from '@recipes/composite/page/DetailWithTabs.tsx?raw';
import type { Recipe } from '../../../types';

export const recipe: Recipe = {
  id: 'page/detail:with-tabs',
  title: 'With Tabs',
  description: 'Entity detail with tabbed sections for details, activity timeline, and related items.',
  type: 'composite',
  component: 'Detail page',
  relatedComponents: ['Stack', 'Card', 'Heading', 'Text', 'Badge', 'Breadcrumb', 'Button', 'Tabs', 'Divider', 'Timeline', 'Icon'],
  render: DetailWithTabs,
  code,
};
