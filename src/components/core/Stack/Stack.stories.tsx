import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stack } from './Stack';

const meta: Meta<typeof Stack> = {
  title: 'Core/Stack',
  component: Stack,
  args: {
    children: (
      <>
        <div style={{ padding: '8px 16px', background: 'var(--move-bg-elevated)', borderRadius: 'var(--move-rounded-md)', border: '1px solid var(--move-border-base)', fontSize: 'var(--move-size-sm)', color: 'var(--move-fg-base)' }}>Item 1</div>
        <div style={{ padding: '8px 16px', background: 'var(--move-bg-elevated)', borderRadius: 'var(--move-rounded-md)', border: '1px solid var(--move-border-base)', fontSize: 'var(--move-size-sm)', color: 'var(--move-fg-base)' }}>Item 2</div>
        <div style={{ padding: '8px 16px', background: 'var(--move-bg-elevated)', borderRadius: 'var(--move-rounded-md)', border: '1px solid var(--move-border-base)', fontSize: 'var(--move-size-sm)', color: 'var(--move-fg-base)' }}>Item 3</div>
      </>
    ),
  },
  argTypes: {
    direction: {
      control: 'select',
      options: ['row', 'column'],
      table: { defaultValue: { summary: 'column' } },
    },
    gap: {
      control: 'select',
      options: ['none', 'xs', 'sm', 'md', 'lg', 'xl'],
      table: { defaultValue: { summary: 'md' } },
    },
    align: {
      control: 'select',
      options: ['start', 'center', 'end', 'stretch', 'baseline'],
      table: { defaultValue: { summary: 'stretch' } },
    },
    justify: {
      control: 'select',
      options: ['start', 'center', 'end', 'between', 'evenly'],
      table: { defaultValue: { summary: 'start' } },
    },
    wrap: {
      control: 'boolean',
      table: { defaultValue: { summary: 'false' } },
    },
    collapseBelow: {
      control: 'text',
    },
    children: {
      control: false,
    },
  },
  render: (args) => <Stack {...args} />,
};

export default meta;

type Story = StoryObj<typeof Stack>;

export const Default: Story = {};
