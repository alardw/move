// Generated from Pagination.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import { Pagination } from 'move';
import type { DemoDefinition } from '../types';

const Component = Pagination as any;

export const demo: DemoDefinition = {
  id: 'navigation:Pagination',
  name: 'Pagination',
  category: 'navigation',
  description: 'Page navigation control with numbered buttons, prev/next triggers, sliding active indicator, and staggered spring entrance animation',
  controls: [
    {
      name: 'total',
      kind: 'select',
      options: ['5', '10', '20', '50'],
      defaultValue: '10',
    },
    {
      name: 'size',
      kind: 'select',
      options: ['sm', 'md', 'lg'],
      defaultValue: 'md',
    },
    {
      name: 'variant',
      kind: 'select',
      options: ['default', 'outline'],
      defaultValue: 'default',
    },
    {
      name: 'siblings',
      kind: 'select',
      options: ['0', '1', '2', '3'],
      defaultValue: '1',
    },
    {
      name: 'boundaries',
      kind: 'select',
      options: ['0', '1', '2'],
      defaultValue: '1',
    },
  ],
  initialProps: {
    total: '10',
    size: 'md',
    variant: 'default',
    siblings: '1',
    boundaries: '1',
  },
  render: (props) => {
    const total = Number(props.total) || 10;
    const size = (props.size as string) || 'md';
    const variant = (props.variant as string) || 'default';
    const siblings = Number(props.siblings) ?? 1;
    const boundaries = Number(props.boundaries) ?? 1;

    return (
      <Component.Root total={total} defaultPage={1} size={size} variant={variant} siblings={siblings} boundaries={boundaries}>
        <Component.PrevTrigger />
        <Component.Items />
        <Component.NextTrigger />
      </Component.Root>
    );
  },
};
