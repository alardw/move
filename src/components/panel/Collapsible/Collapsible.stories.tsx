import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Collapsible } from './Collapsible';

const meta: Meta = {
  title: 'Panel/Collapsible',
  component: Collapsible.Root,
  args: {
    onOpenChange: fn(),
  },
  argTypes: {
    open: {
      control: 'boolean',
      description: 'Controlled open state.',
    },
    defaultOpen: {
      control: 'boolean',
      description: 'Whether the section is open by default.',
    },
    onOpenChange: {
      action: 'onOpenChange',
      description: 'Called when the open state changes.',
    },
    disabled: {
      control: 'boolean',
      description: 'Prevents the collapsible from being toggled.',
      table: { defaultValue: { summary: 'false' } },
    },
  },
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: (args) => (
    <Collapsible.Root
      open={args.open as boolean | undefined}
      defaultOpen={args.defaultOpen as boolean | undefined}
      onOpenChange={args.onOpenChange as (open: boolean) => void}
      disabled={args.disabled as boolean | undefined}
      style={{ maxWidth: 480 }}
    >
      <Collapsible.Trigger>
        What is Move?
        <Collapsible.Icon />
      </Collapsible.Trigger>
      <Collapsible.Content>
        <p style={{ margin: 0, paddingTop: 'var(--move-spacing-sm)', color: 'var(--move-fg-muted)', fontSize: 'var(--move-size-sm)' }}>
          Move is an animated UI component library for React with a focus on smooth, physics-based motion.
          Every component supports theming, pass-through styling, and coordinated animations out of the box.
        </p>
      </Collapsible.Content>
    </Collapsible.Root>
  ),
};
