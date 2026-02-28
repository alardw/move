import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Switch } from './Switch';

const meta: Meta = {
  title: 'Form/Switch',
  component: Switch.Root,
  args: {
    onCheckedChange: fn(),
  },
  argTypes: {
    checked: {
      control: 'boolean',
    },
    defaultChecked: {
      control: 'boolean',
    },
    onCheckedChange: {
      action: 'onCheckedChange',
    },
    disabled: {
      control: 'boolean',
    },
    invalid: {
      control: 'boolean',
      description: 'Whether the switch is in an invalid state',
    },
    label: {
      control: 'text',
      description: 'Optional label displayed beside the switch',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the switch',
      table: { defaultValue: { summary: 'md' } },
    },
    required: {
      control: 'boolean',
    },
    name: {
      control: 'text',
    },
    value: {
      control: 'text',
    },
  },
  render: (args) => (
    <Switch.Root {...args} label={args.label ?? 'Enable'}>
      <Switch.Thumb />
    </Switch.Root>
  ),
};

export default meta;

type Story = StoryObj;

export const Default: Story = {};
