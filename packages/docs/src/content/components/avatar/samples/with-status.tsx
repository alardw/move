import { Avatar, Stack, Text } from 'move';

const people = [
  { name: 'Alex Smith', initials: 'AS', src: 'https://i.pravatar.cc/96?img=8', status: 'online', color: 'green' },
  { name: 'Jamie Chen', initials: 'JC', src: 'https://i.pravatar.cc/96?img=18', status: 'away', color: 'yellow' },
  { name: 'Mira Kovac', initials: 'MK', src: 'https://i.pravatar.cc/96?img=28', status: 'offline', color: 'gray' },
] as const;

/**
 * Avatar doesn’t ship a built-in status indicator — wrap the Avatar in
 * a `position: relative` container and absolutely position a small
 * coloured dot. Common, harmless, no extra component needed.
 */
export default function WithStatusSample() {
  return (
    <Stack gap="md">
      {people.map((p) => (
        <Stack key={p.name} direction="row" gap="md" align="center">
          <span style={{ position: 'relative', display: 'inline-flex' }}>
            <Avatar.Root>
              <Avatar.Image src={p.src} alt={p.name} />
              <Avatar.Fallback>{p.initials}</Avatar.Fallback>
            </Avatar.Root>
            <span
              aria-hidden
              style={{
                position: 'absolute',
                right: -2,
                bottom: -2,
                width: 12,
                height: 12,
                borderRadius: '50%',
                background: `var(--move-${p.color}-500)`,
                boxShadow: '0 0 0 2px var(--move-bg-base)',
              }}
            />
          </span>
          <Stack gap="none">
            <Text weight="medium">{p.name}</Text>
            <Text size="sm" color="muted">{p.status}</Text>
          </Stack>
        </Stack>
      ))}
    </Stack>
  );
}
