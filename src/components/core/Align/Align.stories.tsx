import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Align } from './Align';

const meta: Meta = {
  title: 'Core/Align',
  component: Align,
  argTypes: {
    gap: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl', 'none'],
      table: { defaultValue: { summary: 'md' } },
    },
    align: {
      control: 'select',
      options: ['start', 'center', 'end', 'stretch', 'baseline'],
      table: { defaultValue: { summary: 'center' } },
    },
  },
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: (args) => (
    <Align {...args} style={{ width: '100%' }}>
      <Align.Start>
        <span>Start</span>
      </Align.Start>
      <Align.Center>
        <span>Center</span>
      </Align.Center>
      <Align.End>
        <span>End</span>
      </Align.End>
    </Align>
  ),
};
