// Generated from Alert.spec.ts (schemaVersion: 6, specHash: b9fbaaa9)
import { Alert } from 'move';
import type { DemoDefinition } from '../types';

export const demo: DemoDefinition = {
  id: 'core:Alert',
  name: 'Alert',
  category: 'core',
  description: 'Dismissible alert banner with variant colors, icon, title, and enter/exit animation',
  controls: [
    {
      name: 'variant',
      kind: 'select',
      options: ['info', 'success', 'warning', 'danger'],
      defaultValue: 'info',
    },
    {
      name: 'size',
      kind: 'select',
      options: ['sm', 'md', 'lg'],
      defaultValue: 'md',
    },
    {
      name: 'icon',
      kind: 'boolean',
      defaultValue: true,
    },
    {
      name: 'title',
      kind: 'text',
      defaultValue: 'Alert title',
    },
    {
      name: 'closable',
      kind: 'boolean',
      defaultValue: false,
    },
    {
      name: 'children',
      kind: 'text',
      defaultValue: 'This is an alert description with important information.',
    },
  ],
  initialProps: {
    variant: 'info',
    size: 'md',
    icon: true,
    title: 'Alert title',
    closable: false,
    children: 'This is an alert description with important information.',
  },
  render: (props) => (
    <Alert
      variant={props.variant as string}
      size={props.size as string}
      icon={props.icon as boolean}
      title={props.title as string}
      closable={props.closable as boolean}
    >
      {props.children as string}
    </Alert>
  ),
};
