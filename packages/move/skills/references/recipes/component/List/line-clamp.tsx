import { List, Avatar } from 'move';

const longDescription = 'Senior software engineer specializing in distributed systems, cloud infrastructure, and developer tooling. Previously worked at several startups building real-time collaboration tools.';

export default function ListLineClamp() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32, maxWidth: 480 }}>
      {([1, 2, 3, 'none'] as const).map((lines) => (
        <div key={String(lines)}>
          <p style={{ marginBottom: 8, fontWeight: 500, fontSize: 14, color: 'var(--move-fg-muted)' }}>
            lines={typeof lines === 'string' ? `"${lines}"` : lines}
          </p>
          <List>
            <List.Item>
              <List.Leading>
                <Avatar.Root color="teal"><Avatar.Fallback>LA</Avatar.Fallback></Avatar.Root>
              </List.Leading>
              <List.Content>
                <List.Title>Leslie Alexander</List.Title>
                <List.Description lines={lines}>{longDescription}</List.Description>
              </List.Content>
            </List.Item>
          </List>
        </div>
      ))}
    </div>
  );
}
