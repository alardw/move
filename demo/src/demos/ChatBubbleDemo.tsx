import { ChatBubble, Loader, Heading } from 'move';
import { DocPage, type Example } from '../components/DocPage';
import { Stack } from '../components';

// ─────────────────────────────────────────────────────────────────
// Usage
// ─────────────────────────────────────────────────────────────────

function UsageExample() {
  return (
    <Stack direction="column" gap="md">
      <ChatBubble.Root placement="start">
        <ChatBubble.Avatar src="https://i.pravatar.cc/40?img=1" fallback="A" />
        <ChatBubble.Container>
          <ChatBubble.Header>Alice</ChatBubble.Header>
          <ChatBubble.Content>Hey, how are you doing?</ChatBubble.Content>
          <ChatBubble.Footer>2:34 PM</ChatBubble.Footer>
        </ChatBubble.Container>
      </ChatBubble.Root>

      <ChatBubble.Root placement="end">
        <ChatBubble.Container variant="primary">
          <ChatBubble.Content>I'm doing great, thanks for asking!</ChatBubble.Content>
          <ChatBubble.Footer>2:35 PM</ChatBubble.Footer>
        </ChatBubble.Container>
      </ChatBubble.Root>
    </Stack>
  );
}

// ─────────────────────────────────────────────────────────────────
// Placement
// ─────────────────────────────────────────────────────────────────

function PlacementExample() {
  return (
    <Stack direction="column" gap="md">
      <ChatBubble.Root placement="start">
        <ChatBubble.Avatar fallback="B" />
        <ChatBubble.Container>
          <ChatBubble.Content>Messages from others appear on the left.</ChatBubble.Content>
        </ChatBubble.Container>
      </ChatBubble.Root>

      <ChatBubble.Root placement="end">
        <ChatBubble.Container variant="primary">
          <ChatBubble.Content>Your own messages appear on the right.</ChatBubble.Content>
        </ChatBubble.Container>
      </ChatBubble.Root>
    </Stack>
  );
}

// ─────────────────────────────────────────────────────────────────
// Variants
// ─────────────────────────────────────────────────────────────────

function VariantsExample() {
  return (
    <Stack direction="column" gap="md">
      <ChatBubble.Root>
        <ChatBubble.Container variant="neutral">
          <ChatBubble.Content>Neutral (default)</ChatBubble.Content>
        </ChatBubble.Container>
      </ChatBubble.Root>
      <ChatBubble.Root>
        <ChatBubble.Container variant="primary">
          <ChatBubble.Content>Primary</ChatBubble.Content>
        </ChatBubble.Container>
      </ChatBubble.Root>
      <ChatBubble.Root>
        <ChatBubble.Container variant="success">
          <ChatBubble.Content>Task completed successfully.</ChatBubble.Content>
        </ChatBubble.Container>
      </ChatBubble.Root>
      <ChatBubble.Root>
        <ChatBubble.Container variant="warning">
          <ChatBubble.Content>Rate limit approaching.</ChatBubble.Content>
        </ChatBubble.Container>
      </ChatBubble.Root>
      <ChatBubble.Root>
        <ChatBubble.Container variant="error">
          <ChatBubble.Content>Connection lost. Retrying...</ChatBubble.Content>
        </ChatBubble.Container>
      </ChatBubble.Root>
    </Stack>
  );
}

// ─────────────────────────────────────────────────────────────────
// Tail
// ─────────────────────────────────────────────────────────────────

function TailExample() {
  return (
    <Stack direction="column" gap="md">
      <ChatBubble.Root placement="start">
        <ChatBubble.Avatar src="https://i.pravatar.cc/40?img=5" fallback="S" />
        <ChatBubble.Container tail>
          <ChatBubble.Content>With a tail on the left.</ChatBubble.Content>
        </ChatBubble.Container>
      </ChatBubble.Root>

      <ChatBubble.Root placement="end">
        <ChatBubble.Container variant="primary" tail>
          <ChatBubble.Content>With a tail on the right.</ChatBubble.Content>
        </ChatBubble.Container>
      </ChatBubble.Root>
    </Stack>
  );
}

// ─────────────────────────────────────────────────────────────────
// Typing indicator
// ─────────────────────────────────────────────────────────────────

