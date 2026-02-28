import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ProgressBar } from './ProgressBar';

const meta: Meta<typeof ProgressBar> = {
  title: 'Loading/ProgressBar',
  component: ProgressBar,
  args: {
    value: 60,
  },
  argTypes: {
    value: {
      control: 'number',
    },
    max: {
      control: 'number',
      table: { defaultValue: { summary: '100' } },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      table: { defaultValue: { summary: 'md' } },
    },
    variant: {
      control: 'select',
      options: ['default', 'success', 'warning', 'error'],
      table: { defaultValue: { summary: 'default' } },
    },
  },
  render: (args) => <ProgressBar {...args} />,
};

export default meta;

type Story = StoryObj<typeof ProgressBar>;

export const Default: Story = {};
