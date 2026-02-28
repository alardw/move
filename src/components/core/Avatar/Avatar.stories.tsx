import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Avatar } from './Avatar';

const meta: Meta = {
  title: 'Core/Avatar',
  component: Avatar.Root,
  args: {
    onLoadingStatusChange: fn(),
  },
  argTypes: {
    // Avatar.Root props
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      table: { defaultValue: { summary: 'md' } },
    },
    // Avatar.Image props
    src: {
      control: 'text',
      description: 'URL of the avatar image.',
    },
    alt: {
      control: 'text',
      description: 'Accessible alt text for the image.',
    },
    onLoadingStatusChange: {
      action: 'onLoadingStatusChange',
      description: 'Called when the image loading status changes.',
    },
    // Avatar.Fallback props
    delayMs: {
      control: 'number',
      description: 'Milliseconds to wait before showing the fallback, giving the image time to load.',
    },
    // Avatar.Group props
    staggerDelay: {
      control: 'number',
      table: { defaultValue: { summary: '50' } },
      description: 'Delay in milliseconds between each avatar entrance animation.',
    },
  },
  render: (args) => (
    <Avatar.Root size={args.size as 'xs' | 'sm' | 'md' | 'lg' | 'xl' | undefined}>
      <Avatar.Image
        src={args.src as string | undefined ?? 'https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?w=128&h=128&fit=crop'}
        alt={args.alt as string | undefined ?? 'Jane Doe'}
        onLoadingStatusChange={args.onLoadingStatusChange as ((status: 'idle' | 'loading' | 'loaded' | 'error') => void) | undefined}
      />
      <Avatar.Fallback delayMs={args.delayMs as number | undefined}>
        JD
      </Avatar.Fallback>
    </Avatar.Root>
  ),
};

export default meta;

type Story = StoryObj;

export const Default: Story = {};
