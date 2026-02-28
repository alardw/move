import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { NumberInput } from './NumberInput';

const meta: Meta<typeof NumberInput> = {
  title: 'Form/NumberInput',
  component: NumberInput,
  args: {
    onValueChange: fn(),
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
    value: {
      control: 'number',
    },
    defaultValue: {
      control: 'number',
    },
    min: {
      control: 'number',
    },
    max: {
      control: 'number',
    },
    step: {
      control: 'number',
      table: { defaultValue: { summary: '1' } },
    },
    shiftStep: {
      control: 'number',
    },
    clampBehavior: {
      control: 'select',
      options: ['blur', 'strict', 'none'],
      table: { defaultValue: { summary: 'blur' } },
    },
    allowDecimal: {
      control: 'boolean',
      table: { defaultValue: { summary: 'true' } },
    },
    decimalScale: {
      control: 'number',
    },
    allowNegative: {
      control: 'boolean',
      table: { defaultValue: { summary: 'true' } },
    },
    hideControls: {
      control: 'boolean',
      table: { defaultValue: { summary: 'false' } },
    },
    invalid: {
      control: 'boolean',
    },
    prefix: {
      control: 'text',
    },
    suffix: {
      control: 'text',
    },
    incrementLabel: {
      control: 'text',
    },
    decrementLabel: {
      control: 'text',
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
    onValueChange: { action: 'onValueChange' },
    onChange: { action: 'onChange' },
    onFocus: { action: 'onFocus' },
    onBlur: { action: 'onBlur' },
    onKeyDown: { action: 'onKeyDown' },
  },
  render: (args) => <NumberInput {...args} />,
};

export default meta;

type Story = StoryObj<typeof NumberInput>;

export const Default: Story = {};
