import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { RadioGroup } from './RadioGroup';

const meta: Meta = {
  title: 'Form/RadioGroup',
  component: RadioGroup.Root,
  args: {
    onValueChange: fn(),
  },
  argTypes: {
    value: {
      control: 'text',
      description: 'Controlled selected value.',
    },
    defaultValue: {
      control: 'text',
      description: 'Default selected value for uncontrolled usage.',
    },
    onValueChange: {
      action: 'onValueChange',
      description: 'Called when the selected value changes.',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the entire radio group is disabled.',
    },
    name: {
      control: 'text',
      description: 'Name for form submission.',
    },
    required: {
      control: 'boolean',
      description: 'Whether a selection is required for form validation.',
    },
    invalid: {
      control: 'boolean',
      description: 'Whether the radio group is in an invalid state.',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size variant.',
      table: { defaultValue: { summary: 'md' } },
    },
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: 'Layout orientation of the radio items.',
      table: { defaultValue: { summary: 'vertical' } },
    },
    loop: {
      control: 'boolean',
      description: 'Whether keyboard navigation loops from last to first item.',
    },
  },
  render: (args) => (
    <RadioGroup.Root {...args}>
      <RadioGroup.Item value="option-1">Option 1</RadioGroup.Item>
      <RadioGroup.Item value="option-2">Option 2</RadioGroup.Item>
      <RadioGroup.Item value="option-3">Option 3</RadioGroup.Item>
    </RadioGroup.Root>
  ),
};

export default meta;

type Story = StoryObj;

export const Default: Story = {};
