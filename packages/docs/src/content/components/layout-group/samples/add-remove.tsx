import { useState } from 'react';
import { Stack, Button, Icon, Card, Text, LayoutGroup } from 'move';

let nextId = 100;
const FRUITS = ['Apricot', 'Blueberry', 'Cherry', 'Date', 'Elderberry', 'Fig'];

/**
 * Adding and removing items animates both ways: a new card fades + scales in
 * while the list below it makes room, and a removed card fades + scales out
 * while the gap closes. No AnimatePresence, no manual exit state.
 */
export default function AddRemoveSample() {
  const [items, setItems] = useState([
    { id: 1, label: 'Apple' },
    { id: 2, label: 'Banana' },
  ]);

  const add = () =>
    setItems((prev) => [...prev, { id: ++nextId, label: FRUITS[prev.length % FRUITS.length] }]);
  const remove = (id: number) => setItems((prev) => prev.filter((i) => i.id !== id));

  return (
    <Stack gap="md" align="start">
      <Button size="sm" onClick={add}>
        <Icon name="plus" /> Add item
      </Button>

      <LayoutGroup asChild>
        <Stack gap="sm">
          {items.map((item) => (
            <Card.Root key={item.id}>
              <Card.Body>
                <Stack direction="row" align="center" justify="between" gap="md">
                  <Text weight="medium">{item.label}</Text>
                  <Button size="sm" variant="ghost" onClick={() => remove(item.id)} aria-label={`Remove ${item.label}`}>
                    <Icon name="x" />
                  </Button>
                </Stack>
              </Card.Body>
            </Card.Root>
          ))}
        </Stack>
      </LayoutGroup>
    </Stack>
  );
}
