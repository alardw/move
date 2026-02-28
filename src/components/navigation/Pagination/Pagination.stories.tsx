import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Pagination } from './Pagination';

const meta: Meta<typeof Pagination.Root> = {
  title: 'Navigation/Pagination',
  component: Pagination.Root,
  args: {
    total: 10,
    onChange: fn(),
  },
  argTypes: {
    total: {
      control: 'number',
      description: 'Total number of pages',
    },
    page: {
      control: 'number',
      description: 'Controlled active page (1-based)',
    },
    defaultPage: {
      control: 'number',
      description: 'Uncontrolled initial page (1-based)',
    },
    onChange: {
      action: 'onChange',
      description: 'Called when the active page changes',
    },
    siblings: {
      control: 'number',
      description: 'Pages shown on each side of active page',
      table: { defaultValue: { summary: '1' } },
    },
    boundaries: {
      control: 'number',
      description: 'Pages pinned at start and end',
      table: { defaultValue: { summary: '1' } },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of pagination controls',
      table: { defaultValue: { summary: 'md' } },
    },
    variant: {
      control: 'select',
      options: ['default', 'outline'],
      description: 'Visual variant',
      table: { defaultValue: { summary: 'default' } },
    },
  },
  render: (args) => (
    <Pagination.Root {...args}>
      <Pagination.PrevTrigger />
      <Pagination.Items />
      <Pagination.NextTrigger />
    </Pagination.Root>
  ),
};

export default meta;

type Story = StoryObj<typeof Pagination.Root>;

export const Default: Story = {};
