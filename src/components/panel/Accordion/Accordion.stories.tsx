import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Accordion } from './Accordion';

const meta: Meta = {
  title: 'Panel/Accordion',
  component: Accordion,
  args: {
    onValueChange: fn(),
  },
  argTypes: {
    type: {
      control: 'select',
      options: ['single', 'multiple'],
      description: 'Whether one or multiple items can be open at once.',
      table: { defaultValue: { summary: 'single' } },
    },
    collapsible: {
      control: 'boolean',
      description: 'Allow closing all items in single mode.',
      table: { defaultValue: { summary: 'true' } },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Padding and font size of headers and content.',
      table: { defaultValue: { summary: 'md' } },
    },
    variant: {
      control: 'select',
      options: ['default', 'contained', 'ghost'],
      description: 'Visual style of the accordion.',
      table: { defaultValue: { summary: 'default' } },
    },
    onValueChange: {
      action: 'onValueChange',
    },
  },
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: (args) => (
    <Accordion {...args}>
      <Accordion.Item value="item-1">
        <Accordion.Header>
          <Accordion.Trigger>Is it accessible?</Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content>
          Yes — Arrow Up/Down moves focus between triggers, Home/End jumps to first/last,
          and Enter/Space toggles the focused item.
        </Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="item-2">
        <Accordion.Header>
          <Accordion.Trigger>Is it animated?</Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content>
          Content expands and collapses with coordinated height and opacity animations.
          The chevron icon rotates in sync.
        </Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="item-3">
        <Accordion.Header>
          <Accordion.Trigger>Can I open multiple items?</Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content>
          Set type to &quot;multiple&quot; and any number of items can be open at the same time.
        </Accordion.Content>
      </Accordion.Item>
    </Accordion>
  ),
};
