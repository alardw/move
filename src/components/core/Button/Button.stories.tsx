import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Core/Button',
  component: Button,
  args: {
    children: 'Button',
    onClick: fn(),
    onMouseDown: fn(),
    onMouseUp: fn(),
    onMouseEnter: fn(),
    onMouseLeave: fn(),
    onKeyDown: fn(),
    onKeyUp: fn(),
  },
  argTypes: {
    children: {
      control: 'text',
    },
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost', 'danger'],
      table: { defaultValue: { summary: 'primary' } },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      table: { defaultValue: { summary: 'md' } },
    },
    type: {
      control: 'text',
      table: { defaultValue: { summary: 'button' } },
    },
    disabled: {
      control: 'boolean',
    },
    elevation: {
      control: 'select',
      options: [0, 1, 2, 3, 4, 5],
    },
    onClick: { action: 'onClick' },
    onMouseDown: { action: 'onMouseDown' },
    onMouseUp: { action: 'onMouseUp' },
    onMouseEnter: { action: 'onMouseEnter' },
    onMouseLeave: { action: 'onMouseLeave' },
    onKeyDown: { action: 'onKeyDown' },
    onKeyUp: { action: 'onKeyUp' },
  },
  render: (args) => <Button {...args} />,
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Default: Story = {};
