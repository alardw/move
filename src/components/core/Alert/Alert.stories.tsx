import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Alert } from './Alert';

const meta: Meta<typeof Alert> = {
  title: 'Core/Alert',
  component: Alert,
  args: {
    children: 'A new software update is available for download.',
    onClose: fn(),
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['info', 'success', 'warning', 'danger'],
      table: { defaultValue: { summary: 'info' } },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      table: { defaultValue: { summary: 'md' } },
    },
    icon: {
      control: 'text',
    },
    title: {
      control: 'text',
    },
    closable: {
      control: 'boolean',
      table: { defaultValue: { summary: 'false' } },
    },
    onClose: {
      action: 'onClose',
    },
    closeLabel: {
      control: 'text',
    },
    children: {
      control: 'text',
    },
  },
  render: (args) => <Alert {...args} />,
};

export default meta;

type Story = StoryObj<typeof Alert>;

export const Default: Story = {};
