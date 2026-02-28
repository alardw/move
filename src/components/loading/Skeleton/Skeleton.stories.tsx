import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Skeleton } from './Skeleton';

const meta: Meta = {
  title: 'Loading/Skeleton',
  component: Skeleton.Root,
  argTypes: {
    // Root props
    loading: {
      control: 'boolean',
      table: { defaultValue: { summary: 'true' } },
    },
    animation: {
      control: 'select',
      options: ['pulse', 'wave', false],
      table: { defaultValue: { summary: "'pulse'" } },
    },
    // Circle props
    size: {
      control: 'number',
      table: { defaultValue: { summary: '40' } },
    },
    // Rectangle / Rounded props
    width: {
      control: 'text',
      table: { defaultValue: { summary: "'100%'" } },
    },
    height: {
      control: 'text',
      table: { defaultValue: { summary: "'1rem'" } },
    },
    radius: {
      control: 'text',
      table: { defaultValue: { summary: 'var(--move-skeleton-radius)' } },
    },
    // Text props
    lines: {
      control: 'number',
      table: { defaultValue: { summary: '3' } },
    },
    lastLineWidth: {
      control: 'text',
      table: { defaultValue: { summary: "'60%'" } },
    },
  },
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: (args) => (
    <Skeleton.Root loading={args['loading'] as boolean} animation={args['animation'] as 'pulse' | 'wave' | false}>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <Skeleton.Circle />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
          <Skeleton.Rounded width="40%" height="0.875rem" />
          <Skeleton.Text lines={2} />
        </div>
      </div>
    </Skeleton.Root>
  ),
};
