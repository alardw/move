import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Timeline } from './Timeline';

const meta: Meta = {
  title: 'Data/Timeline',
  component: Timeline.Root,
  argTypes: {
    active: {
      control: 'number',
      description: 'Index of the active item. Items before it show as completed.',
      table: { defaultValue: { summary: '-1' } },
    },
    align: {
      control: 'select',
      options: ['left', 'right', 'alternate'],
      description: 'Bullet position.',
      table: { defaultValue: { summary: 'left' } },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Timeline size.',
      table: { defaultValue: { summary: 'md' } },
    },
    color: {
      control: 'select',
      options: ['primary', 'gray', 'success', 'warning', 'danger'],
      description: 'Active and completed color.',
      table: { defaultValue: { summary: 'primary' } },
    },
    lineVariant: {
      control: 'select',
      options: ['solid', 'dashed', 'dotted'],
      description: 'Connector line style.',
      table: { defaultValue: { summary: 'solid' } },
    },
    reverseActive: {
      control: 'boolean',
      description: 'Reverse active logic: items after active index are completed.',
      table: { defaultValue: { summary: 'false' } },
    },
  },
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: (args) => (
    <Timeline.Root
      active={args.active}
      align={args.align}
      size={args.size}
      color={args.color}
      lineVariant={args.lineVariant}
      reverseActive={args.reverseActive}
    >
      <Timeline.Item title="Order placed">
        Your order has been confirmed and is being processed.
      </Timeline.Item>
      <Timeline.Item title="Processing">
        Package is being prepared for shipment.
      </Timeline.Item>
      <Timeline.Item title="Shipped">
        On its way to the destination.
      </Timeline.Item>
      <Timeline.Item title="Delivered">
        Package delivered to your doorstep.
      </Timeline.Item>
    </Timeline.Root>
  ),
};
