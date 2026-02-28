import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Tabs } from './Tabs';

const meta: Meta = {
  title: 'Panel/Tabs',
  component: Tabs.Root,
  args: {
    onValueChange: fn(),
  },
  argTypes: {
    defaultValue: {
      control: 'text',
      description: 'The value of the tab to select by default.',
    },
    value: {
      control: 'text',
      description: 'Controlled active tab value.',
    },
    onValueChange: {
      action: 'onValueChange',
      description: 'Called when the active tab changes.',
    },
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      table: { defaultValue: { summary: 'horizontal' } },
    },
    dir: {
      control: 'select',
      options: ['ltr', 'rtl'],
      description: 'Reading direction for keyboard navigation.',
    },
    activationMode: {
      control: 'select',
      options: ['automatic', 'manual'],
      table: { defaultValue: { summary: 'automatic' } },
      description: 'Whether tabs activate on focus or require a click.',
    },
  },
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: (args) => (
    <Tabs.Root defaultValue="account" onValueChange={args.onValueChange}>
      <Tabs.List>
        <Tabs.Trigger value="account">Account</Tabs.Trigger>
        <Tabs.Trigger value="password">Password</Tabs.Trigger>
        <Tabs.Trigger value="billing">Billing</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="account">
        Manage your account settings and preferences.
      </Tabs.Content>
      <Tabs.Content value="password">
        Change your password and security options.
      </Tabs.Content>
      <Tabs.Content value="billing">
        View and manage your billing information.
      </Tabs.Content>
    </Tabs.Root>
  ),
};
