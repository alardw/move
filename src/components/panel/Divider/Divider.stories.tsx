import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Divider } from './Divider';

const meta: Meta<typeof Divider> = {
  title: 'Panel/Divider',
  component: Divider,
  args: {},
  argTypes: {
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      table: { defaultValue: { summary: 'horizontal' } },
    },
    type: {
      control: 'select',
      options: ['solid', 'dashed', 'dotted'],
      table: { defaultValue: { summary: 'solid' } },
    },
    align: {
      control: 'select',
      options: ['left', 'center', 'right', 'top', 'bottom'],
      table: { defaultValue: { summary: 'center' } },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      table: { defaultValue: { summary: 'sm' } },
    },
    children: {
      control: 'text',
    },
  },
  render: (args) => <Divider {...args} />,
};

export default meta;

type Story = StoryObj<typeof Divider>;

export const Default: Story = {};
