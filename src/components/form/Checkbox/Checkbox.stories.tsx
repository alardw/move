import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Checkbox } from './Checkbox';

const meta: Meta<typeof Checkbox> = {
  title: 'Form/Checkbox',
  component: Checkbox,
  args: {
    children: 'I agree to the terms',
    onCheckedChange: fn(),
  },
  argTypes: {
    children: {
      control: 'text',
    },
    checked: {
      control: 'boolean',
    },
    defaultChecked: {
      control: 'boolean',
    },
    indeterminate: {
      control: 'boolean',
    },
    onCheckedChange: {
      action: 'onCheckedChange',
    },
    icon: {
      control: 'text',
      table: { defaultValue: { summary: 'check' } },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      table: { defaultValue: { summary: 'md' } },
    },
    disabled: {
      control: 'boolean',
      table: { defaultValue: { summary: 'false' } },
    },
    invalid: {
      control: 'boolean',
    },
    name: {
      control: 'text',
    },
    value: {
      control: 'text',
    },
    required: {
      control: 'boolean',
    },
  },
  render: (args) => <Checkbox {...args} />,
};

export default meta;

type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {};
