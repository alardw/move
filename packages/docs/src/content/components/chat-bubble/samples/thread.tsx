import { ChatBubble, Stack } from 'move';

const me = { src: 'https://i.pravatar.cc/96?img=12', initials: 'AS' };
const them = { src: 'https://i.pravatar.cc/96?img=47', initials: 'MK', name: 'Mira Kovac' };

const thread = [
  { from: 'them', message: 'Hey — what are you stuck on this morning?' },
  { from: 'me', message: 'Wiring up the Sidebar in our app shell. The collapsed rail tooltips don’t fire.' },
  { from: 'them', message: 'You probably need a `tooltip` prop on each Sidebar.Item — collapsed-mode tooltips opt in per item.' },
  { from: 'me', message: 'Tried that, no luck. Are tooltips disabled inside a Drawer?' },
  { from: 'them', message: 'No, but Drawer renders Sidebar in mobile mode, where tooltips are skipped on purpose. Try forcing desktop mode for the test.' },
];

/**
 * Stack a row of bubbles, alternating placement, and let the placement-aware
 * corners do the threading. Group consecutive same-side bubbles by skipping
 * the avatar after the first.
 */
export default function ThreadSample() {
  return (
    <Stack gap="sm">
      {thread.map((m, i) => {
        const placement = m.from === 'me' ? 'end' : 'start';
        const prevSameSide = i > 0 && thread[i - 1].from === m.from;
        const speaker = m.from === 'me' ? me : them;
        return (
          <ChatBubble.Root key={i} placement={placement}>
            {prevSameSide ? (
              <span style={{ width: 'var(--move-control-height-md)' }} aria-hidden />
            ) : (
              <ChatBubble.Avatar src={speaker.src} fallback={speaker.initials} />
            )}
            <ChatBubble.Container variant={m.from === 'me' ? 'primary' : 'neutral'} tail={!prevSameSide}>
              {!prevSameSide && m.from === 'them' && <ChatBubble.Header>{them.name}</ChatBubble.Header>}
              <ChatBubble.Content>{m.message}</ChatBubble.Content>
            </ChatBubble.Container>
          </ChatBubble.Root>
        );
      })}
    </Stack>
  );
}
