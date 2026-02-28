import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Link } from './Link';

const meta: Meta<typeof Link> = {
  title: 'Core/Link',
  component: Link,
  args: {
    children: 'Link',
    href: '#',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'muted', 'subtle'],
      table: { defaultValue: { summary: 'default' } },
    },
    underline: {
      control: 'select',
      options: ['always', 'hover', 'none'],
      table: { defaultValue: { summary: 'hover' } },
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'base', 'lg', 'xl'],
    },
    external: {
      control: 'boolean',
    },
    children: {
      control: 'text',
    },
    href: {
      control: 'text',
    },
  },
  render: (args) => <Link {...args} />,
};

export default meta;

type Story = StoryObj<typeof Link>;

export const Default: Story = {};
