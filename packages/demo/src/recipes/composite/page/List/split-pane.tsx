import ListSplitPane from '@recipes/composite/page/ListSplitPane';
import code from '@recipes/composite/page/ListSplitPane.tsx?raw';
import type { Recipe } from '../../../types';

export const recipe: Recipe = {
  id: 'page/list:split-pane',
  title: 'Split Pane',
  description: 'Master-detail inbox layout with resizable split pane.',
  type: 'composite',
  component: 'List page',
  relatedComponents: ['Stack', 'Heading', 'Text', 'Splitter', 'ScrollArea', 'List', 'Badge', 'Button', 'Divider', 'Icon', 'Avatar'],
  render: ListSplitPane,
  code,
};
