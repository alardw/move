import { Drag, Button, Text, Stack, Icon, useDraggable } from 'move';

function Chip({ id, title, kind }: { id: string; title: string; kind: string }) {
  const { ref, handleProps } = useDraggable<HTMLButtonElement>({ id, data: kind, axis: 'both' });
  return (
    <Button {...handleProps} ref={ref} variant="secondary" size="sm">
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
          <Chip id="b" title="Afbeelding" kind="image" />
        </Stack>
        <Drag.Zone id="docs-only" accepts={(payload) => payload.data === 'doc'}>
          <Stack direction="row" justify="center" align="center">
            <Text size="sm" color="muted">
              Alleen documenten
            </Text>
          </Stack>
        </Drag.Zone>
      </Stack>
    </Drag.Root>
  );
}
