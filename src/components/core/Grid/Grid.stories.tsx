import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Grid } from './Grid';

const cell = (label: string) => (
  <div
    style={{
      padding: 'var(--move-spacing-md)',
      background: 'var(--move-bg-elevated)',
      borderRadius: 'var(--move-rounded-md)',
      border: '1px solid var(--move-border-base)',
      fontSize: 'var(--move-size-sm)',
      color: 'var(--move-fg-base)',
      textAlign: 'center',
    }}
  >
    {label}
  </div>
);

const meta: Meta = {
  title: 'Core/Grid',
  component: Grid,
  argTypes: {
    cols: {
      control: 'number',
      description: 'Equal-width columns',
    },
    rows: {
      control: 'number',
      description: 'Equal-height rows',
    },
    columns: {
      control: 'number',
      description: 'Total columns for span-based mode (default 12)',
    },
    minChildWidth: {
      control: 'text',
      description: 'Auto-fit: minimum child width before wrapping',
    },
    gap: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl', 'none'],
      description: 'Gap between cells',
      table: { defaultValue: { summary: 'md' } },
    },
    rowGap: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl', 'none'],
      description: 'Vertical gap override',
    },
    columnGap: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl', 'none'],
      description: 'Horizontal gap override',
    },
    collapseBelow: {
      control: 'text',
      description: 'Container width below which grid collapses to 1 column',
    },
    children: {
      control: false,
    },
  },
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: (args) => (
    <Grid {...args} style={{ width: '100%' }}>
      <Grid.Cell span={8}>{cell('span 8')}</Grid.Cell>
      <Grid.Cell span={4}>{cell('span 4')}</Grid.Cell>
      <Grid.Cell span={6}>{cell('span 6')}</Grid.Cell>
      <Grid.Cell span={6}>{cell('span 6')}</Grid.Cell>
      <Grid.Cell span={4}>{cell('span 4')}</Grid.Cell>
      <Grid.Cell span={4}>{cell('span 4')}</Grid.Cell>
      <Grid.Cell span={4}>{cell('span 4')}</Grid.Cell>
    </Grid>
  ),
};
