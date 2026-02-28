import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Text } from './Text';

const meta: Meta<typeof Text> = {
  title: 'Core/Text',
  component: Text,
  args: {
    children: 'The quick brown fox jumps over the lazy dog.',
  },
  argTypes: {
    as: {
      control: 'select',
      options: ['p', 'span', 'div', 'em', 'strong', 'small', 'del'],
      description: 'HTML element to render.',
      table: { defaultValue: { summary: 'p' } },
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'base', 'lg', 'xl'],
      description: 'Font size of the text.',
      table: { defaultValue: { summary: 'base' } },
    },
    weight: {
      control: 'select',
      options: ['normal', 'medium', 'semibold', 'bold'],
      description: 'Font weight of the text.',
      table: { defaultValue: { summary: 'normal' } },
    },
    color: {
      control: 'select',
      options: ['base', 'muted', 'subtle', 'primary', 'success', 'warning', 'error'],
      description: 'Text color variant.',
      table: { defaultValue: { summary: 'base' } },
    },
    align: {
      control: 'select',
      options: ['left', 'center', 'right'],
      description: 'Horizontal text alignment.',
    },
    truncate: {
      control: 'boolean',
      description: 'Truncate overflowing text with an ellipsis.',
    },
    children: {
      control: 'text',
    },
  },
  render: (args) => <Text {...args} />,
};

export default meta;

type Story = StoryObj<typeof Text>;

export const Default: Story = {};
