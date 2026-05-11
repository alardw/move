import { Avatar, Badge, Icon, List } from 'move';

const team = [
  { name: 'Alex Smith', role: 'Lead', initials: 'AS', src: 'https://i.pravatar.cc/96?img=12', status: 'online' as const },
  { name: 'Mira Kovac', role: 'Designer', initials: 'MK', src: 'https://i.pravatar.cc/96?img=47', status: 'away' as const },
  { name: 'Theo Park', role: 'Engineer', initials: 'TP', src: 'https://i.pravatar.cc/96?img=33', status: 'offline' as const },
];

const colorMap = { online: 'success' as const, away: 'warning' as const, offline: 'gray' as const };

export default function BasicSample() {
  return (
    <List>
      {team.map((p) => (
        <List.Item key={p.name}>
          <List.Leading>
            <Avatar.Root>
              <Avatar.Image src={p.src} alt={p.name} />
              <Avatar.Fallback>{p.initials}</Avatar.Fallback>
            </Avatar.Root>
          </List.Leading>
          <List.Content>
            <List.Title>{p.name}</List.Title>
            <List.Description>{p.role}</List.Description>
          </List.Content>
          <List.Trailing>
            <Badge variant="dot" color={colorMap[p.status]}>{p.status}</Badge>
            <Icon name="chevron-right" />
          </List.Trailing>
        </List.Item>
      ))}
    </List>
  );
}
