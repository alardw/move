import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Popover } from './Popover';
import { Button } from '../../core/Button/Button';

const meta: Meta = {
  title: 'Overlay/Popover',
  component: Popover.Root,
  args: {
    onOpenChange: fn(),
  },
  argTypes: {
    open: {
      control: 'boolean',
    },
    defaultOpen: {
      control: 'boolean',
      table: { defaultValue: { summary: 'false' } },
    },
    onOpenChange: {
      action: 'onOpenChange',
    },
    closeOnScroll: {
      control: 'boolean',
      description: 'Close the popover when an ancestor element scrolls',
      table: { defaultValue: { summary: 'false' } },
    },
    modal: {
      control: 'boolean',
    },
  },
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: (args) => (
    <Popover.Root
      open={args.open}
      defaultOpen={args.defaultOpen}
      onOpenChange={args.onOpenChange}
      closeOnScroll={args.closeOnScroll}
      modal={args.modal}
    >
      <Popover.Trigger asChild>
        <Button variant="secondary">Open Popover</Button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content sideOffset={8}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <strong>Popover Title</strong>
            <p style={{ margin: 0, color: 'var(--move-fg-muted)' }}>
              This is a popover with some content inside it.
            </p>
          </div>
          <Popover.Arrow />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  ),
};
