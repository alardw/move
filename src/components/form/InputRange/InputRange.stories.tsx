import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { InputRange } from './InputRange';

const meta: Meta<typeof InputRange> = {
  title: 'Form/InputRange',
  component: InputRange,
  args: {
    onValueChange: fn(),
  },
  argTypes: {
    min: {
      control: 'number',
      description: 'Minimum allowed value.',
      table: { defaultValue: { summary: '0' } },
    },
    max: {
      control: 'number',
      description: 'Maximum allowed value.',
      table: { defaultValue: { summary: '100' } },
    },
    step: {
      control: 'number',
      description: 'Step increment between values.',
      table: { defaultValue: { summary: '1' } },
    },
    value: {
      control: 'number',
      description: 'Controlled value (single number or array for range).',
    },
    defaultValue: {
      control: 'number',
      description: 'Default value for uncontrolled usage.',
    },
    onValueChange: {
      action: 'onValueChange',
      description: 'Called when the value changes.',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size variant.',
      table: { defaultValue: { summary: 'md' } },
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the slider is disabled.',
    },
    invalid: {
      control: 'boolean',
      description: 'Whether the slider is in an invalid state.',
    },
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: 'Layout orientation of the slider.',
      table: { defaultValue: { summary: 'horizontal' } },
    },
    name: {
      control: 'text',
      description: 'Name for form submission.',
    },
    showValue: {
      control: 'boolean',
      description: 'Whether to display the current value beside the slider.',
    },
  },
  render: (args) => <InputRange {...args} />,
};

export default meta;

type Story = StoryObj<typeof InputRange>;

export const Default: Story = {};
