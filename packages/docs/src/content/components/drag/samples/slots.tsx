import { useState } from 'react';
import { Drag, Card, Text, Stack, Button, Icon, useDraggable } from 'move';

const POOL = [
  { id: 'p1', title: 'Offerte' },
  { id: 'p2', title: 'CRM' },
  { id: 'p3', title: 'Support' },
];

function Chip({ id, title }: { id: string; title: string }) {
  const { ref, handleProps } = useDraggable<HTMLDivElement>({ id, data: title, axis: 'both' });
  return (
    <Stack flex="none">
      <Card.Root ref={ref} size="sm">
        <Stack direction="row" gap="sm" align="center">
          <Button {...handleProps} variant="ghost" size="sm" aria-label={`Sleep ${title}`}>
            <Icon name="grip-vertical" />
          </Button>
          <Text size="sm">{title}</Text>
        </Stack>
      </Card.Root>
    </Stack>
  );
}

/**
 * Three positions that stay visible while empty. This is what reordering cannot
 * express — there is no row in an empty slot to reorder.
 */
export default function SlotsSample() {
  const [slots, setSlots] = useState<(string | undefined)[]>([undefined, undefined, undefined]);

  return (
    <Drag.Root>
      <Stack gap="lg">
        <Stack direction="row" gap="sm" wrap>
          {POOL.map((p) => (
            <Chip key={p.id} id={p.id} title={p.title} />
          ))}
        </Stack>
        <Stack gap="sm">
          {slots.map((item, i) => (
            <Drag.Zone
              key={i}
              id={`slot-${i}`}
              onDrop={(event) =>
                setSlots((prev) =>
                  prev.map((s, j) => (j === i ? (event.payload.data as string) : s)),
                )
              }
            >
              <Stack direction="row" justify="center" align="center">
                <Text size="sm" color={item ? 'base' : 'muted'}>
                  {item ?? `Positie ${i + 1}`}
                </Text>
              </Stack>
            </Drag.Zone>
          ))}
        </Stack>
      </Stack>
    </Drag.Root>
  );
}
