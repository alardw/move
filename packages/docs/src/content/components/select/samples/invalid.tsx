import { Select } from 'move';

const fruits = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry'];

export default function InvalidSample() {
  return (
    <Select.Root>
      <Select.Trigger invalid>
        <Select.Value placeholder="Pick a fruit" />
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
