import { Card, Heading, Stack, Text } from 'move';

export default function TruncateSample() {
  return (
    <Card.Root maxWidth="24rem">
      <Card.Body>
        <Stack gap="xs">
          <Heading level={3} truncate>
            The very long title of a project that nobody bothered to shorten before pasting it into the page header
          </Heading>
          <Text size="sm" color="muted">— with truncate, the full text becomes a tooltip on hover (browser-native).</Text>
        </Stack>
      </Card.Body>
    </Card.Root>
  );
}
