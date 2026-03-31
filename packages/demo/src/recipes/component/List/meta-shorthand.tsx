import ListMetaShorthand from '@recipes/component/List/meta-shorthand';
import code from '@recipes/component/List/meta-shorthand.tsx?raw';
import type { Recipe } from '../../types';

export const recipe: Recipe = {
  id: 'list:meta-shorthand',
  title: 'Meta Shorthand',
  description: 'Using List.Meta for concise avatar + title + description layout.',
  type: 'component',
  component: 'List',
  relatedComponents: ['Avatar', 'Badge'],
  render: ListMetaShorthand,
  code,
};
