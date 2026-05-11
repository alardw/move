import { Align, Avatar, Button, Icon, InputText, Text } from 'move';

/**
 * The classic app-bar layout. Start carries the brand, Center holds a
 * universal search, End collects user actions. The grid keeps Center
 * truly centred regardless of how wide Start or End grow.
 */
export default function BasicSample() {
  return (
    <Align gap="md" padding="md" style={{ border: '1px solid var(--move-border-base)', borderRadius: 'var(--move-rounded-lg)' }}>
      <Align.Start>
        <Text weight="semibold">Acme Co.</Text>
      </Align.Start>
      <Align.Center>
        <InputText placeholder="Search anything…" style={{ minWidth: '16rem' }} />
      </Align.Center>
      <Align.End>
        <Button variant="ghost" size="sm">
          <Icon name="bell" />
        </Button>
        <Avatar.Root>
          <Avatar.Fallback>AS</Avatar.Fallback>
        </Avatar.Root>
      </Align.End>
    </Align>
  );
}
