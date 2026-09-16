import { useState } from 'react';
import { Sortable, Text, Badge, Stack } from 'move';

const INITIAL = [
  { id: 'a', title: 'Offerte versturen', pinned: false },
  { id: 'b', title: 'Afgeronde taak', pinned: true },
  { id: 'c', title: 'Demo inplannen', pinned: false },
];

/** A row that cannot move keeps its place while the others reorder around it. */
export default function PinnedSample() {
  const [rows, setRows] = useState(INITIAL);

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
        <Sortable.Item key={row.id} id={row.id} index={i} label={row.title} disabled={row.pinned}>
          <Stack direction="row" gap="sm" align="center">
            <Text>{row.title}</Text>
            {row.pinned && <Badge size="sm">Vast</Badge>}
          </Stack>
        </Sortable.Item>
      ))}
    </Sortable.Root>
  );
}
