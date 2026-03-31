import { List } from 'move';

export default function ListSizes() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <div key={size}>
          <p style={{ marginBottom: 8, fontWeight: 500, fontSize: 14, color: 'var(--move-fg-muted)' }}>
            size=&quot;{size}&quot;
          </p>
          <List size={size}>
            <List.Item>
              <List.Content>
                <List.Title>Leslie Alexander</List.Title>
                <List.Description>leslie.alexander@example.com</List.Description>
              </List.Content>
            </List.Item>
            <List.Item>
              <List.Content>
                <List.Title>Michael Foster</List.Title>
                <List.Description>michael.foster@example.com</List.Description>
              </List.Content>
            </List.Item>
          </List>
        </div>
      ))}
    </div>
  );
}
