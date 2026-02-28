import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Tooltip } from './Tooltip';
import { Button } from '../Button/Button';

const meta: Meta<typeof Tooltip> = {
  title: 'Core/Tooltip',
  component: Tooltip,
  args: {
    label: 'Tooltip label',
    onOpenChange: fn(),
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'Tooltip label text',
    },
    side: {
      control: 'select',
      options: ['top', 'right', 'bottom', 'left'],
      description: 'Placement side',
      table: { defaultValue: { summary: 'top' } },
    },
    sideOffset: {
      control: 'number',
      description: 'Offset from trigger',
      table: { defaultValue: { summary: '6' } },
    },
    align: {
      control: 'select',
      options: ['start', 'center', 'end'],
      description: 'Alignment along the side',
    },
    arrow: {
      control: 'boolean',
      description: 'Show arrow',
      table: { defaultValue: { summary: 'true' } },
    },
    delayDuration: {
      control: 'number',
      description: 'Delay before showing',
    },
    open: {
      control: 'boolean',
      description: 'Controlled open state',
    },
    onOpenChange: {
      action: 'onOpenChange',
      description: 'Controlled open change',
    },
  },
  render: (args) => (
    <Tooltip.Provider>
      <Tooltip {...args}>
        <Button>Hover me</Button>
      </Tooltip>
    </Tooltip.Provider>
  ),
};

export default meta;

type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {};
