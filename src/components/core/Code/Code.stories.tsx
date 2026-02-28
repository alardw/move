import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Code } from './Code';

const meta: Meta<typeof Code> = {
  title: 'Core/Code',
  component: Code,
  args: {
    children: 'npm install move',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['subtle', 'outline', 'ghost'],
      table: { defaultValue: { summary: 'subtle' } },
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'base', 'lg'],
      table: { defaultValue: { summary: 'sm' } },
    },
    block: {
      control: 'boolean',
    },
    language: {
      control: 'text',
      description: 'Language for syntax highlighting (requires CodeHighlighterProvider)',
    },
    children: {
      control: 'text',
    },
  },
  render: (args) => <Code {...args} />,
};

export default meta;

type Story = StoryObj<typeof Code>;

export const Default: Story = {};
