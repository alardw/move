import { Stack, Select } from 'move';

const sizes = ['sm', 'md', 'lg'] as const;
const fruits = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry'];

export default function SizesSample() {
  return (
    <Stack direction="row" gap="md" wrap>
      {sizes.map((size) => (
        <Select.Root key={size} defaultValue="Apple">
          <Select.Trigger aria-label={`Fruit (size ${size})`} size={size}>
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
      ))}
    </Stack>
  );
}
