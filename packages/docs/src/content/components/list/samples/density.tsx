import { Icon, List, Stack, Text } from 'move';

const items = [
  { icon: 'inbox' as const, title: 'Inbox', desc: '23 unread' },
  { icon: 'star' as const, title: 'Starred', desc: '4 items' },
  { icon: 'send' as const, title: 'Sent', desc: '128 emails this week' },
  { icon: 'archive' as const, title: 'Archive', desc: '8.2k items' },
];

export default function DensitySample() {
  return (
    <Stack gap="lg">
      <Stack gap="xs">
        <Text size="sm" weight="medium">density="compact"</Text>
        <List density="compact">
          {items.map((it) => (
            <List.Item key={it.title}>
              <List.Leading><Icon name={it.icon} /></List.Leading>
              <List.Content>
                <List.Title>{it.title}</List.Title>
              </List.Content>
            </List.Item>
          ))}
        </List>
      </Stack>
      <Stack gap="xs">
        <Text size="sm" weight="medium">density="comfortable" (default)</Text>
        <List>
          {items.map((it) => (
            <List.Item key={it.title}>
              <List.Leading><Icon name={it.icon} /></List.Leading>
              <List.Content>
                <List.Title>{it.title}</List.Title>
                <List.Description>{it.desc}</List.Description>
              </List.Content>
            </List.Item>
          ))}
        </List>
      </Stack>
    </Stack>
  );
}
