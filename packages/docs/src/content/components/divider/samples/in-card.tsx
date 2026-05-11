import { Avatar, Card, Divider, Stack, Text } from 'move';

const team = [
  { name: 'Alex Smith', role: 'Engineering · Lead', initials: 'AS', src: 'https://i.pravatar.cc/96?img=12' },
  { name: 'Mira Kovac', role: 'Design · Senior', initials: 'MK', src: 'https://i.pravatar.cc/96?img=47' },
  { name: 'Theo Park', role: 'Engineering', initials: 'TP', src: 'https://i.pravatar.cc/96?img=33' },
];

/**
 * Inside a Card, dividers separate items in a list without forcing
 * border-bottom hacks on the rows themselves.
 */
export default function InCardSample() {
  return (
    <Card.Root>
      <Card.Header>
        <Card.Title>Team members</Card.Title>
        <Card.Description>Three of seven shown</Card.Description>
      </Card.Header>
      <Card.Body>
        <Stack gap="md">
          {team.map((p, i) => (
            <Stack key={p.name} gap="md">
              {i > 0 && <Divider gap="xs" />}
              <Stack direction="row" gap="md" align="center">
                <Avatar.Root>
                  <Avatar.Image src={p.src} alt={p.name} />
                  <Avatar.Fallback>{p.initials}</Avatar.Fallback>
                </Avatar.Root>
                <Stack gap="none">
                  <Text weight="medium">{p.name}</Text>
                  <Text size="sm" color="muted">{p.role}</Text>
                </Stack>
              </Stack>
            </Stack>
          ))}
        </Stack>
      </Card.Body>
    </Card.Root>
  );
}
