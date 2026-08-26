import { Align, Button, Card, Icon, Stack, Text } from 'move';

/**
 * Drop the Center to get a clean two-slot bar — title on the left,
 * actions on the right. The grid still reserves the middle track, so
 * the End never collides with the Start when content is short.
 */
export default function TwoSlotSample() {
  return (
    <Stack gap="md">
      <Card.Root>
        <Card.Body>
          <Align gap="md">
            <Align.Start>
              <Text weight="semibold" size="lg">Projects</Text>
            </Align.Start>
            <Align.End>
              <Button variant="ghost" size="sm" aria-label="Filter projects">
                <Icon name="filter" />
              </Button>
              <Button>
                <Stack direction="row" gap="xs" align="center">
                  <Icon name="plus" />
                  New project
                </Stack>
              </Button>
            </Align.End>
          </Align>
        </Card.Body>
      </Card.Root>
      <Card.Root>
        <Card.Body>
          <Align gap="md">
            <Align.Start>
              <Text size="sm" color="muted">23 of 412 selected</Text>
            </Align.Start>
            <Align.End>
              <Button variant="ghost" size="sm">Clear</Button>
              <Button variant="danger" size="sm">Delete selected</Button>
            </Align.End>
          </Align>
        </Card.Body>
      </Card.Root>
    </Stack>
  );
}
