// Generated from Timeline.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import { Timeline } from 'move';
import type { DemoDefinition } from '../types';

const PALETTE_COLORS = ['gray', 'red', 'pink', 'grape', 'violet', 'indigo', 'blue', 'cyan', 'teal', 'green', 'lime', 'yellow', 'orange'];

export const demo: DemoDefinition = {
  id: 'data:Timeline',
  name: 'Timeline',
  category: 'data',
  description: 'Vertical timeline with progress tracking, custom bullets, color-coded states, alternate alignment, and staggered entrance animation',
  controls: [
    {
      name: 'active',
      kind: 'select',
      options: ['-1', '0', '1', '2', '3'],
      defaultValue: '1',
    },
    {
      name: 'align',
      kind: 'select',
      options: ['left', 'right', 'alternate'],
      defaultValue: 'left',
    },
    {
      name: 'size',
      kind: 'select',
      options: ['sm', 'md', 'lg'],
      defaultValue: 'md',
    },
    {
      name: 'color',
      kind: 'select',
      options: PALETTE_COLORS,
      defaultValue: 'indigo',
    },
    {
      name: 'lineVariant',
      kind: 'select',
      options: ['solid', 'dashed', 'dotted'],
      defaultValue: 'solid',
    },
  ],
  initialProps: {
    active: '1',
    align: 'left',
    size: 'md',
    color: 'indigo',
    lineVariant: 'solid',
  },
  render: (props) => (
    <Timeline
      active={Number(props.active)}
      align={props.align as string}
      size={props.size as string}
      color={props.color as string}
      lineVariant={props.lineVariant as string}
    >
      <Timeline.Item title="Order placed">
        Your order has been placed and is being processed.
      </Timeline.Item>
      <Timeline.Item title="Payment confirmed" bullet={<span>$</span>}>
        Payment has been successfully processed.
      </Timeline.Item>
      <Timeline.Item title="Shipped" color="green">
        Your package is on its way to the destination.
      </Timeline.Item>
      <Timeline.Item title="Delivered">
        Package has been delivered to the address.
      </Timeline.Item>
    </Timeline>
  ),
};
