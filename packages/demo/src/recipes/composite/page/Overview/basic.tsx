import OverviewBasic from '@recipes/composite/page/OverviewBasic';
import code from '@recipes/composite/page/OverviewBasic.tsx?raw';
import type { Recipe } from '../../../types';

export const recipe: Recipe = {
  id: 'page/overview:basic',
  title: 'Basic',
  description: 'Dashboard overview with KPI stat cards and recent activity feed.',
  type: 'composite',
  component: 'Overview page',
  relatedComponents: ['Stack', 'Grid', 'Card', 'Heading', 'Text', 'Badge', 'Divider', 'Button', 'Icon'],
  render: OverviewBasic,
  code,
};
