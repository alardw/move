import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { EmptyState } from './EmptyState';

const meta: Meta<typeof EmptyState> = {
  title: 'Loading/EmptyState',
  component: EmptyState,
  args: {
    icon: 'inbox',
    title: 'No messages',
    description: "You're all caught up. New messages will appear here.",
  },
  argTypes: {
    icon: {
      control: 'text',
    },
    title: {
      control: 'text',
    },
    description: {
      control: 'text',
    },
    action: {
      control: 'text',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      table: { defaultValue: { summary: 'md' } },
    },
    children: {
      control: 'text',
    },
  },
  render: (args) => <EmptyState {...args} />,
};

export default meta;

type Story = StoryObj<typeof EmptyState>;

export const Default: Story = {};
