import { Stack, Select } from 'move';

const variants = ['outlined', 'filled'] as const;
const fruits = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry'];

export default function VariantsSample() {
  return (
    <Stack direction="row" gap="md" wrap>
      {variants.map((variant) => (
        <Select.Root key={variant} defaultValue="Cherry">
          <Select.Trigger variant={variant}>
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
