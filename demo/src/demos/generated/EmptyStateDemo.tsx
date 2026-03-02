// Generated from EmptyState.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import { EmptyState, Button } from 'move';
import type { DemoDefinition } from '../types';

export const demo: DemoDefinition = {
  id: 'loading:EmptyState',
  name: 'EmptyState',
  category: 'loading',
  description: 'Centered placeholder for empty views with icon, title, description, and optional action',
  controls: [
    {
      name: 'icon',
      kind: 'text',
      defaultValue: 'image-off',
    },
    {
      name: 'title',
      kind: 'text',
      defaultValue: 'No items found',
    },
    {
      name: 'description',
      kind: 'text',
      defaultValue: 'There are no items to display at this time. Try adding a new item to get started.',
    },
    {
      name: 'size',
      kind: 'select',
      options: ['sm', 'md', 'lg'],
      defaultValue: 'md',
    },
    {
      name: 'showAction',
      kind: 'boolean',
      defaultValue: true,
    },
  ],
  initialProps: {
    icon: 'image-off',
    title: 'No items found',
    description: 'There are no items to display at this time. Try adding a new item to get started.',
    size: 'md',
    showAction: true,
  },
  render: (props) => (
    <EmptyState
      icon={props.icon as string}
      title={props.title as string}
      description={props.description as string}
      size={props.size as string}
      action={props.showAction ? <Button variant="primary" size="sm">Add item</Button> : undefined}
    />
  ),
};
