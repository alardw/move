import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Spinner } from './Spinner';

const meta: Meta = {
  title: 'Loading/Spinner',
  component: Spinner,
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      table: { defaultValue: { summary: 'md' } },
    },
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'current'],
      table: { defaultValue: { summary: 'default' } },
    },
    strokeWidth: {
      control: 'number',
      table: { defaultValue: { summary: '3' } },
    },
  },
  render: (args) => <Spinner {...args} />,
};

export default meta;

type Story = StoryObj;

export const Default: Story = {};
