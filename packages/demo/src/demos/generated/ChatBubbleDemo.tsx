// Generated from ChatBubble.spec.ts (schemaVersion: 6, specHash: af768c01)
import { ChatBubble } from 'move';
import type { DemoDefinition } from '../types';

const PALETTE_COLORS = ['gray', 'red', 'pink', 'grape', 'violet', 'indigo', 'blue', 'cyan', 'teal', 'green', 'lime', 'yellow', 'orange'];

export const demo: DemoDefinition = {
  id: 'core:ChatBubble',
  name: 'ChatBubble',
  category: 'core',
  description: 'Conversation bubble for chat UIs with avatar, placement, tail, variant, and color support',
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
      name: 'color',
      kind: 'select',
      options: ['(none)', ...PALETTE_COLORS],
      defaultValue: '(none)',
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
    color: '(none)',
    tail: true,
    children: 'Hello! How can I help you today?',
  },
  render: (props) => {
    const color = props.color === '(none)' ? undefined : (props.color as string);
    return (
      <ChatBubble.Root placement={props.placement as string} animations={false}>
        <ChatBubble.Avatar fallback="AI" />
        <ChatBubble.Container
          variant={props.variant as string}
          color={color}
          tail={props.tail as boolean}
        >
          <ChatBubble.Content>{props.children as string}</ChatBubble.Content>
        </ChatBubble.Container>
      </ChatBubble.Root>
    );
  },
};
