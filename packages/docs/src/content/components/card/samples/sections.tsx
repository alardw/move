import { Alert, Card, Stack, Text } from 'move';

/**
 * A card does not need all three sections.
 *
 * Whichever section sits on the outside carries the card's own padding, so the
 * gutter matches the sides however few of them there are — a card that ends in
 * its body closes the same way one that ends in a footer does.
 */
export default function SectionsSample() {
  return (
    <Stack gap="md">
      <Card.Root>
        <Card.Header>
          <Card.Title>Unconditionally</Card.Title>
          <Card.Description>That link has expired</Card.Description>
        </Card.Header>
        <Card.Body>
          <Alert variant="warning" title="That link has expired">
            It has either been used already or it timed out. Ask a colleague to send a new one.
          </Alert>
        </Card.Body>
      </Card.Root>

      <Card.Root>
        <Card.Body>
          <Text>
            Only a body. Nothing to announce and nothing to decide — the card is here to hold a
            paragraph, and it closes evenly on all four sides.
          </Text>
        </Card.Body>
      </Card.Root>

      <Card.Root>
        <Card.Header>
          <Card.Title>Only a header</Card.Title>
          <Card.Description>
            A title and a line under it, and that is the whole card.
          </Card.Description>
        </Card.Header>
      </Card.Root>
    </Stack>
  );
}
