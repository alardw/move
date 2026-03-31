import { List, Avatar, Badge, Stack, Text } from 'move';

const people = [
  { name: 'Leslie Alexander', email: 'leslie.alexander@example.com', initials: 'LA', role: 'Co-Founder / CEO', date: 'Jan 12, 2024', status: 'Active' },
  { name: 'Michael Foster', email: 'michael.foster@example.com', initials: 'MF', role: 'Co-Founder / CTO', date: 'Mar 3, 2024', status: 'Active' },
  { name: 'Dries Vincent', email: 'dries.vincent@example.com', initials: 'DV', role: 'Business Relations', date: 'Nov 28, 2023', status: 'Inactive' },
  { name: 'Lindsay Walton', email: 'lindsay.walton@example.com', initials: 'LW', role: 'Front-end Developer', date: 'Feb 15, 2024', status: 'Active' },
];

export default function ListWithAvatar() {
  return (
    <List hover>
      {people.map((person) => (
        <List.Item key={person.email} href="#">
          <List.Leading>
            <Avatar.Root color="indigo"><Avatar.Fallback>{person.initials}</Avatar.Fallback></Avatar.Root>
          </List.Leading>
          <List.Content>
            <List.Title>{person.name}</List.Title>
            <List.Description>{person.role}</List.Description>
          </List.Content>
          <List.Trailing>
            <Stack gap="xs" align="end">
              <Badge color={person.status === 'Active' ? 'green' : 'gray'} variant="soft" size="sm">
                {person.status}
              </Badge>
              <Text size="xs" color="muted">{person.date}</Text>
            </Stack>
          </List.Trailing>
        </List.Item>
      ))}
    </List>
  );
}
