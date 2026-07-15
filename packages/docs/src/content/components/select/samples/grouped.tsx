import { useState } from 'react';
import { Select } from 'move';

const categories = [
  { name: 'Stone fruits', items: ['Peach', 'Plum', 'Cherry', 'Apricot'] },
  { name: 'Citrus', items: ['Orange', 'Lemon', 'Grapefruit'] },
  { name: 'Berries', items: ['Strawberry', 'Blueberry', 'Raspberry'] },
];

export default function GroupedSample() {
  const [value, setValue] = useState('Cherry');
  return (
    <Select.Root value={value} onValueChange={setValue}>
      <Select.Trigger aria-label="Fruit">
        <Select.Value />
        <Select.Icon />
      </Select.Trigger>
      <Select.Content>
        <Select.Viewport>
          {categories.map((cat, i) => (
            <Select.Group key={cat.name}>
              {i > 0 && <Select.Separator />}
              <Select.Label>{cat.name}</Select.Label>
              {cat.items.map((item) => (
                <Select.Item key={item} value={item}>{item}</Select.Item>
              ))}
            </Select.Group>
          ))}
        </Select.Viewport>
      </Select.Content>
    </Select.Root>
  );
}
