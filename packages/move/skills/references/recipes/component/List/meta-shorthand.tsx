import { List, Avatar, Badge } from 'move';

const people = [
  { name: 'Leslie Alexander', role: 'Co-Founder / CEO', initials: 'LA' },
  { name: 'Michael Foster', role: 'Co-Founder / CTO', initials: 'MF' },
  { name: 'Dries Vincent', role: 'Business Relations', initials: 'DV' },
];

export default function ListMetaShorthand() {
  return (
    <List hover>
      {people.map((person) => (
        <List.Item key={person.name} href="#">
          <List.Meta
            avatar={<Avatar.Root color="violet"><Avatar.Fallback>{person.initials}</Avatar.Fallback></Avatar.Root>}
            title={person.name}
            description={person.role}
          />
          <List.Trailing>
            <Badge variant="outline" color="indigo">View</Badge>
          </List.Trailing>
        </List.Item>
      ))}
    </List>
  );
}
