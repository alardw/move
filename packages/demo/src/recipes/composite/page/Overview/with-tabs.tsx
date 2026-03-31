import OverviewWithTabs from '@recipes/composite/page/OverviewWithTabs';
import code from '@recipes/composite/page/OverviewWithTabs.tsx?raw';
import type { Recipe } from '../../../types';

export const recipe: Recipe = {
  id: 'page/overview:with-tabs',
  title: 'With Tabs',
  description: 'Tabbed dashboard with overview stats, analytics, and reports sections.',
  type: 'composite',
  component: 'Overview page',
  relatedComponents: ['Stack', 'Grid', 'Card', 'Heading', 'Text', 'Tabs', 'Badge', 'Icon'],
  render: OverviewWithTabs,
  code,
};
