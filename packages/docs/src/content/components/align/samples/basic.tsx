import { Align, Avatar, Button, Card, Icon, InputText, Text } from 'move';

/**
 * The classic app-bar layout. Start carries the brand, Center holds a
 * universal search, End collects user actions. The grid keeps Center
 * truly centred regardless of how wide Start or End grow.
 */
export default function BasicSample() {
  return (
    <Card.Root>
      <Card.Body>
        <Align gap="md">
          <Align.Start>
            <Text weight="semibold">Acme Co.</Text>
          </Align.Start>
          <Align.Center>
            <InputText placeholder="Search anything…" width="16rem" />
          </Align.Center>
          <Align.End>
            <Button variant="ghost" size="sm" aria-label="Notifications">
              <Icon name="bell" />
            </Button>
            <Avatar.Root>
              <Avatar.Fallback>AS</Avatar.Fallback>
            </Avatar.Root>
          </Align.End>
        </Align>
      </Card.Body>
    </Card.Root>
  );
}
