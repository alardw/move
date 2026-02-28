import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Splitter } from './Splitter';

const meta: Meta<typeof Splitter.Root> = {
  title: 'Panel/Splitter',
  component: Splitter.Root,
  args: {
    onResizeEnd: fn(),
  },
  argTypes: {
    layout: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: 'Layout direction. Default: \'horizontal\'',
      table: { defaultValue: { summary: 'horizontal' } },
    },
    gutterSize: {
      control: 'number',
      description: 'Size of the gutter/handle in pixels.',
      table: { defaultValue: { summary: '4' } },
    },
    collapseBelow: {
      control: 'number',
      description: 'Width in pixels below which horizontal layout collapses to vertical.',
    },
    onResizeEnd: {
      action: 'onResizeEnd',
      description: 'Callback when panel sizes change.',
    },
    children: {
      control: false,
    },
  },
  render: (args) => (
    <div style={{ height: 200, width: '100%', border: '1px solid var(--move-border-base)', borderRadius: 'var(--move-rounded-md)' }}>
      <Splitter.Root {...args}>
        <Splitter.Panel>
          <div style={{ padding: 'var(--move-spacing-md)', background: 'var(--move-bg-subtle)', height: '100%', boxSizing: 'border-box' }}>
            Panel 1
          </div>
        </Splitter.Panel>
        <Splitter.Panel>
          <div style={{ padding: 'var(--move-spacing-md)', background: 'var(--move-bg-muted)', height: '100%', boxSizing: 'border-box' }}>
            Panel 2
          </div>
        </Splitter.Panel>
      </Splitter.Root>
    </div>
  ),
};

export default meta;

type Story = StoryObj<typeof Splitter.Root>;

export const Default: Story = {};
