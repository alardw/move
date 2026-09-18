import { Drag, Button, Text, Stack, Icon, useDraggable } from 'move';

function Chip({ id, title, kind }: { id: string; title: string; kind: string }) {
  // `dragProps`: the chip IS its own handle, so both refs go on one node.
  const { dragProps } = useDraggable<HTMLButtonElement>({ id, data: kind, axis: 'both' });
  return (
    <Button {...dragProps} variant="secondary" size="sm">
      <Icon name="grip-vertical" />
      {title}
    </Button>
  );
}

/**
 * A zone that only takes one kind of thing says so while the pointer is still
 * on it, so the answer arrives before the release rather than after.
 */
export default function AcceptsSample() {
  return (
    <Drag.Root>
      <Stack gap="lg">
        <Stack direction="row" gap="sm" wrap>
          <Chip id="a" title="Document" kind="doc" />
          <Chip id="b" title="Image" kind="image" />
        </Stack>
        <Drag.Zone id="docs-only" accepts={(payload) => payload.data === 'doc'}>
          <Stack direction="row" justify="center" align="center">
            <Text size="sm" color="muted">
              Documents only
            </Text>
          </Stack>
        </Drag.Zone>
      </Stack>
    </Drag.Root>
  );
}
