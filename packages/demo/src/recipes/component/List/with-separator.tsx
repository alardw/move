import ListWithoutSeparator from '@recipes/component/List/with-separator';
import code from '@recipes/component/List/with-separator.tsx?raw';
import type { Recipe } from '../../types';

export const recipe: Recipe = {
  id: 'list:without-separator',
  title: 'Without Separator',
  description: 'Separator is on by default. Set separator={false} to use CSS border dividers instead, or dividers={false} for no dividers at all.',
  type: 'component',
  component: 'List',
  render: ListWithoutSeparator,
  code,
};
