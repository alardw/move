import { DatePicker, Stack, Text } from 'move';

const sizes = ['sm', 'md', 'lg'] as const;

export default function SizesSample() {
  return (
    <Stack gap="md">
      {sizes.map((size) => (
        <Stack key={size} direction="row" gap="md" align="center">
          <Text size="sm" weight="medium" style={{ width: '4ch' }}>{size}</Text>
          <DatePicker.Root mode="single">
            <DatePicker.Trigger>
              <DatePicker.Input size={size} />
            </DatePicker.Trigger>
            <DatePicker.Content />
          </DatePicker.Root>
        </Stack>
      ))}
    </Stack>
  );
}
