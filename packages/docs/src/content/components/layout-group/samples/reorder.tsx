import { useState } from 'react';
import { Stack, Button, Icon, Card, Text, Badge, LayoutGroup } from 'move';

const INITIAL = [
  { id: 'a', num: 1, name: 'Design review', owner: 'Mara' },
  { id: 'b', num: 2, name: 'Ship v2.4', owner: 'Ito' },
  { id: 'c', num: 3, name: 'Write changelog', owner: 'Priya' },
  { id: 'd', num: 4, name: 'Fix flaky test', owner: 'Lou' },
  { id: 'e', num: 5, name: 'Update docs', owner: 'Sven' },
  { id: 'f', num: 6, name: 'Triage issues', owner: 'Wen' },
  { id: 'g', num: 7, name: 'Plan Q3 roadmap', owner: 'Dale' },
];

/**
 * Reordering the array is all it takes — each card keeps its identity (by key)
 * and glides to its new row with a snappy spring. Here "Sort" reverses the list.
 */
export default function ReorderSample() {
  const [items, setItems] = useState(INITIAL);

  return (
    <Stack gap="md" align="start">
      <Button size="sm" onClick={() => setItems((prev) => [...prev].reverse())}>
        <Icon name="arrow-up-down" /> Reverse order
      </Button>

      <LayoutGroup asChild>
        <Stack gap="sm">
          {items.map((item) => (
            <Card.Root key={item.id}>
              <Card.Body>
                <Stack direction="row" align="center" justify="between" gap="md">
                  <Stack direction="row" align="center" gap="sm">
                    {/* Number stays with the item (not the row index), so a reverse
                        is visible: #1 travels to the bottom. */}
                    <Badge variant="soft">{item.num}</Badge>
                    <Text weight="medium">{item.name}</Text>
                  </Stack>
                  <Text size="sm" color="muted">{item.owner}</Text>
                </Stack>
              </Card.Body>
            </Card.Root>
          ))}
        </Stack>
      </LayoutGroup>
    </Stack>
  );
}
