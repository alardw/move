import { ChatBubble, Stack } from 'move';

const personas = [
  { name: 'Mira (Design)', initials: 'MK', src: 'https://i.pravatar.cc/96?img=47', color: 'pink' as const, message: 'Bumped the spacing tokens by one step — the headers were swallowing the body copy.' },
  { name: 'Theo (Engineering)', initials: 'TP', src: 'https://i.pravatar.cc/96?img=33', color: 'indigo' as const, message: 'Picked up the reduced-motion guard — should land in the next prerelease.' },
  { name: 'Jamie (Support)', initials: 'JC', src: 'https://i.pravatar.cc/96?img=22', color: 'teal' as const, message: 'Two customers asked about RTL today — adding to the FAQ for Friday.' },
  { name: 'Auto-deploy', initials: 'AD', src: undefined, color: 'orange' as const, message: 'Deployed v2.4.3 to production. 124 new sessions in the last hour.' },
];

/**
 * `color` overrides `variant` with any Open Color palette name —
 * useful when each speaker should have a stable tint instead of the
 * default semantic variant.
 */
export default function ColorsSample() {
  return (
    <Stack gap="md">
      {personas.map((p) => (
        <ChatBubble.Root key={p.name} placement="start">
          <ChatBubble.Avatar src={p.src} fallback={p.initials} />
          <ChatBubble.Container color={p.color} tail>
            <ChatBubble.Header>{p.name}</ChatBubble.Header>
            <ChatBubble.Content>{p.message}</ChatBubble.Content>
          </ChatBubble.Container>
        </ChatBubble.Root>
      ))}
    </Stack>
  );
}
