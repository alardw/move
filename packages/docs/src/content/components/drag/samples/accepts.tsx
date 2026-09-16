import { Drag, Card, Text, Stack, Button, Icon, useDraggable } from 'move';

function Chip({ id, title, kind }: { id: string; title: string; kind: string }) {
  const { ref, handleProps } = useDraggable<HTMLDivElement>({ id, data: kind, axis: 'both' });
  return (
    <Card.Root ref={ref} size="sm">
      <Stack direction="row" gap="sm" align="center">
        <Button {...handleProps} variant="ghost" size="sm" aria-label={`Sleep ${title}`}>
          <Icon name="grip-vertical" />
        </Button>
        <Text size="sm">{title}</Text>
      </Stack>
    </Card.Root>
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
