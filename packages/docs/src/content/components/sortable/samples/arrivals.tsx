import { useState } from 'react';
import { Drag, Sortable, Button, Text, Stack, Icon, Badge, useDraggable } from 'move';
import type { DragPayload, SortableArrival, SortableChange } from 'move';

interface Point {
  id: string;
  title: string;
}

const POOL: (Point & { type: string })[] = [
  { id: 'n1', title: 'Wachttijd balie', type: 'point' },
  { id: 'n2', title: 'Parkeerplaatsen', type: 'point' },
  // Not a point, and the list says so before you let go.
  { id: 'x1', title: 'Jaarverslag.pdf', type: 'file' },
];

/**
 * A chip outside the list. `type` is what the list reads to decide whether it
 * takes the thing — the question every target asks, so it has its own field
 * rather than living inside `data` under a name each app invents for itself.
 */
function Chip({ item }: { item: (typeof POOL)[number] }) {
  const { dragProps } = useDraggable<HTMLButtonElement>({
    id: item.id,
    type: item.type,
    data: item,
    axis: 'both',
  });
  return (
    <Button {...dragProps} variant="secondary" size="sm">
      <Icon name="grip-vertical" />
      {item.title}
      <Badge size="sm" variant="soft">
        {item.type}
      </Badge>
    </Button>
  );
}

export default function ArrivalsSample() {
  const [pool, setPool] = useState(POOL);
  const [points, setPoints] = useState<Point[]>([
    { id: 'p1', title: 'Openingstijden' },
    { id: 'p2', title: 'Bereikbaarheid' },
    { id: 'p3', title: 'Terugbelbeleid' },
  ]);

  function handleReorder(change: SortableChange) {
    if (!change.destination) return;
    setPoints((prev) => {
      const next = [...prev];
      const [row] = next.splice(change.source.index, 1);
      next.splice(change.destination!.index, 0, row);
      return next;
    });
  }

  function handleInsert(event: SortableArrival) {
    const item = event.payload.data as Point;
    setPool((prev) => prev.filter((p) => p.id !== item.id));
    setPoints((prev) => {
      const next = [...prev];
      next.splice(event.destination.index, 0, { id: item.id, title: item.title });
      return next;
    });
  }

  return (
    <Drag.Root>
      <Stack gap="lg">
        <Stack gap="sm">
          <Text size="sm" color="muted">
            Drag a chip into the list. The rows part where it would land.
          </Text>
          <Stack direction="row" gap="sm" wrap>
            {pool.length === 0 ? (
              <Text size="sm" color="muted">
                Everything placed.
              </Text>
            ) : (
              pool.map((item) => <Chip key={item.id} item={item} />)
            )}
          </Stack>
        </Stack>

        <Sortable.Root
          list="points"
          onReorder={handleReorder}
          // Points only. A file is refused on approach — the rows stay closed
          // and the cursor says no, rather than the drop being swallowed.
          accepts={(payload: DragPayload) => payload.type === 'point'}
          onInsert={handleInsert}
        >
          {points.map((point, i) => (
            <Sortable.Item key={point.id} id={point.id} index={i} label={point.title}>
              <Text size="sm">{point.title}</Text>
            </Sortable.Item>
          ))}
        </Sortable.Root>
      </Stack>
    </Drag.Root>
  );
}
