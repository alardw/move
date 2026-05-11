import { useState } from 'react';
import { DatePicker, Stack, Text } from 'move';

export default function SingleSample() {
  const [value, setValue] = useState<Date | undefined>(undefined);
  return (
    <Stack gap="sm" align="start">
      <DatePicker.Root mode="single" value={value} onValueChange={(d) => setValue(d as Date)}>
        <DatePicker.Trigger>
          <DatePicker.Input />
        </DatePicker.Trigger>
        <DatePicker.Content />
      </DatePicker.Root>
      <Text size="sm" color="muted">
        {value ? `Selected: ${value.toLocaleDateString()}` : 'No date selected.'}
      </Text>
    </Stack>
  );
}
