import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import { ToggleGroup } from './ToggleGroup';

const meta: Meta = {
  title: 'Toolbar/ToggleGroup',
  component: ToggleGroup.Root,
  args: {
    onValueChange: fn(),
  },
  argTypes: {
    value: {
      control: 'text',
    },
    defaultValue: {
      control: 'text',
    },
    onValueChange: {
      action: 'onValueChange',
    },
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      table: { defaultValue: { summary: 'horizontal' } },
    },
    disabled: {
      control: 'boolean',
    },
    loop: {
      control: 'boolean',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      table: { defaultValue: { summary: 'md' } },
    },
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost', 'danger'],
      table: { defaultValue: { summary: 'secondary' } },
    },
  },
  render: (args) => (
    <ToggleGroup.Root {...args} defaultValue="left">
      <ToggleGroup.Item value="left" aria-label="Align left">
        <AlignLeft size={16} />
      </ToggleGroup.Item>
      <ToggleGroup.Item value="center" aria-label="Align center">
        <AlignCenter size={16} />
      </ToggleGroup.Item>
      <ToggleGroup.Item value="right" aria-label="Align right">
        <AlignRight size={16} />
      </ToggleGroup.Item>
    </ToggleGroup.Root>
  ),
};

export default meta;

type Story = StoryObj;

export const Default: Story = {};
