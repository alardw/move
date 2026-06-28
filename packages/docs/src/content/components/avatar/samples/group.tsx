import { Avatar, Stack, Text } from 'move';

const teammates = [
  { id: 1, name: 'Alex Smith', initials: 'AS', color: 'blue' as const, src: 'https://i.pravatar.cc/96?img=12' },
  { id: 2, name: 'Jamie Chen', initials: 'JC', color: 'green' as const, src: 'https://i.pravatar.cc/96?img=22' },
  { id: 3, name: 'Mira Kovac', initials: 'MK', color: 'pink' as const, src: 'https://i.pravatar.cc/96?img=32' },
  { id: 4, name: 'Theo Park', initials: 'TP', color: 'orange' as const, src: 'https://i.pravatar.cc/96?img=42' },
];

/**
 * `Avatar.Group` overlaps avatars with a small negative margin. A
 * trailing "+N" overflow can be a plain Avatar with a fallback.
 */
export default function GroupSample() {
  return (
    <Stack gap="md">
      <Avatar.Group>
        {teammates.map((u) => (
          <Avatar.Root key={u.id} color={u.color}>
            <Avatar.Image src={u.src} alt={u.name} />
            <Avatar.Fallback>{u.initials}</Avatar.Fallback>
          </Avatar.Root>
        ))}
        <Avatar.Root color="gray">
          <Avatar.Fallback>+3</Avatar.Fallback>
        </Avatar.Root>
      </Avatar.Group>
      <Text size="sm" color="muted">
        Working on this together: Alex, Jamie, Mira, Theo, and three others.
      </Text>
    </Stack>
  );
}
