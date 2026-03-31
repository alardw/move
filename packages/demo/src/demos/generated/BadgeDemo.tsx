// Generated from Badge.spec.ts (schemaVersion: 6, specHash: ddc033c4)
import { Badge } from 'move';
import type { DemoDefinition } from '../types';

const PALETTE_COLORS = ['gray', 'red', 'pink', 'grape', 'violet', 'indigo', 'blue', 'cyan', 'teal', 'green', 'lime', 'yellow', 'orange'];

export const demo: DemoDefinition = {
  id: 'core:Badge',
  name: 'Badge',
  category: 'core',
  description: 'Inline status label with variant, color, and size options',
  controls: [
    {
      name: 'variant',
      kind: 'select',
      options: ['solid', 'soft', 'surface', 'outline', 'dot'],
      defaultValue: 'solid',
    },
    {
      name: 'color',
      kind: 'select',
      options: ['default', 'primary', 'success', 'warning', 'danger', 'info', ...PALETTE_COLORS],
      defaultValue: 'default',
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
    variant: 'solid',
    color: 'default',
    size: 'md',
    children: 'Badge',
  },
  render: (props) => (
    <Badge
      variant={props.variant as string}
      color={props.color as string}
      size={props.size as string}
    >
      {props.children as string}
    </Badge>
  ),
};
