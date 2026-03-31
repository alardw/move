import { List, Avatar, Button, Badge, Icon } from 'move';

const people = [
  { name: 'Leslie Alexander', role: 'Co-Founder / CEO', initials: 'LA', color: 'violet', status: 'Active' },
  { name: 'Michael Foster', role: 'Co-Founder / CTO', initials: 'MF', color: 'indigo', status: 'Active' },
  { name: 'Dries Vincent', role: 'Business Relations', initials: 'DV', color: 'teal', status: 'Inactive' },
  { name: 'Lindsay Walton', role: 'Front-end Developer', initials: 'LW', color: 'orange', status: 'Active' },
];

export default function ListWithAction() {
  return (
    <List hover>
      {people.map((person) => (
        <List.Item key={person.name} href="#">
          <List.Leading>
            <Avatar.Root size="md" color={person.color}>
              <Avatar.Fallback>{person.initials}</Avatar.Fallback>
            </Avatar.Root>
          </List.Leading>
          <List.Content>
            <List.Title>{person.name}</List.Title>
            <List.Description>{person.role}</List.Description>
          </List.Content>
          <List.Trailing>
            <Badge variant="soft" color={person.status === 'Active' ? 'green' : 'gray'} size="sm">
              {person.status}
            </Badge>
            <Button variant="secondary" size="sm">View</Button>
            <Icon name="chevron-right" />
          </List.Trailing>
        </List.Item>
      ))}
    </List>
  );
}
