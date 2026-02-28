import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Password } from './Password';

const meta: Meta<typeof Password> = {
  title: 'Form/Password',
  component: Password,
  args: {
    onVisibleChange: fn(),
    onChange: fn(),
    onFocus: fn(),
    onBlur: fn(),
    onKeyDown: fn(),
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['outlined', 'filled'],
      table: { defaultValue: { summary: 'outlined' } },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      table: { defaultValue: { summary: 'md' } },
    },
    invalid: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
    readOnly: {
      control: 'boolean',
    },
    placeholder: {
      control: 'text',
    },
    value: {
      control: 'text',
    },
    defaultValue: {
      control: 'text',
    },
    name: {
      control: 'text',
    },
    id: {
      control: 'text',
    },
    required: {
      control: 'boolean',
    },
    autoFocus: {
      control: 'boolean',
    },
    visible: {
      control: 'boolean',
    },
    defaultVisible: {
      control: 'boolean',
      table: { defaultValue: { summary: 'false' } },
    },
    onVisibleChange: {
      action: 'onVisibleChange',
    },
    onChange: {
      action: 'onChange',
    },
    onFocus: {
      action: 'onFocus',
    },
    onBlur: {
      action: 'onBlur',
    },
    onKeyDown: {
      action: 'onKeyDown',
    },
  },
  render: (args) => <Password placeholder="Enter password" {...args} />,
};

export default meta;

type Story = StoryObj<typeof Password>;

export const Default: Story = {};
