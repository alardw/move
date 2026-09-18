import { useState } from 'react';
import { Drag, Button, Text, Stack, Icon, Badge, useDraggable } from 'move';

interface Item {
  id: string;
  title: string;
  kind: 'doc' | 'image';
}

const START: Item[] = [
  { id: 'a', title: 'Report', kind: 'doc' },
  { id: 'b', title: 'Contract', kind: 'doc' },
  { id: 'c', title: 'Screenshot', kind: 'image' },
];

/** The chip IS its own handle, so `dragProps` puts both refs on one node. */
function Chip({ item }: { item: Item }) {
  const { dragProps } = useDraggable<HTMLButtonElement>({
    id: item.id,
    data: item,
    axis: 'both',
  });
  return (
    <Button {...dragProps} variant="secondary" size="sm">
      <Icon name="grip-vertical" />
      {item.title}
      <Badge size="sm" variant="soft">
        {item.kind}
      </Badge>
    </Button>
  );
}

/**
 * A zone that only takes one kind of thing says so while the pointer is still
 * over it, so the answer arrives before the release rather than after — and a
 * refused drop leaves the chip where it was.
 */
export default function AcceptsSample() {
  const [pool, setPool] = useState<Item[]>(START);
  const [filed, setFiled] = useState<Item[]>([]);

  return (
    <Drag.Root>
      <Stack gap="lg">
        <Stack direction="row" gap="sm" wrap>
          {pool.length === 0 ? (
            <Text size="sm" color="muted">
              Nothing left to file.
            </Text>
          ) : (
            pool.map((item) => <Chip key={item.id} item={item} />)
          )}
        </Stack>

        <Drag.Zone
          id="documents"
          accepts={(payload) => (payload.data as Item).kind === 'doc'}
          onDrop={(event) => {
            const item = event.payload.data as Item;
            // Already here: dropping it on the zone it is in changes nothing.
            if (filed.some((f) => f.id === item.id)) return;
            setPool((prev) => prev.filter((p) => p.id !== item.id));
            setFiled((prev) => [...prev, item]);
          }}
        >
          <Stack gap="sm" align="center">
            <Text size="sm" color="muted">
              Documents only
            </Text>
            {filed.length > 0 && (
              <Stack direction="row" gap="sm" wrap justify="center">
                {/* The filed item is the same chip it was outside, so it can be
                    picked up again. What arrives somewhere is still a thing. */}
                {filed.map((item) => (
                  <Chip key={item.id} item={item} />
                ))}
              </Stack>
            )}
          </Stack>
        </Drag.Zone>
      </Stack>
    </Drag.Root>
  );
}
