import { List, Avatar } from 'move';

const people = [
  { name: 'Leslie Alexander', email: 'leslie.alexander@example.com', initials: 'LA' },
  { name: 'Michael Foster', email: 'michael.foster@example.com', initials: 'MF' },
  { name: 'Dries Vincent', email: 'dries.vincent@example.com', initials: 'DV' },
];

export default function ListDensity() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      {(['compact', 'default', 'comfortable'] as const).map((density) => (
        <div key={density}>
          <p style={{ marginBottom: 8, fontWeight: 500, fontSize: 14, color: 'var(--move-fg-muted)' }}>
            density=&quot;{density}&quot;
          </p>
          <List density={density}>
            {people.map((person) => (
              <List.Item key={person.email}>
                <List.Leading>
                  <Avatar.Root size="sm" color="indigo"><Avatar.Fallback>{person.initials}</Avatar.Fallback></Avatar.Root>
                </List.Leading>
                <List.Content>
                  <List.Title>{person.name}</List.Title>
                  <List.Description>{person.email}</List.Description>
                </List.Content>
              </List.Item>
            ))}
          </List>
        </div>
      ))}
    </div>
  );
}
