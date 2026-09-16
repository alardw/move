import { useState } from 'react';
import { Sortable, Text, Stack, Badge, Avatar } from 'move';

const PEOPLE = [
  { id: 'a', name: 'Avery', role: 'Design' },
  { id: 'b', name: 'Nora', role: 'Engineering' },
  { id: 'c', name: 'Jonah', role: 'Sales' },
];

/**
 * `handle` takes four values. `start` and `end` have Item render the grab point
 * for you. `self` makes the whole row draggable — right for a card, which
 * already reads as liftable. `custom` means you place `Sortable.Handle` exactly
 * where it belongs: this row leads with a face and ends with the grip, so the
 * eye meets the person first and the handle waits at the edge it is reached
 * from.
 *
 * The Handle takes no props on purpose: the icon, the touch target, the cursor
 * and the keyboard menu all belong to it, so placing one is never assembling
 * one.
 */
export default function PlacementSample() {
  const [rows, setRows] = useState(PEOPLE);

  return (
    <Sortable.Root
      onReorder={({ source, destination }) => {
        if (!destination) return;
        setRows((prev) => {
          const next = prev.slice();
          const [moved] = next.splice(source.index, 1);
          next.splice(destination.index, 0, moved);
          return next;
        });
      }}
    >
      {rows.map((row, i) => (
        <Sortable.Item key={row.id} id={row.id} index={i} label={row.name} handle="custom">
          <Avatar.Root size="sm">
            <Avatar.Fallback>{row.name.slice(0, 2).toUpperCase()}</Avatar.Fallback>
          </Avatar.Root>
          <Stack direction="row" gap="sm" align="center" flex={1}>
            <Text>{row.name}</Text>
            <Badge size="sm" variant="soft">
              {row.role}
            </Badge>
          </Stack>
          <Sortable.Handle />
        </Sortable.Item>
      ))}
    </Sortable.Root>
  );
}
