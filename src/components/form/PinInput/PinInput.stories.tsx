import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { PinInput } from './PinInput';

const meta: Meta<typeof PinInput> = {
  title: 'Form/PinInput',
  component: PinInput,
  args: {
    onChange: fn(),
    onComplete: fn(),
  },
  argTypes: {
    length: {
      control: 'number',
      description: 'Number of input slots',
      table: { defaultValue: { summary: '4' } },
    },
    value: {
      control: 'text',
      description: 'Controlled value',
    },
    defaultValue: {
      control: 'text',
      description: 'Default value for uncontrolled mode',
    },
    onChange: {
      action: 'onChange',
      description: 'Called when the value changes',
    },
    onComplete: {
      action: 'onComplete',
      description: 'Called when all slots are filled',
    },
    type: {
      control: 'select',
      options: ['number', 'alphanumeric'],
      description: "Character validation: 'number', 'alphanumeric', or a RegExp",
      table: { defaultValue: { summary: 'number' } },
    },
    mask: {
      control: 'boolean',
      description: 'Mask input like a password field',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder character per slot',
    },
    oneTimeCode: {
      control: 'boolean',
      description: 'Enable autocomplete="one-time-code" for SMS autofill',
      table: { defaultValue: { summary: 'true' } },
    },
    invalid: {
      control: 'boolean',
      description: 'Invalid state',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size variant',
      table: { defaultValue: { summary: 'md' } },
    },
    ariaLabel: {
      control: 'text',
      description: 'Accessible label for the hidden input',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
    name: {
      control: 'text',
      description: 'Hidden input name for form submission',
    },
    autoFocus: {
      control: 'boolean',
      description: 'Auto focus the input on mount',
    },
  },
  render: (args) => <PinInput {...args} />,
};

export default meta;

type Story = StoryObj<typeof PinInput>;

export const Default: Story = {};
