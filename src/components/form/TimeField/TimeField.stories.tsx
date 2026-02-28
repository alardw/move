import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { TimeField } from './TimeField';

const meta: Meta<typeof TimeField> = {
  title: 'Form/TimeField',
  component: TimeField,
  args: {
    onValueChange: fn(),
  },
  argTypes: {
    value: {
      control: 'text',
      description: 'Controlled value in 24h format ("HH:mm" or "HH:mm:ss").',
    },
    defaultValue: {
      control: 'text',
      description: 'Default value for uncontrolled mode.',
    },
    onValueChange: {
      action: 'onValueChange',
      description: 'Called when the value changes.',
    },
    granularity: {
      control: 'select',
      options: ['hour', 'minute', 'second'],
      description: 'Which time segments to display.',
      table: { defaultValue: { summary: 'minute' } },
    },
    hourCycle: {
      control: 'select',
      options: [12, 24],
      description: 'Whether to use 12-hour or 24-hour format.',
      table: { defaultValue: { summary: '24' } },
    },
    withDropdown: {
      control: 'boolean',
      description: 'Show a scroll column picker dropdown.',
      table: { defaultValue: { summary: 'false' } },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the input.',
      table: { defaultValue: { summary: 'md' } },
    },
    disabled: {
      control: 'boolean',
      description: 'Disable the entire field.',
      table: { defaultValue: { summary: 'false' } },
    },
    invalid: {
      control: 'boolean',
      description: 'Show invalid/error styling.',
      table: { defaultValue: { summary: 'false' } },
    },
    min: {
      control: 'text',
      description: 'Minimum time constraint (24h format).',
    },
    max: {
      control: 'text',
      description: 'Maximum time constraint (24h format).',
    },
    step: {
      control: 'number',
      description: 'Arrow key increment in seconds.',
      table: { defaultValue: { summary: '1' } },
    },
  },
  render: (args) => <TimeField {...args} />,
};

export default meta;

type Story = StoryObj<typeof TimeField>;

export const Default: Story = {};
