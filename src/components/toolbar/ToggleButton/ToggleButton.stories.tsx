import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { ToggleButton } from './ToggleButton';

const meta: Meta<typeof ToggleButton> = {
  title: 'Toolbar/ToggleButton',
  component: ToggleButton,
  args: {
    children: 'Toggle',
    onPressedChange: fn(),
  },
  argTypes: {
    children: {
      control: 'text',
    },
    pressed: {
      control: 'boolean',
    },
    defaultPressed: {
      control: 'boolean',
    },
    onPressedChange: {
      action: 'pressedChange',
    },
    disabled: {
      control: 'boolean',
    },
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost', 'danger'],
      table: { defaultValue: { summary: 'secondary' } },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      table: { defaultValue: { summary: 'md' } },
    },
  },
  render: (args) => <ToggleButton {...args} />,
};

export default meta;

type Story = StoryObj<typeof ToggleButton>;

export const Default: Story = {};