function TypingExample() {
  return (
    <Stack direction="column" gap="md">
      <ChatBubble.Root placement="start">
        <ChatBubble.Avatar fallback="AI" />
        <ChatBubble.Container>
          <ChatBubble.Content>
            <Loader variant="dots" size="sm" />
          </ChatBubble.Content>
        </ChatBubble.Container>
      </ChatBubble.Root>
    </Stack>
  );
}

// ─────────────────────────────────────────────────────────────────
// Conversation
// ─────────────────────────────────────────────────────────────────

function ConversationExample() {
  return (
    <Stack direction="column" gap="sm">
      <ChatBubble.Root placement="start">
        <ChatBubble.Avatar src="https://i.pravatar.cc/40?img=3" fallback="M" />
        <ChatBubble.Container tail>
          <ChatBubble.Header>Maya</ChatBubble.Header>
          <ChatBubble.Content>Hey! Did you see the new design?</ChatBubble.Content>
          <ChatBubble.Footer>10:02 AM</ChatBubble.Footer>
        </ChatBubble.Container>
      </ChatBubble.Root>

      <ChatBubble.Root placement="end">
        <ChatBubble.Container variant="primary" tail>
          <ChatBubble.Content>Yes! Looks amazing. Love the new color palette.</ChatBubble.Content>
          <ChatBubble.Footer>10:03 AM</ChatBubble.Footer>
        </ChatBubble.Container>
      </ChatBubble.Root>

      <ChatBubble.Root placement="start">
        <ChatBubble.Avatar src="https://i.pravatar.cc/40?img=3" fallback="M" />
        <ChatBubble.Container tail>
          <ChatBubble.Content>Right? The dark mode variant is especially nice.</ChatBubble.Content>
          <ChatBubble.Footer>10:03 AM</ChatBubble.Footer>
        </ChatBubble.Container>
      </ChatBubble.Root>

      <ChatBubble.Root placement="end">
        <ChatBubble.Container variant="primary" tail>
          <ChatBubble.Content>Definitely. Should we ship it this sprint?</ChatBubble.Content>
          <ChatBubble.Footer>10:04 AM</ChatBubble.Footer>
        </ChatBubble.Container>
      </ChatBubble.Root>

      <ChatBubble.Root placement="start">
        <ChatBubble.Avatar src="https://i.pravatar.cc/40?img=3" fallback="M" />
        <ChatBubble.Container>
          <ChatBubble.Content>
            <Loader variant="dots" size="sm" />
          </ChatBubble.Content>
        </ChatBubble.Container>
      </ChatBubble.Root>
    </Stack>
  );
}

// ─────────────────────────────────────────────────────────────────
// Examples
// ─────────────────────────────────────────────────────────────────

