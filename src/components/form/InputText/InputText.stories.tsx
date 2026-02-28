import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { InputText } from './InputText';

const meta: Meta<typeof InputText> = {
  title: 'Form/InputText',
  component: InputText,
  args: {
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
    type: {
      control: 'text',
      table: { defaultValue: { summary: 'text' } },
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
    required: {
      control: 'boolean',
    },
    autoFocus: {
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
    // Skip: className, style, sp, width, iconLeft, iconRight
  },
  render: (args) => <InputText {...args} />,
};

export default meta;

type Story = StoryObj<typeof InputText>;

export const Default: Story = {};
