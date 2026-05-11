import { ChatBubble, Stack } from 'move';

/**
 * Drop the `tail` and ChatBubble reads as a generic message tile —
 * good for system messages, announcements, and anything that isn’t
 * really part of the conversation.
 */
export default function NoTailSample() {
  return (
    <Stack gap="sm">
      <ChatBubble.Root placement="start">
        <ChatBubble.Avatar fallback="SYS" />
        <ChatBubble.Container variant="neutral">
          <ChatBubble.Header>System</ChatBubble.Header>
          <ChatBubble.Content>Mira joined the channel.</ChatBubble.Content>
        </ChatBubble.Container>
      </ChatBubble.Root>
      <ChatBubble.Root placement="start">
        <ChatBubble.Avatar fallback="DEP" />
        <ChatBubble.Container variant="success">
          <ChatBubble.Content>Deployment finished — v2.4.3 is live.</ChatBubble.Content>
          <ChatBubble.Footer>2 min ago</ChatBubble.Footer>
        </ChatBubble.Container>
      </ChatBubble.Root>
      <ChatBubble.Root placement="start">
        <ChatBubble.Avatar fallback="REM" />
        <ChatBubble.Container variant="warning">
          <ChatBubble.Header>Reminder</ChatBubble.Header>
          <ChatBubble.Content>Standup in 5 minutes — links in the calendar.</ChatBubble.Content>
        </ChatBubble.Container>
      </ChatBubble.Root>
    </Stack>
  );
}
