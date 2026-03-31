import { List, Avatar, Badge } from 'move';

const items = [
  { name: 'Leslie Alexander', role: 'Co-Founder / CEO', initials: 'LA', href: '#leslie' },
  { name: 'Michael Foster', role: 'Co-Founder / CTO', initials: 'MF', href: '#michael' },
  { name: 'Dries Vincent', role: 'Business Relations', initials: 'DV', href: '#dries' },
  { name: 'Lindsay Walton', role: 'Front-end Developer', initials: 'LW', href: '#lindsay', active: true },
  { name: 'Tom Cook', role: 'Director of Product', initials: 'TC', href: '#tom', disabled: true },
];

export default function ListInteractive() {
  return (
    <List hover>
      {items.map((item) => (
        <List.Item key={item.name} href={item.href} active={item.active} disabled={item.disabled}>
          <List.Leading>
            <Avatar.Root size="sm" color="indigo"><Avatar.Fallback>{item.initials}</Avatar.Fallback></Avatar.Root>
          </List.Leading>
          <List.Content>
            <List.Title>{item.name}</List.Title>
            <List.Description>{item.role}</List.Description>
          </List.Content>
          <List.Trailing>
            {item.active && <Badge color="indigo" variant="soft">Selected</Badge>}
            {item.disabled && <Badge color="gray" variant="soft">Unavailable</Badge>}
          </List.Trailing>
        </List.Item>
      ))}
    </List>
  );
}
