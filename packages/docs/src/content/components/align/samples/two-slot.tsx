import { Align, Button, Icon, Stack, Text } from 'move';

/**
 * Drop the Center to get a clean two-slot bar — title on the left,
 * actions on the right. The grid still reserves the middle track, so
 * the End never collides with the Start when content is short.
 */
export default function TwoSlotSample() {
  return (
    <Stack gap="md">
      <Align gap="md" padding="md" style={{ border: '1px solid var(--move-border-base)', borderRadius: 'var(--move-rounded-lg)' }}>
        <Align.Start>
          <Text weight="semibold" size="lg">Projects</Text>
        </Align.Start>
        <Align.End>
          <Button variant="ghost" size="sm">
            <Icon name="filter" />
          </Button>
          <Button>
            <Stack direction="row" gap="xs" align="center">
              <Icon name="plus" />
              <span>New project</span>
            </Stack>
          </Button>
        </Align.End>
      </Align>
      <Align gap="md" padding="md" style={{ border: '1px solid var(--move-border-base)', borderRadius: 'var(--move-rounded-lg)' }}>
        <Align.Start>
          <Text size="sm" color="muted">23 of 412 selected</Text>
        </Align.Start>
        <Align.End>
          <Button variant="ghost" size="sm">Clear</Button>
          <Button variant="danger" size="sm">Delete selected</Button>
        </Align.End>
      </Align>
    </Stack>
  );
}
