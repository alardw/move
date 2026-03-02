// Generated from ChatBubble.spec.ts (schemaVersion: 6, specHash: af768c01)
import { ChatBubble } from 'move';
import type { DemoDefinition } from '../types';

export const demo: DemoDefinition = {
  id: 'core:ChatBubble',
  name: 'ChatBubble',
  category: 'core',
  description: 'Conversation bubble for chat UIs with avatar, placement, tail, and variant support',
  controls: [
    {
      name: 'placement',
      kind: 'select',
      options: ['start', 'end'],
      defaultValue: 'start',
    },
    {
      name: 'variant',
      kind: 'select',
      options: ['neutral', 'primary', 'success', 'warning', 'error'],
      defaultValue: 'neutral',
    },
    {
      name: 'tail',
      kind: 'boolean',
      defaultValue: true,
    },
    {
      name: 'children',
      kind: 'text',
      defaultValue: 'Hello! How can I help you today?',
    },
  ],
  initialProps: {
    placement: 'start',
    variant: 'neutral',
    tail: true,
    children: 'Hello! How can I help you today?',
  },
  render: (props) => (
    <ChatBubble.Root placement={props.placement as string} animate={false}>
      <ChatBubble.Avatar fallback="AI" />
      <ChatBubble.Container variant={props.variant as string} tail={props.tail as boolean}>
        <ChatBubble.Content>{props.children as string}</ChatBubble.Content>
      </ChatBubble.Container>
    </ChatBubble.Root>
  ),
};
