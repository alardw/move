import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ChatBubble } from './ChatBubble';

const meta: Meta<typeof ChatBubble.Root> = {
  title: 'Misc/ChatBubble',
  component: ChatBubble.Root,
  argTypes: {
    placement: {
      control: 'select',
      options: ['start', 'end'],
      table: { defaultValue: { summary: 'start' } },
    },
    children: {
      control: false,
    },
  },
  render: (args) => (
    <ChatBubble.Root {...args}>
      <ChatBubble.Avatar src="https://i.pravatar.cc/40?img=1" fallback="A" />
      <ChatBubble.Container>
        <ChatBubble.Header>Alice</ChatBubble.Header>
        <ChatBubble.Content>Hey, how are you doing?</ChatBubble.Content>
        <ChatBubble.Footer>2:34 PM</ChatBubble.Footer>
      </ChatBubble.Container>
    </ChatBubble.Root>
  ),
};

export default meta;

type Story = StoryObj<typeof ChatBubble.Root>;

export const Default: Story = {};
