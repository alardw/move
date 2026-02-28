import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Heading } from './Heading';

const meta: Meta<typeof Heading> = {
  title: 'Core/Heading',
  component: Heading,
  args: {
    children: 'The quick brown fox',
  },
  argTypes: {
    level: {
      control: 'select',
      options: [1, 2, 3, 4, 5, 6],
      table: { defaultValue: { summary: '2' } },
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl'],
    },
    weight: {
      control: 'select',
      options: ['medium', 'semibold', 'bold'],
      table: { defaultValue: { summary: "'bold'" } },
    },
    color: {
      control: 'select',
      options: ['base', 'muted', 'subtle'],
      table: { defaultValue: { summary: "'base'" } },
    },
    tracking: {
      control: 'select',
      options: ['tight', 'normal'],
      table: { defaultValue: { summary: "'tight'" } },
    },
    align: {
      control: 'select',
      options: ['left', 'center', 'right'],
    },
    truncate: {
      control: 'boolean',
    },
    children: {
      control: 'text',
    },
  },
  render: (args) => <Heading {...args} />,
};

export default meta;

type Story = StoryObj<typeof Heading>;

export const Default: Story = {};