const examples: Example[] = [
  {
    id: 'usage',
    name: 'Usage',
    description: 'A simple exchange between two people.',
    component: <UsageExample />,
    code: `import { ChatBubble } from 'move';

<ChatBubble.Root placement="start">
  <ChatBubble.Avatar src="/avatar.jpg" fallback="A" />
  <ChatBubble.Container>
    <ChatBubble.Header>Alice</ChatBubble.Header>
    <ChatBubble.Content>Hey, how are you doing?</ChatBubble.Content>
    <ChatBubble.Footer>2:34 PM</ChatBubble.Footer>
  </ChatBubble.Container>
</ChatBubble.Root>

<ChatBubble.Root placement="end">
  <ChatBubble.Container variant="primary">
    <ChatBubble.Content>I'm doing great, thanks!</ChatBubble.Content>
    <ChatBubble.Footer>2:35 PM</ChatBubble.Footer>
  </ChatBubble.Container>
</ChatBubble.Root>`,
  },
  {
    id: 'placement',
    name: 'Placement',
    description: 'Left for received, right for sent.',
    component: <PlacementExample />,
    code: `<ChatBubble.Root placement="start">
  <ChatBubble.Avatar fallback="B" />
  <ChatBubble.Container>
    <ChatBubble.Content>On the left.</ChatBubble.Content>
  </ChatBubble.Container>
</ChatBubble.Root>

<ChatBubble.Root placement="end">
  <ChatBubble.Container variant="primary">
    <ChatBubble.Content>On the right.</ChatBubble.Content>
  </ChatBubble.Container>
</ChatBubble.Root>`,
  },
  {
    id: 'variants',
    name: 'Variants',
    description: 'A color for every context.',
    component: <VariantsExample />,
    code: `<ChatBubble.Container variant="neutral">Neutral</ChatBubble.Container>
<ChatBubble.Container variant="primary">Primary</ChatBubble.Container>
<ChatBubble.Container variant="success">Success</ChatBubble.Container>
<ChatBubble.Container variant="warning">Warning</ChatBubble.Container>
<ChatBubble.Container variant="error">Error</ChatBubble.Container>`,
  },
  {
    id: 'tail',
    name: 'With Tail',
    description: 'A small pointer toward the sender.',
    component: <TailExample />,
    code: `<ChatBubble.Root placement="start">
  <ChatBubble.Avatar fallback="S" />
  <ChatBubble.Container tail>
    <ChatBubble.Content>With a tail on the left.</ChatBubble.Content>
  </ChatBubble.Container>
</ChatBubble.Root>

<ChatBubble.Root placement="end">
  <ChatBubble.Container variant="primary" tail>
    <ChatBubble.Content>With a tail on the right.</ChatBubble.Content>
  </ChatBubble.Container>
</ChatBubble.Root>`,
  },
  {
    id: 'typing',
    name: 'Typing Indicator',
    description: 'Show that someone is typing with animated dots.',
    component: <TypingExample />,
    code: `import { ChatBubble, Loader } from 'move';

<ChatBubble.Root placement="start">
  <ChatBubble.Avatar fallback="AI" />
  <ChatBubble.Container>
    <ChatBubble.Content>
      <Loader variant="dots" size="sm" />
    </ChatBubble.Content>
  </ChatBubble.Container>
</ChatBubble.Root>`,
  },
  {
    id: 'conversation',
    name: 'Conversation',
    description: 'A full chat thread with avatars, timestamps, and a typing indicator.',
    component: <ConversationExample />,
    code: `<ChatBubble.Root placement="start">
  <ChatBubble.Avatar src="/maya.jpg" fallback="M" />
  <ChatBubble.Container tail>
    <ChatBubble.Header>Maya</ChatBubble.Header>
    <ChatBubble.Content>Hey! Did you see the new design?</ChatBubble.Content>
    <ChatBubble.Footer>10:02 AM</ChatBubble.Footer>
  </ChatBubble.Container>
</ChatBubble.Root>

<ChatBubble.Root placement="end">
  <ChatBubble.Container variant="primary" tail>
    <ChatBubble.Content>Yes! Looks amazing.</ChatBubble.Content>
    <ChatBubble.Footer>10:03 AM</ChatBubble.Footer>
  </ChatBubble.Container>
</ChatBubble.Root>`,
  },
];

export function ChatBubbleDemo() {
  return (
    <DocPage.Root defaultExample="usage">
      <DocPage.Header
        title="ChatBubble"
        description="Conversation bubbles for chat interfaces with avatars, timestamps, and variants."
      />
      <DocPage.Examples examples={examples} />

      <Heading level={3}>Parameters</Heading>

      <DocPage.ApiSection
        title="ChatBubble.Root"
        properties={[
          { name: 'placement', type: "'start' | 'end'", default: "'start'", description: 'Message alignment. Start for received, end for sent.' },
        ]}
      />

      <DocPage.ApiSection
        title="ChatBubble.Avatar"
        properties={[
          { name: 'src', type: 'string', description: 'Avatar image URL.' },
          { name: 'fallback', type: 'ReactNode', description: 'Fallback content when image is unavailable (e.g. initials).' },
          { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Avatar size.' },
        ]}
      />

      <DocPage.ApiSection
        title="ChatBubble.Container"
        properties={[
          { name: 'variant', type: "'neutral' | 'primary' | 'success' | 'warning' | 'error'", default: "'neutral'", description: 'Bubble color.' },
          { name: 'tail', type: 'boolean', default: 'false', description: 'Show a triangular pointer toward the avatar.' },
        ]}
      />
    </DocPage.Root>
  );
}
