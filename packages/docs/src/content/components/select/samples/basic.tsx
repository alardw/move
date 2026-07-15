import { useState } from 'react';
import { Select } from 'move';

const fruits = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry'];

export default function BasicSample() {
  const [value, setValue] = useState('Apple');
  return (
    <Select.Root value={value} onValueChange={setValue}>
      <Select.Trigger aria-label="Fruit">
        <Select.Value />
        <Select.Icon />
      </Select.Trigger>
      <Select.Content>
        <Select.Viewport>
          {fruits.map((f) => (
            <Select.Item key={f} value={f}>{f}</Select.Item>
          ))}
        </Select.Viewport>
      </Select.Content>
    </Select.Root>
  );
}
