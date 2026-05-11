import { ChatBubble, Stack } from 'move';

const variants = [
  { variant: 'neutral' as const, name: 'Mira', initials: 'MK', src: 'https://i.pravatar.cc/96?img=47', text: 'The default — quiet enough for long threads where the message is the focus.' },
  { variant: 'primary' as const, name: 'You', initials: 'AS', src: 'https://i.pravatar.cc/96?img=12', text: 'Brand-tinted — for your own messages, or replies you want to emphasise.' },
  { variant: 'success' as const, name: 'Theo', initials: 'TP', src: 'https://i.pravatar.cc/96?img=33', text: 'Confirmations, completions, "task done" responses.' },
  { variant: 'warning' as const, name: 'Jamie', initials: 'JC', src: 'https://i.pravatar.cc/96?img=22', text: 'Soft yellow — heads-up messages, rate-limit notices, mild errors.' },
  { variant: 'error' as const, name: 'System', initials: 'SY', src: 'https://i.pravatar.cc/96?img=68', text: 'Red — failures, blocked actions, and anything the user must read.' },
];

export default function VariantsSample() {
  return (
    <Stack gap="md">
      {variants.map((v) => (
        <ChatBubble.Root key={v.variant} placement="start">
          <ChatBubble.Avatar src={v.src} fallback={v.initials} />
          <ChatBubble.Container variant={v.variant} tail>
            <ChatBubble.Header>{v.name} · variant="{v.variant}"</ChatBubble.Header>
            <ChatBubble.Content>{v.text}</ChatBubble.Content>
          </ChatBubble.Container>
        </ChatBubble.Root>
      ))}
    </Stack>
  );
}
