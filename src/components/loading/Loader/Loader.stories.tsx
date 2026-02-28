import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Loader } from './Loader';

const meta: Meta = {
  title: 'Loading/Loader',
  component: Loader,
  argTypes: {
    variant: {
      control: 'select',
      options: ['spinner', 'dots'],
      table: { defaultValue: { summary: 'spinner' } },
    },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'current'],
      table: { defaultValue: { summary: 'primary' } },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      table: { defaultValue: { summary: 'md' } },
    },
    strokeWidth: {
      control: 'number',
      table: { defaultValue: { summary: '3' } },
    },
  },
  render: (args) => <Loader {...args} />,
};

export default meta;

type Story = StoryObj;

export const Default: Story = {};
