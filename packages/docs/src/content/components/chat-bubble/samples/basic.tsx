import { ChatBubble, Stack } from 'move';

export default function BasicSample() {
  return (
    <Stack gap="md">
      <ChatBubble.Root placement="start">
        <ChatBubble.Avatar src="https://i.pravatar.cc/96?img=47" fallback="MK" />
        <ChatBubble.Container tail>
          <ChatBubble.Header>Mira Kovac</ChatBubble.Header>
          <ChatBubble.Content>Hey — I left the new theme tokens on the design branch. Want me to walk you through them?</ChatBubble.Content>
          <ChatBubble.Footer>just now</ChatBubble.Footer>
        </ChatBubble.Container>
      </ChatBubble.Root>
      <ChatBubble.Root placement="end">
        <ChatBubble.Avatar src="https://i.pravatar.cc/96?img=12" fallback="AS" />
        <ChatBubble.Container variant="primary" tail>
          <ChatBubble.Content>Yes please — I’m about to override the primary palette and don’t want to do it twice.</ChatBubble.Content>
          <ChatBubble.Footer>just now</ChatBubble.Footer>
        </ChatBubble.Container>
      </ChatBubble.Root>
    </Stack>
  );
}
