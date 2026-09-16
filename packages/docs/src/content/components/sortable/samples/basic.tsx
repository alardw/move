import { useState } from 'react';
import { Sortable, Text } from 'move';

const INITIAL = [
  { id: 'a', title: 'Offerte versturen' },
  { id: 'b', title: 'Contract nakijken' },
  { id: 'c', title: 'Demo inplannen' },
  { id: 'd', title: 'Factuur opvolgen' },
];

export default function BasicSample() {
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
        <Sortable.Item key={row.id} id={row.id} index={i} label={row.title}>
          <Text>{row.title}</Text>
        </Sortable.Item>
      ))}
    </Sortable.Root>
  );
}
