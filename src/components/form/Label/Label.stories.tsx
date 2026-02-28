import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Label } from './Label';

const meta: Meta<typeof Label> = {
  title: 'Form/Label',
  component: Label,
  args: {
    children: 'Email address',
  },
  argTypes: {
    children: {
      control: 'text',
    },
    htmlFor: {
      control: 'text',
    },
    required: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      table: { defaultValue: { summary: 'md' } },
    },
  },
  render: (args) => <Label {...args} />,
};

export default meta;

type Story = StoryObj<typeof Label>;

export const Default: Story = {};
