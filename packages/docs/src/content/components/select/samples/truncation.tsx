import { useState } from 'react';
import { Select } from 'move';

const fruits = [
  'Apple', 'Apricot', 'Banana', 'Blackberry', 'Blueberry',
  'Cherry tomato (technically a fruit, botanically speaking)',
  'Cranberry', 'Date', 'Dragonfruit',
  'Elderberry — wild-harvested from old-growth European hedgerows',
  'Fig', 'Gooseberry',
  'Grape — specifically Cabernet Sauvignon du Bordeaux',
  'Guava',
  'Honeydew melon, imported from the Central Valley of California',
  'Imbe (African mangosteen, Garcinia livingstonei)',
  'Jackfruit', 'Kiwi', 'Lemon', 'Mango', 'Nectarine',
  'Orange', 'Papaya', 'Pear',
];

export default function TruncationSample() {
  const [value, setValue] = useState('Cherry tomato (technically a fruit, botanically speaking)');
  return (
    <Select.Root value={value} onValueChange={setValue}>
      <Select.Trigger maxWidth={280}>
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
