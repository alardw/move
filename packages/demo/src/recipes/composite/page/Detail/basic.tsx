import DetailBasic from '@recipes/composite/page/DetailBasic';
import code from '@recipes/composite/page/DetailBasic.tsx?raw';
import type { Recipe } from '../../../types';

export const recipe: Recipe = {
  id: 'page/detail:basic',
  title: 'Basic',
  description: 'Entity detail page with breadcrumbs, description list, and a sidebar notes card.',
  type: 'composite',
  component: 'Detail page',
  relatedComponents: ['Stack', 'Grid', 'Card', 'Heading', 'Text', 'Badge', 'Breadcrumb', 'Button', 'Divider', 'Icon'],
  render: DetailBasic,
  code,
};
