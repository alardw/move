// Generated from Badge.spec.ts (schemaVersion: 6, specHash: ddc033c4)
import { Badge } from 'move';
import type { DemoDefinition } from '../types';

export const demo: DemoDefinition = {
  id: 'core:Badge',
  name: 'Badge',
  category: 'core',
  description: 'Inline status label with variant and size options',
  controls: [
    {
      name: 'variant',
      kind: 'select',
      options: ['primary', 'secondary', 'outline', 'success', 'warning', 'danger'],
      defaultValue: 'primary',
    },
    {
      name: 'size',
      kind: 'select',
      options: ['sm', 'md', 'lg'],
      defaultValue: 'md',
    },
    {
      name: 'children',
      kind: 'text',
      defaultValue: 'Badge',
    },
  ],
  initialProps: {
    variant: 'primary',
    size: 'md',
    children: 'Badge',
  },
  render: (props) => (
    <Badge
      variant={props.variant as string}
      size={props.size as string}
    >
      {props.children as string}
    </Badge>
  ),
};
