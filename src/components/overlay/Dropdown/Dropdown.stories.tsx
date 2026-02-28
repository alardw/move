import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Button } from '../../core/Button/Button';
import { Dropdown } from './Dropdown';

const meta: Meta = {
  title: 'Overlay/Dropdown',
  component: Dropdown.Root,
  args: {
    onOpenChange: fn(),
  },
  argTypes: {
    open: {
      control: 'boolean',
    },
    defaultOpen: {
      control: 'boolean',
    },
    onOpenChange: {
      action: 'onOpenChange',
    },
  },
  render: (args) => (
    <Dropdown.Root
      open={args.open as boolean | undefined}
      defaultOpen={args.defaultOpen as boolean | undefined}
      onOpenChange={args.onOpenChange as (open: boolean) => void}
    >
      <Dropdown.Trigger asChild>
        <Button>Open Menu</Button>
      </Dropdown.Trigger>
      <Dropdown.Portal>
        <Dropdown.Content sideOffset={5}>
          <Dropdown.Label>Actions</Dropdown.Label>
          <Dropdown.Separator />
          <Dropdown.Item>New Tab</Dropdown.Item>
          <Dropdown.Item>New Window</Dropdown.Item>
          <Dropdown.Item disabled>New Private Window</Dropdown.Item>
          <Dropdown.Separator />
          <Dropdown.Item>Settings</Dropdown.Item>
        </Dropdown.Content>
      </Dropdown.Portal>
    </Dropdown.Root>
  ),
};

export default meta;

type Story = StoryObj;

export const Default: Story = {};
