import { useState } from 'react';
import { Sortable, Text, Stack } from 'move';

const INITIAL = [
  { id: 'a', title: 'Eerste punt' },
  { id: 'b', title: 'Tweede punt' },
  { id: 'c', title: 'Derde punt' },
];

/**
 * Tab to a handle and press Enter. The same moves the pointer makes, as named
 * actions — and the menu never opens for a pointer, so a drag is never
 * interrupted by one.
 */
export default function KeyboardSample() {
  const [rows, setRows] = useState(INITIAL);

  return (
    <Stack gap="md">
      <Text size="sm" color="muted">
        Tab to a handle, then press Enter.
      </Text>
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
          <Sortable.Item key={row.id} id={row.id} index={i} label={row.title}>
            <Text>{row.title}</Text>
          </Sortable.Item>
        ))}
      </Sortable.Root>
    </Stack>
  );
}
